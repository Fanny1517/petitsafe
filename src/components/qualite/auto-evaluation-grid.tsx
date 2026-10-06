"use client";

import React, { useState, useMemo } from "react";
import { AxeQualite, StatutConformite } from "@prisma/client";
import {
  MaturiteGauge,
} from "./maturite-gauge";
import {
  QualiteFilterBar,
} from "./qualite-filter-bar";
import {
  CritereCard,
  type CritereItem,
} from "./critere-card";
import {
  PaqActionModal,
} from "./paq-action-modal";
import {
  type EvidenceData,
} from "./evidence-badge";
import {
  sauvegarderEvaluationCritere,
} from "@/app/actions/qualite";
import {
  buildMaturiteStatsFromCriteres,
  type MaturiteStats,
} from "@/types/qualite";
import { toast } from "sonner";
import {
  Sparkles,
  Plus,
  FileDown,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AutoEvaluationGridProps {
  structureId: string;
  initialCriteres: CritereItem[];
  initialStats: any;
  preuvesTerrain: Record<string, EvidenceData>;
  periode: string;
}

export function AutoEvaluationGrid({
  structureId,
  initialCriteres,
  initialStats,
  preuvesTerrain,
  periode,
}: AutoEvaluationGridProps) {
  const router = useRouter();
  const [criteres, setCriteres] = useState<CritereItem[]>(initialCriteres);
  const [stats, setStats] = useState<MaturiteStats>(() =>
    buildMaturiteStatsFromCriteres(initialCriteres, initialStats)
  );
  const [selectedAxe, setSelectedAxe] = useState<AxeQualite | "TOUS">("TOUS");
  const [selectedStatut, setSelectedStatut] = useState<StatutConformite | "TOUS">("TOUS");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal PAQ
  const [paqModalOpen, setPaqModalOpen] = useState(false);
  const [selectedCritereForPaq, setSelectedCritereForPaq] = useState<{
    id?: string;
    code?: string;
    titre?: string;
  }>({});

  // Recalculate local stats upon user update
  const recalculateLocalStats = (updatedList: CritereItem[]) => {
    setStats(buildMaturiteStatsFromCriteres(updatedList));
  };

  // Handler for updating status from a card
  const handleUpdateStatut = async (
    critereId: string,
    statut: StatutConformite,
    observations?: string
  ) => {
    try {
      const res = await sauvegarderEvaluationCritere({
        structureId,
        critereId,
        statut,
        observations,
        periode,
      });

      if (res.success) {
        // Optimistically update list
        const updated = criteres.map((c) => {
          if (c.id === critereId) {
            return {
              ...c,
              evaluation: {
                id: res.data?.id || c.evaluation?.id || "temp-id",
                statut,
                observations: observations ?? c.evaluation?.observations ?? null,
                preuves_url: c.evaluation?.preuves_url || [],
                date_evaluation: new Date(),
                evalue_par: c.evaluation?.evalue_par || { prenom: "Vous", nom: "" },
              },
            };
          }
          return c;
        });

        setCriteres(updated);
        recalculateLocalStats(updated);
        toast.success("Évaluation enregistrée");
        return true;
      } else {
        toast.error(res.error || "Erreur lors de la sauvegarde");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la sauvegarde");
      return false;
    }
  };

  const handleOpenPaqModal = (critereId?: string, critereCode?: string, critereTitre?: string) => {
    setSelectedCritereForPaq({ id: critereId, code: critereCode, titre: critereTitre });
    setPaqModalOpen(true);
  };

  // Filter criteria
  const filteredCriteres = useMemo(() => {
    return criteres.filter((c) => {
      // Filter by axe
      if (selectedAxe !== "TOUS") {
        if (c.chapitre !== selectedAxe && c.axe !== selectedAxe) {
          const num = parseInt(c.code.split("-")[1]);
          if (selectedAxe === "ACCUEIL_SECURITE" && (num < 1 || num > 5)) return false;
          if (selectedAxe === "DEVELOPPEMENT_EVEIL" && (num < 6 || num > 10)) return false;
          if (selectedAxe === "RELATION_FAMILLES" && (num < 11 || num > 15)) return false;
          if (selectedAxe === "PILOTAGE_RISQUES" && (num < 16 || num > 20)) return false;
        }
      }

      // Filter by status
      if (selectedStatut !== "TOUS") {
        const currentStat = c.evaluation?.statut || "NON_EVALUE";
        if (currentStat !== selectedStatut) return false;
      }

      // Filter by search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = c.code.toLowerCase().includes(q);
        const matchesTitre = c.titre.toLowerCase().includes(q);
        const matchesChapitre = c.chapitre.toLowerCase().includes(q);
        const matchesPoints = c.points_cles.some((p) => p.toLowerCase().includes(q));
        if (!matchesCode && !matchesTitre && !matchesChapitre && !matchesPoints) {
          return false;
        }
      }

      return true;
    });
  }, [criteres, selectedAxe, selectedStatut, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Global Maturity Gauge & Stats Card */}
      <MaturiteGauge stats={stats} />

      {/* 2. Filter & Search Controls */}
      <QualiteFilterBar
        selectedAxe={selectedAxe}
        onSelectAxe={setSelectedAxe}
        selectedStatut={selectedStatut}
        onSelectStatut={setSelectedStatut}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={{
          total: criteres.length,
          conformes: stats.conformes,
          partiels: stats.partiels,
          a_ameliorer: stats.a_ameliorer,
          non_evalues: stats.non_evalues,
        }}
      />

      {/* 3. Criteria List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>
            Affichage de <strong>{filteredCriteres.length}</strong> critère(s) sur{" "}
            {criteres.length}
          </span>
          {stats.a_ameliorer > 0 && (
            <button
              type="button"
              onClick={() => handleOpenPaqModal()}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une action globale au PAQ
            </button>
          )}
        </div>

        {filteredCriteres.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-gray-800">
              Aucun critère ne correspond à votre filtre
            </h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Essayez de modifier vos critères de recherche ou de réinitialiser le filtre par axe et conformité.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedAxe("TOUS");
                setSelectedStatut("TOUS");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredCriteres.map((critere) => {
            const evidence = critere.evidence_source
              ? preuvesTerrain[critere.evidence_source]
              : undefined;

            return (
              <CritereCard
                key={critere.id}
                critere={critere}
                structureId={structureId}
                evidenceData={evidence}
                onUpdateStatut={handleUpdateStatut}
                onOpenPaqModal={handleOpenPaqModal}
              />
            );
          })
        )}
      </div>

      {/* PAQ Modal Dialog */}
      <PaqActionModal
        isOpen={paqModalOpen}
        onClose={() => setPaqModalOpen(false)}
        structureId={structureId}
        critereId={selectedCritereForPaq.id}
        critereCode={selectedCritereForPaq.code}
        critereTitre={selectedCritereForPaq.titre}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
