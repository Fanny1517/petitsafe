"use server";

import { prisma } from "@/lib/supabase/prisma";
import { assertAccess, authErrorToResult } from "@/lib/security/auth-context";
import { logAudit } from "@/lib/security/audit";
import { AuditAction, type VoieAdministration } from "@prisma/client";

export interface AdministrationInput {
  enfant_id: string;
  nom_medicament: string;
  posologie: string;
  voie: VoieAdministration;
  date_administration: string;
  ordonnance_fournie: boolean;
  observations?: string;
}

export interface SignaturePayload {
  profil_id: string;
  nom_complet: string;
}

async function loadAdminAndAssert(id: string, opts: { profilId?: string; requireAdmin?: boolean } = {}) {
  const existing = await prisma.administrationMedicament.findUnique({
    where: { id },
    select: {
      id: true, structure_id: true, signe: true, signe_par_id: true,
      temoin_id: true, temoin_signe_le: true, enfant_id: true, nom_medicament: true,
    },
  });
  if (!existing) return { existing: null, error: "Administration introuvable." as const };
  await assertAccess(existing.structure_id, opts);
  return { existing, error: null };
}

export async function listerAdministrations(structureId: string, opts?: { enfantId?: string }) {
  try {
    await assertAccess(structureId);
    const list = await prisma.administrationMedicament.findMany({
      where: {
        structure_id: structureId,
        ...(opts?.enfantId ? { enfant_id: opts.enfantId } : {}),
      },
      include: { enfant: { select: { id: true, prenom: true, nom: true } } },
      orderBy: { date_administration: "desc" },
    });
    return { success: true as const, data: list };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function getAdministration(id: string) {
  try {
    const a = await prisma.administrationMedicament.findUnique({
      where: { id },
      include: { enfant: { select: { id: true, prenom: true, nom: true } } },
    });
    if (!a) return { success: false as const, error: "Administration introuvable." };
    await assertAccess(a.structure_id);
    return { success: true as const, data: a };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function creerAdministration(
  structureId: string,
  data: AdministrationInput,
  actorProfilId?: string
) {
  try {
    const ctx = await assertAccess(structureId, { profilId: actorProfilId });

    if (!data.nom_medicament?.trim()) return { success: false as const, error: "Nom du médicament requis." };
    if (!data.posologie?.trim()) return { success: false as const, error: "Posologie requise." };
    if (!data.date_administration) return { success: false as const, error: "Date et heure d'administration requises." };

    // L'enfant doit appartenir à la structure
    const enfant = await prisma.enfant.findFirst({
      where: { id: data.enfant_id, structure_id: structureId },
      select: { id: true },
    });
    if (!enfant) return { success: false as const, error: "Enfant introuvable dans cette structure." };

    const admin = await prisma.administrationMedicament.create({
      data: {
        structure_id: structureId,
        enfant_id: data.enfant_id,
        nom_medicament: data.nom_medicament.trim(),
        posologie: data.posologie.trim(),
        voie: data.voie,
        date_administration: new Date(data.date_administration),
        ordonnance_fournie: data.ordonnance_fournie,
        observations: data.observations?.trim() || null,
      },
    });
    await logAudit({
      structureId,
      userId: ctx.userId,
      profilId: ctx.profil?.id,
      profilNom: ctx.profil ? `${ctx.profil.prenom} ${ctx.profil.nom}` : undefined,
      action: AuditAction.CREATE,
      entity: "administration_medicament",
      entityId: admin.id,
      details: { nom_medicament: admin.nom_medicament, enfant_id: admin.enfant_id },
    });
    return { success: true as const, data: admin };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function modifierAdministration(id: string, data: AdministrationInput, actorProfilId?: string) {
  try {
    const { existing, error } = await loadAdminAndAssert(id, { profilId: actorProfilId });
    if (error || !existing) return { success: false as const, error: error ?? "Administration introuvable." };
    if (existing.signe) return { success: false as const, error: "Administration signée — modification impossible." };

    const admin = await prisma.administrationMedicament.update({
      where: { id },
      data: {
        nom_medicament: data.nom_medicament.trim(),
        posologie: data.posologie.trim(),
        voie: data.voie,
        date_administration: new Date(data.date_administration),
        ordonnance_fournie: data.ordonnance_fournie,
        observations: data.observations?.trim() || null,
      },
    });
    return { success: true as const, data: admin };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function signerAdministration(id: string, sig: SignaturePayload) {
  try {
    if (!sig.profil_id || !sig.nom_complet) {
      return { success: false as const, error: "Profil et nom complet requis pour signer." };
    }
    const { existing, error } = await loadAdminAndAssert(id, { profilId: sig.profil_id });
    if (error || !existing) return { success: false as const, error: error ?? "Administration introuvable." };
    if (existing.signe) return { success: false as const, error: "Déjà signée — signature irréversible." };

    const admin = await prisma.administrationMedicament.update({
      where: { id },
      data: {
        signe: true,
        signe_par_id: sig.profil_id,
        signe_par_nom: sig.nom_complet,
        signe_le: new Date(),
      },
    });
    return { success: true as const, data: admin };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function cosignerAdministration(id: string, sig: SignaturePayload) {
  try {
    if (!sig.profil_id || !sig.nom_complet) {
      return { success: false as const, error: "Profil témoin et nom complet requis." };
    }
    const { existing, error } = await loadAdminAndAssert(id, { profilId: sig.profil_id });
    if (error || !existing) return { success: false as const, error: error ?? "Administration introuvable." };
    if (!existing.signe) return { success: false as const, error: "L'administration doit d'abord être signée par l'administrateur." };
    if (existing.temoin_signe_le) return { success: false as const, error: "Témoin déjà enregistré." };
    if (existing.signe_par_id === sig.profil_id) {
      return { success: false as const, error: "Le témoin doit être un professionnel différent." };
    }

    const admin = await prisma.administrationMedicament.update({
      where: { id },
      data: {
        temoin_id: sig.profil_id,
        temoin_nom: sig.nom_complet,
        temoin_signe_le: new Date(),
      },
    });
    return { success: true as const, data: admin };
  } catch (e) {
    return authErrorToResult(e);
  }
}

export async function supprimerAdministration(id: string, actorProfilId?: string) {
  try {
    const { existing, error } = await loadAdminAndAssert(id, { profilId: actorProfilId, requireAdmin: true });
    if (error || !existing) return { success: false as const, error: error ?? "Administration introuvable." };
    if (existing.signe) return { success: false as const, error: "Administration signée — suppression interdite." };

    await prisma.administrationMedicament.delete({ where: { id } });

    await logAudit({
      structureId: existing.structure_id,
      profilId: actorProfilId,
      action: AuditAction.DELETE,
      entity: "administration_medicament",
      entityId: id,
      details: { nom_medicament: existing.nom_medicament, enfant_id: existing.enfant_id },
    });

    return { success: true as const };
  } catch (e) {
    return authErrorToResult(e);
  }
}
