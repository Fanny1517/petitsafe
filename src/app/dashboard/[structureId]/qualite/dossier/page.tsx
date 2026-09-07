import { QualitePageLayout } from "@/components/qualite/qualite-page-layout";
import { FileCheck2, FileDown, ShieldCheck, Sparkles, ArrowRight, Building } from "lucide-react";
import Link from "next/link";

export default function DossierQuinquennalPage({
  params,
}: {
  params: { structureId: string };
}) {
  const structureId = params.structureId;

  return (
    <QualitePageLayout
      structureId={structureId}
      titre="Dossier quinquennal d'évaluation"
      description="Consolidation automatique des preuves, de l'auto-évaluation et des résultats d'enquêtes pour l'évaluation externe HAS / PMI."
    >
      <div className="space-y-6 w-full">
        {/* Résumé des indicateurs du dossier */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
              5 ans
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Cycle d'évaluation</p>
              <p className="text-sm font-semibold text-slate-800">Conformité HAS / PMI</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Traçabilité Intègre</p>
              <p className="text-sm font-semibold text-slate-800">Preuves terrain horodatées</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Export Certifié</p>
              <p className="text-sm font-semibold text-slate-800">Livrable officiel PDF</p>
            </div>
          </div>
        </div>

        {/* Carte principale pleine largeur */}
        <div className="w-full bg-white rounded-2xl p-8 sm:p-12 border border-slate-100 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <FileCheck2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Axe 4 — En préparation
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Compilateur de dossier quinquennal HAS / PMI
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Ce module agrégera en un clic votre auto-évaluation complète, l'historique de vos preuves terrain horodatées, vos synthèses d'enquêtes et votre PAQ sous un format PDF certifié prêt pour les évaluateurs externes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-4">
            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Traçabilité Intègre
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Extraction chronologique infalsifiable des relevés HACCP, présences, protocoles d'administration et d'hygiène.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Graphiques & Maturité
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bilan automatique des scores par axe, taux d'atteinte ministériel et historique des actions d'amélioration continue.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <FileDown className="w-4 h-4 text-blue-600" />
                Export Conforme HAS
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Génération d'un dossier PDF normé avec sommaire interactif, fiches critères détaillées et annexes probantes.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={`/dashboard/${structureId}/qualite/auto-evaluation`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              Consulter l'auto-évaluation en cours
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </QualitePageLayout>
  );
}
