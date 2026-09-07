import { QualitePageLayout } from "@/components/qualite/qualite-page-layout";
import { AutoEvaluationGrid } from "@/components/qualite/auto-evaluation-grid";
import {
  getGrilleAutoEvaluation,
  calculerStatistiquesQualite,
  getPreuvesAutomatiques,
} from "@/app/actions/qualite";

import { EvidenceData } from "@/components/qualite/evidence-badge";

export const dynamic = "force-dynamic";

export default async function AutoEvaluationPage({
  params,
}: {
  params: { structureId: string };
}) {
  const structureId = params.structureId;
  const periode = "2025-2026";

  const [grilleRes, statsRes, preuvesRes] = await Promise.all([
    getGrilleAutoEvaluation(structureId, periode),
    calculerStatistiquesQualite(structureId, periode),
    getPreuvesAutomatiques(structureId),
  ]);

  const rawCriteres = grilleRes.success && grilleRes.data ? grilleRes.data : [];
  const initialCriteres = rawCriteres.map((c: any) => ({
    id: c.id,
    code: c.code,
    chapitre: c.axe,
    axe: c.axe,
    titre: c.titre,
    points_cles: c.points_cles || [],
    guide_ministeriel: c.guide_ministeriel,
    exemples_pratiques: c.preuves_suggerees || [],
    evidence_source: c.source_preuve_auto,
    evaluation: c.evaluation
      ? {
          id: c.evaluation.id,
          statut: c.evaluation.statut,
          observations: c.evaluation.observations,
          preuves_url: [],
          date_evaluation: c.evaluation.derniere_eval,
          evalue_par: c.evaluation.evalue_par_nom
            ? { prenom: c.evaluation.evalue_par_nom, nom: "" }
            : null,
        }
      : null,
    actions: [],
  }));

  const initialStats = statsRes.success && statsRes.data ? statsRes.data : null;

  const preuvesTerrain: Record<string, EvidenceData> = {
    HACCP_TEMP: {
      type: "HACCP_TEMP",
      source: "HACCP_TEMP",
      count: preuvesRes.temperaturesHaccp.totalSemaine,
      anomalies: preuvesRes.temperaturesHaccp.anomaliesSemaine,
      derniere_date: preuvesRes.temperaturesHaccp.dernierReleve
        ? new Date(preuvesRes.temperaturesHaccp.dernierReleve).toISOString()
        : null,
      est_conforme: preuvesRes.temperaturesHaccp.conforme,
      message: preuvesRes.temperaturesHaccp.conforme
        ? `${preuvesRes.temperaturesHaccp.totalSemaine} relevé(s) conforme(s) sur 7j`
        : `${preuvesRes.temperaturesHaccp.anomaliesSemaine} anomalie(s) détectée(s)`,
      url: `/dashboard/${structureId}/temperatures`,
    },
    NETTOYAGE: {
      type: "NETTOYAGE",
      source: "NETTOYAGE",
      count: preuvesRes.nettoyage.validationsSemaine,
      anomalies: 0,
      derniere_date: null,
      est_conforme: preuvesRes.nettoyage.conforme,
      message: `${preuvesRes.nettoyage.validationsSemaine} tâche(s) validée(s) cette semaine`,
      url: `/dashboard/${structureId}/nettoyage`,
    },
    MEDICAMENTS: {
      type: "MEDICAMENTS",
      source: "MEDICAMENTS",
      count: preuvesRes.medicamentsEtPai.administrationsSemaine,
      anomalies: 0,
      derniere_date: null,
      est_conforme: preuvesRes.medicamentsEtPai.conforme,
      message: `${preuvesRes.medicamentsEtPai.paisActifs} PAI actif(s), ${preuvesRes.medicamentsEtPai.administrationsSemaine} prise(s) tracée(s)`,
      url: `/dashboard/${structureId}/suivi`,
    },
    PRESENCES: {
      type: "PRESENCES",
      source: "PRESENCES",
      count: preuvesRes.presences.presentsAujourdhui,
      anomalies: 0,
      derniere_date: null,
      est_conforme: preuvesRes.presences.conforme,
      message: `${preuvesRes.presences.presentsAujourdhui} enfant(s) pointé(s) présent(s) aujourd'hui`,
      url: `/dashboard/${structureId}/presences`,
    },
  };

  return (
    <QualitePageLayout
      structureId={structureId}
      titre="Auto-évaluation du référentiel national"
      description="Évaluez la conformité de votre établissement sur les 4 axes ministériels (relation enfant, relation parents, organisation & RH, bâtiment & sécurité) et connectez vos preuves terrain en temps réel."
      periodeActuelle={periode}
    >
      <AutoEvaluationGrid
        structureId={structureId}
        initialCriteres={initialCriteres}
        initialStats={initialStats}
        preuvesTerrain={preuvesTerrain}
        periode={periode}
      />
    </QualitePageLayout>
  );
}
