"use client";

import React, { useState } from "react";
import { StatutConformite, PrioriteAction, StatutAction } from "@prisma/client";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Plus,
  Calendar,
  User,
  Clock,
  ExternalLink,
  Sparkles,
  Save,
  Loader2,
  Check,
} from "lucide-react";
import { EvidenceBadge, type EvidenceData } from "./evidence-badge";

export interface CritereItem {
  id: string;
  code: string;
  chapitre: string;
  axe?: string | null;
  titre: string;
  points_cles: string[];
  guide_ministeriel: string | null;
  exemples_pratiques: string[];
  evidence_source: string | null;
  evaluation?: {
    id: string;
    statut: StatutConformite;
    observations: string | null;
    preuves_url: string[];
    date_evaluation: Date | string;
    evalue_par?: {
      prenom: string;
      nom: string;
    } | null;
  } | null;
  actions_qualite?: {
    id: string;
    titre: string;
    description: string | null;
    responsable: string | null;
    priorite: PrioriteAction;
    statut: StatutAction;
    echeance: Date | string | null;
  }[];
}

interface CritereCardProps {
  critere: CritereItem;
  structureId: string;
  evidenceData?: EvidenceData;
  onUpdateStatut: (critereId: string, statut: StatutConformite, observations?: string) => Promise<boolean>;
  onOpenPaqModal: (critereId: string, critereCode: string, critereTitre: string) => void;
}

export function CritereCard({
  critere,
  structureId,
  evidenceData,
  onUpdateStatut,
  onOpenPaqModal,
}: CritereCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatut, setCurrentStatut] = useState<StatutConformite>(
    critere.evaluation?.statut || "NON_EVALUE"
  );
  const [observations, setObservations] = useState(
    critere.evaluation?.observations || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleStatutChange = async (newStatut: StatutConformite) => {
    setCurrentStatut(newStatut);
    setIsSaving(true);
    const ok = await onUpdateStatut(critere.id, newStatut, observations);
    setIsSaving(false);
    if (ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleSaveObservations = async () => {
    setIsSaving(true);
    const ok = await onUpdateStatut(critere.id, currentStatut, observations);
    setIsSaving(false);
    if (ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const getStatutBadge = (statut: StatutConformite) => {
    switch (statut) {
      case "CONFORME":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle2,
          text: "Conforme",
        };
      case "PARTIELLEMENT_CONFORME":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: AlertTriangle,
          text: "Partiel",
        };
      case "A_AMELIORER":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          icon: XCircle,
          text: "À améliorer",
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-600 border-gray-200",
          icon: HelpCircle,
          text: "Non évalué",
        };
    }
  };

  const badge = getStatutBadge(currentStatut);
  const BadgeIcon = badge.icon;

  const actions = critere.actions_qualite || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-gray-200 overflow-hidden">
      {/* Card Header & Controls */}
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Criterion Info */}
          <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                {critere.code}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                {critere.chapitre}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                {badge.text}
              </span>
              {critere.evidence_source && (
                <EvidenceBadge
                  evidenceSource={critere.evidence_source}
                  evidenceData={evidenceData}
                  structureId={structureId}
                />
              )}
            </div>

            <h4 className="text-sm md:text-base font-semibold text-gray-900 leading-snug">
              {critere.titre}
            </h4>

            {critere.points_cles && critere.points_cles.length > 0 && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {critere.points_cles.join(" • ")}
              </p>
            )}
          </div>

          {/* Quick Conformity Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
            <button
              type="button"
              title="Marquer comme conforme"
              disabled={isSaving}
              onClick={() => handleStatutChange("CONFORME")}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                currentStatut === "CONFORME"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-emerald-50/50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Conforme</span>
            </button>

            <button
              type="button"
              title="Marquer comme partiellement conforme"
              disabled={isSaving}
              onClick={() => handleStatutChange("PARTIELLEMENT_CONFORME")}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                currentStatut === "PARTIELLEMENT_CONFORME"
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-amber-50/50 text-amber-700 border-amber-100 hover:bg-amber-100"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Partiel</span>
            </button>

            <button
              type="button"
              title="Marquer à améliorer"
              disabled={isSaving}
              onClick={() => handleStatutChange("A_AMELIORER")}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                currentStatut === "A_AMELIORER"
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-rose-50/50 text-rose-700 border-rose-100 hover:bg-rose-100"
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span className="hidden sm:inline">À améliorer</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-1"
              aria-label={isOpen ? "Replier" : "Déplier"}
            >
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Content Details */}
      {isOpen && (
        <div className="px-4 md:px-5 pb-5 pt-3 border-t border-gray-50 bg-gray-50/40 space-y-4 text-xs animate-in fade-in duration-200">
          {/* Guide Ministériel & Exemples */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>Exigences du référentiel national (Arrêté 2025 / HAS)</span>
            </div>

            {critere.guide_ministeriel && (
              <p className="text-gray-700 leading-relaxed italic bg-indigo-50/40 p-3 rounded-lg border border-indigo-50">
                "{critere.guide_ministeriel}"
              </p>
            )}

            {critere.exemples_pratiques && critere.exemples_pratiques.length > 0 && (
              <div>
                <span className="font-semibold text-gray-800 block mb-1.5">
                  Exemples de preuves ou bonnes pratiques attendues :
                </span>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {critere.exemples_pratiques.map((ex, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Observations & Field Proof Notes */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-800">
                Observations de la structure et justificatifs internes :
              </label>
              {critere.evaluation?.date_evaluation && (
                <span className="text-[11px] text-gray-400">
                  Évalué le {new Date(critere.evaluation.date_evaluation).toLocaleDateString("fr-FR")}
                  {critere.evaluation.evalue_par && ` par ${critere.evaluation.evalue_par.prenom}`}
                </span>
              )}
            </div>

            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Précisez ici les éléments concrets mis en place dans votre structure, protocoles affichés, dates de formation ou points d'écart constatés..."
              className="w-full p-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleSaveObservations}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 hover:bg-black text-white transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isSaved ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {isSaved ? "Enregistré !" : "Enregistrer les observations"}
              </button>

              <button
                type="button"
                onClick={() => onOpenPaqModal(critere.id, critere.code, critere.titre)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Créer une action PAQ
              </button>
            </div>
          </div>

          {/* Linked PAQ Actions List */}
          {actions.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-indigo-100/70 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Actions d'amélioration associées au PAQ ({actions.length})
                </span>
              </div>

              <div className="space-y-2">
                {actions.map((act) => {
                  const getStatutBadgeAct = (s: StatutAction) => {
                    switch (s) {
                      case "TERMINE":
                        return "bg-emerald-50 text-emerald-700 border-emerald-200";
                      case "EN_COURS":
                        return "bg-blue-50 text-blue-700 border-blue-200";
                      default:
                        return "bg-amber-50 text-amber-700 border-amber-200";
                    }
                  };

                  return (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-gray-800 text-xs">{act.titre}</span>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500">
                          {act.responsable && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {act.responsable}
                            </span>
                          )}
                          {act.echeance && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(act.echeance).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                          <span className="text-gray-400">Priorité : {act.priorite}</span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getStatutBadgeAct(
                          act.statut
                        )}`}
                      >
                        {act.statut === "A_FAIRE"
                          ? "À faire"
                          : act.statut === "EN_COURS"
                          ? "En cours"
                          : "Terminé"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
