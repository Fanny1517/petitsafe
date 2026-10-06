"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  FileCheck2,
  Building,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  Loader2,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { PdfDossierQuinquennal } from "@/components/pdf/pdf-dossier-quinquennal";
import { toast } from "sonner";
import type { DossierQuinquennalData, AxeQualite } from "@/types/qualite";
import { LIBELLES_AXES } from "@/types/qualite";

interface DossierExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DossierQuinquennalData;
}

export function DossierExportModal({ isOpen, onClose, data }: DossierExportModalProps) {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [inclureSignatures, setInclureSignatures] = useState(true);
  const [inclurePreuvesTerrain, setInclurePreuvesTerrain] = useState(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);
    try {
      const blob = await pdf(<PdfDossierQuinquennal data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const cleanNom = (data.structure?.nom || "structure")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "_");
      a.href = url;
      a.download = `dossier_quinquennal_${cleanNom}_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      toast.success("Dossier quinquennal PDF téléchargé avec succès !");
    } catch (err) {
      console.error("Erreur génération PDF dossier quinquennal:", err);
      toast.error("Échec de la génération du livrable PDF.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <>
      {/* Styles print optimisés pour sortie A4 */}
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
          .dossier-modal-backdrop {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            display: block !important;
          }
          .dossier-modal-container {
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
          #dossier-printable-document,
          #dossier-printable-document * {
            visibility: visible !important;
          }
          #dossier-printable-document {
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
            size: A4 portrait;
            margin: 12mm;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto dossier-modal-backdrop">
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150 dossier-modal-container">
          {/* Header de la modale */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Exportation du dossier quinquennal (HAS / PMI)
                </h3>
                <p className="text-xs text-slate-500">
                  Livrable réglementaire consolidé conforme au référentiel national qualité 2025
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

          {/* Barre d'options */}
          <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0 no-print">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inclureSignatures}
                  onChange={(e) => setInclureSignatures(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Inclure la page de visas et signatures officielles
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inclurePreuvesTerrain}
                  onChange={(e) => setInclurePreuvesTerrain(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                Inclure la synthèse des preuves terrain (HACCP et hygiène)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={generatingPdf}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {generatingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Télécharger PDF officiel
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Zone de prévisualisation du document imprimable */}
          <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100">
            <div
              id="dossier-printable-document"
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto space-y-8 text-slate-900"
            >
              {/* Entête officiel */}
              <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Arrêté du 29 août 2024 • Référentiel national qualité 2025
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  DOSSIER QUINQUENNAL D'ÉVALUATION DE LA QUALITÉ
                </h1>
                <p className="text-xs text-slate-500 max-w-xl mx-auto">
                  Document de transmission pour la Haute Autorité de Santé (HAS), les services de la PMI et les financeurs
                </p>

                <div className="mt-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{data.structure.nom}</p>
                    <p className="text-slate-600">Type : {data.structure.type}</p>
                    {data.structure.adresse && (
                      <p className="text-slate-600">
                        {data.structure.adresse}, {data.structure.code_postal} {data.structure.ville}
                      </p>
                    )}
                  </div>
                  <div className="sm:text-right space-y-0.5">
                    {data.structure.numero_agrement && (
                      <p className="font-mono text-indigo-700 font-semibold">
                        Agrément PMI : {data.structure.numero_agrement}
                      </p>
                    )}
                    <p className="text-slate-500">Période du cycle : <strong>{data.periodeCycle}</strong></p>
                    <p className="text-slate-500">Date d'édition : <strong>{data.dateGeneration}</strong></p>
                  </div>
                </div>
              </div>

              {/* Synthèse managériale et KPIs */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  1. Synthèse globale et degré de préparation
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="block text-xs text-slate-500">Complétude dossier</span>
                    <span className="text-xl font-bold text-indigo-700">{data.completude.tauxGlobal}%</span>
                    <span className="block text-[10px] text-slate-400">éligibilité contrôle</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="block text-xs text-slate-500">Score maturité RNQ</span>
                    <span className="text-xl font-bold text-emerald-700">{data.statsAutoEval?.scoreGlobal ?? 0}%</span>
                    <span className="block text-[10px] text-slate-400">{data.statsAutoEval?.libelleMaturite}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="block text-xs text-slate-500">Avis usagers</span>
                    <span className="text-xl font-bold text-sky-700">{data.completude.totalReponsesFamilles}</span>
                    <span className="block text-[10px] text-slate-400">retours parents tracés</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="block text-xs text-slate-500">Plan d'action (PAQ)</span>
                    <span className="text-xl font-bold text-amber-700">{data.completude.actionsPAQCount}</span>
                    <span className="block text-[10px] text-slate-400">actions correctives</span>
                  </div>
                </div>

                {/* Ventilation par axe */}
                <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-700 border-b border-slate-200 flex justify-between">
                    <span>Axe du référentiel national qualité 2025</span>
                    <span>Niveau de conformité</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {data.statsAutoEval &&
                      (["ACCUEIL_SECURITE", "DEVELOPPEMENT_EVEIL", "RELATION_FAMILLES", "PILOTAGE_RISQUES"] as const).map((axe) => {
                        const s = data.statsAutoEval!.parAxe[axe];
                        if (!s) return null;
                        return (
                          <div key={axe} className="px-4 py-2.5 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{s.label}</p>
                              <p className="text-[11px] text-slate-500">
                                {s.evaluesCount} / {s.totalCriteres} critères formalisés
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-indigo-700 text-sm">{s.scoreMoyen}%</span>
                              <p className="text-[10px] text-emerald-700 font-medium">
                                {s.repartition.CONFORME + s.repartition.EXEMPLAIRE} critères conformes
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Preuves terrain */}
              {inclurePreuvesTerrain && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    2. Preuves et registres terrain opérationnels
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <p className="font-bold text-slate-900">Maîtrise sanitaire et HACCP</p>
                      <p className="text-slate-600 mt-1">
                        {data.preuvesTerrain.temperaturesHaccp.totalSemaine} relevés biquotidiens archivés • {data.preuvesTerrain.temperaturesHaccp.anomaliesSemaine} anomalie(s)
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <p className="font-bold text-slate-900">Hygiène et bionettoyage</p>
                      <p className="text-slate-600 mt-1">
                        {data.preuvesTerrain.nettoyage.validationsSemaine} validations de tâches et désinfections tracées
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <p className="font-bold text-slate-900">Médicaments et PAI</p>
                      <p className="text-slate-600 mt-1">
                        {data.preuvesTerrain.medicamentsEtPai.paisActifs} PAI actifs • {data.preuvesTerrain.medicamentsEtPai.administrationsSemaine} administrations avec cosignature
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <p className="font-bold text-slate-900">Présences et ratios d'encadrement</p>
                      <p className="text-slate-600 mt-1">
                        {data.preuvesTerrain.presences.presentsAujourdhui} enfants pointés en continu sur le registre dématérialisé
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Extrait Auto-évaluation */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  3. Grille des critères officiels du référentiel national (extrait)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                        <th className="p-2 w-[12%]">Réf</th>
                        <th className="p-2 w-[45%]">Critère</th>
                        <th className="p-2 w-[18%]">Statut</th>
                        <th className="p-2 w-[25%]">Pistes et observations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.criteresAvecEval.slice(0, 10).map((c) => {
                        const st = c.evaluation?.statut ?? "NON_EVALUE";
                        return (
                          <tr key={c.id}>
                            <td className="p-2 font-bold text-indigo-700">{c.code}</td>
                            <td className="p-2 font-medium text-slate-900">{c.titre}</td>
                            <td className="p-2">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  st === "CONFORME" || st === "EXEMPLAIRE"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : st === "PARTIELLEMENT_CONFORME"
                                    ? "bg-amber-100 text-amber-800"
                                    : st === "A_AMELIORER"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {st}
                              </span>
                            </td>
                            <td className="p-2 text-slate-500 text-[11px]">
                              {c.evaluation?.observations || c.evaluation?.pistes_amelioration || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Visas et signatures */}
              {inclureSignatures && (
                <div className="space-y-3 pt-4 border-t-2 border-slate-200">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 pb-1">
                    4. Visas officiels et validation réglementaire
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="border border-slate-300 rounded-lg p-3 h-28 flex flex-col justify-between bg-slate-50/40">
                      <div>
                        <p className="font-bold text-slate-900">Visa de la direction</p>
                        <p className="text-[10px] text-slate-500">Date et signature :</p>
                      </div>
                      <div className="border-b border-dashed border-slate-300 w-3/4"></div>
                    </div>
                    <div className="border border-slate-300 rounded-lg p-3 h-28 flex flex-col justify-between bg-slate-50/40">
                      <div>
                        <p className="font-bold text-slate-900">Visa référent santé</p>
                        <p className="text-[10px] text-slate-500">Date et signature :</p>
                      </div>
                      <div className="border-b border-dashed border-slate-300 w-3/4"></div>
                    </div>
                    <div className="border border-slate-300 rounded-lg p-3 h-28 flex flex-col justify-between bg-slate-50/40">
                      <div>
                        <p className="font-bold text-slate-900">Évaluateur externe</p>
                        <p className="text-[10px] text-slate-500">Date et cachet :</p>
                      </div>
                      <div className="border-b border-dashed border-slate-300 w-3/4"></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-between text-[10px] text-slate-400">
                <span>RZPan'Da • Logiciel de conformité et traçabilité pour crèches</span>
                <span>Édité le {data.dateGeneration}</span>
              </div>
            </div>
          </div>

          {/* Footer de la modale */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 no-print">
            <span className="text-xs text-slate-500">
              Prêt pour transmission aux inspecteurs de la PMI et évaluateurs externes
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
