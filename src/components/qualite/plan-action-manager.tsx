"use client";

import React, { useState, useMemo } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  CircleAlert,
  ArrowUpRight,
  User,
  Calendar,
  Sparkles,
  Check,
  ChevronDown,
  X,
  Edit3,
  Trash2,
  RotateCcw,
  Loader2,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { StatutAction, PrioriteAction } from "@prisma/client";
import { mettreAJourStatutActionPAQ, supprimerActionPAQ } from "@/app/actions/qualite";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PaqActionModal } from "./paq-action-modal";
import { PaqExportModal, StructureInfo } from "./paq-export-modal";

export interface ActionPAQItem {
  id: string;
  structure_id: string;
  critere_id: string | null;
  titre: string;
  description: string | null;
  responsable: string | null;
  echeance: Date | string | null;
  priorite: PrioriteAction;
  statut: StatutAction;
  resultat_attendu: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  critere?: {
    code: string;
    titre: string;
    axe: string;
  } | null;
}

interface PlanActionManagerProps {
  structureId: string;
  initialActions: ActionPAQItem[];
  criteresReferentiel?: Array<{
    id: string;
    code: string;
    titre: string;
    axe: string;
  }>;
  structureInfo?: StructureInfo | null;
}

export function PlanActionManager({
  structureId,
  initialActions,
  criteresReferentiel = [],
  structureInfo = null,
}: PlanActionManagerProps) {
  const router = useRouter();
  const [actions, setActions] = useState<ActionPAQItem[]>(initialActions);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // État de la modale de création d'action directe
  const [creationModalOpen, setCreationModalOpen] = useState(false);

  // État de la modale d'export & impression officielle
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // État de la modale de clôture
  const [clotureModalOpen, setClotureModalOpen] = useState(false);
  const [selectedActionForCloture, setSelectedActionForCloture] = useState<ActionPAQItem | null>(null);
  const [commentaireCloture, setCommentaireCloture] = useState("");
  const [submittingCloture, setSubmittingCloture] = useState(false);

  // Filtres et recherche
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<"TOUS" | StatutAction>("TOUS");
  const [filtrePriorite, setFiltrePriorite] = useState<"TOUTES" | PrioriteAction>("TOUTES");
  const [filtreResponsable, setFiltreResponsable] = useState<"TOUS" | "NON_ASSIGNE" | string>("TOUS");

  // Liste unique des responsables existants
  const listeResponsables = useMemo(() => {
    const respSet = new Set<string>();
    actions.forEach((a) => {
      if (a.responsable && a.responsable.trim()) {
        respSet.add(a.responsable.trim());
      }
    });
    return Array.from(respSet).sort((a, b) => a.localeCompare(b, "fr"));
  }, [actions]);

  // Actions filtrées selon tous les critères
  const actionsFiltrees = useMemo(() => {
    return actions.filter((act) => {
      // 1. Filtre par statut
      if (filtreStatut !== "TOUS" && act.statut !== filtreStatut) {
        return false;
      }

      // 2. Filtre par priorité
      if (filtrePriorite !== "TOUTES" && act.priorite !== filtrePriorite) {
        return false;
      }

      // 3. Filtre par responsable
      if (filtreResponsable === "NON_ASSIGNE") {
        if (act.responsable && act.responsable.trim()) return false;
      } else if (filtreResponsable !== "TOUS") {
        if (act.responsable?.trim() !== filtreResponsable) return false;
      }

      // 4. Recherche textuelle
      if (recherche.trim()) {
        const query = recherche.toLowerCase().trim();
        const matchTitre = act.titre.toLowerCase().includes(query);
        const matchDesc = act.description?.toLowerCase().includes(query) ?? false;
        const matchResp = act.responsable?.toLowerCase().includes(query) ?? false;
        const matchResultat = act.resultat_attendu?.toLowerCase().includes(query) ?? false;
        const matchCritere =
          (act.critere?.code.toLowerCase().includes(query) ||
            act.critere?.titre.toLowerCase().includes(query)) ??
          false;

        if (!matchTitre && !matchDesc && !matchResp && !matchResultat && !matchCritere) {
          return false;
        }
      }

      return true;
    });
  }, [actions, recherche, filtreStatut, filtrePriorite, filtreResponsable]);

  // Indicateur si des filtres sont appliqués
  const aDesFiltresActifs =
    recherche.trim() !== "" ||
    filtreStatut !== "TOUS" ||
    filtrePriorite !== "TOUTES" ||
    filtreResponsable !== "TOUS";

  const reinitialiserFiltres = () => {
    setRecherche("");
    setFiltreStatut("TOUS");
    setFiltrePriorite("TOUTES");
    setFiltreResponsable("TOUS");
  };

  // Compteurs synthétiques
  const totalActions = actions.length;
  const enCoursActions = actions.filter((a) => a.statut === "A_FAIRE" || a.statut === "EN_COURS").length;
  const clotureesActions = actions.filter((a) => a.statut === "TERMINE").length;

  /**
   * Bascule de statut directe (À faire <-> En cours) ou déclenchement du modal de clôture si Terminé
   */
  const handleStatutChange = async (action: ActionPAQItem, nouveauStatut: StatutAction) => {
    if (action.statut === nouveauStatut) return;

    // Si on veut marquer comme Terminé, on ouvre la modale de clôture pour recueillir le résultat
    if (nouveauStatut === "TERMINE") {
      setSelectedActionForCloture(action);
      setCommentaireCloture(action.resultat_attendu || "");
      setClotureModalOpen(true);
      return;
    }

    // Sinon mise à jour directe (A_FAIRE ou EN_COURS)
    setLoadingActionId(action.id);
    try {
      const res = await mettreAJourStatutActionPAQ({
        actionId: action.id,
        structureId,
        statut: nouveauStatut,
      });

      if (res.success) {
        setActions((prev) =>
          prev.map((a) =>
            a.id === action.id ? { ...a, statut: nouveauStatut } : a
          )
        );
        toast.success(
          nouveauStatut === "EN_COURS"
            ? "Action passée en cours de réalisation"
            : "Action replacée en attente (À faire)"
        );
        router.refresh();
      } else {
        toast.error(res.error || "Erreur lors de la mise à jour du statut");
      }
    } catch (err: any) {
      toast.error(err?.message || "Une erreur inattendue est survenue");
    } finally {
      setLoadingActionId(null);
    }
  };

  /**
   * Validation de la clôture avec résultat
   */
  const handleValiderCloture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActionForCloture) return;

    setSubmittingCloture(true);
    try {
      const res = await mettreAJourStatutActionPAQ({
        actionId: selectedActionForCloture.id,
        structureId,
        statut: "TERMINE",
        commentaireCloture: commentaireCloture.trim() || null,
      });

      if (res.success) {
        setActions((prev) =>
          prev.map((a) =>
            a.id === selectedActionForCloture.id
              ? { ...a, statut: "TERMINE", resultat_attendu: commentaireCloture.trim() || null }
              : a
          )
        );
        toast.success("Action clôturée avec succès ! Objectif validé.");
        setClotureModalOpen(false);
        setSelectedActionForCloture(null);
        setCommentaireCloture("");
        router.refresh();
      } else {
        toast.error(res.error || "Échec de la clôture de l'action");
      }
    } catch (err: any) {
      toast.error(err?.message || "Une erreur inattendue est survenue");
    } finally {
      setSubmittingCloture(false);
    }
  };

  /**
   * Modification directe du résultat d'une action déjà clôturée
   */
  const handleEditerResultat = (action: ActionPAQItem) => {
    setSelectedActionForCloture(action);
    setCommentaireCloture(action.resultat_attendu || "");
    setClotureModalOpen(true);
  };

  /**
   * Suppression d'une action
   */
  const handleSupprimerAction = async (actionId: string, titre: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'action "${titre}" du PAQ ?`)) {
      return;
    }

    setLoadingActionId(actionId);
    try {
      const res = await supprimerActionPAQ(actionId, structureId);
      if (res.success) {
        setActions((prev) => prev.filter((a) => a.id !== actionId));
        toast.success("Action supprimée du PAQ");
        router.refresh();
      } else {
        toast.error(res.error || "Impossible de supprimer l'action");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erreur de suppression");
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé synthétique des actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
            {totalActions}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Actions totales</p>
            <p className="text-sm font-semibold text-slate-900">Engagées dans le PAQ</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            {enCoursActions}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">En cours / À faire</p>
            <p className="text-sm font-semibold text-slate-900">Sous surveillance active</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            {clotureesActions}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Actions clôturées</p>
            <p className="text-sm font-semibold text-slate-900">Objectifs atteints</p>
          </div>
        </div>
      </div>

      {/* Liste des actions avec barre d'outils (Filtres & Recherche) */}
      {actions.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Entête avec titre et bouton d'action */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
                Actions du plan d'action qualité
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilotez l'avancement et clôturez chaque démarche dès constatation des résultats
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {aDesFiltresActifs ? (
                  <>
                    <span className="text-indigo-600">{actionsFiltrees.length}</span> / {actions.length} action{actions.length > 1 ? "s" : ""}
                  </>
                ) : (
                  `${actions.length} action${actions.length > 1 ? "s" : ""}`
                )}
              </span>
              <button
                type="button"
                onClick={() => setExportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Exporter en PDF/Impression ou Excel/CSV"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Exporter / Imprimer</span>
                <span className="sm:hidden">Export</span>
              </button>
              <button
                type="button"
                onClick={() => setCreationModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Nouvelle action PAQ
              </button>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="p-4 border-b border-slate-100 bg-white space-y-3">
            {/* Ligne 1 : Champ de recherche plein format */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher par titre, responsable, critère RNQ, description..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {recherche.trim() && (
                <button
                  type="button"
                  onClick={() => setRecherche("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60 transition-all"
                  title="Effacer la recherche"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Ligne 2 : Filtres rapides par Statut (Pills) + Dropdowns Priorité & Responsable */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Pills de Statut */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setFiltreStatut("TOUS")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    filtreStatut === "TOUS"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  Tous ({actions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltreStatut("A_FAIRE")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    filtreStatut === "A_FAIRE"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  À faire ({actions.filter((a) => a.statut === "A_FAIRE").length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltreStatut("EN_COURS")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    filtreStatut === "EN_COURS"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  En cours ({actions.filter((a) => a.statut === "EN_COURS").length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltreStatut("TERMINE")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    filtreStatut === "TERMINE"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  Terminé ({actions.filter((a) => a.statut === "TERMINE").length})
                </button>
              </div>

              {/* Menus de filtres secondaires (Priorité, Responsable, Reset) */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Sélecteur Priorité */}
                <div className="relative">
                  <select
                    value={filtrePriorite}
                    onChange={(e) => setFiltrePriorite(e.target.value as any)}
                    aria-label="Filtrer par priorité"
                    className={`pl-2.5 pr-7 py-1.5 rounded-lg text-xs font-medium border appearance-none transition-all cursor-pointer ${
                      filtrePriorite !== "TOUTES"
                        ? "bg-indigo-50/60 border-indigo-200 text-indigo-800 font-semibold"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                  >
                    <option value="TOUTES">Toutes les priorités</option>
                    <option value="HAUTE">Haute / Urgente</option>
                    <option value="MOYENNE">Moyenne</option>
                    <option value="BASSE">Basse</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Sélecteur Responsable */}
                <div className="relative">
                  <select
                    value={filtreResponsable}
                    onChange={(e) => setFiltreResponsable(e.target.value)}
                    aria-label="Filtrer par responsable"
                    className={`pl-2.5 pr-7 py-1.5 rounded-lg text-xs font-medium border appearance-none transition-all cursor-pointer ${
                      filtreResponsable !== "TOUS"
                        ? "bg-indigo-50/60 border-indigo-200 text-indigo-800 font-semibold"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                  >
                    <option value="TOUS">Tous les responsables</option>
                    {listeResponsables.map((resp) => (
                      <option key={resp} value={resp}>
                        {resp}
                      </option>
                    ))}
                    <option value="NON_ASSIGNE">Non assigné</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Bouton Réinitialiser si filtres actifs */}
                {aDesFiltresActifs && (
                  <button
                    type="button"
                    onClick={reinitialiserFiltres}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all border border-rose-200 cursor-pointer"
                    title="Réinitialiser tous les filtres"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Corps de la liste : actions filtrées ou état vide des filtres */}
          {actionsFiltrees.length === 0 ? (
            <div className="p-10 text-center space-y-3 bg-slate-50/40">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  Aucune action ne correspond à vos filtres
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Modifiez vos critères de recherche, ajustez les statuts ou réinitialisez les filtres pour afficher l'ensemble du PAQ.
                </p>
              </div>
              <button
                type="button"
                onClick={reinitialiserFiltres}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                Effacer tous les filtres
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {actionsFiltrees.map((act) => {
              const estEnRetard =
                act.statut !== "TERMINE" &&
                act.echeance &&
                new Date(act.echeance).getTime() < new Date().setHours(0, 0, 0, 0);

              const isLoading = loadingActionId === act.id;

              return (
                <div
                  key={act.id}
                  className={`p-5 hover:bg-slate-50/70 transition-all ${
                    act.statut === "TERMINE" ? "bg-slate-50/30" : ""
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Infos de l'action */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {act.critere?.code ? (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            Critère {act.critere.code}
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            Action transversale
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            act.priorite === "HAUTE" || act.priorite === "URGENTE"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : act.priorite === "MOYENNE"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          Priorité {act.priorite.toLowerCase()}
                        </span>

                        {estEnRetard && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-red-100 text-red-700 flex items-center gap-1 animate-pulse">
                            <CircleAlert className="w-3 h-3" />
                            Échéance dépassée
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-semibold ${
                          act.statut === "TERMINE"
                            ? "text-slate-600 line-through decoration-slate-300"
                            : "text-slate-900"
                        }`}
                      >
                        {act.titre}
                      </h3>

                      {act.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {act.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                        {act.responsable && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            Resp. : <strong className="text-slate-700 font-medium">{act.responsable}</strong>
                          </span>
                        )}
                        {act.echeance && (
                          <span className={`flex items-center gap-1 ${estEnRetard ? "text-red-600 font-semibold" : ""}`}>
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Échéance : <strong className="font-medium">{new Date(act.echeance).toLocaleDateString("fr-FR")}</strong>
                          </span>
                        )}
                        {act.critere?.titre && (
                          <span className="text-slate-400 truncate max-w-xs" title={act.critere.titre}>
                            Lié à : {act.critere.titre}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contrôle interactif du statut */}
                    <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
                      {isLoading ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs">
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                          <span>Mise à jour...</span>
                        </div>
                      ) : (
                        <div className="inline-flex rounded-xl p-1 bg-slate-100/80 border border-slate-200 shadow-inner gap-1">
                          <button
                            type="button"
                            onClick={() => handleStatutChange(act, "A_FAIRE")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              act.statut === "A_FAIRE"
                                ? "bg-white text-slate-800 shadow-sm font-semibold"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                            }`}
                            title="Placer l'action en attente"
                          >
                            À faire
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatutChange(act, "EN_COURS")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                              act.statut === "EN_COURS"
                                ? "bg-amber-500 text-white shadow-sm font-semibold"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                            }`}
                            title="Action en cours de déploiement"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            En cours
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatutChange(act, "TERMINE")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                              act.statut === "TERMINE"
                                ? "bg-emerald-600 text-white shadow-sm font-semibold"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                            }`}
                            title="Clôturer l'action et inscrire le bilan"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Terminé
                          </button>
                        </div>
                      )}

                      {/* Lien vers critère auto-évaluation si associé */}
                      {act.critere && (
                        <Link
                          href={`/dashboard/${structureId}/qualite/auto-evaluation`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="Consulter le critère dans l'auto-évaluation"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      )}

                      {/* Menu suppression */}
                      <button
                        type="button"
                        onClick={() => handleSupprimerAction(act.id, act.titre)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Supprimer cette action"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Encart de résultat si action clôturée */}
                  {act.statut === "TERMINE" && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50 rounded-xl p-3 border border-slate-200/60">
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 font-bold" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">
                            Résultat et bilan d'impact
                          </p>
                          <p className="text-xs text-slate-900 mt-0.5">
                            {act.resultat_attendu || (
                              <span className="italic text-slate-500">
                                Aucun commentaire de clôture spécifié.
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEditerResultat(act)}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 hover:underline shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Modifier bilan
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}
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
              Inscrivez directement une démarche d'amélioration ou appuyez-vous sur les critères évalués lors de votre auto-évaluation qualité.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCreationModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nouvelle action PAQ
            </button>
            <Link
              href={`/dashboard/${structureId}/qualite/auto-evaluation`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              Aller à l'auto-évaluation
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Modale de Création Directe / Libre d'une action PAQ */}
      <PaqActionModal
        isOpen={creationModalOpen}
        onClose={() => setCreationModalOpen(false)}
        structureId={structureId}
        criteresDisponibles={criteresReferentiel}
        onSuccess={(nouvelleAction) => {
          if (nouvelleAction) {
            setActions((prev) => [nouvelleAction, ...prev]);
          }
          setCreationModalOpen(false);
          router.refresh();
        }}
      />

      {/* Modale de Clôture / Saisie du Résultat Obtenu */}
      {clotureModalOpen && selectedActionForCloture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">
                    Clôture de l'action PAQ
                  </h3>
                  <p className="text-xs text-slate-500">
                    Validez l'atteinte des objectifs et documentez le résultat
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setClotureModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps du modal */}
            <form onSubmit={handleValiderCloture} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Action concernée
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {selectedActionForCloture.titre}
                </p>
                {selectedActionForCloture.critere?.code && (
                  <p className="text-xs text-indigo-600 mt-1">
                    Rattachée au critère {selectedActionForCloture.critere.code} : {selectedActionForCloture.critere.titre}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Résultat obtenu / bilan d'impact <span className="text-emerald-600 font-normal">(conseillé pour l'audit PMI)</span>
                </label>
                <textarea
                  rows={4}
                  value={commentaireCloture}
                  onChange={(e) => setCommentaireCloture(e.target.value)}
                  placeholder="Ex : Protocole d'accueil revu et validé par le médecin référent. Présentation effectuée en réunion d'équipe le 15/09 avec émargeage. Affichage mis à disposition dans chaque section."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 placeholder-slate-400 resize-none"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Ce bilan sera consigné dans le registre qualité et repris dans le dossier quinquennal.
                </p>
              </div>

              {/* Actions du footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setClotureModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submittingCloture}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingCloture ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Clôture en cours...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Confirmer la clôture
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale d'Export & Synthèse Officielle PAQ (Impression PDF / Excel CSV) */}
      <PaqExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        actions={actions}
        actionsFiltrees={actionsFiltrees}
        structureInfo={structureInfo}
      />
    </div>
  );
}
