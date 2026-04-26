import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/supabase/prisma";
import { RoleProfil } from "@prisma/client";

export class AuthError extends Error {
  constructor(public reason: "UNAUTHENTICATED" | "FORBIDDEN" | "INVALID_PROFIL", message: string) {
    super(message);
  }
}

interface AuthCtx {
  userId: string;
  structureId: string;
  profil?: { id: string; role: RoleProfil; prenom: string; nom: string };
}

interface AssertOptions {
  /** Si fourni, vérifie que ce profil appartient à la structure */
  profilId?: string;
  /** Si true, vérifie que le profil est ADMINISTRATEUR */
  requireAdmin?: boolean;
}

/**
 * Garde-fou serveur unique pour toutes les server actions sensibles.
 *
 * Vérifie :
 *  1. L'utilisateur Supabase est authentifié (cookies).
 *  2. Cet utilisateur a bien un UserStructure pour le `structureId` donné.
 *  3. (option) Le `profilId` appartient à la même structure.
 *  4. (option) Ce profil a le rôle ADMINISTRATEUR.
 *
 * Lève une AuthError si l'une des vérifications échoue.
 * Toutes les actions doivent appeler ce helper en début d'exécution avec
 * le `structureId` reçu du client — sinon une structure peut être prise pour cible.
 */
export async function assertAccess(
  structureId: string,
  opts: AssertOptions = {}
): Promise<AuthCtx> {
  if (!structureId || typeof structureId !== "string") {
    throw new AuthError("UNAUTHENTICATED", "structure_id manquant");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new AuthError("UNAUTHENTICATED", "Non authentifié");

  const us = await prisma.userStructure.findUnique({
    where: { user_id_structure_id: { user_id: user.id, structure_id: structureId } },
    select: { user_id: true },
  });
  if (!us) throw new AuthError("FORBIDDEN", "Accès refusé à cette structure");

  let profil: AuthCtx["profil"];
  if (opts.profilId) {
    const p = await prisma.profil.findFirst({
      where: { id: opts.profilId, structure_id: structureId, actif: true },
      select: { id: true, role: true, prenom: true, nom: true },
    });
    if (!p) throw new AuthError("INVALID_PROFIL", "Profil invalide pour cette structure");
    if (opts.requireAdmin && p.role !== RoleProfil.ADMINISTRATEUR) {
      throw new AuthError("FORBIDDEN", "Action réservée aux administrateurs");
    }
    profil = p;
  } else if (opts.requireAdmin) {
    throw new AuthError("FORBIDDEN", "Profil administrateur requis");
  }

  return { userId: user.id, structureId, profil };
}

/**
 * Wrapper qui transforme une AuthError en `{ success: false, error }`
 * conforme au format de retour standard des server actions.
 */
export function authErrorToResult(e: unknown): { success: false; error: string } {
  if (e instanceof AuthError) {
    if (e.reason === "UNAUTHENTICATED")
      return { success: false, error: "Vous devez être connecté." };
    if (e.reason === "INVALID_PROFIL")
      return { success: false, error: "Profil invalide." };
    return { success: false, error: e.message };
  }
  console.error("[auth] erreur inattendue:", e);
  return { success: false, error: "Erreur serveur." };
}
