"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  CircleAlert,
  Calendar,
  Building2,
  Award,
  Filter,
  Users,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { ActionPAQItem } from "./plan-action-manager";
import { StatutAction, PrioriteAction } from "@prisma/client";

export interface StructureInfo {
  id?: string;
  nom: string;
  ville?: string | null;
  code_postal?: string | null;
  numero_agrement?: string | null;
  type?: string | null;
}

interface PaqExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ActionPAQItem[];
  actionsFiltrees: ActionPAQItem[];
  structureInfo?: StructureInfo | null;
}

type PerimetreExport = "TOUS" | "EN_COURS" | "CLOS" | "SELECTION_ACTUELLE";

export function PaqExportModal({
  isOpen,
  onClose,
  actions,
  actionsFiltrees,
  structureInfo,
}: PaqExportModalProps) {
  const [perimetre, setPerimetre] = useState<PerimetreExport>("TOUS");
  const [inclureSignatures, setInclureSignatures] = useState(true);
  const [inclureBilansImpact, setInclureBilansImpact] = useState(true);

  // Actions sélectionnées selon le périmètre choisi
  const actionsAExporter = useMemo(() => {
    switch (perimetre) {
      case "EN_COURS":
        return actions.filter(
          (a) => a.statut === "A_FAIRE" || a.statut === "EN_COURS"
        );
      case "CLOS":
        return actions.filter((a) => a.statut === "TERMINE");
      case "SELECTION_ACTUELLE":
        return actionsFiltrees;
      case "TOUS":
      default:
        return actions;
    }
  }, [actions, actionsFiltrees, perimetre]);

  // Statistiques du périmètre sélectionné
  const stats = useMemo(() => {
    const total = actionsAExporter.length;
    const aFaire = actionsAExporter.filter((a) => a.statut === "A_FAIRE").length;
    const enCours = actionsAExporter.filter((a) => a.statut === "EN_COURS").length;
    const terminees = actionsAExporter.filter((a) => a.statut === "TERMINE").length;
    const urgentes = actionsAExporter.filter(
      (a) => a.priorite === "URGENTE" && a.statut !== "TERMINE"
    ).length;
    const tauxCompletion = total > 0 ? Math.round((terminees / total) * 100) : 0;

    return { total, aFaire, enCours, terminees, urgentes, tauxCompletion };
  }, [actionsAExporter]);

  if (!isOpen) return null;

  const dateJour = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /**
   * Déclenchement de l'impression native / Enregistrement PDF
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Export CSV formaté pour Excel avec BOM UTF-8
   */
  const handleExportCsv = () => {
    try {
      const headers = [
        "Référence",
        "Axe RNQ",
        "Titre de l'action",
        "Description",
        "Priorité",
        "Statut",
        "Responsable",
        "Échéance",
        "Bilan d'impact / Résultat",
        "Date de création",
      ];

      const formatField = (val: string | null | undefined) => {
        if (!val) return '""';
        // Nettoyer les sauts de ligne pour préserver la structure des lignes CSV
        const clean = String(val)
          .replace(/\r?\n/g, " ")
          .replace(/"/g, '""');
        return `"${clean}"`;
      };

      const formatDateSafe = (dateVal: any) => {
        if (!dateVal) return "";
        try {
          const d = new Date(dateVal);
          return isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR");
        } catch {
          return "";
        }
      };

      const rows = actionsAExporter.map((act) => {
        const refCode = act.critere ? `Critère ${act.critere.code}` : "Transversale";
        const axeLabel = act.critere?.axe || "Transversal";
        const prioLabel =
          act.priorite === "URGENTE"
            ? "Urgente"
            : act.priorite === "HAUTE"
            ? "Haute"
            : act.priorite === "MOYENNE"
            ? "Moyenne"
            : "Basse";
        const statutLabel =
          act.statut === "TERMINE"
            ? "Clôturé"
            : act.statut === "EN_COURS"
            ? "En cours"
            : "À faire";
        const echeanceStr = formatDateSafe(act.echeance) || "Non définie";
        const dateCreaStr = formatDateSafe(act.created_at);

        return [
          formatField(refCode),
          formatField(axeLabel),
          formatField(act.titre),
          formatField(act.description),
          formatField(prioLabel),
          formatField(statutLabel),
          formatField(act.responsable || "Non assigné"),
          formatField(echeanceStr),
          formatField(act.resultat_attendu || ""),
          formatField(dateCreaStr),
        ].join(";");
      });

      const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const cleanNom = (structureInfo?.nom || "structure")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "_");
      const nomFichier = `PAQ_${cleanNom}_${new Date().toISOString().split("T")[0]}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", nomFichier);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Différer la révocation de l'URL Blob pour éviter l'annulation du téléchargement sous Chromium Windows
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error("Erreur lors de l'export CSV :", err);
    }
  };

  return (
    <>
      {/* Styles injectés pour masquer les contrôles lors de l'impression et formater la page A4 Paysage */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          .no-print {
            display: none !important;
          }
          .paq-modal-backdrop {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            display: block !important;
          }
          .paq-modal-container {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          #paq-printable-document,
          #paq-printable-document * {
            visibility: visible !important;
          }
          #paq-printable-document {
            position: static !important;
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }
          @page {
            size: landscape;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto paq-modal-backdrop">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150 paq-modal-container">
          {/* Header de la modale */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Synthèse & Exportation du Plan d'Action Qualité
                </h3>
                <p className="text-xs text-slate-500">
                  Rapport prêt à imprimer pour revues de direction, réunions d'équipe et contrôles PMI
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barre de configuration du périmètre et options */}
          <div className="p-4 bg-white border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4 shrink-0 no-print">
            {/* Choix du périmètre */}
            <div className="md:col-span-7 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                Périmètre du rapport à exporter
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPerimetre("TOUS")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                    perimetre === "TOUS"
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Toutes ({actions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPerimetre("EN_COURS")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                    perimetre === "EN_COURS"
                      ? "bg-amber-50 border-amber-300 text-amber-700"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  En cours ({actions.filter((a) => a.statut !== "TERMINE").length})
                </button>
                <button
                  type="button"
                  onClick={() => setPerimetre("CLOS")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                    perimetre === "CLOS"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Clôturées ({actions.filter((a) => a.statut === "TERMINE").length})
                </button>
                <button
                  type="button"
                  onClick={() => setPerimetre("SELECTION_ACTUELLE")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                    perimetre === "SELECTION_ACTUELLE"
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Filtre actif ({actionsFiltrees.length})
                </button>
              </div>
            </div>

            {/* Options additionnelles */}
            <div className="md:col-span-5 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 md:pl-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inclureBilansImpact}
                  onChange={(e) => setInclureBilansImpact(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Afficher les bilans d'impact constatés
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inclureSignatures}
                  onChange={(e) => setInclureSignatures(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Inclure la zone de visas & signatures
              </label>
            </div>
          </div>

          {/* Zone d'aperçu du document (avec scrollbar interne) */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100">
            <div
              id="paq-printable-document"
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-slate-900"
            >
              {/* En-tête officiel du document */}
              <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      RZPan'Da • Démarche Qualité
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Référentiel National Qualité (RNQ)
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-2">
                    PLAN D'ACTION QUALITÉ (PAQ)
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    Document de pilotage de l'amélioration continue et conformité d'accueil
                  </p>
                </div>

                {/* Bloc Structure & Date */}
                <div className="text-left sm:text-right text-xs text-slate-600 space-y-1 shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                  <p className="font-bold text-sm text-slate-900">
                    {structureInfo?.nom || "Structure Petite Enfance"}
                  </p>
                  {structureInfo?.ville && (
                    <p className="text-slate-600">
                      {structureInfo.code_postal ? `${structureInfo.code_postal} ` : ""}
                      {structureInfo.ville}
                    </p>
                  )}
                  {structureInfo?.numero_agrement && (
                    <p className="text-slate-500 font-mono text-[11px]">
                      Agrément PMI : {structureInfo.numero_agrement}
                    </p>
                  )}
                  <p className="text-slate-500 pt-1">
                    Édité le : <strong className="text-slate-800">{dateJour}</strong>
                  </p>
                </div>
              </div>

              {/* Synthèse chiffrée (Dashboard KPIs d'impression) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-center">
                  <span className="block text-xs font-medium text-slate-500">Périmètre</span>
                  <span className="text-lg font-bold text-slate-900">{stats.total}</span>
                  <span className="block text-[10px] text-slate-400">actions</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-center">
                  <span className="block text-xs font-medium text-slate-500">À faire</span>
                  <span className="text-lg font-bold text-slate-700">{stats.aFaire}</span>
                  <span className="block text-[10px] text-slate-400">en attente</span>
                </div>
                <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/60 text-center">
                  <span className="block text-xs font-medium text-amber-800">En cours</span>
                  <span className="text-lg font-bold text-amber-700">{stats.enCours}</span>
                  <span className="block text-[10px] text-amber-600">engagées</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200/60 text-center">
                  <span className="block text-xs font-medium text-emerald-800">Clôturées</span>
                  <span className="text-lg font-bold text-emerald-700">{stats.terminees}</span>
                  <span className="block text-[10px] text-emerald-600">soldées</span>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200/60 text-center col-span-2 sm:col-span-1">
                  <span className="block text-xs font-medium text-indigo-800">Complétion</span>
                  <span className="text-lg font-bold text-indigo-700">{stats.tauxCompletion}%</span>
                  <span className="block text-[10px] text-indigo-600">d'avancement</span>
                </div>
              </div>

              {/* Tableau officiel des actions */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-300 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3 w-[15%]">Référence</th>
                      <th className="py-2.5 px-3 w-[35%]">Action & Démarche</th>
                      <th className="py-2.5 px-3 w-[12%]">Priorité</th>
                      <th className="py-2.5 px-3 w-[15%]">Responsable</th>
                      <th className="py-2.5 px-3 w-[13%]">Échéance</th>
                      <th className="py-2.5 px-3 w-[10%] text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {actionsAExporter.length > 0 ? (
                      actionsAExporter.map((act) => {
                        const estTermine = act.statut === "TERMINE";
                        const estEnCours = act.statut === "EN_COURS";

                        return (
                          <tr
                            key={act.id}
                            className="hover:bg-slate-50/50 break-inside-avoid"
                          >
                            {/* Référence / Critère */}
                            <td className="py-3 px-3 align-top">
                              {act.critere ? (
                                <div>
                                  <span className="font-bold text-indigo-700">
                                    Critère {act.critere.code}
                                  </span>
                                  <p className="text-[10px] text-slate-500 line-clamp-1">
                                    {act.critere.titre}
                                  </p>
                                </div>
                              ) : (
                                <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                                  Transversale
                                </span>
                              )}
                            </td>

                            {/* Titre & Description & Bilan d'impact */}
                            <td className="py-3 px-3 align-top space-y-1">
                              <p className="font-semibold text-slate-900">{act.titre}</p>
                              {act.description && (
                                <p className="text-slate-600 text-[11px] leading-relaxed">
                                  {act.description}
                                </p>
                              )}
                              {/* Bilan d'impact si clôturé */}
                              {inclureBilansImpact && estTermine && act.resultat_attendu && (
                                <div className="mt-1.5 p-2 rounded bg-slate-50/50 border border-slate-200/60 text-slate-900 text-[11px] flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                                  <div className="text-slate-900">
                                    <strong className="font-semibold text-slate-900">Bilan constaté : </strong>
                                    <span className="text-slate-900">{act.resultat_attendu}</span>
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Priorité */}
                            <td className="py-3 px-3 align-top">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  act.priorite === "URGENTE"
                                    ? "bg-rose-100 text-rose-800"
                                    : act.priorite === "HAUTE"
                                    ? "bg-orange-100 text-orange-800"
                                    : act.priorite === "MOYENNE"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {act.priorite}
                              </span>
                            </td>

                            {/* Responsable */}
                            <td className="py-3 px-3 align-top font-medium text-slate-700">
                              {act.responsable?.trim() || "Non assigné"}
                            </td>

                            {/* Échéance */}
                            <td className="py-3 px-3 align-top font-medium text-slate-700">
                              {act.echeance ? (
                                new Date(act.echeance).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              ) : (
                                <span className="text-slate-400 italic">Non fixée</span>
                              )}
                            </td>

                            {/* Statut */}
                            <td className="py-3 px-3 align-top text-right">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  estTermine
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : estEnCours
                                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                                    : "bg-slate-100 text-slate-700 border border-slate-300"
                                }`}
                              >
                                {estTermine ? "Clôturé" : estEnCours ? "En cours" : "À faire"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                          Aucune action ne correspond à ce périmètre d'export.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bloc de signature et visas (Optionnel) */}
              {inclureSignatures && (
                <div className="pt-6 border-t-2 border-slate-200 break-inside-avoid">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Visas & Validation officielle
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border border-slate-300 rounded-lg p-3.5 space-y-8 bg-slate-50/40">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Visa de la Direction / Responsable d'Établissement
                        </p>
                        <p className="text-[10px] text-slate-500">Date et signature :</p>
                      </div>
                      <div className="border-b border-dashed border-slate-300 w-3/4"></div>
                    </div>
                    <div className="border border-slate-300 rounded-lg p-3.5 space-y-8 bg-slate-50/40">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Visa du Référent Santé / Équipe Pédagogique
                        </p>
                        <p className="text-[10px] text-slate-500">Date et signature :</p>
                      </div>
                      <div className="border-b border-dashed border-slate-300 w-3/4"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pied de page du document */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>RZPan'Da — Solution de traçabilité et qualité petite enfance</span>
                <span>Document généré le {dateJour}</span>
              </div>
            </div>
          </div>

          {/* Footer de la modale avec boutons d'action */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 no-print">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>
                <strong>{actionsAExporter.length}</strong> action{actionsAExporter.length > 1 ? "s" : ""} sélectionnée{actionsAExporter.length > 1 ? "s" : ""} dans ce rapport
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Fermer
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Télécharger Excel / CSV
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimer / PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
