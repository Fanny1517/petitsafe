"use server";

import { prisma } from "@/lib/supabase/prisma";
import { assertAccess, authErrorToResult } from "@/lib/security/auth-context";
import { logAudit } from "@/lib/security/audit";
import { AuditAction } from "@prisma/client";
import { z } from "zod";

const structureUpdateSchema = z.object({
  nom: z.string().trim().min(2).max(120),
  adresse: z.string().trim().max(200).nullable().optional(),
  code_postal: z.string().trim().max(10).nullable().optional(),
  ville: z.string().trim().max(80).nullable().optional(),
  telephone: z.string().trim().max(40).nullable().optional(),
  email: z
    .string()
    .trim()
    .email()
    .max(120)
    .nullable()
    .optional()
    .or(z.literal("")),
});

export async function getStructureInfo(structureId: string) {
  try {
    await assertAccess(structureId);
    const structure = await prisma.structure.findUnique({
      where: { id: structureId },
      select: {
        id: true, nom: true, type: true, adresse: true,
        code_postal: true, ville: true, telephone: true,
        email: true, numero_agrement: true,
      },
    });
    if (!structure) return { success: false as const, error: "Structure introuvable." };
    return { success: true as const, data: structure };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function getSeuilsAge(structureId: string) {
  try {
    await assertAccess(structureId);
    const structure = await prisma.structure.findUnique({
      where: { id: structureId },
      select: { seuil_bebes_max: true, seuil_moyens_max: true },
    });
    if (!structure) return { success: false as const, error: "Structure introuvable." };
    return { success: true as const, data: structure };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function updateSeuilsAge(
  structureId: string,
  seuilBebesMax: number,
  seuilMoyensMax: number,
  actorProfilId?: string
) {
  try {
    const ctx = await assertAccess(structureId, { profilId: actorProfilId, requireAdmin: true });

    if (seuilBebesMax < 6 || seuilBebesMax > 48)
      return { success: false as const, error: "Le seuil bébés doit être entre 6 et 48 mois." };
    if (seuilMoyensMax <= seuilBebesMax)
      return { success: false as const, error: "Le seuil moyens doit être supérieur au seuil bébés." };
    if (seuilMoyensMax > 60)
      return { success: false as const, error: "Le seuil moyens ne peut pas dépasser 60 mois." };

    await prisma.structure.update({
      where: { id: structureId },
      data: { seuil_bebes_max: seuilBebesMax, seuil_moyens_max: seuilMoyensMax },
    });
    await logAudit({
      structureId,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.UPDATE,
      entity: "structure",
      entityId: structureId,
      details: { seuilBebesMax, seuilMoyensMax },
    });
    return { success: true as const };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function updateStructureInfo(
  structureId: string,
  data: {
    nom: string;
    adresse?: string | null;
    code_postal?: string | null;
    ville?: string | null;
    telephone?: string | null;
    email?: string | null;
  },
  actorProfilId?: string
) {
  try {
    const ctx = await assertAccess(structureId, { profilId: actorProfilId, requireAdmin: true });

    const parsed = structureUpdateSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false as const, error: "Données invalides." };
    }

    await prisma.structure.update({
      where: { id: structureId },
      data: {
        nom: parsed.data.nom,
        adresse: parsed.data.adresse?.trim() || null,
        code_postal: parsed.data.code_postal?.trim() || null,
        ville: parsed.data.ville?.trim() || null,
        telephone: parsed.data.telephone?.trim() || null,
        email: parsed.data.email?.trim() || null,
      },
    });
    await logAudit({
      structureId,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.UPDATE,
      entity: "structure",
      entityId: structureId,
      details: { nom: parsed.data.nom },
    });
    return { success: true as const };
  } catch (e) {
    return authErrorToResult(e);
  }
}

function isGibberishNom(input: string): boolean {
  const nom = input.trim();
  if (nom.length < 3) return true;
  if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(nom)) return false;
  if (!/[aeiouyàâäéèêëîïôöùûüAEIOUYÀÂÄÉÈÊËÎÏÔÖÙÛÜ]/.test(nom)) return true;
  if (/z[bcdfgjklmnpqrstvwx]|[bcdfgjklmnpqrstvwx]z/i.test(nom)) return true;
  return false;
}

export async function nettoyerDonneesAberrantes(structureId: string, actorProfilId?: string) {
  try {
    const ctx = await assertAccess(structureId, { profilId: actorProfilId, requireAdmin: true });

    const relevesHorsPlage = await prisma.releveTemperature.deleteMany({
      where: {
        structure_id: structureId,
        OR: [{ temperature: { gt: 100 } }, { temperature: { lt: -50 } }],
      },
    });

    const equipements = await prisma.equipement.findMany({
      where: { structure_id: structureId },
      select: { id: true, nom: true },
    });
    const equipementsAberrantsIds = equipements
      .filter((e) => isGibberishNom(e.nom))
      .map((e) => e.id);
    const equipDeleted = equipementsAberrantsIds.length
      ? await prisma.equipement.deleteMany({ where: { id: { in: equipementsAberrantsIds } } })
      : { count: 0 };

    const stocksHorsQuantite = await prisma.stock.deleteMany({
      where: { structure_id: structureId, quantite: { gt: 10000 } },
    });
    const stocksRestants = await prisma.stock.findMany({
      where: { structure_id: structureId },
      select: { id: true, produit_nom: true },
    });
    const stocksAberrantsIds = stocksRestants
      .filter((s) => isGibberishNom(s.produit_nom))
      .map((s) => s.id);
    const stocksGibberishDeleted = stocksAberrantsIds.length
      ? await prisma.stock.deleteMany({ where: { id: { in: stocksAberrantsIds } } })
      : { count: 0 };

    const receptions = await prisma.receptionMarchandise.findMany({
      where: { structure_id: structureId },
      select: { id: true, nom_produit: true },
    });
    const receptionsAberrantesIds = receptions
      .filter((r) => isGibberishNom(r.nom_produit))
      .map((r) => r.id);
    const recDeleted = receptionsAberrantesIds.length
      ? await prisma.receptionMarchandise.deleteMany({ where: { id: { in: receptionsAberrantesIds } } })
      : { count: 0 };

    const totals = {
      relevesSupprimes: relevesHorsPlage.count,
      equipementsSupprimes: equipDeleted.count,
      stocksSupprimes: stocksHorsQuantite.count + stocksGibberishDeleted.count,
      receptionsSupprimees: recDeleted.count,
    };

    await logAudit({
      structureId,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.DELETE,
      entity: "structure",
      entityId: structureId,
      details: totals,
    });

    return { success: true as const, data: totals };
  } catch (e) {
    return authErrorToResult(e);
  }
}
