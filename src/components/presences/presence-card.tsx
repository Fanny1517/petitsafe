"use client";

import { useState } from "react";
import {
  Check,
  Clock,
  AlertCircle,
  Calendar,
  MoreVertical,
  LogOut,
  FileCheck,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { BadgeAllergie } from "@/components/shared/badge-allergie";
import { BadgeRegime } from "@/components/shared/badge-regime";
import { togglePresenceRapide } from "@/app/actions/presences";

interface PresenceItem {
  enfant: {
    id: string;
    prenom: string;
    nom: string;
    photo_url: string | null;
    groupe: string | null;
    date_naissance: Date;
    regimes: string[];
    regime_alimentaire?: string | null;
  };
  statut: "ATTENDU" | "PRESENT" | "ABSENT" | "ABSENT_JUSTIFIE" | "CONGE";
  est_present: boolean;
  heure_arrivee: string | null;
  heure_depart: string | null;
  motif_absence: string | null;
  certificat_fourni: boolean;
  observations: string | null;
  releve_par_nom: string | null;
}

interface PresenceCardProps {
  item: PresenceItem;
  dateStr: string;
  structureId: string;
  profilId?: string;
  profilNom?: string;
  onOpenAbsence: (item: PresenceItem) => void;
  onOpenHoraires: (item: PresenceItem) => void;
  onUpdate: () => void;
}

const COULEURS_AVATAR = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed", "#db2777"];

function getInitiales(prenom: string, nom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

function getAvatarBg(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COULEURS_AVATAR[Math.abs(hash) % COULEURS_AVATAR.length];
}

function formatHeure(isoString?: string | null): string {
  if (!isoString) return "--:--";
  const d = new Date(isoString);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function PresenceCard({
  item,
  dateStr,
  structureId,
  profilId,
  profilNom,
  onOpenAbsence,
  onOpenHoraires,
  onUpdate,
}: PresenceCardProps) {
  const [toggling, setToggling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { enfant, statut, est_present, heure_arrivee, heure_depart, motif_absence, certificat_fourni, observations, releve_par_nom } = item;

  const handleTogglePresent = async () => {
    setToggling(true);
    try {
      const nextEstPresent = !est_present;
      await togglePresenceRapide({
        structure_id: structureId,
        enfant_id: enfant.id,
        date: dateStr,
        est_present: nextEstPresent,
        profil_id: profilId,
        releve_par_nom: profilNom,
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setToggling(false);
    }
  };

  // Statut styling
  let statutBadge = (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      Attendu
    </span>
  );

  let borderClass = "border-gray-200 bg-white hover:border-gray-300";

  if (est_present) {
    borderClass = "border-emerald-200 bg-emerald-50/20 shadow-sm";
    statutBadge = (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-fade-in">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
        Présent
      </span>
    );
  } else if (statut === "ABSENT") {
    borderClass = "border-rose-200 bg-rose-50/20";
    statutBadge = (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
        Absent
      </span>
    );
  } else if (statut === "ABSENT_JUSTIFIE") {
    borderClass = "border-amber-200 bg-amber-50/20";
    statutBadge = (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <FileCheck size={12} className="text-amber-600" />
        Absence Justifiée
      </span>
    );
  } else if (statut === "CONGE") {
    borderClass = "border-sky-200 bg-sky-50/20";
    statutBadge = (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
        <Calendar size={12} className="text-sky-600" />
        En Congé
      </span>
    );
  }

  return (
    <div
      className={`relative rounded-2xl border p-4 transition-all duration-200 ${borderClass} flex flex-col justify-between`}
    >
      <div>
        {/* Top: Avatar + Info + Menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              {enfant.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={enfant.photo_url}
                  alt={`${enfant.prenom} ${enfant.nom}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm border-2 border-white"
                  style={{ backgroundColor: getAvatarBg(enfant.id) }}
                >
                  {getInitiales(enfant.prenom, enfant.nom)}
                </div>
              )}
              {est_present && (
                <span className="absolute -bottom-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </div>

            {/* Nom & Groupe */}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900 text-base leading-tight">
                  {enfant.prenom} {enfant.nom}
                </h4>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {enfant.groupe && (
                  <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-md bg-gray-100 text-gray-600">
                    {enfant.groupe}
                  </span>
                )}
                {statutBadge}
              </div>
            </div>
          </div>

          {/* Quick Menu Button */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Options"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 text-xs text-gray-700 animate-scale-up">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenHoraires(item);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium"
                  >
                    <Clock size={14} className="text-emerald-600" />
                    Modifier horaires & notes
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenAbsence(item);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 text-rose-600 font-medium"
                  >
                    <AlertCircle size={14} className="text-rose-500" />
                    Signaler absence / congé
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Badges Info (Régime / Observations / Motif) */}
        <div className="mt-3 space-y-1.5">
          {enfant.regimes && enfant.regimes.length > 0 && (
            <div className="flex items-center gap-1.5">
              <BadgeRegime enfant={enfant} />
            </div>
          )}

          {motif_absence && !est_present && (
            <div className="text-xs p-2 rounded-lg bg-rose-50/80 border border-rose-100 text-rose-800">
              <span className="font-semibold">Motif :</span> {motif_absence}
              {certificat_fourni && (
                <span className="ml-1 font-bold text-amber-700">✓ Certificat fourni</span>
              )}
            </div>
          )}

          {observations && (
            <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded-lg border border-gray-100 line-clamp-2">
              &quot;{observations}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Bottom: Horaires & Bouton d'action Rapide */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        {/* Horaires compacts */}
        <div className="text-xs text-gray-600 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Arrivée :</span>
            <span className="font-semibold text-gray-800">{formatHeure(heure_arrivee)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Départ :</span>
            <span className="font-semibold text-gray-800">{formatHeure(heure_depart)}</span>
          </div>
        </div>

        {/* Bouton de pointage rapide */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePresent}
            disabled={toggling}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 ${
              est_present
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 hover:border-emerald-300 border border-gray-200"
            }`}
          >
            <Check size={14} className={est_present ? "text-white" : "text-gray-400"} />
            {est_present ? "Présent" : "Pointer"}
          </button>
        </div>
      </div>
    </div>
  );
}
