"use client";

import { PandaIcon } from "@/components/shared/panda-icon";
import { LogoText } from "@/components/shared/logo-text";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useModules } from "@/hooks/use-modules";
import { useProfil } from "@/hooks/use-profil";
import {
  LayoutDashboard, Baby, ClipboardList, Thermometer, Package, Sparkles,
  MessageSquare, FileText, FileDown, Settings, LogOut, ChevronLeft, Moon,
} from "lucide-react";
import { useState } from "react";
import type { ModuleId } from "@/lib/constants";

interface SidebarProps {
  structureId: string;
  structureNom: string;
  prenom: string;
  modulesActifs: string[];
}

const ICONS: Record<string, typeof LayoutDashboard> = {
  Thermometer, Baby, Package, Sparkles, ClipboardList,
  MessageSquare, FileText, FileDown, Moon,
};

type ColorTheme = "blue" | "pink" | "purple" | "orange" | "emerald" | "amber" | "teal" | "cyan" | "violet" | "indigo" | "gray";

const COLOR_CLASSES: Record<ColorTheme, {
  activeBg: string;
  activeText: string;
  activeIcon: string;
  inactiveHoverBg: string;
  inactiveHoverText: string;
  inactiveHoverIcon: string;
  inactiveIcon: string;
}> = {
  indigo: {
    activeBg: "bg-indigo-50 text-indigo-700",
    activeText: "text-indigo-700",
    activeIcon: "text-indigo-600",
    inactiveHoverBg: "hover:bg-indigo-50/60 hover:text-indigo-700",
    inactiveHoverText: "hover:text-indigo-700",
    inactiveHoverIcon: "group-hover:text-indigo-500",
    inactiveIcon: "text-gray-400",
  },
  blue: {
    activeBg: "bg-blue-50 text-blue-700",
    activeText: "text-blue-700",
    activeIcon: "text-blue-600",
    inactiveHoverBg: "hover:bg-blue-50/60 hover:text-blue-700",
    inactiveHoverText: "hover:text-blue-700",
    inactiveHoverIcon: "group-hover:text-blue-500",
    inactiveIcon: "text-gray-400",
  },
  pink: {
    activeBg: "bg-pink-50 text-pink-700",
    activeText: "text-pink-700",
    activeIcon: "text-pink-600",
    inactiveHoverBg: "hover:bg-pink-50/60 hover:text-pink-700",
    inactiveHoverText: "hover:text-pink-700",
    inactiveHoverIcon: "group-hover:text-pink-500",
    inactiveIcon: "text-gray-400",
  },
  purple: {
    activeBg: "bg-purple-50 text-purple-700",
    activeText: "text-purple-700",
    activeIcon: "text-purple-600",
    inactiveHoverBg: "hover:bg-purple-50/60 hover:text-purple-700",
    inactiveHoverText: "hover:text-purple-700",
    inactiveHoverIcon: "group-hover:text-purple-500",
    inactiveIcon: "text-gray-400",
  },
  orange: {
    activeBg: "bg-orange-50 text-orange-700",
    activeText: "text-orange-700",
    activeIcon: "text-orange-600",
    inactiveHoverBg: "hover:bg-orange-50/60 hover:text-orange-700",
    inactiveHoverText: "hover:text-orange-700",
    inactiveHoverIcon: "group-hover:text-orange-500",
    inactiveIcon: "text-gray-400",
  },
  emerald: {
    activeBg: "bg-emerald-50 text-emerald-700",
    activeText: "text-emerald-700",
    activeIcon: "text-emerald-600",
    inactiveHoverBg: "hover:bg-emerald-50/60 hover:text-emerald-700",
    inactiveHoverText: "hover:text-emerald-700",
    inactiveHoverIcon: "group-hover:text-emerald-500",
    inactiveIcon: "text-gray-400",
  },
  amber: {
    activeBg: "bg-amber-50 text-amber-700",
    activeText: "text-amber-700",
    activeIcon: "text-amber-600",
    inactiveHoverBg: "hover:bg-amber-50/60 hover:text-amber-700",
    inactiveHoverText: "hover:text-amber-700",
    inactiveHoverIcon: "group-hover:text-indigo-500",
    inactiveIcon: "text-gray-400",
  },
  teal: {
    activeBg: "bg-teal-50 text-teal-700",
    activeText: "text-teal-700",
    activeIcon: "text-teal-600",
    inactiveHoverBg: "hover:bg-teal-50/60 hover:text-teal-700",
    inactiveHoverText: "hover:text-teal-700",
    inactiveHoverIcon: "group-hover:text-teal-500",
    inactiveIcon: "text-gray-400",
  },
  cyan: {
    activeBg: "bg-cyan-50 text-cyan-700",
    activeText: "text-cyan-700",
    activeIcon: "text-cyan-600",
    inactiveHoverBg: "hover:bg-cyan-50/60 hover:text-cyan-700",
    inactiveHoverText: "hover:text-cyan-700",
    inactiveHoverIcon: "group-hover:text-cyan-500",
    inactiveIcon: "text-gray-400",
  },
  violet: {
    activeBg: "bg-violet-50 text-violet-700",
    activeText: "text-violet-700",
    activeIcon: "text-violet-600",
    inactiveHoverBg: "hover:bg-violet-50/60 hover:text-violet-700",
    inactiveHoverText: "hover:text-violet-700",
    inactiveHoverIcon: "group-hover:text-violet-500",
    inactiveIcon: "text-gray-400",
  },
  gray: {
    activeBg: "bg-gray-100 text-gray-900",
    activeText: "text-gray-900",
    activeIcon: "text-gray-700",
    inactiveHoverBg: "hover:bg-gray-50 hover:text-gray-900",
    inactiveHoverText: "hover:text-gray-900",
    inactiveHoverIcon: "group-hover:text-gray-600",
    inactiveIcon: "text-gray-400",
  }
};

