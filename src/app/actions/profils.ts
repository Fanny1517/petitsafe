"use server";

import { prisma } from "@/lib/supabase/prisma";
import { RoleProfil, AuditAction } from "@prisma/client";
import { hash, compare } from "bcryptjs";
import { rateLimit } from "@/lib/security/rate-limit";
import { assertAccess, authErrorToResult } from "@/lib/security/auth-context";
import { logAudit } from "@/lib/security/audit";
import { z } from "zod";

const profilSchema = z.object({
  prenom: z.string().trim().min(1).max(60),
  nom: z.string().trim().min(1).max(60),
  poste: z.string().trim().max(120).optional(),
  role: z.nativeEnum(RoleProfil).optional(),
  telephone: z.string().trim().max(40).optional(),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  certifications: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(1000).optional(),
  pin: z.string().trim().min(4).max(20).optional(),
});

const profilUpdateSchema = profilSchema.partial().extend({
  actif: z.boolean().optional(),
});

// ═══ Lister les profils actifs d'une structure (sans le pin) ═══
export async function listerProfils(structureId: string) {
  try {
    await assertAccess(structureId);
    const profils = await prisma.profil.findMany({
      where: { structure_id: structureId, actif: true },
      orderBy: [{ role: "asc" }, { prenom: "asc" }],
      select: {
        id: true, structure_id: true, prenom: true, nom: true, poste: true,
        role: true, telephone: true, email: true, certifications: true,
        notes: true, actif: true,
      },
    });
    return { success: true as const, data: profils };
  } catch (e) {
    return authErrorToResult(e);
  }
}

// ═══ Lister tous les profils (y compris inactifs) — admin only ═══
export async function listerTousProfils(structureId: string, actorProfilId?: string) {
  try {
    await assertAccess(structureId, { profilId: actorProfilId, requireAdmin: true });
    const profils = await prisma.profil.findMany({
      where: { structure_id: structureId },
      orderBy: [{ actif: "desc" }, { role: "asc" }, { prenom: "asc" }],
      select: {
        id: true, structure_id: true, prenom: true, nom: true, poste: true,
        role: true, telephone: true, email: true, certifications: true,
        notes: true, actif: true,
      },
    });
    return { success: true as const, data: profils };
  } catch (e) {
    return authErrorToResult(e);
  }
}

// ═══ Obtenir un profil par ID ═══
export async function obtenirProfil(profilId: string, structureId: string) {
  try {
    await assertAccess(structureId);
    const profil = await prisma.profil.findFirst({
      where: { id: profilId, structure_id: structureId },
      select: {
        id: true, structure_id: true, prenom: true, nom: true, poste: true,
        role: true, telephone: true, email: true, certifications: true,
        notes: true, actif: true,
      },
    });
    if (!profil) return { success: false as const, error: "Profil introuvable." };
    return { success: true as const, data: profil };
  } catch (e) {
    return authErrorToResult(e);
  }
}

// ═══ Créer un profil — admin only ═══
export async function creerProfil(
  data: {
    structure_id: string;
    prenom: string;
    nom: string;
    poste?: string;
    role?: RoleProfil;
    telephone?: string;
    email?: string;
    certifications?: string;
    notes?: string;
    pin?: string;
  },
  actorProfilId?: string
) {
  try {
    const ctx = await assertAccess(data.structure_id, { profilId: actorProfilId, requireAdmin: true });

    if (!data.pin?.trim()) return { success: false as const, error: "Le mot de passe profil est obligatoire." };
    const parsed = profilSchema.safeParse(data);
    if (!parsed.success) return { success: false as const, error: "Données profil invalides." };

    const hashedPin = await hash(parsed.data.pin!.trim(), 10);

    const profil = await prisma.profil.create({
      data: {
        structure_id: data.structure_id,
        prenom: parsed.data.prenom,
        nom: parsed.data.nom,
        poste: parsed.data.poste || null,
        role: parsed.data.role || RoleProfil.PROFESSIONNEL,
        telephone: parsed.data.telephone || null,
        email: parsed.data.email || null,
        certifications: parsed.data.certifications || null,
        notes: parsed.data.notes || null,
        pin: hashedPin,
      },
    });

    await logAudit({
      structureId: data.structure_id,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.CREATE,
      entity: "profil",
      entityId: profil.id,
      details: { prenom: profil.prenom, nom: profil.nom, role: profil.role },
    });

    return { success: true as const, data: profil };
  } catch (e) {
    return authErrorToResult(e);
  }
}

