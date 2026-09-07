"use client";

import React from "react";
import { AxeQualite } from "@prisma/client";
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

interface MaturiteStats {
  total: number;
  evalues: number;
  conformes: number;
  partiels: number;
  a_ameliorer: number;
  non_evalues: number;
  pourcentage_conformite: number;
  score_global: number;
  niveau_maturite: string;
  par_axe: Record<
    AxeQualite,
    {
      total: number;
      conformes: number;
      partiels: number;
      a_ameliorer: number;
      non_evalues: number;
      taux: number;
    }
  >;
}

interface MaturiteGaugeProps {
  stats: MaturiteStats;
  compact?: boolean;
}

const AXE_LABELS: Record<AxeQualite, { label: string; short: string; color: string }> = {
  ACCUEIL_SECURITE: {
    label: "Axe 1 — Accueil, Santé & Sécurité",
    short: "Santé & Sécurité",
    color: "emerald",
  },
  DEVELOPPEMENT_EVEIL: {
    label: "Axe 2 — Pratiques d'Éveil & Socialisation",
    short: "Éveil & Bien-être",
    color: "blue",
  },
  RELATION_FAMILLES: {
    label: "Axe 3 — Relation Familles & Co-éducation",
    short: "Relation Familles",
    color: "purple",
  },
  PILOTAGE_RISQUES: {
    label: "Axe 4 — Organisation, Équipe & Pilotage des risques",
    short: "Organisation & RH",
    color: "amber",
  },
};

export function MaturiteGauge({ stats, compact = false }: MaturiteGaugeProps) {
  const score = Math.round(stats?.score_global ?? (stats as any)?.scoreGlobal ?? 0);

  // SVG Gauge calculations
  const size = compact ? 120 : 160;
  const strokeWidth = compact ? 10 : 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getNiveauBadge = (niveau?: string) => {
    switch (niveau) {
      case "Excellence & Maîtrise":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: ShieldCheck,
          desc: "Niveau cible atteint pour l'évaluation quinquennale externe.",
        };
      case "Démarche confirmée":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Award,
          desc: "Démarche qualité solide avec preuves tangibles d'application.",
        };
      case "En cours de structuration":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: AlertTriangle,
          desc: "Auto-évaluation initiée, plusieurs axes d'amélioration identifiés.",
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-700 border-gray-200",
          icon: HelpCircle,
          desc: "Complétez la grille pour calibrer votre niveau de conformité.",
        };
    }
  };

  const niveauInfo = getNiveauBadge(stats?.niveau_maturite || (stats as any)?.libelleMaturite);
  const NiveauIcon = niveauInfo.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Gauge + Main Score */}
        <div className="flex items-center gap-5 w-full lg:w-auto justify-center lg:justify-start">
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={
                  score >= 90
                    ? "#10B981"
                    : score >= 75
                    ? "#3B82F6"
                    : score >= 50
                    ? "#F59E0B"
                    : "#64748B"
                }
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">{score}%</span>
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Conformité
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${niveauInfo.bg}`}
              >
                <NiveauIcon className="w-3.5 h-3.5" />
                {stats.niveau_maturite}
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-[220px] leading-relaxed">
              {niveauInfo.desc}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
              <span className="font-semibold text-gray-900">{stats.evalues}</span> / {stats.total} critères évalués
            </div>
          </div>
        </div>

        {/* Status Distribution Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold">Conformes</span>
            </div>
            <span className="text-xl font-bold text-emerald-800">{stats?.conformes ?? 0}</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-semibold">Partiels</span>
            </div>
            <span className="text-xl font-bold text-amber-800">{stats?.partiels ?? 0}</span>
          </div>

          <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-rose-700 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">À améliorer</span>
            </div>
            <span className="text-xl font-bold text-rose-800">{stats?.a_ameliorer ?? 0}</span>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">À évaluer</span>
            </div>
            <span className="text-xl font-bold text-gray-700">{stats?.non_evalues ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Progress Bars per Axe */}
      <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(AXE_LABELS) as AxeQualite[]).map((axe) => {
          const axeStat = stats?.par_axe?.[axe] || {
            total: 0,
            conformes: 0,
            partiels: 0,
            a_ameliorer: 0,
            non_evalues: 0,
            taux: 0,
          };
          const info = AXE_LABELS[axe];
          return (
            <div key={axe} className="bg-gray-50/70 rounded-xl p-3 border border-gray-100/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-gray-800 truncate" title={info.label}>
                  {info.short}
                </span>
                <span className="font-bold text-gray-900">{axeStat.taux}%</span>
              </div>
              <div className="w-full bg-gray-200/80 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    axeStat.taux >= 80
                      ? "bg-emerald-500"
                      : axeStat.taux >= 60
                      ? "bg-blue-500"
                      : axeStat.taux >= 40
                      ? "bg-amber-500"
                      : "bg-gray-400"
                  }`}
                  style={{ width: `${axeStat.taux}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                <span>{axeStat.conformes} conformes</span>
                <span>{axeStat.a_ameliorer > 0 ? `${axeStat.a_ameliorer} à amél.` : "0 éc."}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
