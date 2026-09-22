"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  FileDown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Printer,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import Link from "next/link";
import { DossierExportModal } from "./dossier-export-modal";
import type { DossierQuinquennalData, AxeQualite } from "@/types/qualite";
import { LIBELLES_AXES } from "@/types/qualite";

interface DossierQuinquennalManagerProps {
  structureId: string;
  initialData: DossierQuinquennalData;
}

type OngletDossier = "SYNTHESE" | "AUTOREF" | "ENQUETES" | "PAQ";

export function DossierQuinquennalManager({
  structureId,
  initialData,
}: DossierQuinquennalManagerProps) {
  const [data, setData] = useState<DossierQuinquennalData>(initialData);
  const [ongletActif, setOngletActif] = useState<OngletDossier>("SYNTHESE");
  const [modalExportOpen, setModalExportOpen] = useState(false);
  const [rechercheCritere, setRechercheCritere] = useState("");
  const [filtreAxe, setFiltreAxe] = useState<string>("TOUS");

  // Filtre des critères pour l'onglet Auto-évaluation
  const criteresFiltres = data.criteresAvecEval.filter((c) => {
    const matchRecherche =
      c.code.toLowerCase().includes(rechercheCritere.toLowerCase()) ||
      c.titre.toLowerCase().includes(rechercheCritere.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(rechercheCritere.toLowerCase()));

    const matchAxe = filtreAxe === "TOUS" || c.axe === filtreAxe;
    return matchRecherche && matchAxe;
  });

  const { completude, statsAutoEval } = data;

  return (
    <div className="space-y-6 w-full">
      {/* Bandeau supérieur de statut de transmission & KPIs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              completude.statutPreparation === "PRET_POUR_TRANSMISSION"
                ? "bg-emerald-50 text-emerald-600"
                : completude.statutPreparation === "EN_CONSTITUTION"
                ? "bg-amber-50 text-amber-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <FileCheck2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  completude.statutPreparation === "PRET_POUR_TRANSMISSION"
                    ? "bg-emerald-100 text-emerald-800"
                    : completude.statutPreparation === "EN_CONSTITUTION"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {completude.statutPreparation === "PRET_POUR_TRANSMISSION"
                  ? "Prêt pour transmission HAS / PMI"
                  : completude.statutPreparation === "EN_CONSTITUTION"
                  ? "Dossier en cours de consolidation"
                  : "Dossier à initialiser"}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {data.periodeCycle}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Dossier Quinquennal d'Évaluation de la Qualité
            </h2>
            <p className="text-xs text-slate-500">
              Agrégation continue de l'auto-évaluation, des avis familles, du PAQ et des preuves terrain.
            </p>
          </div>
        </div>

        {/* Actions principales */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setModalExportOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            Générer & Exporter le dossier
          </button>
        </div>
      </div>

      {/* Cartes métriques clés (Complétude, Maturité, Familles, PAQ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Complétude */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Complétude du dossier</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {completude.tauxGlobal}%
            </span>
            <span className="text-xs text-slate-400">éligibilité</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${completude.tauxGlobal}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {completude.criteresEvaluesPct}% des critères officiels renseignés
          </p>
        </div>

        {/* Maturité RNQ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Score RNQ 2025</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">
              {statsAutoEval?.scoreGlobal ?? 0}%
            </span>
            <span className="text-xs text-slate-400">pondéré</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${statsAutoEval?.scoreGlobal ?? 0}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-700 font-medium truncate">
            {statsAutoEval?.libelleMaturite}
          </p>
        </div>

        {/* Voix des familles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Voix des familles</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {completude.totalReponsesFamilles}
            </span>
            <span className="text-xs text-slate-400">avis parents</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {data.enquetesSynthese.length} campagne(s) d'évaluation menée(s)
          </p>
          <div className="pt-1">
            <Link
              href={`/dashboard/${structureId}/qualite/enquetes`}
              className="text-[11px] font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              Gérer les enquêtes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* PAQ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Amélioration continue (PAQ)</span>
            <HeartHandshake className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {completude.actionsPAQCount}
            </span>
            <span className="text-xs text-slate-400">actions</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {completude.actionsUrgentesEnAttente > 0 ? (
              <span className="text-rose-600 font-medium">
                {completude.actionsUrgentesEnAttente} action(s) prioritaire(s)
              </span>
            ) : (
              <span className="text-emerald-600 font-medium">
                Aucun retard critique
              </span>
            )}
          </p>
          <div className="pt-1">
            <Link
              href={`/dashboard/${structureId}/qualite/plan-action`}
              className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              Accéder au PAQ <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation entre les 4 onglets d'inspection */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setOngletActif("SYNTHESE")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            ongletActif === "SYNTHESE"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          1. Synthèse d'Audit & Éligibilité
        </button>
        <button
          type="button"
          onClick={() => setOngletActif("AUTOREF")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            ongletActif === "AUTOREF"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          2. Auto-évaluation Référentiel ({data.criteresAvecEval.length})
        </button>
        <button
          type="button"
          onClick={() => setOngletActif("ENQUETES")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            ongletActif === "ENQUETES"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          3. Baromètre & Voix des Familles
        </button>
        <button
          type="button"
          onClick={() => setOngletActif("PAQ")}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            ongletActif === "PAQ"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          4. Plan d'Action Qualité ({data.actionsPAQ.length})
        </button>
      </div>

      {/* CONTENU ONGLET 1 : SYNTHÈSE & AUDIT */}
      {ongletActif === "SYNTHESE" && (
        <div className="space-y-6">
          {/* Diagnostic d'audit : Points forts vs Points de vigilance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Points forts */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Points forts de conformité identifiés
              </h3>
              {completude.pointsForts.length > 0 ? (
                <ul className="space-y-2">
                  {completude.pointsForts.map((pt, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">Aucun point fort consolidé.</p>
              )}
            </div>

            {/* Points de vigilance */}
            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Actions recommandées avant transmission
              </h3>
              {completude.pointsVigilance.length > 0 ? (
                <ul className="space-y-2">
                  {completude.pointsVigilance.map((pv, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{pv}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700 font-medium">
                  Aucun point bloquant détecté. Le dossier est parfaitement aligné.
                </p>
              )}
            </div>
          </div>

          {/* Analyse des 4 axes du Référentiel National 2025 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Maturité par axe réglementaire (Arrêté du 29 août 2024)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsAutoEval &&
                (["ACCUEIL_SECURITE", "DEVELOPPEMENT_EVEIL", "RELATION_FAMILLES", "PILOTAGE_RISQUES"] as const).map((axe) => {
                  const a = statsAutoEval.parAxe[axe];
                  if (!a) return null;
                  return (
                    <div
                      key={axe}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2"
                    >
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                        {axe.replace("_", " ")}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                        {a.label}
                      </p>
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-xl font-bold text-slate-900">
                          {a.scoreMoyen}%
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {a.evaluesCount}/{a.totalCriteres} éval.
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${a.scoreMoyen}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Intégrité des registres et preuves terrain */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Traçabilité Opérationnelle & Preuves Terrain
                </h3>
                <p className="text-xs text-slate-500">
                  Registres intègres et horodatés extraits en direct des modules RZPan'Da.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                <span className="text-slate-500 text-[11px]">Relevés Frigo HACCP</span>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {data.preuvesTerrain.temperaturesHaccp.totalSemaine} relevés
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  {data.preuvesTerrain.temperaturesHaccp.anomaliesSemaine === 0
                    ? "✓ Chaîne du froid maîtrisée"
                    : `${data.preuvesTerrain.temperaturesHaccp.anomaliesSemaine} anomalie(s)`}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                <span className="text-slate-500 text-[11px]">Bionettoyage</span>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {data.preuvesTerrain.nettoyage.validationsSemaine} validations
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  ✓ Émargements horodatés
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                <span className="text-slate-500 text-[11px]">Médicaments & PAI</span>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {data.preuvesTerrain.medicamentsEtPai.paisActifs} PAI actifs
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  {data.preuvesTerrain.medicamentsEtPai.administrationsSemaine} prise(s) cosignée(s)
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                <span className="text-slate-500 text-[11px]">Pointages Présences</span>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {data.preuvesTerrain.presences.presentsAujourdhui} présents
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  ✓ Taux d'encadrement vérifié
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 2 : AUTO-ÉVALUATION */}
      {ongletActif === "AUTOREF" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Grille des 20 Critères Nationaux
              </h3>
              <p className="text-xs text-slate-500">
                Consultez l'état de validation de chaque critère ministériel.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Filtre par axe */}
              <select
                value={filtreAxe}
                onChange={(e) => setFiltreAxe(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:outline-none"
              >
                <option value="TOUS">Tous les axes</option>
                <option value="ACCUEIL_SECURITE">1. Accueil & Sécurité</option>
                <option value="DEVELOPPEMENT_EVEIL">2. Éveil & Développement</option>
                <option value="RELATION_FAMILLES">3. Relation Familles</option>
                <option value="PILOTAGE_RISQUES">4. Risques & Équipe</option>
              </select>

              {/* Recherche textuelle */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={rechercheCritere}
                  onChange={(e) => setRechercheCritere(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none w-36 sm:w-48"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3 w-[12%]">Réf</th>
                  <th className="py-2.5 px-3 w-[45%]">Critère Officiel</th>
                  <th className="py-2.5 px-3 w-[18%]">Statut de Conformité</th>
                  <th className="py-2.5 px-3 w-[25%]">Constats & Pistes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criteresFiltres.map((c) => {
                  const st = c.evaluation?.statut ?? "NON_EVALUE";
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 align-top font-bold text-indigo-700">
                        {c.code}
                      </td>
                      <td className="py-3 px-3 align-top space-y-1">
                        <p className="font-semibold text-slate-900">{c.titre}</p>
                        <p className="text-slate-500 text-[11px] line-clamp-1">{c.description}</p>
                      </td>
                      <td className="py-3 px-3 align-top">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold ${
                            st === "CONFORME" || st === "EXEMPLAIRE"
                              ? "bg-emerald-100 text-emerald-800"
                              : st === "PARTIELLEMENT_CONFORME"
                              ? "bg-amber-100 text-amber-800"
                              : st === "A_AMELIORER"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {st === "CONFORME" || st === "EXEMPLAIRE"
                            ? "Conforme"
                            : st === "PARTIELLEMENT_CONFORME"
                            ? "Partiellement conforme"
                            : st === "A_AMELIORER"
                            ? "À améliorer"
                            : "Non évalué"}
                        </span>
                      </td>
                      <td className="py-3 px-3 align-top text-slate-600 text-[11px]">
                        {c.evaluation?.observations || c.evaluation?.pistes_amelioration || (
                          <span className="text-slate-400 italic">Non consigné</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 3 : ENQUÊTES USAGERS */}
      {ongletActif === "ENQUETES" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Baromètre de Satisfaction des Familles & Usagers
            </h3>
            <p className="text-xs text-slate-500">
              Résultats agrégés des enquêtes administrées pendant le cycle d'évaluation.
            </p>
          </div>

          {data.enquetesSynthese.length > 0 ? (
            <div className="space-y-4">
              {data.enquetesSynthese.map((enq) => (
                <div
                  key={enq.id}
                  className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                        {enq.type_enquete}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{enq.titre}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-700">
                          {enq.tauxSatisfaction}%
                        </span>
                        <p className="text-[10px] text-slate-400">Satisfaction</p>
                      </div>
                      <div className="text-right pl-3 border-l border-slate-200">
                        <span className="text-lg font-black text-slate-800">
                          {enq.totalReponses}
                        </span>
                        <p className="text-[10px] text-slate-400">Réponses</p>
                      </div>
                    </div>
                  </div>

                  {/* Verbatims */}
                  {enq.topVerbatims.length > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-700">
                        Extraits de verbatims et retours qualitatifs :
                      </span>
                      <div className="mt-1 space-y-1">
                        {enq.topVerbatims.map((vb, idx) => (
                          <p key={idx} className="text-xs text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                            "{vb}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Aucune enquête enregistrée pour le moment.
              </p>
              <Link
                href={`/dashboard/${structureId}/qualite/enquetes`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 pt-1"
              >
                Créer une première campagne d'enquête <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* CONTENU ONGLET 4 : PLAN D'ACTION QUALITÉ */}
      {ongletActif === "PAQ" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Plan d'Action Qualité (PAQ) associé au cycle
              </h3>
              <p className="text-xs text-slate-500">
                Actions correctives et améliorations continues engagées par l'équipe.
              </p>
            </div>
            <Link
              href={`/dashboard/${structureId}/qualite/plan-action`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              Éditer le PAQ <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3 w-[15%]">Réf</th>
                  <th className="py-2.5 px-3 w-[35%]">Action</th>
                  <th className="py-2.5 px-3 w-[15%]">Responsable</th>
                  <th className="py-2.5 px-3 w-[12%]">Priorité</th>
                  <th className="py-2.5 px-3 w-[10%]">Statut</th>
                  <th className="py-2.5 px-3 w-[13%]">Résultat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.actionsPAQ.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 align-top">
                      {act.critere ? (
                        <span className="font-bold text-indigo-700">Critère {act.critere.code}</span>
                      ) : (
                        <span className="text-slate-400">Transversale</span>
                      )}
                    </td>
                    <td className="py-3 px-3 align-top space-y-0.5">
                      <p className="font-semibold text-slate-900">{act.titre}</p>
                      {act.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">{act.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-3 align-top text-slate-700">
                      {act.responsable || "Non assigné"}
                    </td>
                    <td className="py-3 px-3 align-top">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {act.priorite}
                      </span>
                    </td>
                    <td className="py-3 px-3 align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          act.statut === "TERMINE"
                            ? "bg-emerald-100 text-emerald-800"
                            : act.statut === "EN_COURS"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {act.statut === "TERMINE" ? "Clôturé" : act.statut === "EN_COURS" ? "En cours" : "À faire"}
                      </span>
                    </td>
                    <td className="py-3 px-3 align-top text-slate-600 text-[11px]">
                      {act.resultat_attendu || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale d'exportation officielle */}
      <DossierExportModal
        isOpen={modalExportOpen}
        onClose={() => setModalExportOpen(false)}
        data={data}
      />
    </div>
  );
}
