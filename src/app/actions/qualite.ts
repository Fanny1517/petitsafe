"use server";

// RZPan'Da — Server Actions pour le Référentiel Qualité & Auto-évaluation (Axe 1)
// Architecture modulaire réutilisable pour les axes 2 (enquêtes) et 3 (PAQ / dossier quinquennal)

import { prisma } from "@/lib/supabase/prisma";
import { AxeQualite, StatutConformite, PrioriteAction, StatutAction } from "@prisma/client";
import { revalidatePath } from "next/cache";

import {
  POIDS_STATUT,
  LIBELLES_AXES,
  type CritereAvecEvaluation,
  type StatsAxeQualite,
  type StatsGlobalesQualite,
  type PreuvesAutomatiques,
} from "@/types/qualite";

/**
 * Récupère tous les critères avec l'évaluation actuelle pour la période donnée
 */
export async function getGrilleAutoEvaluation(
  structureId: string,
  periode: string = "2025",
  filtreAxe?: AxeQualite
) {
  try {
    const whereCritere = filtreAxe ? { axe: filtreAxe } : {};

    const [criteres, evaluations, actions] = await Promise.all([
      prisma.critereReferentiel.findMany({
        where: whereCritere,
        orderBy: [{ axe: "asc" }, { ordre: "asc" }],
      }),
      prisma.evaluationCritere.findMany({
        where: { structure_id: structureId, periode },
      }),
      prisma.actionQualite.groupBy({
        by: ["critere_id"],
        where: { structure_id: structureId, critere_id: { not: null } },
        _count: { id: true },
      }),
    ]);

    const evalMap = new Map(evaluations.map((e) => [e.critere_id, e]));
    const actionCountMap = new Map(
      actions.map((a) => [a.critere_id as string, a._count.id])
    );

    const grille: CritereAvecEvaluation[] = criteres.map((c) => {
      const ev = evalMap.get(c.id);
      return {
        id: c.id,
        code: c.code,
        axe: c.axe,
        titre: c.titre,
        description: c.description,
        points_cles: c.points_cles,
        guide_ministeriel: c.guide_ministeriel,
        ordre: c.ordre,
        poids: c.poids,
        preuves_suggerees: c.preuves_suggerees,
        source_preuve_auto: c.source_preuve_auto,
        evaluation: ev
          ? {
              id: ev.id,
              statut: ev.statut,
              observations: ev.observations,
              pistes_amelioration: ev.pistes_amelioration,
              evalue_par_nom: ev.evalue_par_nom,
              derniere_eval: ev.derniere_eval,
            }
          : null,
        actionsCount: actionCountMap.get(c.id) ?? 0,
      };
    });

    return { success: true as const, data: grille };
  } catch (error) {
    console.error("Erreur getGrilleAutoEvaluation :", error);
    return { success: false as const, error: "Impossible de charger la grille d'évaluation." };
  }
}

/**
 * Sauvegarde ou met à jour l'évaluation d'un critère
 */
export async function sauvegarderEvaluationCritere(params: {
  structureId: string;
  critereId: string;
  periode?: string;
  statut: StatutConformite;
  observations?: string | null;
  pistesAmelioration?: string | null;
  profilId?: string | null;
  profilNom?: string | null;
}) {
  const {
    structureId,
    critereId,
    periode = "2025",
    statut,
    observations,
    pistesAmelioration,
    profilId,
    profilNom,
  } = params;

  try {
    const evaluation = await prisma.evaluationCritere.upsert({
      where: {
        structure_id_critere_id_periode: {
          structure_id: structureId,
          critere_id: critereId,
          periode,
        },
      },
      update: {
        statut,
        observations: observations ?? null,
        pistes_amelioration: pistesAmelioration ?? null,
        evalue_par_id: profilId ?? null,
        evalue_par_nom: profilNom ?? null,
        derniere_eval: new Date(),
      },
      create: {
        structure_id: structureId,
        critere_id: critereId,
        periode,
        statut,
        observations: observations ?? null,
        pistes_amelioration: pistesAmelioration ?? null,
        evalue_par_id: profilId ?? null,
        evalue_par_nom: profilNom ?? null,
        derniere_eval: new Date(),
      },
    });

    revalidatePath(`/dashboard/${structureId}/qualite`);
    revalidatePath(`/dashboard/${structureId}/qualite/auto-evaluation`);

    return { success: true as const, data: evaluation };
  } catch (error) {
    console.error("Erreur sauvegarderEvaluationCritere :", error);
    return { success: false as const, error: "Échec de l'enregistrement de l'évaluation." };
  }
}

