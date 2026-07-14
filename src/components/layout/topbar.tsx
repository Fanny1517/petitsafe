"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, RefreshCw, LayoutDashboard, Baby, ClipboardList, Thermometer, Package, Sparkles, MessageSquare, FileText, FileDown, Settings, LogOut, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationsBell } from "./notifications-bell";
import { useProfil } from "@/hooks/use-profil";
import { useModules } from "@/hooks/use-modules";
import { createClient } from "@/lib/supabase/client";
import { PandaIcon } from "@/components/shared/panda-icon";
import { LogoText } from "@/components/shared/logo-text";
import type { ModuleId } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Structure {
  structure_id: string;
  structure: { id: string; nom: string; type: string; modules_actifs: string[] };
}

interface TopbarProps {
  structures: Structure[];
  activeStructureId: string | null;
  onSwitchStructure: (id: string) => void;
  prenom: string;
  modulesActifs: string[];
}

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
    inactiveHoverIcon: "group-hover:text-amber-500",
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
  icon: any;
  href: string;
  moduleId?: ModuleId;
  alwaysVisible?: boolean;
  adminOnly?: boolean;
  condition?: (isActif: (m: ModuleId) => boolean) => boolean;
  color: ColorTheme;
}

const SECTIONS: { title: string; items: MenuItem[] }[] = [
  {
    title: "Tableau de bord",
    items: [
      { label: "Tableau de bord", icon: LayoutDashboard, href: "", alwaysVisible: true, color: "indigo" },
    ],
  },
  {
    title: "HACCP & Traçabilité",
    items: [
      { label: "Températures", icon: Thermometer, href: "/temperatures", moduleId: "temperatures", color: "blue" },
      { label: "Biberonnerie", icon: Baby, href: "/biberonnerie", moduleId: "biberonnerie", color: "pink" },
      { label: "Réceptions & Stock", icon: Package, href: "/stock", adminOnly: true, condition: (isActif) => isActif("tracabilite") || isActif("stocks"), color: "amber" },
      { label: "Nettoyage", icon: Sparkles, href: "/nettoyage", moduleId: "nettoyage", color: "purple" },
    ],
  },
  {
    title: "Suivi Enfants",
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

export function Topbar({ structures, activeStructureId, onSwitchStructure, prenom, modulesActifs }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [openStructure, setOpenStructure] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const refStructure = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const active = structures.find((s) => s.structure_id === activeStructureId);
  const { profil, clearProfil, profils, isAdmin } = useProfil();
  const { isActif } = useModules(modulesActifs);
  const basePath = `/dashboard/${activeStructureId}`;

  const displayPrenom = profil?.prenom || prenom;
  const displayInitiale = displayPrenom.charAt(0).toUpperCase();
  const displayPoste = profil?.poste || null;

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

  const isSectionActive = (section: typeof SECTIONS[number]): boolean => {
    return section.items.some(item => {
      const fullHref = basePath + item.href;
      return item.href === "" ? (pathname === basePath || pathname === basePath + "/") : pathname.startsWith(fullHref);
    });
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (refStructure.current && !refStructure.current.contains(e.target as Node)) setOpenStructure(false);
      if (openDropdown && dropdownRefs.current[openDropdown] && !dropdownRefs.current[openDropdown]?.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="h-14 flex items-center px-4 shrink-0 gap-4">
        {/* Gauche : Logo + Sélecteur structure */}
        <div className="flex items-center gap-3">
          <Link href={basePath} className="flex items-center gap-2 shrink-0">
            <PandaIcon size={32} />
            <LogoText className="text-xl font-bold hidden lg:inline" />
          </Link>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          {structures.length > 1 ? (
            <div className="relative" ref={refStructure}>
              <button onClick={() => setOpenStructure(!openStructure)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                {active?.structure.nom ?? "Structure"}
                <ChevronDown size={16} className={openStructure ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>
              {openStructure && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[200px] z-50">
                  {structures.map((s) => (
                    <button key={s.structure_id} onClick={() => { onSwitchStructure(s.structure_id); setOpenStructure(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${s.structure_id === activeStructureId ? "text-rzpanda-primary font-medium" : "text-gray-600"}`}>
                      {s.structure.nom}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{active?.structure.nom ?? "RZPan'Da"}</span>
          )}
        </div>

        {/* Centre : Menus Desktop */}
        <nav className="hidden items-center gap-1 md:flex flex-1">
          {SECTIONS.map((section) => {
            const visibleItems = section.items.filter(isItemVisible);
            if (visibleItems.length === 0) return null;

            if (visibleItems.length === 1 && section.title === "Tableau de bord") {
              const item = visibleItems[0];
              const fullHref = basePath + item.href;
              const isActive = pathname === basePath || pathname === basePath + "/";
              const theme = COLOR_CLASSES[item.color || "indigo"];
              return (
                <Link key={section.title} href={fullHref}
                  className={cn("group flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-all text-sm",
                    isActive ? theme.activeBg : cn("text-gray-600", theme.inactiveHoverBg)
                  )}>
                  <item.icon size={16} className={cn("transition-colors duration-200", isActive ? theme.activeIcon : cn(theme.inactiveIcon, theme.inactiveHoverIcon))} />
                  <span>{item.label}</span>
                </Link>
              );
            }

            const sectionActive = isSectionActive(section);

            return (
              <div key={section.title} className="relative" ref={el => { dropdownRefs.current[section.title] = el; }}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === section.title ? null : section.title)}
                  className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all text-sm",
                    sectionActive ? "bg-rzpanda-primary/10 text-rzpanda-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}>
                  <span>{section.title}</span>
                  <ChevronDown size={14} className={cn("transition-transform", openDropdown === section.title && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {openDropdown === section.title && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[220px] z-50"
                    >
                      {visibleItems.map((item) => {
                        const fullHref = basePath + item.href;
                        const isActive = item.href === "" ? (pathname === basePath || pathname === basePath + "/") : pathname.startsWith(fullHref);
                        const theme = COLOR_CLASSES[item.color || "indigo"];
                        return (
                          <Link key={item.href} href={fullHref}
                            onClick={() => setOpenDropdown(null)}
                            className={cn("group flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200",
                              isActive ? theme.activeBg : cn("text-gray-700", theme.inactiveHoverBg)
                            )}>
                            <item.icon size={16} className={cn("shrink-0 transition-colors duration-200", isActive ? theme.activeIcon : cn(theme.inactiveIcon, theme.inactiveHoverIcon))} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Droite : Notifications + Profil + Déconnexion + Burger */}
        <div className="flex items-center gap-3 ml-auto">
          {activeStructureId && <NotificationsBell structureId={activeStructureId} />}
          {profils.length > 1 && (
            <button
              onClick={clearProfil}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-xs text-gray-500 transition-colors"
              title="Changer de profil"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Changer</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-rzpanda-primary/10 flex items-center justify-center text-sm font-semibold text-rzpanda-primary">
              {displayInitiale}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-medium text-gray-700 leading-tight">{displayPrenom}</span>
              {displayPoste && (
                <span className="text-[10px] text-gray-400 leading-tight">{displayPoste}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors hidden sm:block"
            title="Déconnexion"
          >
            <LogOut size={18} />
          </button>

          {/* Burger Mobile */}
          <button className="p-2 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="flex flex-col gap-1 py-3 px-4">
              {SECTIONS.map((section) => {
                const visibleItems = section.items.filter(isItemVisible);
                if (visibleItems.length === 0) return null;
                return (
                  <div key={section.title}>
                    {section.title && (
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mt-2 mb-1">{section.title}</p>
                    )}
                    {visibleItems.map((item) => {
                      const fullHref = basePath + item.href;
                      const isActive = item.href === "" ? (pathname === basePath || pathname === basePath + "/") : pathname.startsWith(fullHref);
                      const theme = COLOR_CLASSES[item.color || "indigo"];
                      return (
                        <Link key={item.href} href={fullHref}
                          onClick={() => setMobileOpen(false)}
                          className={cn("group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive ? theme.activeBg : cn("text-gray-700", theme.inactiveHoverBg)
                          )}>
                          <item.icon size={18} className={cn("shrink-0 transition-colors duration-200", isActive ? theme.activeIcon : cn(theme.inactiveIcon, theme.inactiveHoverIcon))} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
              {/* Déconnexion mobile */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-2"
              >
                <LogOut size={18} className="shrink-0" />
                <span>Déconnexion</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
