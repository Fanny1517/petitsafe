import { QualitePageLayout } from "@/components/qualite/qualite-page-layout";
import { Users, HeartHandshake, Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function EnquetesPage({
  params,
}: {
  params: { structureId: string };
}) {
  const structureId = params.structureId;

  return (
    <QualitePageLayout
      structureId={structureId}
      titre="Enquêtes de Satisfaction Parents & Professionnels"
      description="Mesurez la perception des familles et de l'équipe pédagogique avec des questionnaires standardisés conformes aux exigences du référentiel."
    >
      <div className="space-y-6 w-full">
        {/* Résumé des enquêtes / baromètres */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
              0
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Campagnes lancées</p>
              <p className="text-sm font-semibold text-slate-800">Programmation annuelle</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Baromètre parents</p>
              <p className="text-sm font-semibold text-slate-800">Accueil et satisfaction</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Baromètre équipe</p>
              <p className="text-sm font-semibold text-slate-800">Climat et cohésion</p>
            </div>
          </div>
        </div>

        {/* Carte principale pleine largeur */}
        <div className="w-full bg-white rounded-2xl p-8 sm:p-12 border border-slate-100 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Axe 2 — Prochaine étape
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Module enquêtes et retours d'expérience
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Ce module permettra de lancer des campagnes d'enquêtes auprès des parents et de l'équipe, d'agréger automatiquement les scores et de croiser les retours avec votre grille d'auto-évaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-4">
            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <HeartHandshake className="w-4 h-4 text-pink-500" />
                Baromètre parents (Axe 2)
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Accueil, écoute, communication quotidienne, transmissions et satisfaction globale des familles.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Baromètre équipe (Axe 3)
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Conditions de travail, charge émotionnelle, cohésion d'équipe, analyse des pratiques et formations.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Croisement PAQ automatique
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Détection instantanée des écarts de perception pour alimenter automatiquement votre Plan d'Action Qualité.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={`/dashboard/${structureId}/qualite/auto-evaluation`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              Retourner à l'auto-évaluation (Axe 1)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </QualitePageLayout>
  );
}
