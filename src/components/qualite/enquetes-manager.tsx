"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Users,
  Copy,
  Check,
  ExternalLink,
  BarChart3,
  Trash2,
  Power,
  Calendar,
  Sparkles,
  ClipboardList,
  HeartHandshake,
  Utensils,
  CheckCircle2,
  Clock,
  AlertCircle,
  QrCode,
  X,
} from "lucide-react";
import { toggleStatutEnquete, supprimerEnquete, getEnquetesStructure } from "@/app/actions/enquetes";
import { EnqueteCreationModal } from "./enquete-creation-modal";
import { EnqueteStatsModal } from "./enquete-stats-modal";
import { TypeEnquete } from "@prisma/client";
import { useRouter } from "next/navigation";

interface EnqueteItem {
  id: string;
  titre: string;
  description: string | null;
  type_enquete: TypeEnquete;
  token: string;
  actif: boolean;
  cible_reponses: number | null;
  date_debut: Date;
  date_fin: Date | null;
  date_creation: Date;
  _count: {
    reponses: number;
    questions: number;
  };
}

interface EnquetesManagerProps {
  structureId: string;
  initialEnquetes: EnqueteItem[];
}

const TYPE_ICONS: Record<TypeEnquete, any> = {
  ANNUELLE: ClipboardList,
  INTEGRATION: HeartHandshake,
  FLASH: Utensils,
  AUTRE: Sparkles,
};

