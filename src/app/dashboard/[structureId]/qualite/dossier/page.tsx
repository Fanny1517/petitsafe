import { QualitePageLayout } from "@/components/qualite/qualite-page-layout";
import { getDossierQuinquennalData } from "@/app/actions/qualite-dossier";
import { DossierQuinquennalManager } from "@/components/qualite/dossier-quinquennal-manager";

export const dynamic = "force-dynamic";

export default async function DossierQuinquennalPage({
  params,
}: {
  params: { structureId: string };
}) {
  const structureId = params.structureId;
  const res = await getDossierQuinquennalData(structureId, "Cycle 2021-2026");

  if (!res.success) {
    return (
      <QualitePageLayout
        structureId={structureId}
        titre="Dossier quinquennal d'évaluation"
        description="Consolidation automatique des preuves, de l'auto-évaluation et des résultats d'enquêtes pour l'évaluation externe HAS / PMI."
      >
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <p className="text-sm font-semibold text-rose-600">
            {res.error || "Impossible de charger le dossier quinquennal."}
          </p>
        </div>
      </QualitePageLayout>
    );
  }


  return (
    <QualitePageLayout
      structureId={structureId}
      titre="Dossier quinquennal d'évaluation (HAS / PMI)"
      description="Consolidation automatique de l'auto-évaluation continue (RNQ 2025), du baromètre familles, du PAQ et des preuves terrain prêtes pour le contrôle externe."
    >
      <DossierQuinquennalManager
        structureId={structureId}
        initialData={res.data}
      />
    </QualitePageLayout>
  );
}