/**
 * Calcule les indicateurs globaux et par axe de maturité qualité
 */
export async function calculerStatistiquesQualite(
  structureId: string,
  periode: string = "2025"
): Promise<{ success: true; data: StatsGlobalesQualite } | { success: false; error: string }> {
  try {
    const [criteres, evaluations, actionsCount] = await Promise.all([
      prisma.critereReferentiel.findMany(),
      prisma.evaluationCritere.findMany({
        where: { structure_id: structureId, periode },
      }),
      prisma.actionQualite.count({ where: { structure_id: structureId } }),
    ]);

    const evalMap = new Map(evaluations.map((e) => [e.critere_id, e]));

    const initRepartition = (): Record<StatutConformite, number> => ({
      NON_EVALUE: 0,
      A_AMELIORER: 0,
      PARTIELLEMENT_CONFORME: 0,
      CONFORME: 0,
      EXEMPLAIRE: 0,
    });

    const repartitionGlobale = initRepartition();

    const parAxe: Record<AxeQualite, StatsAxeQualite> = {
      ACCUEIL_SECURITE: {
        axe: "ACCUEIL_SECURITE",
        label: LIBELLES_AXES.ACCUEIL_SECURITE,
        totalCriteres: 0,
        evaluesCount: 0,
        scoreMoyen: 0,
        repartition: initRepartition(),
      },
      DEVELOPPEMENT_EVEIL: {
        axe: "DEVELOPPEMENT_EVEIL",
        label: LIBELLES_AXES.DEVELOPPEMENT_EVEIL,
        totalCriteres: 0,
        evaluesCount: 0,
        scoreMoyen: 0,
        repartition: initRepartition(),
      },
      RELATION_FAMILLES: {
        axe: "RELATION_FAMILLES",
        label: LIBELLES_AXES.RELATION_FAMILLES,
        totalCriteres: 0,
        evaluesCount: 0,
        scoreMoyen: 0,
        repartition: initRepartition(),
      },
      PILOTAGE_RISQUES: {
        axe: "PILOTAGE_RISQUES",
        label: LIBELLES_AXES.PILOTAGE_RISQUES,
        totalCriteres: 0,
        evaluesCount: 0,
        scoreMoyen: 0,
        repartition: initRepartition(),
      },
    };

    let sommePointsPonderes = 0;
    let sommePoidsTotal = 0;
    let totalEvalues = 0;

    const scoresParAxe: Record<AxeQualite, { points: number; poids: number }> = {
      ACCUEIL_SECURITE: { points: 0, poids: 0 },
      DEVELOPPEMENT_EVEIL: { points: 0, poids: 0 },
      RELATION_FAMILLES: { points: 0, poids: 0 },
      PILOTAGE_RISQUES: { points: 0, poids: 0 },
    };

    for (const c of criteres) {
      const axeStat = parAxe[c.axe];
      axeStat.totalCriteres += 1;

      const ev = evalMap.get(c.id);
      const statut: StatutConformite = ev ? ev.statut : "NON_EVALUE";

      repartitionGlobale[statut] += 1;
      axeStat.repartition[statut] += 1;

      if (statut !== "NON_EVALUE") {
        axeStat.evaluesCount += 1;
        totalEvalues += 1;
      }

      const point = POIDS_STATUT[statut];
      scoresParAxe[c.axe].points += point * c.poids;
      scoresParAxe[c.axe].poids += 100 * c.poids;

      sommePointsPonderes += point * c.poids;
      sommePoidsTotal += 100 * c.poids;
    }

    // Calcul score par axe
    (Object.keys(parAxe) as AxeQualite[]).forEach((axe) => {
      const s = scoresParAxe[axe];
      parAxe[axe].scoreMoyen = s.poids > 0 ? Math.round((s.points / s.poids) * 100) : 0;
    });

    const scoreGlobal = sommePoidsTotal > 0 ? Math.round((sommePointsPonderes / sommePoidsTotal) * 100) : 0;
    const progressionPourcent = criteres.length > 0 ? Math.round((totalEvalues / criteres.length) * 100) : 0;

    let niveauMaturite: "A_INITIER" | "EN_COURS" | "CONFIRMEE" | "EXCELLENCE" = "A_INITIER";
    let libelleMaturite = "Démarche à initier";

    if (scoreGlobal >= 85) {
      niveauMaturite = "EXCELLENCE";
      libelleMaturite = "Niveau Excellence";
    } else if (scoreGlobal >= 60) {
      niveauMaturite = "CONFIRMEE";
      libelleMaturite = "Qualité Confirmée";
    } else if (scoreGlobal >= 30) {
      niveauMaturite = "EN_COURS";
      libelleMaturite = "En cours d'appropriation";
    }

    return {
      success: true,
      data: {
        periode,
        totalCriteres: criteres.length,
        evaluesCount: totalEvalues,
        progressionPourcent,
        scoreGlobal,
        niveauMaturite,
        libelleMaturite,
        parAxe,
        repartitionGlobale,
        actionsPAQCount: actionsCount,
      },
    };
  } catch (error) {
    console.error("Erreur calculerStatistiquesQualite :", error);
    return { success: false, error: "Impossible de calculer les statistiques qualité." };
  }
}