const TYPE_BADGES: Record<TypeEnquete, { label: string; bg: string; text: string }> = {
  ANNUELLE: { label: "Baromètre Annuel", bg: "bg-purple-50 border-purple-200", text: "text-purple-700" },
  INTEGRATION: { label: "Fin d'Adaptation", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  FLASH: { label: "Enquête Flash", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  AUTRE: { label: "Personnalisée", bg: "bg-gray-100 border-gray-200", text: "text-gray-700" },
};

export function EnquetesManager({ structureId, initialEnquetes }: EnquetesManagerProps) {
  const router = useRouter();
  const [enquetes, setEnquetes] = useState<EnqueteItem[]>(initialEnquetes);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [qrModalToken, setQrModalToken] = useState<{ token: string; titre: string } | null>(null);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [selectedStatsEnqueteId, setSelectedStatsEnqueteId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Synchronisation avec les props initialEnquetes lors des revalidations serveur
  useEffect(() => {
    setEnquetes(initialEnquetes);
  }, [initialEnquetes]);

  // Actualisation explicite côté client et synchronisation serveur
  const refreshEnquetes = async () => {
    try {
      const res = await getEnquetesStructure(structureId);
      if (!res.error && res.enquetes) {
        setEnquetes(res.enquetes as EnqueteItem[]);
      }
    } catch (err) {
      console.error("Erreur actualisation enquetes:", err);
    }
    router.refresh();
  };

  // Statistiques globales
  const totalCampagnes = enquetes.length;
  const activesCampagnes = enquetes.filter((e) => e.actif).length;
  const totalReponses = enquetes.reduce((acc, curr) => acc + curr._count.reponses, 0);

  const getPublicUrl = (token: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/enquete/${token}/`;
    }
    return `/enquete/${token}/`;
  };

  const handleCopyLink = async (token: string) => {
    const url = getPublicUrl(token);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2500);
    } catch (err) {
      console.error("Erreur copie presse-papier:", err);
    }
  };

  const handleToggleStatut = async (enquete: EnqueteItem) => {
    setIsUpdating(enquete.id);
    const newStatus = !enquete.actif;
    const res = await toggleStatutEnquete(enquete.id, newStatus, structureId);
    if (res.success) {
      setEnquetes((prev) =>
        prev.map((e) => (e.id === enquete.id ? { ...e, actif: newStatus } : e))
      );
      router.refresh();
    }
    setIsUpdating(null);
  };

  const handleDelete = async (enqueteId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette enquête et toutes ses réponses associées ?")) {
      return;
    }
    setIsUpdating(enqueteId);
    const res = await supprimerEnquete(enqueteId, structureId);
    if (res.success) {
      setEnquetes((prev) => prev.filter((e) => e.id !== enqueteId));
      router.refresh();
    }
    setIsUpdating(null);
  };

  return (
    <div className="space-y-6">
      {/* Barre d'action supérieure & KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Campagnes Actives
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {activesCampagnes} <span className="text-xs text-gray-400 font-normal">/ {totalCampagnes} total</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Avis Parents Collectés
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {totalReponses}
            </div>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Nouvelle Consultation
            </span>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Lancez un baromètre 2025 en 1 clic
            </p>
          </div>
          <button
            onClick={() => setShowCreationModal(true)}
            className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Créer</span>
          </button>
        </div>
      </div>

      {/* Liste des campagnes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-600" />
            <span>Campagnes d&apos;enquêtes & Baromètres</span>
          </h2>
          <button
            onClick={() => setShowCreationModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle enquête</span>
          </button>
        </div>

        {enquetes.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Aucune campagne d&apos;enquête lancée
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Sondez vos familles sur l&apos;accueil, les repas et les activités d&apos;éveil pour piloter
              votre démarche qualité et valoriser les retours lors des contrôles PMI.
            </p>
            <button
              onClick={() => setShowCreationModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Lancer mon premier baromètre
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {enquetes.map((enq) => {
              const IconComp = TYPE_ICONS[enq.type_enquete] || Sparkles;
              const badge = TYPE_BADGES[enq.type_enquete] || TYPE_BADGES.AUTRE;
              const progressPct =
                enq.cible_reponses && enq.cible_reponses > 0
                  ? Math.min(100, Math.round((enq._count.reponses / enq.cible_reponses) * 100))
                  : null;

              return (
                <div
                  key={enq.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm ${
                    enq.actif ? "border-gray-200 hover:border-emerald-300" : "border-gray-200/60 opacity-80"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Infos de l'enquête */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            enq.actif
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${enq.actif ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}
                          />
                          {enq.actif ? "En cours" : "Clôturée"}
                        </span>

                        {Boolean(
                          enq.cible_reponses &&
                            enq.cible_reponses > 0 &&
                            enq._count.reponses >= enq.cible_reponses
                        ) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                            Objectif atteint
                          </span>
                        )}

                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Créée le {new Date(enq.date_creation).toLocaleDateString("fr-FR")}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900">{enq.titre}</h3>

                      {enq.description && (
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 max-w-2xl">
                          {enq.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                        <span>{enq._count.questions} questions</span>
                        <span>•</span>
                        <strong className="text-emerald-700 font-semibold">
                          {enq._count.reponses} réponse(s) reçue(s)
                        </strong>
                        {enq.cible_reponses && (
                          <>
                            <span>/</span>
                            <span>Objectif : {enq.cible_reponses} familles</span>
                          </>
                        )}
                      </div>

                      {/* Progression vs cible */}
                      {progressPct !== null && (
                        <div className="max-w-md pt-1">
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                      {/* Bouton Voir les stats */}
                      <button
                        onClick={() => setSelectedStatsEnqueteId(enq.id)}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Résultats & Stats</span>
                      </button>

                      {/* Bouton Copier le lien parent */}
                      <button
                        onClick={() => handleCopyLink(enq.token)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                          copiedToken === enq.token
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                        title="Copier le lien public pour les parents"
                      >
                        {copiedToken === enq.token ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Lien copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copier le lien</span>
                          </>
                        )}
                      </button>

                      {/* Bouton QR Code */}
                      <button
                        onClick={() => setQrModalToken({ token: enq.token, titre: enq.titre })}
                        className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition"
                        title="Afficher le QR Code pour affichage à l'accueil"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      {/* Bouton tester le formulaire */}
                      <a
                        href={`/enquete/${enq.token}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition"
                        title="Tester le formulaire dans un nouvel onglet"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Toggle Statut */}
                      <button
                        onClick={() => handleToggleStatut(enq)}
                        disabled={isUpdating === enq.id}
                        className={`p-2 rounded-xl border transition ${
                          enq.actif
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                        title={enq.actif ? "Clôturer la campagne" : "Réactiver la campagne"}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      {/* Supprimer */}
                      <button
                        onClick={() => handleDelete(enq.id)}
                        disabled={isUpdating === enq.id}
                        className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition"
                        title="Supprimer l'enquête"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de création */}
      {showCreationModal && (
        <EnqueteCreationModal
          structureId={structureId}
          onClose={() => setShowCreationModal(false)}
          onCreated={async () => {
            await refreshEnquetes();
          }}
        />
      )}

      {/* Modal de statistiques */}
      {selectedStatsEnqueteId && (
        <EnqueteStatsModal
          enqueteId={selectedStatsEnqueteId}
          structureId={structureId}
          onClose={() => setSelectedStatsEnqueteId(null)}
        />
      )}

      {/* Modal QR Code */}
      {qrModalToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-sm">QR Code d&apos;accueil</h3>
              <button
                onClick={() => setQrModalToken(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Imprimez ou affichez ce QR code à l&apos;entrée de la crèche pour inviter les parents à flasher et répondre en 60 secondes.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl inline-block border border-gray-200">
              {/* Image QR Code via service public fiable */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  getPublicUrl(qrModalToken.token)
                )}`}
                alt="QR Code Enquête"
                className="w-48 h-48 mx-auto rounded-lg shadow-sm"
              />
            </div>

            <p className="text-xs font-semibold text-gray-700 truncate">
              {qrModalToken.titre}
            </p>

            <button
              onClick={() => handleCopyLink(qrModalToken.token)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copier le lien direct</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
