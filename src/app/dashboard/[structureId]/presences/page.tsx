"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Download,
  Loader2,
  Sparkles,
  Check,
  Filter,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfil } from "@/hooks/use-profil";
import { useRealtimeSubscription } from "@/hooks/use-realtime-subscription";
import {
  getPresencesJour,
  pointerTousPresents,
  type PresenceJourResult,
} from "@/app/actions/presences";
import { PresenceCard } from "@/components/presences/presence-card";
import { ModalAbsence } from "@/components/presences/modal-absence";
import { ModalHoraires } from "@/components/presences/modal-horaires";
import { ModalRegistre } from "@/components/presences/modal-registre";
import { GROUPES_ENFANTS } from "@/lib/constants";

function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PresencesPage() {
  const params = useParams();
  const structureId = params.structureId as string;
  const { profil } = useProfil();
  const { prenom: authPrenom, user } = useAuth();

  const profilNom = profil
    ? `${profil.prenom || ""} ${profil.nom || ""}`.trim()
    : authPrenom || user?.email || undefined;

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [data, setData] = useState<PresenceJourResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statutFiltre, setStatutFiltre] = useState<string>("TOUS");
  const [groupeFiltre, setGroupeFiltre] = useState<string>("Tous");

  // Modals state
  const [selectedChildForAbsence, setSelectedChildForAbsence] = useState<PresenceJourResult["items"][0] | null>(null);
  const [selectedChildForHoraires, setSelectedChildForHoraires] = useState<PresenceJourResult["items"][0] | null>(null);
  const [showRegistreModal, setShowRegistreModal] = useState(false);

  const dateStr = useMemo(() => formatDateISO(currentDate), [currentDate]);
  const isToday = useMemo(() => formatDateISO(new Date()) === dateStr, [dateStr]);

  const fetchPresences = async () => {
    try {
      const res = await getPresencesJour(structureId, dateStr);
      if (res.success) {
        setData(res.data);
        setError(null);
      } else {
        setError(res.error || "Erreur de chargement des présences");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPresences();
  }, [structureId, dateStr]); // eslint-disable-line react-hooks/exhaustive-deps

  // Realtime live sync
  useRealtimeSubscription("Presence", structureId, {
    onInsert: () => fetchPresences(),
    onUpdate: () => fetchPresences(),
  });

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleSetToday = () => {
    setCurrentDate(new Date());
  };

  const handlePointerTous = async () => {
    if (!window.confirm("Pointer tous les enfants attendus comme présents maintenant ?")) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await pointerTousPresents(structureId, dateStr, profil?.id, profilNom);
      if (res.success) {
        await fetchPresences();
      } else {
        alert(res.error || "Erreur lors du pointage global");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered children list
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter((item) => {
      // Search
      const fullName = `${item.enfant.prenom} ${item.enfant.nom}`.toLowerCase();
      if (search && !fullName.includes(search.toLowerCase())) return false;

      // Group
      if (groupeFiltre !== "Tous" && item.enfant.groupe !== groupeFiltre) return false;

      // Statut
      if (statutFiltre === "PRESENTS" && !item.est_present) return false;
      if (statutFiltre === "ATTENDUS" && (item.est_present || item.statut !== "ATTENDU")) return false;
      if (statutFiltre === "ABSENTS" && item.statut !== "ABSENT" && item.statut !== "ABSENT_JUSTIFIE") return false;
      if (statutFiltre === "CONGES" && item.statut !== "CONGE") return false;

      return true;
    });
  }, [data?.items, search, groupeFiltre, statutFiltre]);

  const dateFormatee = currentDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ═══ HEADER BAR ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CalendarCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Pointage & Présences
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500 capitalize">{dateFormatee}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Direct
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector & Registre Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg hover:bg-white text-gray-600 hover:text-gray-900 transition-colors"
              title="Jour précédent"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleSetToday}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                isToday ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Aujourd&apos;hui
            </button>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => {
                if (e.target.value) setCurrentDate(new Date(e.target.value));
              }}
              className="text-xs font-medium bg-transparent border-0 px-2 py-1 text-gray-700 focus:outline-none cursor-pointer"
            />
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg hover:bg-white text-gray-600 hover:text-gray-900 transition-colors"
              title="Jour suivant"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={() => setShowRegistreModal(true)}
            className="h-10 px-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download size={15} />
            Registre & Exports
          </button>
        </div>
      </div>

      {/* ═══ STATS & KPI TILES ═══ */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Présents */}
          <div
            onClick={() => setStatutFiltre(statutFiltre === "PRESENTS" ? "TOUS" : "PRESENTS")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statutFiltre === "PRESENTS"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400"
                : "bg-emerald-50/50 text-emerald-950 border-emerald-200 hover:border-emerald-300"
            }`}
          >
            <span className={`text-xs font-semibold uppercase tracking-wider block ${statutFiltre === "PRESENTS" ? "text-emerald-100" : "text-emerald-700"}`}>
              Présents
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black">{data.stats.presents}</span>
              <span className={`text-xs font-semibold ${statutFiltre === "PRESENTS" ? "text-emerald-100" : "text-emerald-600"}`}>
                ({data.stats.tauxPresence}%)
              </span>
            </div>
          </div>

          {/* Attendus */}
          <div
            onClick={() => setStatutFiltre(statutFiltre === "ATTENDUS" ? "TOUS" : "ATTENDUS")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statutFiltre === "ATTENDUS"
                ? "bg-gray-800 text-white border-gray-800 shadow-md ring-2 ring-gray-400"
                : "bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className={`text-xs font-semibold uppercase tracking-wider block ${statutFiltre === "ATTENDUS" ? "text-gray-300" : "text-gray-500"}`}>
              Non pointés
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black">{data.stats.attendus}</span>
              <span className={`text-xs ${statutFiltre === "ATTENDUS" ? "text-gray-300" : "text-gray-400"}`}>
                attendus
              </span>
            </div>
          </div>

          {/* Absents */}
          <div
            onClick={() => setStatutFiltre(statutFiltre === "ABSENTS" ? "TOUS" : "ABSENTS")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statutFiltre === "ABSENTS"
                ? "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-400"
                : "bg-rose-50/50 text-rose-950 border-rose-200 hover:border-rose-300"
            }`}
          >
            <span className={`text-xs font-semibold uppercase tracking-wider block ${statutFiltre === "ABSENTS" ? "text-rose-100" : "text-rose-700"}`}>
              Absents
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black">{data.stats.absents}</span>
              {data.stats.absentsJustifies > 0 && (
                <span className={`text-[11px] ${statutFiltre === "ABSENTS" ? "text-rose-100" : "text-rose-600"}`}>
                  ({data.stats.absentsJustifies} justifiés)
                </span>
              )}
            </div>
          </div>

          {/* Congés */}
          <div
            onClick={() => setStatutFiltre(statutFiltre === "CONGES" ? "TOUS" : "CONGES")}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statutFiltre === "CONGES"
                ? "bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-400"
                : "bg-sky-50/50 text-sky-950 border-sky-200 hover:border-sky-300"
            }`}
          >
            <span className={`text-xs font-semibold uppercase tracking-wider block ${statutFiltre === "CONGES" ? "text-sky-100" : "text-sky-700"}`}>
              Congés
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black">{data.stats.conges}</span>
            </div>
          </div>

          {/* Total Inscrits & Action Rapide */}
          <div className="p-3.5 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between col-span-2 sm:col-span-1 shadow-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                Total Inscrits
              </span>
              <span className="text-2xl font-black text-gray-800 mt-1 block">
                {data.stats.totalInscrits}
              </span>
            </div>
            {data.stats.attendus > 0 && isToday && (
              <button
                onClick={handlePointerTous}
                disabled={actionLoading}
                className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-1.5 px-2.5 rounded-lg border border-emerald-200 transition-colors flex items-center justify-center gap-1"
              >
                <Check size={12} />
                Tout pointer
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══ SEARCH & FILTERS BAR ═══ */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un enfant..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filters Group & Reset */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Groupe */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {["Tous", ...GROUPES_ENFANTS].map((g) => (
              <button
                key={g}
                onClick={() => setGroupeFiltre(g)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  groupeFiltre === g
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {(statutFiltre !== "TOUS" || groupeFiltre !== "Tous" || search) && (
            <button
              onClick={() => {
                setStatutFiltre("TOUS");
                setGroupeFiltre("Tous");
                setSearch("");
              }}
              className="text-xs text-rose-600 hover:underline font-medium px-2 py-1"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* ═══ CHILDREN GRID ═══ */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 size={36} className="animate-spin text-emerald-600 mb-3" />
          <p className="text-sm font-medium">Chargement de la liste d&apos;appel...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <AlertCircle size={32} className="text-rose-500 mx-auto mb-2" />
          <p className="font-semibold text-rose-800">{error}</p>
          <button
            onClick={fetchPresences}
            className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <Users size={36} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-base">Aucun enfant trouvé</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            Aucun enregistrement ne correspond à vos filtres actuels.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <PresenceCard
              key={item.enfant.id}
              item={item as unknown as Parameters<typeof PresenceCard>[0]["item"]}
              dateStr={dateStr}
              structureId={structureId}
              profilId={profil?.id}
              profilNom={profilNom}
              onOpenAbsence={(child) => setSelectedChildForAbsence(child as unknown as PresenceJourResult["items"][0])}
              onOpenHoraires={(child) => setSelectedChildForHoraires(child as unknown as PresenceJourResult["items"][0])}
              onUpdate={fetchPresences}
            />
          ))}
        </div>
      )}

      {/* ═══ MODAL ABSENCE ═══ */}
      {selectedChildForAbsence && (
        <ModalAbsence
          isOpen={true}
          onClose={() => setSelectedChildForAbsence(null)}
          onSuccess={fetchPresences}
          structureId={structureId}
          enfantId={selectedChildForAbsence.enfant.id}
          enfantNom={`${selectedChildForAbsence.enfant.prenom} ${selectedChildForAbsence.enfant.nom}`}
          dateStr={dateStr}
          initialStatut={
            selectedChildForAbsence.statut === "ABSENT_JUSTIFIE" || selectedChildForAbsence.statut === "CONGE"
              ? selectedChildForAbsence.statut
              : "ABSENT"
          }
          initialMotif={selectedChildForAbsence.motif_absence}
          initialCertificat={selectedChildForAbsence.certificat_fourni}
          initialObservations={selectedChildForAbsence.observations}
          profilId={profil?.id}
          profilNom={profilNom}
        />
      )}

      {/* ═══ MODAL HORAIRES ═══ */}
      {selectedChildForHoraires && (
        <ModalHoraires
          isOpen={true}
          onClose={() => setSelectedChildForHoraires(null)}
          onSuccess={fetchPresences}
          structureId={structureId}
          enfantId={selectedChildForHoraires.enfant.id}
          enfantNom={`${selectedChildForHoraires.enfant.prenom} ${selectedChildForHoraires.enfant.nom}`}
          dateStr={dateStr}
          initialHeureArrivee={selectedChildForHoraires.heure_arrivee}
          initialHeureDepart={selectedChildForHoraires.heure_depart}
          initialObservations={selectedChildForHoraires.observations}
          profilId={profil?.id}
          profilNom={profilNom}
        />
      )}

      {/* ═══ MODAL REGISTRE MENSUEL & EXPORT ═══ */}
      {showRegistreModal && (
        <ModalRegistre
          isOpen={true}
          onClose={() => setShowRegistreModal(false)}
          structureId={structureId}
        />
      )}
    </div>
  );
}