// ═══ Modifier un profil — admin only OU auto-édition ═══
export async function modifierProfil(
  profilId: string,
  data: {
    prenom?: string;
    nom?: string;
    poste?: string;
    role?: RoleProfil;
    telephone?: string;
    email?: string;
    certifications?: string;
    notes?: string;
    actif?: boolean;
    pin?: string;
  },
  actorProfilId?: string
) {
  try {
    const target = await prisma.profil.findUnique({
      where: { id: profilId },
      select: { id: true, structure_id: true, role: true, prenom: true, nom: true },
    });
    if (!target) return { success: false as const, error: "Profil introuvable." };

    // Auto-édition (limité aux champs non sensibles) OU admin de la structure
    const isSelfEdit = !!actorProfilId && actorProfilId === profilId;
    const requireAdmin = !isSelfEdit;
    const ctx = await assertAccess(target.structure_id, {
      profilId: actorProfilId,
      requireAdmin,
    });

    // Garde-fou : un non-admin ne peut PAS changer son propre rôle ni son statut actif
    if (isSelfEdit && (data.role !== undefined || data.actif !== undefined)) {
      return { success: false as const, error: "Action réservée aux administrateurs." };
    }

    const parsed = profilUpdateSchema.safeParse(data);
    if (!parsed.success) return { success: false as const, error: "Données invalides." };

    const updateData: Record<string, unknown> = {
      ...(parsed.data.prenom !== undefined && { prenom: parsed.data.prenom }),
      ...(parsed.data.nom !== undefined && { nom: parsed.data.nom }),
      ...(parsed.data.poste !== undefined && { poste: parsed.data.poste || null }),
      ...(parsed.data.role !== undefined && { role: parsed.data.role }),
      ...(parsed.data.telephone !== undefined && { telephone: parsed.data.telephone || null }),
      ...(parsed.data.email !== undefined && { email: parsed.data.email || null }),
      ...(parsed.data.certifications !== undefined && { certifications: parsed.data.certifications || null }),
      ...(parsed.data.notes !== undefined && { notes: parsed.data.notes || null }),
      ...(parsed.data.actif !== undefined && { actif: parsed.data.actif }),
    };

    if (parsed.data.pin) {
      updateData.pin = await hash(parsed.data.pin.trim(), 10);
    }

    const profil = await prisma.profil.update({
      where: { id: profilId },
      data: updateData,
    });

    const action =
      parsed.data.role !== undefined && parsed.data.role !== target.role
        ? AuditAction.ROLE_CHANGE
        : AuditAction.UPDATE;

    await logAudit({
      structureId: target.structure_id,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action,
      entity: "profil",
      entityId: profil.id,
      details: action === AuditAction.ROLE_CHANGE
        ? { from: target.role, to: parsed.data.role }
        : { prenom: profil.prenom, nom: profil.nom },
    });

    return { success: true as const, data: profil };
  } catch (e) {
    return authErrorToResult(e);
  }
}

// ═══ Désactiver un profil — admin only ═══
export async function desactiverProfil(profilId: string, actorProfilId?: string) {
  try {
    const target = await prisma.profil.findUnique({
      where: { id: profilId },
      select: { id: true, structure_id: true, role: true },
    });
    if (!target) return { success: false as const, error: "Profil introuvable." };

    const ctx = await assertAccess(target.structure_id, {
      profilId: actorProfilId,
      requireAdmin: true,
    });

    if (target.role === RoleProfil.ADMINISTRATEUR) {
      const autresAdmins = await prisma.profil.count({
        where: {
          structure_id: target.structure_id,
          role: RoleProfil.ADMINISTRATEUR,
          actif: true,
          id: { not: profilId },
        },
      });
      if (autresAdmins === 0) {
        return { success: false as const, error: "Impossible de désactiver le dernier administrateur." };
      }
    }

    await prisma.profil.update({ where: { id: profilId }, data: { actif: false } });

    await logAudit({
      structureId: target.structure_id,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.ARCHIVE,
      entity: "profil",
      entityId: profilId,
    });

    return { success: true as const };
  } catch (e) {
    return authErrorToResult(e);
  }
}

// ═══ Vérifier le mot de passe d'un profil ═══
export async function verifierProfilPin(profilId: string, pin: string) {
  try {
    const rl = await rateLimit("pin", { max: 5, windowMs: 60_000, key: profilId });
    if (!rl.ok) {
      return {
        success: false as const,
        error: `Trop de tentatives. Réessayez dans ${rl.retryAfterSec}s.`,
      };
    }

    const profil = await prisma.profil.findUnique({
      where: { id: profilId },
      select: { id: true, structure_id: true, pin: true },
    });
    if (!profil) return { success: false as const, error: "Profil introuvable." };

    // Le PIN est lié à un profil d'une structure : on s'assure que l'utilisateur
    // courant a bien accès à cette structure (sinon il ne devrait jamais voir ce profilId).
    try {
      await assertAccess(profil.structure_id);
    } catch (e) {
      return authErrorToResult(e);
    }

    // Profil existant sans PIN → attribuer le PIN par défaut "0000"
    if (!profil.pin) {
      const defaultPin = await hash("0000", 10);
      await prisma.profil.update({ where: { id: profilId }, data: { pin: defaultPin } });
      const valid = pin === "0000";
      if (!valid) return { success: false as const, error: "Mot de passe par défaut : 0000. Changez-le dans Paramètres → Équipe." };
      return { success: true as const };
    }

    const valid = await compare(pin, profil.pin);
    if (!valid) return { success: false as const, error: "Mot de passe incorrect." };

    return { success: true as const };
  } catch {
    return { success: false as const, error: "Erreur lors de la vérification." };
  }
}

// ═══ Auto-créer le profil admin si aucun profil n'existe ═══
export async function assurerProfilAdmin(structureId: string, prenom: string, nom: string) {
  try {
    await assertAccess(structureId);

    const count = await prisma.profil.count({ where: { structure_id: structureId } });
    if (count > 0) return { success: true as const, created: false };

    const defaultPin = await hash("0000", 10);

    const profil = await prisma.profil.create({
      data: {
        structure_id: structureId,
        prenom: prenom.trim(),
        nom: nom.trim(),
        poste: "Directrice",
        role: RoleProfil.ADMINISTRATEUR,
        pin: defaultPin,
      },
    });
    return { success: true as const, created: true, data: profil };
  } catch (e) {
    return authErrorToResult(e);
  }
}