interface MenuItem {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
  moduleId?: ModuleId;
  alwaysVisible?: boolean;
  adminOnly?: boolean;
  condition?: (isActif: (m: ModuleId) => boolean) => boolean;
  color: ColorTheme;
}

const SECTIONS: { title: string; category?: string; items: MenuItem[] }[] = [
  {
    title: "",
    items: [
      { label: "Tableau de bord", icon: LayoutDashboard, href: "", alwaysVisible: true, color: "indigo" },
    ],
  },
  {
    title: "HACCP & Traçabilité",
    category: "haccp",
    items: [
      { label: "Températures", icon: Thermometer, href: "/temperatures", moduleId: "temperatures", color: "blue" },
      { label: "Biberonnerie", icon: Baby, href: "/biberonnerie", moduleId: "biberonnerie", color: "pink" },
      { label: "Réceptions & Stock", icon: Package, href: "/stock", adminOnly: true, condition: (isActif) => isActif("tracabilite") || isActif("stocks"), color: "amber" },
      { label: "Nettoyage", icon: Sparkles, href: "/nettoyage", moduleId: "nettoyage", color: "purple" },
    ],
  },
  {
    title: "Suivi Enfants",
    category: "suivi",
    items: [
      { label: "Enfants", icon: Baby, href: "/enfants", alwaysVisible: true, color: "orange" },
      { label: "Suivi du jour", icon: ClipboardList, href: "/suivi", condition: (isActif) => isActif("repas") || isActif("changes") || isActif("siestes"), color: "emerald" },
      { label: "Transmissions", icon: MessageSquare, href: "/transmissions", moduleId: "transmissions", color: "teal" },
    ],
  },
  {
    title: "Gestion",
    items: [
      { label: "Protocoles", icon: FileText, href: "/protocoles", moduleId: "protocoles", color: "cyan" },
      { label: "Exports PDF", icon: FileDown, href: "/exports", alwaysVisible: true, adminOnly: true, color: "violet" },
      { label: "Paramètres", icon: Settings, href: "/parametres", alwaysVisible: true, adminOnly: true, color: "gray" },
    ],
  },
];

export function Sidebar({ structureId, structureNom, prenom, modulesActifs }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);
  const { isActif, modulesParCategorie } = useModules(modulesActifs);
  const { profil, isAdmin } = useProfil();
  const basePath = `/dashboard/${structureId}`;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isItemVisible = (item: MenuItem): boolean => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.alwaysVisible) return true;
    if (item.condition) return item.condition(isActif);
    if (item.moduleId) return isActif(item.moduleId);
    return true;
  };

  const isSectionVisible = (section: typeof SECTIONS[number]): boolean => {
    if (!section.title) return true; // always show the dashboard section
    return section.items.some(isItemVisible);
  };

  return (
    <aside className={cn("hidden md:flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-200 shrink-0", collapsed ? "w-[72px]" : "w-[240px]")}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <PandaIcon size={32} />
          {!collapsed && <LogoText className="text-xl font-bold" />}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" aria-label={collapsed ? "Ouvrir le menu" : "Réduire le menu"}>
          <ChevronLeft size={18} className={cn("transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Structure</p>
          <p className="text-sm font-medium text-gray-700 truncate">{structureNom}</p>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {SECTIONS.map((section) => {
          if (!isSectionVisible(section)) return null;
          const visibleItems = section.items.filter(isItemVisible);
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.title || "main"} className="mb-2">
              {section.title && !collapsed && (
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mt-3 mb-1">{section.title}</p>
              )}
              {visibleItems.map((item) => {
                const fullHref = basePath + item.href;
                const isActive = item.href === "" ? (pathname === basePath || pathname === basePath + "/") : pathname.startsWith(fullHref);
                const theme = COLOR_CLASSES[item.color || "indigo"];
                return (
                  <Link key={item.href} href={fullHref}
                    className={cn("group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5",
                      isActive ? theme.activeBg : cn("text-gray-600", theme.inactiveHoverBg))}>
                    <item.icon size={20} className={cn("shrink-0 transition-colors duration-200", isActive ? theme.activeIcon : cn(theme.inactiveIcon, theme.inactiveHoverIcon))} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 p-3">
        {!collapsed && <p className="text-sm font-medium text-gray-700 mb-2 truncate px-1">{profil?.prenom || prenom}</p>}
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full" aria-label="Se déconnecter">
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
