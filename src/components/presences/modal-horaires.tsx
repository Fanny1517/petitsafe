"use client";

import { useState } from "react";
import { X, Clock, Check, AlertCircle } from "lucide-react";
import { updateHeuresPresence } from "@/app/actions/presences";

interface ModalHorairesProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  structureId: string;
  enfantId: string;
  enfantNom: string;
  dateStr: string;
  initialHeureArrivee?: string | null;
  initialHeureDepart?: string | null;
  initialObservations?: string | null;
  profilId?: string;
  profilNom?: string;
}

function dateToTimeInputValue(isoString?: string | null): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function timeInputToIsoDate(timeVal: string, baseDateStr: string): string | null {
  if (!timeVal) return null;
  const [hours, minutes] = timeVal.split(":").map(Number);
  const base = new Date(baseDateStr);
  base.setHours(hours, minutes, 0, 0);
  return base.toISOString();
}

export function ModalHoraires({
  isOpen,
  onClose,
  onSuccess,
  structureId,
  enfantId,
  enfantNom,
  dateStr,
  initialHeureArrivee,
  initialHeureDepart,
  initialObservations,
  profilId,
  profilNom,
}: ModalHorairesProps) {
  const [heureArrivee, setHeureArrivee] = useState(dateToTimeInputValue(initialHeureArrivee));
  const [heureDepart, setHeureDepart] = useState(dateToTimeInputValue(initialHeureDepart));
  const [observations, setObservations] = useState(initialObservations || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSetArriveeNow = () => {
    const now = new Date();
    setHeureArrivee(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
  };

  const handleSetDepartNow = () => {
    const now = new Date();
    setHeureDepart(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const arriveeIso = timeInputToIsoDate(heureArrivee, dateStr);
      const departIso = timeInputToIsoDate(heureDepart, dateStr);

      const res = await updateHeuresPresence({
        structure_id: structureId,
        enfant_id: enfantId,
        date: dateStr,
        heure_arrivee: arriveeIso,
        heure_depart: departIso,
        observations: observations.trim() || null,
        profil_id: profilId,
        releve_par_nom: profilNom,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Erreur lors de l'enregistrement des horaires.");
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-emerald-50/50">
          <div className="flex items-center gap-2 text-emerald-800">
            <Clock size={22} className="text-emerald-600" />
            <h3 className="font-semibold text-base sm:text-lg">Horaires & Pointage</h3>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Heure d'arrivée */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Arrivée
                </label>
                <button
                  type="button"
                  onClick={handleSetArriveeNow}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                >
                  Maintenant
                </button>
              </div>
              <input
                type="time"
                value={heureArrivee}
                onChange={(e) => setHeureArrivee(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50"
              />
            </div>

            {/* Heure de départ */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Départ
                </label>
                <button
                  type="button"
                  onClick={handleSetDepartNow}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                >
                  Maintenant
                </button>
              </div>
              <input
                type="time"
                value={heureDepart}
                onChange={(e) => setHeureDepart(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Observations / Transmissions du matin ou soir
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
              placeholder="Ex: Arrivé avec un petit doudou, récupéré par la grand-mère à 17h15..."
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
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
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Check size={16} />
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
