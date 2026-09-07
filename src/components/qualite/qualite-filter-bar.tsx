"use client";

import React from "react";
import { AxeQualite, StatutConformite } from "@prisma/client";
import { Search, Filter, CheckCircle2, AlertTriangle, XCircle, HelpCircle, Layers } from "lucide-react";

interface QualiteFilterBarProps {
  selectedAxe: AxeQualite | "TOUS";
  onSelectAxe: (axe: AxeQualite | "TOUS") => void;
  selectedStatut: StatutConformite | "TOUS";
  onSelectStatut: (statut: StatutConformite | "TOUS") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  counts?: {
    total: number;
    conformes: number;
    partiels: number;
    a_ameliorer: number;
    non_evalues: number;
  };
}

const AXE_OPTIONS: { id: AxeQualite | "TOUS"; label: string; short: string }[] = [
  { id: "TOUS", label: "Tous les axes", short: "Tous" },
  { id: "ACCUEIL_SECURITE", label: "Axe 1 — Santé & Sécurité", short: "Axe 1 : Sécurité" },
  { id: "DEVELOPPEMENT_EVEIL", label: "Axe 2 — Éveil & Pratiques", short: "Axe 2 : Éveil" },
  { id: "RELATION_FAMILLES", label: "Axe 3 — Relation Familles", short: "Axe 3 : Co-éducation" },
  { id: "PILOTAGE_RISQUES", label: "Axe 4 — Pilotage des risques & RH", short: "Axe 4 : RH & Pilotage" },
];

export function QualiteFilterBar({
  selectedAxe,
  onSelectAxe,
  selectedStatut,
  onSelectStatut,
  searchQuery,
  onSearchChange,
  counts,
}: QualiteFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3.5">
      {/* Search and Main Axe Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un critère (code ex: CRIT-01, mots-clés...)"
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Axe Selector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {AXE_OPTIONS.map((opt) => {
            const isSelected = selectedAxe === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectAxe(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {opt.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conformity Status Filter Pills */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-gray-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Statut :
          </span>

          <button
            type="button"
            onClick={() => onSelectStatut("TOUS")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedStatut === "TOUS"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tous {counts && `(${counts.total})`}
          </button>

          <button
            type="button"
            onClick={() => onSelectStatut("CONFORME")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedStatut === "CONFORME"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Conformes {counts && `(${counts.conformes})`}
          </button>

          <button
            type="button"
            onClick={() => onSelectStatut("PARTIELLEMENT_CONFORME")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedStatut === "PARTIELLEMENT_CONFORME"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Partiels {counts && `(${counts.partiels})`}
          </button>

          <button
            type="button"
            onClick={() => onSelectStatut("A_AMELIORER")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedStatut === "A_AMELIORER"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            À améliorer {counts && `(${counts.a_ameliorer})`}
          </button>

          <button
            type="button"
            onClick={() => onSelectStatut("NON_EVALUE")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedStatut === "NON_EVALUE"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Non évalués {counts && `(${counts.non_evalues})`}
          </button>
        </div>
      </div>
    </div>
  );
}
