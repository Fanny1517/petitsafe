"use client";

import React, { useState } from "react";
import { X, Plus, AlertCircle, Calendar, User, Tag, Loader2, Check } from "lucide-react";
import { PrioriteAction } from "@prisma/client";
import { creerActionPAQ } from "@/app/actions/qualite";
import { toast } from "sonner";

interface PaqActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  structureId: string;
  critereId?: string;
  critereCode?: string;
  critereTitre?: string;
  onSuccess?: () => void;
}

export function PaqActionModal({
  isOpen,
  onClose,
  structureId,
  critereId,
  critereCode,
  critereTitre,
  onSuccess,
}: PaqActionModalProps) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [responsable, setResponsable] = useState("");
  const [priorite, setPriorite] = useState<PrioriteAction>("MOYENNE");
  const [echeance, setEcheance] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) {
      toast.error("Veuillez saisir un titre d'action");
      return;
    }

    setLoading(true);
    try {
      const res = await creerActionPAQ({
        structureId,
        critereId,
        titre: titre.trim(),
        description: description.trim() || undefined,
        responsable: responsable.trim() || undefined,
        priorite: priorite,
        echeance: echeance || undefined,
      });

      if (res.success) {
        toast.success("Action ajoutée avec succès au Plan d'Action Qualité !");
        setTitre("");
        setDescription("");
        setResponsable("");
        setEcheance("");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.error || "Impossible d'enregistrer l'action");
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white">
          <div>
            <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Nouvelle action d'amélioration (PAQ)
            </h3>
            {critereCode && (
              <p className="text-xs text-indigo-600 font-medium mt-0.5">
                Rattachée à : {critereCode} — {critereTitre}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Intitulé de l'action corrective <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Mettre à jour l'affichage des allergènes en cuisine"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Objectif mesurable & Moyens prévus
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les livrables attendus, la méthodologie ou le protocole à réviser..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                Responsable
              </label>
              <input
                type="text"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                placeholder="Ex: Référente santé / EJE"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Échéance cible
              </label>
              <input
                type="date"
                value={echeance}
                onChange={(e) => setEcheance(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              Niveau de priorité
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["BASSE", "MOYENNE", "HAUTE", "URGENTE"] as PrioriteAction[]).map((p) => {
                const isSelected = priorite === p;
                const colors: Record<PrioriteAction, { active: string; default: string }> = {
                  BASSE: {
                    active: "bg-blue-600 text-white border-blue-600",
                    default: "bg-blue-50/50 text-blue-700 border-blue-100 hover:bg-blue-50",
                  },
                  MOYENNE: {
                    active: "bg-emerald-600 text-white border-emerald-600",
                    default: "bg-emerald-50/50 text-emerald-700 border-emerald-100 hover:bg-emerald-50",
                  },
                  HAUTE: {
                    active: "bg-amber-600 text-white border-amber-600",
                    default: "bg-amber-50/50 text-amber-700 border-amber-100 hover:bg-amber-50",
                  },
                  URGENTE: {
                    active: "bg-rose-600 text-white border-rose-600",
                    default: "bg-rose-50/50 text-rose-700 border-rose-100 hover:bg-rose-50",
                  },
                };

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriorite(p)}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                      isSelected ? colors[p].active : colors[p].default
                    }`}
                  >
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Enregistrer l'action
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
