"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, LayoutDashboard, Baby, ClipboardList, Thermometer, Package, Sparkles, MessageSquare, FileText, FileDown, Settings, Moon } from 'lucide-react';
import { useModules } from "@/hooks/use-modules";
import { useProfil } from "@/hooks/use-profil";
import type { ModuleId } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavbarProps {
    structureId: string;
    structureNom: string;
    prenom: string;
    modulesActifs: string[];
}

const ICONS: Record<string, any> = {
    Thermometer, Baby, Package, Sparkles, ClipboardList,
    MessageSquare, FileText, FileDown, Moon, LayoutDashboard, Settings,
};

interface MenuItem {
    label: string;
    icon: any;
    href: string;
    moduleId?: ModuleId;
    alwaysVisible?: boolean;
    adminOnly?: boolean;
    condition?: (isActif: (m: ModuleId) => boolean) => boolean;
}

const SECTIONS: { title: string; category?: string; items: MenuItem[] }[] = [
    {
        title: "Tableau de bord",
        items: [
            { label: "Tableau de bord", icon: LayoutDashboard, href: "", alwaysVisible: true },
        ],
    },
    {
        title: "HACCP & Traçabilité",
        category: "haccp",
        items: [
            { label: "Températures", icon: Thermometer, href: "/temperatures", moduleId: "temperatures" },
            { label: "Biberonnerie", icon: Baby, href: "/biberonnerie", moduleId: "biberonnerie" },
            { label: "Réceptions & Stock", icon: Package, href: "/stock", adminOnly: true, condition: (isActif) => isActif("tracabilite") || isActif("stocks") },
            { label: "Nettoyage", icon: Sparkles, href: "/nettoyage", moduleId: "nettoyage" },
        ],
    },
    {
        title: "Suivi Enfants",
        category: "suivi",
        items: [
            { label: "Enfants", icon: Baby, href: "/enfants", alwaysVisible: true },
            { label: "Suivi du jour", icon: ClipboardList, href: "/suivi", condition: (isActif) => isActif("repas") || isActif("changes") || isActif("siestes") },
            { label: "Transmissions", icon: MessageSquare, href: "/transmissions", moduleId: "transmissions" },
        ],
    },
    {
        title: "Gestion",
        items: [
            { label: "Protocoles", icon: FileText, href: "/protocoles", moduleId: "protocoles" },
            { label: "Exports PDF", icon: FileDown, href: "/exports", alwaysVisible: true, adminOnly: true },
            { label: "Paramètres", icon: Settings, href: "/parametres", alwaysVisible: true, adminOnly: true },
        ],
    },
];

export default function Navbar({ structureId, structureNom, prenom, modulesActifs }: NavbarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { isActif } = useModules(modulesActifs);
    const { isAdmin } = useProfil();
    const basePath = `/dashboard/${structureId}`;
    const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
            if (openDropdown && dropdownRefs.current[openDropdown] && !dropdownRefs.current[openDropdown]?.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [openDropdown]);

    return (
        <header className="sticky top-14 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-6">
                <nav className="flex h-14 items-center">
                    {/* Menu Desktop */}
                    <div className="hidden items-center gap-1 md:flex">
                        {SECTIONS.map((section) => {
                            const visibleItems = section.items.filter(isItemVisible);
                            if (visibleItems.length === 0) return null;

                            // Si 1 seul item = lien direct, pas de dropdown
                            if (visibleItems.length === 1 && section.title === "Tableau de bord") {
                                const item = visibleItems[0];
                                const fullHref = basePath + item.href;
                                const isActive = pathname === basePath || pathname === basePath + "/";
                                return (
                                    <Link key={section.title} href={fullHref}
                                        className={cn("flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all text-sm",
                                            isActive ? "bg-rzpanda-primary/10 text-rzpanda-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}>
                                        <item.icon size={18} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            }

                            const sectionActive = isSectionActive(section);

                            return (
                                <div key={section.title} className="relative" ref={el => { dropdownRefs.current[section.title] = el; }}>
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === section.title ? null : section.title)}
                                        className={cn("flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all text-sm",
                                            sectionActive ? "bg-rzpanda-primary/10 text-rzpanda-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}>
                                        <span>{section.title}</span>
                                        <ChevronDown size={16} className={cn("transition-transform", openDropdown === section.title && "rotate-180")} />
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
                                                    return (
                                                        <Link key={item.href} href={fullHref}
                                                            onClick={() => setOpenDropdown(null)}
                                                            className={cn("flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                                                isActive ? "bg-rzpanda-primary/10 text-rzpanda-primary font-medium" : "text-gray-700 hover:bg-gray-50"
                                                            )}>
                                                            <item.icon size={18} className="shrink-0" />
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
                    </div>

                    {/* Burger Mobile */}
                    <button
                        className="ml-auto p-2 md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>

                {/* Menu Mobile */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-1 pb-4 md:hidden"
                        >
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
                                            return (
                                                <Link key={item.href} href={fullHref}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                                                        isActive ? "bg-rzpanda-primary/10 text-rzpanda-primary" : "text-gray-700 hover:bg-gray-50"
                                                    )}>
                                                    <item.icon size={18} className="shrink-0" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
