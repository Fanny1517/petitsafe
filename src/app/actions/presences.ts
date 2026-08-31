"use server";

import { prisma } from "@/lib/supabase/prisma";
import { assertAccess, authErrorToResult } from "@/lib/security/auth-context";
import {
  togglePresenceSchema,
  updateHeuresPresenceSchema,
  absenceSchema,
} from "@/lib/schemas/presence";
import { revalidatePath } from "next/cache";

export interface PresenceJourItem {
  enfant: {
    id: string;
    prenom: string;
    nom: string;
    photo_url: string | null;
    groupe: string | null;
    date_naissance: Date;
    regimes: string[];
  };
  presence: any;
  statut: "ATTENDU" | "PRESENT" | "ABSENT" | "ABSENT_JUSTIFIE" | "CONGE";
  est_present: boolean;
  heure_arrivee: string | null;
  heure_depart: string | null;
  motif_absence: string | null;
  certificat_fourni: boolean;
  observations: string | null;
  releve_par_nom: string | null;
}

export interface PresenceJourStats {
  totalInscrits: number;
  presents: number;
  absents: number;
  absentsJustifies: number;
  conges: number;
  attendus: number;
  tauxPresence: number;
}

export interface PresenceJourResult {
  date: string;
  totalEnfants: number;
  nbPresents: number;
  nbAbsents: number;
  nbConges: number;
  nbAttendus: number;
  tauxPresence: number;
  stats: PresenceJourStats;
  items: PresenceJourItem[];
  liste: PresenceJourItem[];
}

function getDateRange(dateStr?: string) {
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  const dayStart = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0));
  const dayEnd = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999));
  return { targetDate, dayStart, dayEnd };
}

/**
 * Récupère tous les enfants actifs de la structure et leur fiche de présence pour la date donnée.
 */
export async function getPresencesJour(structureId: string, dateStr?: string) {
  try {
    await assertAccess(structureId);
    const { dayStart, dayEnd } = getDateRange(dateStr);

    // Récupération des enfants actifs
    const enfants = await prisma.enfant.findMany({
      where: { structure_id: structureId, actif: true },
      select: {
        id: true,
        prenom: true,
        nom: true,
        photo_url: true,
        groupe: true,
        date_naissance: true,
        regimes: true,
      },
      orderBy: [{ groupe: "asc" }, { nom: "asc" }, { prenom: "asc" }],
    });

    // Récupération des présences enregistrées pour ce jour
    const presences = await prisma.presence.findMany({
      where: {
        structure_id: structureId,
        date: { gte: dayStart, lte: dayEnd },
      },
      include: {
        releve_par: {
          select: { id: true, prenom: true, nom: true },
        },
      },
    });

    const presencesMap = new Map(presences.map((p) => [p.enfant_id, p]));

    // Fusion enfants + présences
    const liste = enfants.map((enfant) => {
      const presence = presencesMap.get(enfant.id);
      return {
        enfant,
        presence: presence || null,
        statut: presence ? presence.statut : "ATTENDU",
        est_present: presence ? presence.est_present : false,
        heure_arrivee: presence?.heure_arrivee ? presence.heure_arrivee.toISOString() : null,
        heure_depart: presence?.heure_depart ? presence.heure_depart.toISOString() : null,
        motif_absence: presence?.motif_absence || null,
        certificat_fourni: presence?.certificat_fourni || false,
        observations: presence?.observations || null,
        releve_par_nom: presence?.releve_par_nom || (presence?.releve_par ? `${presence.releve_par.prenom} ${presence.releve_par.nom}` : null),
      };
    });

    // Calcul des statistiques du jour
    const totalEnfants = enfants.length;
    const nbPresents = liste.filter((l) => l.est_present).length;
    const nbAbsents = liste.filter((l) => l.statut === "ABSENT" || l.statut === "ABSENT_JUSTIFIE").length;
    const nbAbsentsJustifies = liste.filter((l) => l.statut === "ABSENT_JUSTIFIE").length;
    const nbConges = liste.filter((l) => l.statut === "CONGE").length;
    const nbAttendus = liste.filter((l) => l.statut === "ATTENDU" && !l.est_present).length;
    const tauxPresence = totalEnfants > 0 ? Math.round((nbPresents / totalEnfants) * 100) : 0;

    const stats: PresenceJourStats = {
      totalInscrits: totalEnfants,
      presents: nbPresents,
      absents: nbAbsents,
      absentsJustifies: nbAbsentsJustifies,
      conges: nbConges,
      attendus: nbAttendus,
      tauxPresence,
    };

    return {
      success: true as const,
      data: {
        date: dayStart.toISOString(),
        totalEnfants,
        nbPresents,
        nbAbsents,
        nbConges,
        nbAttendus,
        tauxPresence,
        stats,
        items: liste,
        liste,
      },
    };
  } catch (error) {
    return authErrorToResult(error);
  }
}

