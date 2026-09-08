import { QualitePageLayout } from "@/components/qualite/qualite-page-layout";
import { EnquetesManager } from "@/components/qualite/enquetes-manager";
import { getEnquetesStructure } from "@/app/actions/enquetes";

export default async function EnquetesPage({
  params,
}: {
  params: { structureId: string };
}) {
  const structureId = params.structureId;
  const res = await getEnquetesStructure(structureId);
  const enquetes = "enquetes" in res && res.enquetes ? res.enquetes : [];

  return (
    <QualitePageLayout
      structureId={structureId}
      titre="Enquêtes Familles & Baromètre de Satisfaction"
      description="Mesurez la perception des familles et de l'équipe pédagogique avec des questionnaires standardisés conformes aux exigences du Référentiel National Qualité 2025."
    >
      <div className="w-full">
        <EnquetesManager structureId={structureId} initialEnquetes={enquetes} />
      </div>
    </QualitePageLayout>
  );
}

