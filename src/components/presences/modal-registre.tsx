"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Download, Printer, Filter, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getRegistreMensuel } from "@/app/actions/presences";

interface ModalRegistreProps {
  isOpen: boolean;
  onClose: () => void;
  structureId: string;
}

interface RegistreEnfant {
  enfant: { id: string; prenom: string; nom: string; groupe: string | null };
  stats: {
    joursPresents: number;
    joursAbsents: number;
    joursConges: number;
    tauxPresence: number;
  };
  details: {
    date: string;
    statut: "PRESENT" | "ABSENT" | "ABSENT_JUSTIFIE" | "CONGE" | "NON_POINTE";
    heure_arrivee?: string | null;
    heure_depart?: string | null;
    motif_absence?: string | null;
  }[];
}

export function ModalRegistre({ isOpen, onClose, structureId }: ModalRegistreProps) {
  const [mois, setMois] = useState<number>(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [registre, setRegistre] = useState<RegistreEnfant[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistre = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRegistreMensuel(structureId, mois, annee);
      if (res.success) {
        setRegistre(res.data as unknown as RegistreEnfant[]);
      } else {
        setError(res.error || "Erreur de chargement du registre");
      }
    } catch {
      setError("Erreur inattendue lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRegistre();
    }
  }, [isOpen, mois, annee]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (registre.length === 0) return;

    // Header CSV
    const headers = [
      "Enfant Nom",
      "Enfant Prénom",
      "Groupe",
      "Jours Présents",
      "Jours Absents",
      "Jours Congés",
      "Taux Présence (%)",
    ];

    const rows = registre.map((r) => [
      `"${r.enfant.nom}"`,
      `"${r.enfant.prenom}"`,
      `"${r.enfant.groupe || ""}"`,
      r.stats.joursPresents,
      r.stats.joursAbsents,
      r.stats.joursConges,
      `${r.stats.tauxPresence}%`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registre_presences_${mois}_${annee}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const MOIS_NOMS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2 text-gray-800">
            <Calendar size={22} className="text-emerald-600" />
            <div>
              <h3 className="font-bold text-lg">Registre Réglementaire des Présences</h3>
              <p className="text-xs text-gray-500">Conforme aux exigences CAF / PMI & Traçabilité légale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar: Mois / Année / Export */}
        <div className="p-4 bg-white border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={mois}
              onChange={(e) => setMois(Number(e.target.value))}
              className="h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {MOIS_NOMS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={annee}
              onChange={(e) => setAnnee(Number(e.target.value))}
              className="h-10 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {[annee - 1, annee, annee + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="h-10 px-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer size={15} />
              Imprimer
            </button>
            <button
              onClick={handleExportCSV}
              disabled={registre.length === 0}
              className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <Download size={15} />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
              <p className="text-sm">Génération du registre en cours...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          ) : registre.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">Aucune donnée de présence pour cette période.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-600 uppercase font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4">Enfant</th>
                    <th className="py-3 px-4">Section / Groupe</th>
                    <th className="py-3 px-4 text-center">Jours Présents</th>
                    <th className="py-3 px-4 text-center">Absences</th>
                    <th className="py-3 px-4 text-center">Congés</th>
                    <th className="py-3 px-4 text-right">Taux de présence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {registre.map((r) => (
                    <tr key={r.enfant.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {r.enfant.prenom} {r.enfant.nom}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">{r.enfant.groupe || "--"}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-emerald-700">
                        {r.stats.joursPresents}
                      </td>
                      <td className="py-3.5 px-4 text-center text-rose-600">{r.stats.joursAbsents}</td>
                      <td className="py-3.5 px-4 text-center text-sky-600">{r.stats.joursConges}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-bold ${
                            r.stats.tauxPresence >= 80
                              ? "bg-emerald-100 text-emerald-800"
                              : r.stats.tauxPresence >= 50
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {r.stats.tauxPresence}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