/**
 * Pointage rapide (Arrivée / Non pointé)
 */
export async function togglePresenceRapide(data: {
  structure_id: string;
  enfant_id: string;
  date: string;
  est_present: boolean;
  profil_id?: string;
  releve_par_nom?: string;
}) {
  try {
    const parsed = togglePresenceSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false as const, error: "Données de pointage invalides." };
    }

    await assertAccess(parsed.data.structure_id, { profilId: parsed.data.profil_id });
    const { dayStart } = getDateRange(parsed.data.date);

    const now = new Date();

    const presence = await prisma.presence.upsert({
      where: {
        structure_id_enfant_id_date: {
          structure_id: parsed.data.structure_id,
          enfant_id: parsed.data.enfant_id,
          date: dayStart,
        },
      },
      create: {
        structure_id: parsed.data.structure_id,
        enfant_id: parsed.data.enfant_id,
        date: dayStart,
        statut: parsed.data.est_present ? "PRESENT" : "ATTENDU",
        est_present: parsed.data.est_present,
        heure_arrivee: parsed.data.est_present ? now : null,
        releve_par_id: parsed.data.profil_id || null,
        releve_par_nom: data.releve_par_nom || null,
      },
      update: {
        statut: parsed.data.est_present ? "PRESENT" : "ATTENDU",
        est_present: parsed.data.est_present,
        heure_arrivee: parsed.data.est_present ? (await prisma.presence.findUnique({
          where: {
            structure_id_enfant_id_date: {
              structure_id: parsed.data.structure_id,
              enfant_id: parsed.data.enfant_id,
              date: dayStart,
            },
          },
          select: { heure_arrivee: true },
        }))?.heure_arrivee || now : null,
        releve_par_id: parsed.data.profil_id || null,
        releve_par_nom: data.releve_par_nom || null,
      },
    });

    revalidatePath(`/dashboard/${parsed.data.structure_id}/presences`);
    revalidatePath(`/dashboard/${parsed.data.structure_id}`);

    return { success: true as const, data: presence };
  } catch (error) {
    return authErrorToResult(error);
  }
}

/**
 * Mise à jour des heures d'arrivée, de départ ou des observations
 */
export async function updateHeuresPresence(data: {
  structure_id: string;
  enfant_id: string;
  date: string;
  heure_arrivee?: string | null;
  heure_depart?: string | null;
  observations?: string | null;
  profil_id?: string;
  releve_par_nom?: string;
}) {
  try {
    const parsed = updateHeuresPresenceSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false as const, error: "Données d'horaires invalides." };
    }

    await assertAccess(parsed.data.structure_id, { profilId: parsed.data.profil_id });
    const { dayStart } = getDateRange(parsed.data.date);

    const arriveeDate = parsed.data.heure_arrivee ? new Date(parsed.data.heure_arrivee) : null;
    const departDate = parsed.data.heure_depart ? new Date(parsed.data.heure_depart) : null;

    const presence = await prisma.presence.upsert({
      where: {
        structure_id_enfant_id_date: {
          structure_id: parsed.data.structure_id,
          enfant_id: parsed.data.enfant_id,
          date: dayStart,
        },
      },
      create: {
        structure_id: parsed.data.structure_id,
        enfant_id: parsed.data.enfant_id,
        date: dayStart,
        statut: "PRESENT",
        est_present: true,
        heure_arrivee: arriveeDate || new Date(),
        heure_depart: departDate,
        observations: parsed.data.observations || null,
        releve_par_id: parsed.data.profil_id || null,
        releve_par_nom: data.releve_par_nom || null,
      },
      update: {
        heure_arrivee: arriveeDate !== undefined ? arriveeDate : undefined,
        heure_depart: departDate !== undefined ? departDate : undefined,
        observations: parsed.data.observations !== undefined ? parsed.data.observations : undefined,
        est_present: arriveeDate ? true : false,
        statut: arriveeDate ? "PRESENT" : "ATTENDU",
        releve_par_id: parsed.data.profil_id || null,
        releve_par_nom: data.releve_par_nom || null,
      },
    });

    revalidatePath(`/dashboard/${parsed.data.structure_id}/presences`);
    revalidatePath(`/dashboard/${parsed.data.structure_id}`);

    return { success: true as const, data: presence };
  } catch (error) {
    return authErrorToResult(error);
  }
}