/**
 * Récupère les preuves automatiques issues des modules opérationnels RZPan'Da
 */
export async function getPreuvesAutomatiques(structureId: string): Promise<PreuvesAutomatiques> {
  try {
    const septJoursAvant = new Date();
    septJoursAvant.setDate(septJoursAvant.getDate() - 7);

    const debutAujourdhui = new Date();
    debutAujourdhui.setHours(0, 0, 0, 0);

    const [relevesTemp, validationsNettoyage, pais, medicaments, presences] = await Promise.all([
      prisma.releveTemperature.findMany({
        where: { structure_id: structureId, date: { gte: septJoursAvant } },
        select: { conforme: true, date: true },
        orderBy: { date: "desc" },
      }),
      prisma.validationNettoyage.count({
        where: {
          tache: { zone: { structure_id: structureId } },
          date: { gte: septJoursAvant },
        },
      }),
      prisma.pAI.count({
        where: { structure_id: structureId, actif: true },
      }),
      prisma.administrationMedicament.count({
        where: {
          structure_id: structureId,
          date_administration: { gte: septJoursAvant },
        },
      }),
      prisma.presence.count({
        where: {
          structure_id: structureId,
          date: { gte: debutAujourdhui },
          statut: "PRESENT",
        },
      }),
    ]);

    const anomaliesTemp = relevesTemp.filter((r) => !r.conforme).length;
    const dernierReleveTemp = relevesTemp.length > 0 ? relevesTemp[0].date : null;

    return {
      temperaturesHaccp: {
        totalSemaine: relevesTemp.length,
        anomaliesSemaine: anomaliesTemp,
        dernierReleve: dernierReleveTemp,
        conforme: relevesTemp.length > 0 && anomaliesTemp === 0,
      },
      nettoyage: {
        validationsSemaine: validationsNettoyage,
        conforme: validationsNettoyage > 0,
      },
      medicamentsEtPai: {
        paisActifs: pais,
        administrationsSemaine: medicaments,
        conforme: true,
      },
      presences: {
        presentsAujourdhui: presences,
        conforme: presences > 0,
      },
    };
  } catch (error) {
    console.error("Erreur getPreuvesAutomatiques :", error);
    return {
      temperaturesHaccp: { totalSemaine: 0, anomaliesSemaine: 0, dernierReleve: null, conforme: false },
      nettoyage: { validationsSemaine: 0, conforme: false },
      medicamentsEtPai: { paisActifs: 0, administrationsSemaine: 0, conforme: false },
      presences: { presentsAujourdhui: 0, conforme: false },
    };
  }
}

/**
 * Crée une action dans le Plan d'Action Qualité (PAQ) liée ou non à un critère
 */
