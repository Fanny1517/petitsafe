import { QualitePageLayout } from "@/components/qualite/qualite-page-layout";
import { getActionsPAQ, getCriteresReferentielSimple } from "@/app/actions/qualite";
import { PlanActionManager, ActionPAQItem } from "@/components/qualite/plan-action-manager";
import { prisma } from "@/lib/supabase/prisma";

export const dynamic = "force-dynamic";

export default async function PlanActionPage({
  params,
}: {
  params: { structureId: string };
}) {
  const structureId = params.structureId;
  const [actionsRes, criteresRes, structure] = await Promise.all([
    getActionsPAQ(structureId),
    getCriteresReferentielSimple(),
    prisma.structure.findUnique({
      where: { id: structureId },
      select: {
        id: true,
        nom: true,
        ville: true,
        code_postal: true,
        numero_agrement: true,
        type: true,
      },
    }),
  ]);

  const actions = (actionsRes.success && actionsRes.data ? actionsRes.data : []) as ActionPAQItem[];
  const criteres = (criteresRes.success && criteresRes.data ? criteresRes.data : []);

  return (
    <QualitePageLayout
      structureId={structureId}
      titre="Plan d'action qualité (PAQ)"
      description="Pilotage des actions d'amélioration continue générées à partir des écarts identifiés dans l'auto-évaluation."
    >
      <PlanActionManager
        structureId={structureId}
        initialActions={actions}
        criteresReferentiel={criteres}
        structureInfo={structure}
      />
    </QualitePageLayout>
  );
}

