"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useModules } from "@/hooks/use-modules";
import { useProfil } from "@/hooks/use-profil";
import { LayoutDashboard, Thermometer, Baby, Sparkles, Package, Menu, X, ClipboardList, MessageSquare, FileText, FileDown, Settings, LogOut, Moon } from "lucide-react";
import { useState } from "react";
import type { ModuleId } from "@/lib/constants";

interface BottomNavProps {
  structureId: string;
  modulesActifs: string[];
}

export function BottomNav({ structureId, modulesActifs }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { isActif } = useModules(modulesActifs);
  const { isAdmin } = useProfil();
  const [showMore, setShowMore] = useState(false);
  const basePath = `/dashboard/${structureId}`;

type ColorTheme = "blue" | "pink" | "purple" | "orange" | "emerald" | "amber" | "teal" | "cyan" | "violet" | "indigo" | "gray";

const COLOR_CLASSES: Record<ColorTheme, {
  activeText: string;
  activeIcon: string;
  activeBg: string;
  inactiveHoverBg: string;
  inactiveHoverIcon: string;
}> = {
  indigo: { activeText: "text-indigo-600", activeIcon: "text-indigo-600", activeBg: "bg-indigo-50 text-indigo-700", inactiveHoverBg: "hover:bg-indigo-50/60 hover:text-indigo-700", inactiveHoverIcon: "group-hover:text-indigo-500" },
  blue: { activeText: "text-blue-600", activeIcon: "text-blue-600", activeBg: "bg-blue-50 text-blue-700", inactiveHoverBg: "hover:bg-blue-50/60 hover:text-blue-700", inactiveHoverIcon: "group-hover:text-blue-500" },
  pink: { activeText: "text-pink-600", activeIcon: "text-pink-600", activeBg: "bg-pink-50 text-pink-700", inactiveHoverBg: "hover:bg-pink-50/60 hover:text-pink-700", inactiveHoverIcon: "group-hover:text-pink-500" },
  purple: { activeText: "text-purple-600", activeIcon: "text-purple-600", activeBg: "bg-purple-50 text-purple-700", inactiveHoverBg: "hover:bg-purple-50/60 hover:text-purple-700", inactiveHoverIcon: "group-hover:text-purple-500" },
  orange: { activeText: "text-orange-600", activeIcon: "text-orange-600", activeBg: "bg-orange-50 text-orange-700", inactiveHoverBg: "hover:bg-orange-50/60 hover:text-orange-700", inactiveHoverIcon: "group-hover:text-orange-500" },
  emerald: { activeText: "text-emerald-600", activeIcon: "text-emerald-600", activeBg: "bg-emerald-50 text-emerald-700", inactiveHoverBg: "hover:bg-emerald-50/60 hover:text-emerald-700", inactiveHoverIcon: "group-hover:text-emerald-500" },
  amber: { activeText: "text-amber-600", activeIcon: "text-amber-600", activeBg: "bg-amber-50 text-amber-700", inactiveHoverBg: "hover:bg-amber-50/60 hover:text-amber-700", inactiveHoverIcon: "group-hover:text-amber-500" },
  teal: { activeText: "text-teal-600", activeIcon: "text-teal-600", activeBg: "bg-teal-50 text-teal-700", inactiveHoverBg: "hover:bg-teal-50/60 hover:text-teal-700", inactiveHoverIcon: "group-hover:text-teal-500" },
  cyan: { activeText: "text-cyan-600", activeIcon: "text-cyan-600", activeBg: "bg-cyan-50 text-cyan-700", inactiveHoverBg: "hover:bg-cyan-50/60 hover:text-cyan-700", inactiveHoverIcon: "group-hover:text-cyan-500" },
  violet: { activeText: "text-violet-600", activeIcon: "text-violet-600", activeBg: "bg-violet-50 text-violet-700", inactiveHoverBg: "hover:bg-violet-50/60 hover:text-violet-700", inactiveHoverIcon: "group-hover:text-violet-500" },
  gray: { activeText: "text-gray-700", activeIcon: "text-gray-700", activeBg: "bg-gray-100 text-gray-900", inactiveHoverBg: "hover:bg-gray-50 hover:text-gray-900", inactiveHoverIcon: "group-hover:text-gray-600" }
};

  // Build dynamic main items: dashboard + up to 3 active HACCP modules
  const haccpItems: { label: string; icon: typeof LayoutDashboard; href: string; moduleId: ModuleId; color: ColorTheme }[] = [
    { label: "Temp.", icon: Thermometer, href: "/temperatures", moduleId: "temperatures", color: "blue" },
    { label: "Biberon", icon: Baby, href: "/biberonnerie", moduleId: "biberonnerie", color: "pink" },
    { label: "Nettoyage", icon: Sparkles, href: "/nettoyage", moduleId: "nettoyage", color: "purple" },
    { label: "Stock", icon: Package, href: "/stock", moduleId: "tracabilite", color: "amber" },
  ];
  const activeHaccpItems = haccpItems.filter((item) => {
    if (item.moduleId === "tracabilite" && !isAdmin) return false;
    return isActif(item.moduleId);
  }).slice(0, 3);

  const mainItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "", color: "indigo" as ColorTheme },
    ...activeHaccpItems,
  ];

  const moreItems = [
    { label: "Enfants", icon: Baby, href: "/enfants", color: "orange" as ColorTheme },
    ...(isActif("repas") || isActif("changes") || isActif("siestes") ? [{ label: "Suivi", icon: ClipboardList, href: "/suivi", color: "emerald" as ColorTheme }] : []),
    ...(isActif("transmissions") ? [{ label: "Transmissions", icon: MessageSquare, href: "/transmissions", color: "teal" as ColorTheme }] : []),
    ...(isActif("protocoles") ? [{ label: "Protocoles", icon: FileText, href: "/protocoles", color: "cyan" as ColorTheme }] : []),
    ...(isAdmin ? [{ label: "Exports", icon: FileDown, href: "/exports", color: "violet" as ColorTheme }] : []),
    ...(isAdmin ? [{ label: "Paramètres", icon: Settings, href: "/parametres", color: "gray" as ColorTheme }] : []),
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-700">Menu</span>
              <button onClick={() => setShowMore(false)} aria-label="Fermer"><X size={20} className="text-gray-400" /></button>
            </div>
            {moreItems.map((item) => {
              const fullHref = basePath + item.href;
              const isActive = pathname.startsWith(fullHref);
              const theme = COLOR_CLASSES[item.color || "indigo"];
              return (
                <Link key={item.href} href={fullHref} onClick={() => setShowMore(false)}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200",
                    isActive 
                      ? cn(theme.activeBg, "font-medium") 
                      : cn("text-gray-600", theme.inactiveHoverBg)
                  )}>
                  <item.icon size={20} className={cn("transition-colors duration-200", isActive ? theme.activeIcon : cn("text-gray-400", theme.inactiveHoverIcon))} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 w-full">
              <LogOut size={20} /><span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around h-16">
          {mainItems.map((item) => {
            const fullHref = basePath + item.href;
            const isActive = item.href === "" ? (pathname === basePath || pathname === basePath + "/") : pathname.startsWith(fullHref);
            const theme = COLOR_CLASSES[item.color || "indigo"];
            return (
              <Link key={item.href} href={fullHref}
                className={cn("flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-colors duration-200", 
                  isActive ? theme.activeText : "text-gray-400 hover:text-gray-600"
                )}>
                <item.icon size={22} className="transition-colors duration-200" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <button onClick={() => setShowMore(true)}
            className={cn("flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1", showMore ? "text-rzpanda-primary" : "text-gray-400")} aria-label="Plus d'options">
            <Menu size={22} /><span className="text-[10px] font-medium">Plus</span>
          </button>
        </div>
      </nav>
    </>
  );
}
