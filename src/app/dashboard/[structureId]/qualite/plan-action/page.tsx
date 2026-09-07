import { QualitePageLayout } from "@/components/qualite/qualite-page-layout";
import { ClipboardList, CheckCircle2, Clock, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getActionsPAQ } from "@/app/actions/qualite";

export const dynamic = "force-dynamic";

export default async function PlanActionPage({
  params,
}: {
  params: { structureId: string };
}) {
  const structureId = params.structureId;
  const actionsRes = await getActionsPAQ(structureId);
  const actions = actionsRes.success && actionsRes.data ? actionsRes.data : [];

  return (
    <QualitePageLayout
      structureId={structureId}
      titre="Plan d'Action Qualité (PAQ)"
      description="Pilotage des actions d'amélioration continue générées à partir des écarts identifiés dans l'auto-évaluation."
    >
      <div className="space-y-6">
        {/* Résumé des actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
              {actions.length}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Actions totales</p>
              <p className="text-sm font-semibold text-slate-800">Engagées dans le PAQ</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
              {actions.filter((a: { statut: string; }) => a.statut === "A_FAIRE" || a.statut === "EN_COURS").length}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">En cours / À faire</p>
              <p className="text-sm font-semibold text-slate-800">Sous surveillance</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
              {actions.filter((a) => a.statut === "TERMINE").length}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Actions clôturées</p>
              <p className="text-sm font-semibold text-slate-800">Objectifs atteints</p>
            </div>
          </div>
        </div>

        {/* Liste des actions créées */}
        {actions.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Actions issues de l'Auto-évaluation
              </h2>
              <span className="text-xs text-slate-500">
                {actions.length} action{actions.length > 1 ? "s" : ""} enregistrée{actions.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {actions.map((act) => (
                <div key={act.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      {act.critere?.code && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {act.critere.code}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        act.priorite === "HAUTE" || act.priorite === "URGENTE"
                          ? "bg-red-50 text-red-700"
                          : act.priorite === "MOYENNE"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"
                      }`}>
                        Priorité {act.priorite.toLowerCase()}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        act.statut === "TERMINE"
                          ? "bg-emerald-50 text-emerald-700"
                          : act.statut === "EN_COURS"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {act.statut.replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-800">
                      {act.titre}
                    </h3>

                    {act.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {act.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      {act.responsable && <span>Resp. : <strong className="text-slate-600 font-medium">{act.responsable}</strong></span>}
                      {act.echeance && <span>Échéance : <strong className="text-slate-600 font-medium">{new Date(act.echeance).toLocaleDateString("fr-FR")}</strong></span>}
                      {act.critere?.titre && <span>Lié à : {act.critere.titre}</span>}
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/${structureId}/qualite/auto-evaluation`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0"
                  >
                    Voir critère
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-100 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                Aucune action dans le PAQ pour le moment
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Lorsque vous évaluez un critère comme « À améliorer » ou « Partiel » dans l'auto-évaluation, cliquez sur « Ajouter une action au PAQ » pour l'inscrire ici.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href={`/dashboard/${structureId}/qualite/auto-evaluation`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-sm"
              >
                Aller à l'Auto-évaluation
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </QualitePageLayout>
  );
}