export async function creerActionPAQ(params: {
  structureId: string;
  critereId?: string | null;
  titre: string;
  description?: string | null;
  responsable?: string | null;
  echeance?: string | null;
  priorite?: PrioriteAction;
  resultatAttendu?: string | null;
}) {
  const {
    structureId,
    critereId,
    titre,
    description,
    responsable,
    echeance,
    priorite = "MOYENNE",
    resultatAttendu,
  } = params;

  try {
    const action = await prisma.actionQualite.create({
      data: {
        structure_id: structureId,
        critere_id: critereId ?? null,
        titre,
        description: description ?? null,
        responsable: responsable ?? null,
        echeance: echeance ? new Date(echeance) : null,
        priorite,
        statut: "A_FAIRE",
        resultat_attendu: resultatAttendu ?? null,
      },
      include: {
        critere: {
          select: { code: true, titre: true, axe: true },
        },
      },
    });

    revalidatePath(`/dashboard/${structureId}/qualite`);
    revalidatePath(`/dashboard/${structureId}/qualite/auto-evaluation`);
    revalidatePath(`/dashboard/${structureId}/qualite/plan-action`);

    return { success: true as const, data: action };
  } catch (error) {
    console.error("Erreur creerActionPAQ :", error);
    return { success: false as const, error: "Échec de la création de l'action PAQ." };
  }
}

/**
 * Récupère la liste simplifiée des critères du référentiel pour sélection
 */
export async function getCriteresReferentielSimple() {
  try {
    const criteres = await prisma.critereReferentiel.findMany({
      select: { id: true, code: true, titre: true, axe: true },
      orderBy: [{ axe: "asc" }, { ordre: "asc" }],
    });
    return { success: true as const, data: criteres };
  } catch (error) {
    console.error("Erreur getCriteresReferentielSimple :", error);
    return { success: false as const, error: "Impossible de récupérer les critères." };
  }
}

/**
 * Récupère les actions PAQ d'une structure
 */
export async function getActionsPAQ(structureId: string, critereId?: string) {
  try {
    const where: { structure_id: string; critere_id?: string } = { structure_id: structureId };
    if (critereId) where.critere_id = critereId;

    const actions = await prisma.actionQualite.findMany({
      where,
      include: {
        critere: {
          select: { code: true, titre: true, axe: true },
        },
      },
      orderBy: [{ priorite: "desc" }, { created_at: "desc" }],
    });

    return { success: true as const, data: actions };
  } catch (error) {
    console.error("Erreur getActionsPAQ :", error);
    return { success: false as const, error: "Impossible de récupérer les actions." };
  }
}

/**
 * Met à jour le statut d'une action du Plan d'Action Qualité (PAQ)
 */
export async function mettreAJourStatutActionPAQ(params: {
  actionId: string;
  structureId: string;
  statut: StatutAction;
  commentaireCloture?: string | null;
}) {
  const { actionId, structureId, statut, commentaireCloture } = params;

  try {
    const existante = await prisma.actionQualite.findFirst({
      where: { id: actionId, structure_id: structureId },
    });

    if (!existante) {
      return { success: false as const, error: "Action PAQ introuvable." };
    }

    const action = await prisma.actionQualite.update({
      where: { id: actionId },
      data: {
        statut,
        resultat_attendu: commentaireCloture !== undefined ? commentaireCloture : existante.resultat_attendu,
      },
    });

    revalidatePath(`/dashboard/${structureId}/qualite`);
    revalidatePath(`/dashboard/${structureId}/qualite/auto-evaluation`);
    revalidatePath(`/dashboard/${structureId}/qualite/plan-action`);

    return { success: true as const, data: action };
  } catch (error) {
    console.error("Erreur mettreAJourStatutActionPAQ :", error);
    return { success: false as const, error: "Échec de la mise à jour de l'action PAQ." };
  }
}

/**
 * Supprime une action du Plan d'Action Qualité (PAQ)
 */
export async function supprimerActionPAQ(actionId: string, structureId: string) {
  try {
    const existante = await prisma.actionQualite.findFirst({
      where: { id: actionId, structure_id: structureId },
    });

    if (!existante) {
      return { success: false as const, error: "Action PAQ introuvable." };
    }

    await prisma.actionQualite.delete({
      where: { id: actionId },
    });

    revalidatePath(`/dashboard/${structureId}/qualite`);
    revalidatePath(`/dashboard/${structureId}/qualite/auto-evaluation`);
    revalidatePath(`/dashboard/${structureId}/qualite/plan-action`);

    return { success: true as const };
  } catch (error) {
    console.error("Erreur supprimerActionPAQ :", error);
    return { success: false as const, error: "Échec de la suppression de l'action PAQ." };
  }
}


