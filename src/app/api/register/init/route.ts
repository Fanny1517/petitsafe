import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { encryptData } from "@/lib/security/crypto";
import { envoyerEmailValidation } from "@/lib/email/registration-emails";
import { rateLimit } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

const registerInitSchema = z.object({
  email: z.string().email("Adresse email invalide").toLowerCase().trim(),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  prenom: z.string().min(1, "Le prénom est obligatoire").trim(),
  nom: z.string().min(1, "Le nom est obligatoire").trim(),
  nomStructure: z.string().min(1, "Le nom de la structure est obligatoire").trim(),
  typeStructure: z.enum(["CRECHE", "MICRO_CRECHE", "MAM", "ASS_MAT"]),
  modulesActifs: z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting : max 5 demandes d'inscription / min par IP
    const rl = await rateLimit("register-init", { max: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, error: `Trop de requêtes. Veuillez patienter ${rl.retryAfterSec}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = registerInitSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Données de formulaire invalides";
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const { email, password, prenom, nom, nomStructure, typeStructure, modulesActifs } = parsed.data;

    // 2. Vérifier si un compte définitif existe déjà dans Supabase Auth
    try {
      const supabaseAdmin = createAdminClient();
      // On cherche si l'utilisateur existe déjà
      const { data: usersData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
      if (!userError && usersData?.users) {
        const existingUser = usersData.users.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        );
        if (existingUser) {
          return NextResponse.json(
            {
              success: false,
              error: "Un compte avec cette adresse email existe déjà. Veuillez vous connecter ou réinitialiser votre mot de passe.",
            },
            { status: 409 }
          );
        }
      }
    } catch (adminErr) {
      console.warn("[RegisterInit] Impossible de vérifier Supabase Auth admin :", adminErr);
    }

    // 3. Préparer les données d'inscription temporaire
    const encryptedPassword = encryptData(password);
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures de validité

    // 4. Enregistrer ou mettre à jour dans InscriptionTemporaire
    await prisma.inscriptionTemporaire.upsert({
      where: { email },
      create: {
        email,
        password_encrypted: encryptedPassword,
        prenom,
        nom,
        nom_structure: nomStructure,
        type_structure: typeStructure,
        modules_actifs: modulesActifs,
        token,
        expires_at: expiresAt,
      },
      update: {
        password_encrypted: encryptedPassword,
        prenom,
        nom,
        nom_structure: nomStructure,
        type_structure: typeStructure,
        modules_actifs: modulesActifs,
        token,
        expires_at: expiresAt,
      },
    });

    // 5. Envoyer l'email de validation avec Nodemailer
    const emailResult = await envoyerEmailValidation({
      email,
      prenom,
      nom,
      nomStructure,
      token,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Échec d'envoi de l'email de confirmation : ${emailResult.error || "Erreur SMTP"}. Veuillez vérifier votre adresse email.`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email de validation envoyé avec succès.",
      email,
    });
  } catch (error) {
    console.error("[RegisterInit] Erreur serveur :", error);
    const detail = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json(
      { success: false, error: `Une erreur est survenue lors de l'inscription : ${detail}` },
      { status: 500 }
    );
  }
}
