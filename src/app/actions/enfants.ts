"use server";

import { prisma } from "@/lib/supabase/prisma";
import { enfantSchema } from "@/lib/schemas/enfant";
import { assertAccess, authErrorToResult } from "@/lib/security/auth-context";
import { logAudit } from "@/lib/security/audit";
import { AuditAction } from "@prisma/client";
import { z } from "zod";

export async function creerEnfant(
  structureId: string,
  data: z.infer<typeof enfantSchema>,
  profilId?: string
) {
  try {
    const ctx = await assertAccess(structureId, { profilId });

    const parsed = enfantSchema.safeParse(data);
    if (!parsed.success) return { success: false as const, error: "Données invalides." };

    const enfant = await prisma.enfant.create({
      data: {
        structure_id: structureId,
        prenom: parsed.data.prenom,
        nom: parsed.data.nom,
        date_naissance: new Date(parsed.data.date_naissance),
        sexe: parsed.data.sexe ?? undefined,
        groupe: parsed.data.groupe ?? undefined,
        groupe_force: parsed.data.groupe_force ?? false,
        photo_url: parsed.data.photo_url ?? undefined,
        regimes: parsed.data.regimes,
        allergies: {
          create: parsed.data.allergies.map((a) => ({
            allergene: a.allergene,
            severite: a.severite,
            protocole: a.protocole ?? undefined,
            document_pai: a.document_pai ?? undefined,
          })),
        },
        contacts: {
          create: parsed.data.contacts.map((c) => ({
            nom: c.nom,
            lien: c.lien,
            telephone: c.telephone,
            est_autorise_recuperer: c.est_autorise_recuperer,
            ordre_priorite: c.ordre_priorite,
          })),
        },
      },
      include: { allergies: true, contacts: true },
    });

    await logAudit({
      structureId,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.CREATE,
      entity: "enfant",
      entityId: enfant.id,
      details: { prenom: enfant.prenom, nom: enfant.nom },
    });

    return { success: true as const, data: enfant };
  } catch (e) {
    if (e instanceof Error && e.constructor.name === "AuthError") return authErrorToResult(e);
    return authErrorToResult(e);
  }
}