/**
 * Déclaration d'absence ou congé avec motif et justificatif
 */
export async function declarerAbsence(data: {
  structure_id: string;
  enfant_id: string;
  date: string;
  statut: "ABSENT" | "ABSENT_JUSTIFIE" | "CONGE";
  motif_absence: string;
  certificat_fourni?: boolean;
  observations?: string;
  profil_id?: string;
  releve_par_nom?: string;
}) {
  try {
    const parsed = absenceSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false as const, error: "Données d'absence invalides." };
    }

    await assertAccess(parsed.data.structure_id, { profilId: parsed.data.profil_id });
    const { dayStart } = getDateRange(parsed.data.date);

    const presence = await prisma.presence.upsert({
      where: {
        structure_id_enfant_id_date: {
          structure_id: parsed.data.structure_id,
          enfant_id: parsed.data.enfant_id,
          date: dayStart,
        },
      },
      create: {
        structure_id: parsed.data.structure_id,
        enfant_id: parsed.data.enfant_id,
        date: dayStart,
        statut: parsed.data.statut,
        est_present: false,
        heure_arrivee: null,
        heure_depart: null,
        motif_absence: parsed.data.motif_absence,
        certificat_fourni: parsed.data.certificat_fourni,
        observations: parsed.data.observations || null,
        releve_par_id: parsed.data.profil_id || null,
        releve_par_nom: data.releve_par_nom || null,
      },
      update: {
        statut: parsed.data.statut,
        est_present: false,
        heure_arrivee: null,
        heure_depart: null,
        motif_absence: parsed.data.motif_absence,
        certificat_fourni: parsed.data.certificat_fourni,
        observations: parsed.data.observations || null,
        releve_par_id: parsed.data.profil_id || null,
        releve_par_nom: data.releve_par_nom || null,
      },
    });

    revalidatePath(`/dashboard/${parsed.data.structure_id}/presences`);
    revalidatePath(`/dashboard/${parsed.data.structure_id}`);

    return { success: true as const, data: presence };
  } catch (error) {
    return authErrorToResult(error);
  }
}

/**
 * Pointage en masse : Marquer tous les enfants attendus comme présents
 */
export async function pointerTousPresents(
  structureId: string,
  dateStr: string,
  profilId?: string,
  releveParNom?: string
) {
  try {
    await assertAccess(structureId, { profilId });
    const { dayStart, dayEnd } = getDateRange(dateStr);

    const enfants = await prisma.enfant.findMany({
      where: { structure_id: structureId, actif: true },
      select: { id: true },
    });

    const presencesExistantes = await prisma.presence.findMany({
      where: {
        structure_id: structureId,
        date: { gte: dayStart, lte: dayEnd },
      },
    });

    const mapExistantes = new Map(presencesExistantes.map((p) => [p.enfant_id, p]));
    const now = new Date();

    for (const enfant of enfants) {
      const existante = mapExistantes.get(enfant.id);
      // On ne modifie pas les enfants déclarés absents ou en congé
      if (existante && (existante.statut === "ABSENT" || existante.statut === "ABSENT_JUSTIFIE" || existante.statut === "CONGE")) {
        continue;
      }

      await prisma.presence.upsert({
        where: {
          structure_id_enfant_id_date: {
            structure_id: structureId,
            enfant_id: enfant.id,
            date: dayStart,
          },
        },
        create: {
          structure_id: structureId,
          enfant_id: enfant.id,
          date: dayStart,
          statut: "PRESENT",
          est_present: true,
          heure_arrivee: now,
          releve_par_id: profilId || null,
          releve_par_nom: releveParNom || null,
        },
        update: {
          statut: "PRESENT",
          est_present: true,
          heure_arrivee: existante?.heure_arrivee || now,
          releve_par_id: profilId || null,
          releve_par_nom: releveParNom || null,
        },
      });
    }

    revalidatePath(`/dashboard/${structureId}/presences`);
    revalidatePath(`/dashboard/${structureId}`);

    return { success: true as const };
  } catch (error) {
    return authErrorToResult(error);
  }
}

