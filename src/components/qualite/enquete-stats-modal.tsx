"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  Users,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Heart,
  Sliders,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Calendar,
  User,
  Trash2,
} from "lucide-react";
import { getStatistiquesEnquete, supprimerReponseEnquete } from "@/app/actions/enquetes";
import { AxeQualite } from "@prisma/client";
import Link from "next/link";

interface EnqueteStatsModalProps {
  enqueteId: string;
  structureId: string;
  onClose: () => void;
}

const AXE_LABELS: Record<AxeQualite, { titre: string; couleur: string; bg: string }> = {
  ACCUEIL_SECURITE: {
    titre: "Axe 1 : accueil et sécurité",
    couleur: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  DEVELOPPEMENT_EVEIL: {
    titre: "Axe 2 : développement et éveil",
    couleur: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  RELATION_FAMILLES: {
    titre: "Axe 3 : relation avec les familles",
    couleur: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  PILOTAGE_RISQUES: {
    titre: "Axe 4 : organisation et pilotage",
    couleur: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
};

type TabType = "synthese" | "questions" | "verbatims" | "parents";

export function EnqueteStatsModal({ enqueteId, structureId, onClose }: EnqueteStatsModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("synthese");
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleParent = (id: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Chargement (et rechargement) des statistiques de l'enquête
  const loadStats = React.useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    const res = await getStatistiquesEnquete(enqueteId);
    if (!res.error && res.stats) {
      setData(res);
    }
    setLoading(false);
  }, [enqueteId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Suppression définitive de la réponse d'un parent (droit à l'effacement)
  const handleDeleteReponse = async (reponseId: string, nom: string) => {
    if (
      !confirm(
        `Supprimer définitivement la réponse de ${nom} ?\n\nSes notes et commentaires seront effacés et les statistiques recalculées. Cette action est irréversible.`
      )
    ) {
      return;
    }
    setDeletingId(reponseId);
    const res = await supprimerReponseEnquete(reponseId, structureId);
    if (res.error) {
      alert(res.error);
    } else {
      await loadStats(false);
    }
    setDeletingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Modal */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-1.5 border border-emerald-200/60">
              <TrendingUp className="w-3.5 h-3.5" />
              Baromètre et analyse statistique
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              {data?.enquete?.titre || "Résultats de l'enquête"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Onglets de navigation */}
        <div className="flex border-b border-gray-100 px-6 gap-2 bg-gray-50/50">
          <button
            onClick={() => setActiveTab("synthese")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "synthese"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Vue synthétique et axes 2025
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "questions"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Détail par question
          </button>
          <button
            onClick={() => setActiveTab("verbatims")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "verbatims"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Verbatims des parents ({data?.stats?.tousLesVerbatims?.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("parents")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "parents"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Parents ({data?.stats?.reponsesParents?.length ?? data?.stats?.totalReponses ?? 0})
          </button>
        </div>

        {/* Contenu avec scroll */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
              <p className="text-sm font-medium">Compilation des retours parents...</p>
            </div>
          ) : !data || data.stats.totalReponses === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Aucune réponse pour le moment</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Partagez le lien de l&apos;enquête auprès de vos familles pour commencer à collecter les retours.
              </p>
            </div>
          ) : (
            <>
              {/* TAB SYNTHÈSE */}
              {activeTab === "synthese" && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Satisfaction globale
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-emerald-700">
                          {data.stats.satisfactionGlobalePct}%
                        </span>
                        <span className="text-xs text-emerald-600 font-medium">avis positifs</span>
                      </div>
                      <p className="text-xs text-emerald-700/80 mt-1">Notes ≥ 4/5 ou réponses Oui</p>
                    </div>

                    <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4">
                      <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
                        Participation
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-blue-700">
                          {data.stats.totalReponses}
                        </span>
                        {data.enquete.cible_reponses && (
                          <span className="text-xs text-blue-600 font-medium">
                            / {data.enquete.cible_reponses} cible
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-700/80 mt-1">Familles ayant répondu</p>
                    </div>

                    <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4">
                      <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                        Verbatims libres
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-purple-700">
                          {data.stats.tousLesVerbatims.length}
                        </span>
                        <span className="text-xs text-purple-600 font-medium">commentaires</span>
                      </div>
                      <p className="text-xs text-purple-700/80 mt-1">Suggestions et compliments</p>
                    </div>
                  </div>

                  {/* Analyse par Axe du Référentiel National 2025 */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      Score de satisfaction aligné sur le référentiel national 2025
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(Object.keys(data.stats.parAxe) as AxeQualite[]).map((axe) => {
                        const axeStat = data.stats.parAxe[axe];
                        const info = AXE_LABELS[axe];
                        const moyenne = axeStat.moyenneSur5;
                        const pct = Math.round((moyenne / 5) * 100);

                        return (
                          <div
                            key={axe}
                            className={`p-4 rounded-2xl border ${info.bg} flex flex-col justify-between`}
                          >
                            <div className="flex items-start justify-between">
                              <span className={`text-sm font-bold ${info.couleur}`}>
                                {info.titre}
                              </span>
                              <span className={`text-xl font-black ${info.couleur}`}>
                                {moyenne > 0 ? `${moyenne} / 5` : "N/A"}
                              </span>
                            </div>
                            <div className="mt-3">
                              <div className="w-full bg-white/80 h-2.5 rounded-full overflow-hidden border border-gray-200/60">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 mt-1 block">
                                {axeStat.nbEvaluations} avis collectés sur cet axe
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Passerelle vers le Plan d'Amélioration de la Qualité (PAQ) */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        Passerelle qualité : transformer les retours en actions
                      </h4>
                      <p className="text-xs text-amber-800/80 mt-1 max-w-xl">
                        Un point de vigilance identifié ? Intégrez directement une action corrective dans votre
                        plan d&apos;action qualité (PAQ) pour prouver votre réactivité lors des audits.
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/${structureId}/qualite/plan-action/`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex-shrink-0"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Créer une action PAQ
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB QUESTIONS */}
              {activeTab === "questions" && (
                <div className="space-y-4">
                  {data.stats.questionsStats.map((q: any, idx: number) => (
                    <div
                      key={q.questionId}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                              {q.libelle}
                            </h4>
                            {q.axe_qualite && (
                              <span className="inline-block mt-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                {AXE_LABELS[q.axe_qualite as AxeQualite]?.titre || q.axe_qualite}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {q.nbReponses} réponses
                        </span>
                      </div>

                      {/* Statistique spécifique selon le type */}
                      {q.type_question === "NOTE_5" && (
                        <div className="pt-2">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-2xl font-black text-gray-900">
                              {q.moyenne !== null ? `${q.moyenne} / 5` : "-"}
                            </span>
                            <div className="flex items-center text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    q.moyenne && star <= Math.round(q.moyenne)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Barres de répartition 1 à 5 */}
                          <div className="grid grid-cols-5 gap-2 text-center text-xs">
                            {[1, 2, 3, 4, 5].map((n) => {
                              const count = q.distributionNotes[n] || 0;
                              const pct = q.nbReponses > 0 ? Math.round((count / q.nbReponses) * 100) : 0;
                              return (
                                <div key={n} className="space-y-1">
                                  <div className="h-16 bg-gray-50 rounded-lg flex flex-col justify-end p-1 overflow-hidden">
                                    <div
                                      className="bg-emerald-500 rounded w-full transition-all"
                                      style={{ height: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="font-semibold text-gray-700">{n} ★</span>
                                  <span className="text-[11px] text-gray-400 block">{count} ({pct}%)</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {q.type_question === "OUI_NON" && (
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-sm font-semibold mb-1">
                            <span className="text-emerald-700">Oui : {q.tauxOui}%</span>
                            <span className="text-gray-500">Non : {100 - (q.tauxOui ?? 0)}%</span>
                          </div>
                          <div className="w-full bg-red-100 h-3 rounded-full overflow-hidden flex">
                            <div
                              className="bg-emerald-500 h-full transition-all"
                              style={{ width: `${q.tauxOui ?? 0}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {q.type_question === "TEXTE" && (
                        <div className="pt-2">
                          <span className="text-xs font-semibold text-gray-500">
                            {q.verbatims.length} commentaire(s) enregistré(s)
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB VERBATIMS */}
              {activeTab === "verbatims" && (
                <div className="space-y-3">
                  {data.stats.tousLesVerbatims.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun commentaire textuel laissé pour le moment.</p>
                    </div>
                  ) : (
                    data.stats.tousLesVerbatims.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 text-sm"
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.question}</span>
                        </div>
                        <p className="text-gray-800 italic leading-relaxed">
                          &laquo; {item.texte} &raquo;
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB PARENTS */}
              {activeTab === "parents" && (
                <div className="space-y-4">
                  {/* Info Header */}
                  <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-4 flex items-start gap-3">
                    <div className="p-2 bg-emerald-100/80 text-emerald-800 rounded-xl shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Liste des retours individuels des parents
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        Consultez le détail des réponses pour chaque famille. Cliquez sur un parent pour dérouler l&apos;ensemble de ses réponses et échanger avec lui pour approfondir les axes d&apos;amélioration.
                      </p>
                    </div>
                  </div>

                  {!data?.stats?.reponsesParents || data.stats.reponsesParents.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun parent n&apos;a encore soumis d&apos;évaluation.</p>
                    </div>
                  ) : (
                    data.stats.reponsesParents.map((parent: any) => {
                      const isExpanded = expandedParents.has(parent.id);
                      const initiales = parent.nom
                        ? parent.nom
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()
                        : "P";
                      const dateFormatted = parent.date_soumission
                        ? new Date(parent.date_soumission).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Date inconnue";

                      return (
                        <div
                          key={parent.id}
                          className="bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:border-gray-300 transition overflow-hidden"
                        >
                          {/* En-tête cliquable */}
                          <div
                            onClick={() => toggleParent(parent.id)}
                            className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none bg-gradient-to-r from-gray-50/70 to-white hover:bg-gray-50 transition"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                                {initiales}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-bold text-gray-900 text-base truncate">
                                    {parent.nom}
                                  </h3>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                    <Calendar className="w-3 h-3" />
                                    {dateFormatted}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                  <a
                                    href={`mailto:${parent.email}?subject=${encodeURIComponent(`Échange concernant vos retours - ${data.enquete.titre}`)}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                                    title="Envoyer un email au parent"
                                  >
                                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                                    {parent.email}
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Chevron et action */}
                            <div className="flex items-center gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteReponse(parent.id, parent.nom);
                                }}
                                disabled={deletingId === parent.id}
                                className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-sm disabled:opacity-50"
                                title="Supprimer cette réponse"
                                aria-label={`Supprimer la réponse de ${parent.nom}`}
                              >
                                {deletingId === parent.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                              <span className="hidden sm:inline-block text-xs font-medium text-gray-400">
                                {isExpanded ? "Masquer les réponses" : "Voir les réponses"}
                              </span>
                              <div
                                className={`w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 transition-transform duration-200 shadow-sm ${
                                  isExpanded ? "rotate-180 bg-gray-100 text-gray-900" : ""
                                }`}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          {/* Détail accordéon des réponses */}
                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50/40 p-4 sm:p-5 space-y-3.5 animate-in fade-in duration-200">
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200/60 text-xs">
                                <span className="font-semibold text-gray-600">
                                  Détail des {parent.reponses?.length ?? 0} question(s) répondue(s)
                                </span>
                                <a
                                  href={`mailto:${parent.email}?subject=${encodeURIComponent(`Échange suite à votre évaluation - ${data.enquete.titre}`)}`}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70 transition"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  Contacter pour échanger
                                </a>
                              </div>

                              <div className="space-y-2.5">
                                {parent.reponses?.map((rep: any, idx: number) => {
                                  const axeInfo = rep.axe_qualite ? AXE_LABELS[rep.axe_qualite as AxeQualite] : null;

                                  return (
                                    <div
                                      key={rep.questionId || idx}
                                      className="bg-white rounded-xl p-3.5 border border-gray-200/70 shadow-xs space-y-2"
                                    >
                                      <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div className="space-y-1 flex-1 min-w-[200px]">
                                          {axeInfo && (
                                            <span
                                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${axeInfo.bg} ${axeInfo.couleur}`}
                                            >
                                              {axeInfo.titre}
                                            </span>
                                          )}
                                          <p className="text-sm font-semibold text-gray-900">
                                            {rep.libelle}
                                          </p>
                                        </div>

                                        {/* Valeur de la réponse */}
                                        <div className="shrink-0">
                                          {rep.type_question === "NOTE_5" && rep.valeur_note !== null && (
                                            <div className="flex items-center gap-2">
                                              <div className="flex text-amber-400">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                  <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                      star <= rep.valeur_note
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-gray-200"
                                                    }`}
                                                  />
                                                ))}
                                              </div>
                                              <span className="font-bold text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                                {rep.valeur_note} / 5
                                              </span>
                                            </div>
                                          )}

                                          {rep.type_question === "OUI_NON" && rep.valeur_booleen !== null && (
                                            <span
                                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                                rep.valeur_booleen
                                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                                  : "bg-rose-50 text-rose-800 border-rose-200"
                                              }`}
                                            >
                                              {rep.valeur_booleen ? "Oui" : "Non"}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Si commentaire texte */}
                                      {rep.type_question === "TEXTE" && (
                                        <div className="mt-1 p-3 bg-gray-50/80 rounded-lg border-l-4 border-emerald-500 text-xs text-gray-800 italic leading-relaxed">
                                          {rep.valeur_texte ? (
                                            <>&laquo; {rep.valeur_texte} &raquo;</>
                                          ) : (
                                            <span className="text-gray-400 font-normal">
                                              Aucun commentaire textuel saisi
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
