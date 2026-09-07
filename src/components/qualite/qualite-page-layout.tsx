"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  CheckCircle2,
  ClipboardList,
  Users,
  FileCheck2,
  FileDown,
  Sparkles,
  Calendar,
  ChevronRight,
} from "lucide-react";

interface QualitePageLayoutProps {
  structureId: string;
  titre?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  periodeActuelle?: string;
}

export function QualitePageLayout({
  structureId,
  titre = "Démarche Qualité & Référentiel National",
  description = "Évaluation continue des pratiques, gouvernance des plans d'action et préparation au dossier quinquennal.",
  actions,
  children,
  periodeActuelle = "2025-2026",
}: QualitePageLayoutProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/${structureId}/qualite`;

  const tabs = [
    {
      id: "auto-evaluation",
      label: "1. Auto-évaluation continue",
      href: `${basePath}/auto-evaluation`,
      icon: CheckCircle2,
    },
    {
      id: "enquetes",
      label: "2. Enquêtes et retours",
      href: `${basePath}/enquetes`,
      icon: Users,
    },
    {
      id: "plan-action",
      label: "3. Plan d'action (PAQ)",
      href: `${basePath}/plan-action`,
      icon: ClipboardList,
    },
    {
      id: "dossier",
      label: "4. Dossier quinquennal",
      href: `${basePath}/dossier`,
      icon: FileCheck2,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white border border-white/15">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                RZPan'Da Qualité
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <Calendar className="w-3 h-3 text-slate-400" />
                Campagne {periodeActuelle}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {titre}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>

          {actions && (
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {actions}
            </div>
          )}
        </div>

        {/* Modular Navigation Tabs Bar */}
        <div className="relative z-10 mt-8 pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const TabIcon = tab.icon;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`group flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 border-2 border-white shadow-lg scale-[1.02]"
                    : "bg-white/10 text-white border border-white/60 hover:bg-white/20 hover:border-white hover:scale-[1.01]"
                }`}
              >
                <TabIcon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-indigo-600" : "text-white/80 group-hover:text-white"
                  }`}
                />
                <span className="truncate">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">{children}</div>
    </div>
  );
}