/**
 * Récupère l'historique des présences sur une période pour les registres et exports
 */
export async function getHistoriquePresences(
  structureId: string,
  options: {
    enfantId?: string;
    dateDebut?: string;
    dateFin?: string;
  } = {}
) {
  try {
    await assertAccess(structureId);

    const now = new Date();
    const debut = options.dateDebut
      ? new Date(options.dateDebut)
      : new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
    const fin = options.dateFin
      ? new Date(options.dateFin)
      : new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));

    const presences = await prisma.presence.findMany({
      where: {
        structure_id: structureId,
        ...(options.enfantId ? { enfant_id: options.enfantId } : {}),
        date: { gte: debut, lte: fin },
      },
      include: {
        enfant: {
          select: { id: true, prenom: true, nom: true, groupe: true },
        },
      },
      orderBy: [{ date: "desc" }, { enfant: { nom: "asc" } }],
    });

    return { success: true as const, data: presences };
  } catch (error) {
    return authErrorToResult(error);
  }
}

/**
 * Récupère le registre mensuel consolidé pour une structure, un mois et une année
 */
export async function getRegistreMensuel(
  structureId: string,
  mois: number,
  annee: number
) {
  try {
    await assertAccess(structureId);

    const dateDebut = new Date(Date.UTC(annee, mois - 1, 1, 0, 0, 0, 0));
    const dateFin = new Date(Date.UTC(annee, mois, 0, 23, 59, 59, 999));

    const enfants = await prisma.enfant.findMany({
      where: { structure_id: structureId, actif: true },
      select: { id: true, prenom: true, nom: true, groupe: true },
      orderBy: [{ groupe: "asc" }, { nom: "asc" }, { prenom: "asc" }],
    });

    const presences = await prisma.presence.findMany({
      where: {
        structure_id: structureId,
        date: { gte: dateDebut, lte: dateFin },
      },
      orderBy: { date: "asc" },
    });

    const presencesParEnfant = new Map<string, typeof presences>();
    for (const p of presences) {
      if (!presencesParEnfant.has(p.enfant_id)) {
        presencesParEnfant.set(p.enfant_id, []);
      }
      presencesParEnfant.get(p.enfant_id)!.push(p);
    }

    const registre = enfants.map((enfant) => {
      const enfantPresences = presencesParEnfant.get(enfant.id) || [];
      let joursPresents = 0;
      let joursAbsents = 0;
      let joursConges = 0;

      const details = enfantPresences.map((p) => {
        if (p.statut === "PRESENT") joursPresents++;
        else if (p.statut === "ABSENT" || p.statut === "ABSENT_JUSTIFIE") joursAbsents++;
        else if (p.statut === "CONGE") joursConges++;

        return {
          date: p.date.toISOString().split("T")[0],
          statut: p.statut,
          heure_arrivee: p.heure_arrivee ? p.heure_arrivee.toISOString() : null,
          heure_depart: p.heure_depart ? p.heure_depart.toISOString() : null,
          motif_absence: p.motif_absence || null,
        };
      });

      const totalJoursTraites = joursPresents + joursAbsents + joursConges;
      const tauxPresence = totalJoursTraites > 0 ? Math.round((joursPresents / totalJoursTraites) * 100) : 0;

      return {
        enfant,
        stats: {
          joursPresents,
          joursAbsents,
          joursConges,
          tauxPresence,
        },
        details,
      };
    });

    return { success: true as const, data: registre };
  } catch (error) {
    return authErrorToResult(error);
  }
}
