"use client";

import { useState } from "react";
import { X, AlertCircle, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { declarerAbsence } from "@/app/actions/presences";

interface ModalAbsenceProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  structureId: string;
  enfantId: string;
  enfantNom: string;
  dateStr: string;
  initialStatut?: "ABSENT" | "ABSENT_JUSTIFIE" | "CONGE";
  initialMotif?: string | null;
  initialCertificat?: boolean;
  initialObservations?: string | null;
  profilId?: string;
  profilNom?: string;
}

const MOTIFS_FREQUENTS = [
  "Maladie / Fièvre",
  "Rendez-vous médical",
  "Gastro-entérite",
  "Bronchiolite / Rhume",
  "Convenance personnelle / Famille",
  "Congés / Vacances",
  "Hospitalisation",
  "Autre motif",
];

export function ModalAbsence({
  isOpen,
  onClose,
  onSuccess,
  structureId,
  enfantId,
  enfantNom,
  dateStr,
  initialStatut = "ABSENT",
  initialMotif = "",
  initialCertificat = false,
  initialObservations = "",
  profilId,
  profilNom,
}: ModalAbsenceProps) {
  const [statut, setStatut] = useState<"ABSENT" | "ABSENT_JUSTIFIE" | "CONGE">(initialStatut);
  const [motif, setMotif] = useState(initialMotif || "");
  const [certificat, setCertificat] = useState(initialCertificat);
  const [observations, setObservations] = useState(initialObservations || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motif.trim()) {
      setError("Veuillez indiquer un motif.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await declarerAbsence({
        structure_id: structureId,
        enfant_id: enfantId,
        date: dateStr,
        statut: certificat ? "ABSENT_JUSTIFIE" : statut,
        motif_absence: motif.trim(),
        certificat_fourni: certificat,
        observations: observations.trim() || undefined,
        profil_id: profilId,
        releve_par_nom: profilNom,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Erreur lors de l'enregistrement.");
      }
    } catch {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertCircle size={22} className="text-rose-600" />
            <h3 className="font-semibold text-base sm:text-lg">Déclarer une absence ou un congé</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Enfant : <span className="font-bold text-gray-900">{enfantNom}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Date : {new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {/* Type d'absence */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setStatut("ABSENT");
                  if (certificat) setCertificat(false);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  statut === "ABSENT" && !certificat
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                Absent
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatut("ABSENT_JUSTIFIE");
                  setCertificat(true);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  statut === "ABSENT_JUSTIFIE" || certificat
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                Justifiée (Médical)
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatut("CONGE");
                  setCertificat(false);
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  statut === "CONGE"
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                Congé / Vacances
              </button>
            </div>
          </div>

          {/* Motifs suggérés */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Motif de l&apos;absence *
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {MOTIFS_FREQUENTS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => {
                    setMotif(m);
                    if (m === "Congés / Vacances") setStatut("CONGE");
                    if (m.includes("Maladie") || m.includes("Gastro") || m.includes("Bronchio")) {
                      if (statut === "CONGE") setStatut("ABSENT");
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    motif === m
                      ? "bg-rose-100 text-rose-800 border-rose-300 font-medium"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Préciser le motif..."
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              required
            />
          </div>

          {/* Certificat médical */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              id="certificat"
              checked={certificat}
              onChange={(e) => {
                setCertificat(e.target.checked);
                if (e.target.checked) setStatut("ABSENT_JUSTIFIE");
              }}
              className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="certificat" className="text-xs font-medium text-gray-700 cursor-pointer flex-1">
              Certificat médical ou justificatif fourni (pour déduction CAF / facturation)
            </label>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Observations / Précisions
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={2}
              placeholder="Ex: Prévenu par téléphone par la maman à 8h15, retour prévu lundi..."
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Enregistrement..." : "Enregistrer l'absence"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
