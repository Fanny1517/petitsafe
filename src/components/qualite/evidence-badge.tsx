"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Link2, CheckCircle2, AlertTriangle, ExternalLink, Sparkles, Database } from "lucide-react";

export interface EvidenceData {
  type: string;
  source: string;
  count: number;
  anomalies: number;
  derniere_date: string | null;
  est_conforme: boolean;
  message: string;
  url: string;
}

interface EvidenceBadgeProps {
  evidenceSource: string | null;
  evidenceData?: EvidenceData;
  structureId: string;
}

export function EvidenceBadge({
  evidenceSource,
  evidenceData,
  structureId,
}: EvidenceBadgeProps) {
  const [showPopover, setShowPopover] = useState(false);

  if (!evidenceSource) {
    return null;
  }

  const getSourceMeta = (source: string) => {
    switch (source) {
      case "HACCP_TEMP":
        return {
          title: "Module Températures (HACCP)",
          label: "Données Températures",
          defaultUrl: `/dashboard/${structureId}/temperatures`,
          color: "blue",
        };
      case "NETTOYAGE":
        return {
          title: "Plan de Nettoyage",
          label: "Plan d'Entretien",
          defaultUrl: `/dashboard/${structureId}/nettoyage`,
          color: "purple",
        };
      case "MEDICAMENTS":
        return {
          title: "Registre Médical & PAI",
          label: "Suivi Médical",
          defaultUrl: `/dashboard/${structureId}/suivi`,
          color: "rose",
        };
      case "PRESENCES":
        return {
          title: "Registre Présences & Ratios",
          label: "Registre Présences",
          defaultUrl: `/dashboard/${structureId}/presences`,
          color: "emerald",
        };
      default:
        return {
          title: "Preuve terrain connectée",
          label: source,
          defaultUrl: `/dashboard/${structureId}`,
          color: "gray",
        };
    }
  };

  const meta = getSourceMeta(evidenceSource);
  const targetUrl = evidenceData?.url || meta.defaultUrl;
  const isHealthy = evidenceData ? evidenceData.est_conforme : true;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
          isHealthy
            ? "bg-indigo-50/70 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/70"
            : "bg-amber-50/70 text-amber-700 border-amber-200/80 hover:bg-amber-100/70"
        }`}
      >
        <Database className="w-3 h-3 text-indigo-500" />
        <span>Preuve terrain : {meta.label}</span>
        {evidenceData && (
          isHealthy ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-0.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 ml-0.5" />
          )
        )}
      </button>

      {/* Hover / Click Popover with proof details */}
      {showPopover && (
        <div
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
          className="absolute z-30 left-0 mt-1 w-72 p-3 bg-white rounded-xl shadow-xl border border-gray-100 text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
            <span className="font-semibold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              {meta.title}
            </span>
            <span className="text-[10px] text-gray-400">Sync auto</span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-3">
            {evidenceData?.message ||
              "Ce critère est audité automatiquement via les saisies quotidiennes effectuées par votre équipe sur le terrain."}
          </p>

          {evidenceData && (
            <div className="bg-gray-50 rounded-lg p-2 mb-3 text-[11px] space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Enregistrements (30j) :</span>
                <span className="font-semibold text-gray-900">{evidenceData.count}</span>
              </div>
              {evidenceData.anomalies > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Anomalies / alertes :</span>
                  <span>{evidenceData.anomalies}</span>
                </div>
              )}
              {evidenceData.derniere_date && (
                <div className="flex justify-between text-gray-500 text-[10px]">
                  <span>Dernier relevé :</span>
                  <span>{new Date(evidenceData.derniere_date).toLocaleDateString("fr-FR")}</span>
                </div>
              )}
            </div>
          )}

          <Link
            href={targetUrl}
            className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors"
          >
            <span>Consulter les relevés terrain</span>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </Link>
        </div>
      )}
    </div>
  );
}
