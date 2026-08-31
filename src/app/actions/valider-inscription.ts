"use server";

import { prisma } from "@/lib/prisma";
import { decryptData } from "@/lib/security/crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { envoyerEmailBienvenue } from "@/lib/email/registration-emails";
import bcrypt from "bcryptjs";

export type ValidationResult =
  | {
      success: true;
      email: string;
      nomStructure: string;
      structureId: string;
    }
  | {
      success: false;
      error: string;
      isExpired?: boolean;
    };

/**
 * Valide le token d'inscription temporaire, crée les entités en base et active l'utilisateur.
 */
export async function validerInscription(token: string): Promise<ValidationResult> {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return { success: false, error: "Token de validation manquant ou invalide." };
  }

  try {
    // 1. Rechercher l'inscription temporaire
    const pending = await prisma.inscriptionTemporaire.findUnique({
      where: { token: token.trim() },
    });

    if (!pending) {
      return {
        success: false,
        error: "Ce lien de validation est invalide ou a déjà été utilisé.",
      };
    }

    // 2. Vérifier l'expiration (24 heures)
    if (new Date() > pending.expires_at) {
      // Nettoyage de l'inscription expirée
      await prisma.inscriptionTemporaire.delete({ where: { id: pending.id } }).catch(() => {});
      return {
        success: false,
        isExpired: true,
        error: "Ce lien de validation a expiré (validité de 24 heures). Veuillez renouveler votre inscription.",
      };
    }

    // 3. Déchiffrer le mot de passe temporaire
    let plainPassword = "";
    try {
      plainPassword = decryptData(pending.password_encrypted);
    } catch (decryptErr) {
      console.error("[validerInscription] Erreur de déchiffrement du mot de passe :", decryptErr);
      return {
        success: false,
        error: "Erreur de sécurité lors du traitement du mot de passe. Veuillez vous réinscrire.",
      };
    }

    // 4. Créer le compte utilisateur dans Supabase Auth
    const supabaseAdmin = createAdminClient();
    let authUserId: string;

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: pending.email,
      password: plainPassword,
      email_confirm: true,
      user_metadata: {
        prenom: pending.prenom,
        nom: pending.nom,
      },
    });

    if (authError) {
      // Si l'utilisateur existe déjà dans Supabase Auth (ex: créé lors d'un test)
      if (authError.message.includes("already registered") || authError.message.includes("already been registered")) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const existing = listData?.users.find(
          (u) => u.email?.toLowerCase() === pending.email.toLowerCase()
        );
        if (existing) {
          authUserId = existing.id;
          // Mise à jour du mot de passe et confirmation
          await supabaseAdmin.auth.admin.updateUserById(authUserId, {
            password: plainPassword,
            email_confirm: true,
            user_metadata: { prenom: pending.prenom, nom: pending.nom },
          });
        } else {
          return { success: false, error: `Erreur d'authentification : ${authError.message}` };
        }
      } else {
        console.error("[validerInscription] Erreur création Supabase user :", authError);
        return { success: false, error: `Impossible de créer le compte : ${authError.message}` };
      }
    } else if (authData.user) {
      authUserId = authData.user.id;
    } else {
      return { success: false, error: "Création du compte utilisateur impossible." };
    }

    // 5. Créer la Structure dans PostgreSQL
    const structure = await prisma.structure.create({
      data: {
        nom: pending.nom_structure,
        type: pending.type_structure,
        modules_actifs: pending.modules_actifs,
      },
    });

    // 6. Associer l'utilisateur à la Structure avec le rôle GESTIONNAIRE
    await prisma.userStructure.create({
      data: {
        user_id: authUserId,
        structure_id: structure.id,
        role: "GESTIONNAIRE",
      },
    });

    // 7. Créer le profil administrateur principal avec code PIN 0000 par défaut
    const defaultPin = await bcrypt.hash("0000", 10);
    await prisma.profil.create({
      data: {
        structure_id: structure.id,
        nom: pending.nom || "Directrice",
        prenom: pending.prenom || "Directrice",
        role: "ADMINISTRATEUR",
        pin: defaultPin,
        actif: true,
      },
    });

    // 8. Supprimer l'inscription temporaire consommée
    await prisma.inscriptionTemporaire.delete({
      where: { id: pending.id },
    });

    // 9. Envoyer l'email de bienvenue en arrière-plan
    envoyerEmailBienvenue({
      email: pending.email,
      prenom: pending.prenom,
      nom: pending.nom,
      nomStructure: pending.nom_structure,
    }).catch((err) => console.error("[validerInscription] Erreur envoi email bienvenue :", err));

    return {
      success: true,
      email: pending.email,
      nomStructure: pending.nom_structure,
      structureId: structure.id,
    };
  } catch (error) {
    console.error("[validerInscription] Erreur inattendue :", error);
    const detail = error instanceof Error ? error.message : "Erreur inconnue";
    return { success: false, error: `Une erreur est survenue lors de la validation : ${detail}` };
  }
}