export async function modifierEnfant(
  enfantId: string,
  structureId: string,
  data: z.infer<typeof enfantSchema>,
  profilId?: string
) {
  try {
    const ctx = await assertAccess(structureId, { profilId });

    const parsed = enfantSchema.safeParse(data);
    if (!parsed.success) return { success: false as const, error: "Données invalides." };

    await prisma.allergieEnfant.deleteMany({ where: { enfant_id: enfantId } });
    await prisma.contactUrgence.deleteMany({ where: { enfant_id: enfantId } });

    const enfant = await prisma.enfant.update({
      where: { id: enfantId, structure_id: structureId },
      data: {
        prenom: parsed.data.prenom,
        nom: parsed.data.nom,
        date_naissance: new Date(parsed.data.date_naissance),
        sexe: parsed.data.sexe ?? undefined,
        groupe: parsed.data.groupe ?? undefined,
        groupe_force: parsed.data.groupe_force ?? false,
        photo_url: parsed.data.photo_url ?? undefined,
        regimes: parsed.data.regimes,
        allergies: {
          create: parsed.data.allergies.map((a) => ({
            allergene: a.allergene,
            severite: a.severite,
            protocole: a.protocole ?? undefined,
            document_pai: a.document_pai ?? undefined,
          })),
        },
        contacts: {
          create: parsed.data.contacts.map((c) => ({
            nom: c.nom,
            lien: c.lien,
            telephone: c.telephone,
            est_autorise_recuperer: c.est_autorise_recuperer,
            ordre_priorite: c.ordre_priorite,
          })),
        },
      },
      include: { allergies: true, contacts: true },
    });

    await logAudit({
      structureId,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.UPDATE,
      entity: "enfant",
      entityId: enfant.id,
      details: { prenom: enfant.prenom, nom: enfant.nom },
    });

    return { success: true as const, data: enfant };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function archiverEnfant(enfantId: string, structureId: string, profilId?: string) {
  try {
    const ctx = await assertAccess(structureId, { profilId, requireAdmin: true });
    await prisma.enfant.update({
      where: { id: enfantId, structure_id: structureId },
      data: { actif: false },
    });
    await logAudit({
      structureId,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.ARCHIVE,
      entity: "enfant",
      entityId: enfantId,
    });
    return { success: true as const };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function supprimerEnfant(enfantId: string, structureId: string, profilId?: string) {
  try {
    const ctx = await assertAccess(structureId, { profilId, requireAdmin: true });
    const enfant = await prisma.enfant.findFirst({
      where: { id: enfantId, structure_id: structureId },
      select: { prenom: true, nom: true },
    });
    await prisma.enfant.delete({
      where: { id: enfantId, structure_id: structureId },
    });
    await logAudit({
      structureId,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.DELETE,
      entity: "enfant",
      entityId: enfantId,
      details: enfant ? { prenom: enfant.prenom, nom: enfant.nom } : undefined,
    });
    return { success: true as const };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function getEnfants(structureId: string) {
  try {
    await assertAccess(structureId);
    const enfants = await prisma.enfant.findMany({
      where: { structure_id: structureId, actif: true },
      include: { allergies: true, contacts: true },
      orderBy: { prenom: "asc" },
    });
    return { success: true as const, data: enfants };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function getEnfant(enfantId: string, structureId: string) {
  try {
    await assertAccess(structureId);
    const enfant = await prisma.enfant.findFirst({
      where: { id: enfantId, structure_id: structureId },
      include: { allergies: true, contacts: true },
    });
    if (!enfant) return { success: false as const, error: "Enfant non trouvé." };
    return { success: true as const, data: enfant };
  } catch (e) {
    return authErrorToResult(e);
  }
}

interface ImportRow {
  prenom: string;
  nom: string;
  date_naissance?: string;
  sexe?: string;
  groupe?: string;
  allergies: { allergene: string; severite: string }[];
}

export async function importerEnfants(structureId: string, rows: ImportRow[], profilId?: string) {
  try {
    await assertAccess(structureId, { profilId, requireAdmin: true });
    const results: { prenom: string; nom: string; success: boolean; error?: string }[] = [];

    for (const row of rows) {
      try {
        const sexe = row.sexe === "F" || row.sexe === "FILLE" ? "FILLE" : row.sexe === "M" || row.sexe === "GARCON" ? "GARCON" : undefined;

        await prisma.enfant.create({
          data: {
            structure_id: structureId,
            prenom: row.prenom,
            nom: row.nom,
            date_naissance: row.date_naissance ? new Date(row.date_naissance) : new Date(),
            sexe: sexe ?? undefined,
            groupe: row.groupe ?? undefined,
            allergies: {
              create: row.allergies
                .filter((a) => a.allergene)
                .map((a) => ({
                  allergene: a.allergene,
                  severite: (["LEGERE", "MODEREE", "SEVERE"].includes(a.severite) ? a.severite : "MODEREE") as "LEGERE" | "MODEREE" | "SEVERE",
                })),
            },
          },
        });
        results.push({ prenom: row.prenom, nom: row.nom, success: true });
      } catch {
        results.push({ prenom: row.prenom, nom: row.nom, success: false, error: "Erreur lors de l'import" });
      }
    }

    const imported = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    return { success: true as const, data: { imported, failed, results } };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function checkDoublons(structureId: string, enfants: { prenom: string; nom: string }[]) {
  try {
    await assertAccess(structureId);
    const existing = await prisma.enfant.findMany({
      where: { structure_id: structureId, actif: true },
      select: { prenom: true, nom: true },
    });
    const doublons = enfants.filter((e) =>
      existing.some((ex) => ex.prenom.toLowerCase() === e.prenom.toLowerCase() && ex.nom.toLowerCase() === e.nom.toLowerCase())
    );
    return { success: true as const, data: doublons };
  } catch {
    return { success: true as const, data: [] };
  }
}
