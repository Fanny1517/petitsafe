"use server";

import { prisma } from "@/lib/supabase/prisma";
import { assertAccess } from "@/lib/security/auth-context";
import {
  calculerStatistiquesQualite,
  getGrilleAutoEvaluation,
  getActionsPAQ,
  getPreuvesAutomatiques,
} from "@/app/actions/qualite";
import { getStatistiquesEnquete } from "@/app/actions/enquetes";
import {
  AxeQualite,
  type DossierQuinquennalData,
  type DossierEnqueteSynthese,
  type DossierCompletude,
} from "@/types/qualite";

/**
 * Récupère et consolide l'ensemble des données du Dossier Quinquennal (Axe 1, 2, 3 + preuves)
 */
export async function getDossierQuinquennalData(
  structureId: string,
  periodeCycle: string = "Cycle 2021-2026"
): Promise<{ success: true; data: DossierQuinquennalData } | { success: false; error: string }> {
  try {
    await assertAccess(structureId);

    // 1. Récupération des informations de la structure
    const structure = await prisma.structure.findUnique({
      where: { id: structureId },
      select: {
        id: true,
        nom: true,
        type: true,
        adresse: true,
        code_postal: true,
        ville: true,
        telephone: true,
        email: true,
        numero_agrement: true,
      },
    });

    if (!structure) {
      return { success: false, error: "Structure introuvable." };
    }

    // 2. Détection de la période active d'évaluation
    // Cherche d'abord s'il existe des évaluations sous "2025-2026" ou la dernière période renseignée
    const derniereEval = await prisma.evaluationCritere.findFirst({
      where: { structure_id: structureId },
      orderBy: { derniere_eval: "desc" },
      select: { periode: true },
    });
    const periodeActive = derniereEval?.periode || "2025-2026";

    // 3. Récupérations concurrentes des 3 axes & preuves
    const [statsRes, grilleRes, actionsRes, enquetesDb, preuvesTerrain] = await Promise.all([
      calculerStatistiquesQualite(structureId, periodeActive),
      getGrilleAutoEvaluation(structureId, periodeActive),
      getActionsPAQ(structureId),
      prisma.enqueteSatisfaction.findMany({
        where: { structure_id: structureId },
        select: { id: true, titre: true, type_enquete: true, cible_reponses: true },
        orderBy: { date_creation: "desc" },
      }),
      getPreuvesAutomatiques(structureId),
    ]);

    const statsAutoEval = statsRes.success ? statsRes.data : null;
    const criteresAvecEval = grilleRes.success ? grilleRes.data : [];
    const actionsPAQ = actionsRes.success ? actionsRes.data : [];

    // 3. Agrégation synthétique des enquêtes
    const enquetesSynthese: DossierEnqueteSynthese[] = [];
    for (const enq of enquetesDb) {
      try {
        const statEnq = await getStatistiquesEnquete(enq.id);
        if ("stats" in statEnq && statEnq.stats) {
          const s = statEnq.stats;
          // Calcul moyenne globale sur 5
          const axesKeys: AxeQualite[] = [
            "ACCUEIL_SECURITE",
            "DEVELOPPEMENT_EVEIL",
            "RELATION_FAMILLES",
            "PILOTAGE_RISQUES",
          ];
          let sumAxe = 0;
          let countAxe = 0;
          const scoresParAxe: Record<AxeQualite, number> = {
            ACCUEIL_SECURITE: 0,
            DEVELOPPEMENT_EVEIL: 0,
            RELATION_FAMILLES: 0,
            PILOTAGE_RISQUES: 0,
          };

          for (const a of axesKeys) {
            const axeStat = (s.parAxe as Record<AxeQualite, { moyenneSur5: number; nbQuestions: number; nbEvaluations: number }>)[a];
            const m = axeStat?.moyenneSur5 || 0;
            scoresParAxe[a] = m;
            if (m > 0) {
              sumAxe += m;
              countAxe++;
            }
          }

          const moyenneSur5 = countAxe > 0 ? parseFloat((sumAxe / countAxe).toFixed(2)) : 0;
          const topVerbatims = s.tousLesVerbatims.slice(0, 5).map((v) => v.texte);

          enquetesSynthese.push({
            id: enq.id,
            titre: enq.titre,
            type_enquete: enq.type_enquete,
            totalReponses: s.totalReponses,
            cibleReponses: enq.cible_reponses,
            tauxSatisfaction: s.satisfactionGlobalePct,
            moyenneSur5,
            scoresParAxe,
            topVerbatims,
          });
        }
      } catch (err) {
        console.error(`Erreur calcul stats enquête ${enq.id}:`, err);
      }
    }

    // 4. Calcul de la complétude et points de vigilance
    const totalCriteres = criteresAvecEval.length;
    const criteresEvalues = criteresAvecEval.filter(
      (c) => c.evaluation && c.evaluation.statut !== "NON_EVALUE"
    ).length;
    const criteresEvaluesPct = totalCriteres > 0 ? Math.round((criteresEvalues / totalCriteres) * 100) : 0;

    const totalReponsesFamilles = enquetesSynthese.reduce((acc, curr) => acc + curr.totalReponses, 0);
    const actionsUrgentesEnAttente = actionsPAQ.filter(
      (a) => (a.priorite === "URGENTE" || a.priorite === "HAUTE") && a.statut !== "TERMINE"
    ).length;

    const preuvesConformes =
      preuvesTerrain.temperaturesHaccp.conforme &&
      preuvesTerrain.nettoyage.conforme &&
      preuvesTerrain.presences.conforme;

    // Calcul score global de préparation du dossier (0-100%)
    // - Auto-évaluation : 40 points
    // - Enquêtes familles : 25 points
    // - PAQ : 20 points
    // - Preuves terrain : 15 points
    const pointsAutoEval = Math.round((criteresEvaluesPct / 100) * 40);
    const pointsEnquetes = Math.min(25, totalReponsesFamilles >= 10 ? 25 : totalReponsesFamilles * 2.5);
    const pointsPAQ = actionsPAQ.length > 0 ? 20 : 0;
    const pointsPreuves = preuvesConformes ? 15 : 8;

    const tauxGlobal = Math.min(100, Math.round(pointsAutoEval + pointsEnquetes + pointsPAQ + pointsPreuves));

    let statutPreparation: "NON_DEMARRE" | "EN_CONSTITUTION" | "PRET_POUR_TRANSMISSION" = "EN_CONSTITUTION";
    if (tauxGlobal >= 85 && criteresEvaluesPct >= 90) {
      statutPreparation = "PRET_POUR_TRANSMISSION";
    } else if (tauxGlobal < 25) {
      statutPreparation = "NON_DEMARRE";
    }

    const pointsForts: string[] = [];
    const pointsVigilance: string[] = [];

    if (criteresEvaluesPct >= 80) {
      pointsForts.push(`Grille d'auto-évaluation couverte à ${criteresEvaluesPct}% (${criteresEvalues}/${totalCriteres} critères formalisés)`);
    } else {
      pointsVigilance.push(`${totalCriteres - criteresEvalues} critère(s) restant(s) à évaluer dans le référentiel national`);
    }

    if (totalReponsesFamilles >= 5) {
      pointsForts.push(`Écoute usagers active : ${totalReponsesFamilles} avis familles collectés et tracés`);
    } else {
      pointsVigilance.push("Participation usagers encore restreinte : lancez une campagne baromètre auprès des parents");
    }

    if (actionsPAQ.length > 0) {
      const closes = actionsPAQ.filter((a) => a.statut === "TERMINE").length;
      pointsForts.push(`Plan d'action structuré avec ${actionsPAQ.length} actions engagées (${closes} clôturées)`);
    } else {
      pointsVigilance.push("Aucune action corrective formalisée dans le Plan d'Action Qualité (PAQ)");
    }

    if (actionsUrgentesEnAttente > 0) {
      pointsVigilance.push(`${actionsUrgentesEnAttente} action(s) prioritaire(s) ou urgente(s) sont encore en attente de clôture`);
    }

    if (preuvesConformes) {
      pointsForts.push("Traçabilité terrain opérationnelle sans anomalie (HACCP, Nettoyage, Présences)");
    } else {
      pointsVigilance.push("Anomalies ou relevés manquants détectés sur les registres opérationnels (HACCP / Hygiène)");
    }

    const completude: DossierCompletude = {
      tauxGlobal,
      autoEvaluationFaite: criteresEvaluesPct >= 80,
      criteresEvaluesPct,
      enquetesRealisees: enquetesSynthese.length > 0,
      totalReponsesFamilles,
      paqActif: actionsPAQ.length > 0,
      actionsPAQCount: actionsPAQ.length,
      actionsUrgentesEnAttente,
      preuvesTerrainConformes: preuvesConformes,
      statutPreparation,
      pointsVigilance,
      pointsForts,
    };

    const dateGeneration = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const data: DossierQuinquennalData = {
      structure,
      periodeCycle,
      dateGeneration,
      completude,
      statsAutoEval,
      criteresAvecEval,
      enquetesSynthese,
      actionsPAQ,
      preuvesTerrain,
    };

    return { success: true, data };
  } catch (error: any) {
    console.error("Erreur getDossierQuinquennalData :", error);
    return { success: false, error: "Impossible de compiler le dossier quinquennal." };
  }
}
