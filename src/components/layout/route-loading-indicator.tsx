"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

/**
 * Fonctions utilitaires globales pour declencher manuellement l'indicateur
 * lors de transitions programmees (ex: router.push).
 */
export function startNavigationLoading() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app:navigation-start"));
  }
}

export function stopNavigationLoading() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app:navigation-end"));
  }
}

function NavigationTracker({ onReset }: { onReset: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // La route a fini de se charger et de s'afficher
    onReset();
  }, [pathname, searchParams, onReset]);

  return null;
}

export function RouteLoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleEnd = () => setIsLoading(false);

    window.addEventListener("app:navigation-start", handleStart);
    window.addEventListener("app:navigation-end", handleEnd);

    // Interception globale des clics sur les liens internes
    const handleGlobalClick = (event: MouseEvent) => {
      // Si le clic a été empêché ou si ce n'est pas un clic gauche standard
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }

      const anchor = (event.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      // Liens externes, ancres internes, mailto/tel ou cibles dans un nouvel onglet
      if (
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(anchor.href, window.location.href);

        // Vérifier si c'est la même origine
        if (targetUrl.origin !== currentUrl.origin) return;

        // Même page exacte (même pathname et mêmes paramètres)
        if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
          return;
        }

        // Il s'agit d'une vraie navigation interne -> déclencher l'indicateur
        setIsLoading(true);
      } catch {
        // En cas d'URL non analysable, ignorer
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      window.removeEventListener("app:navigation-start", handleStart);
      window.removeEventListener("app:navigation-end", handleEnd);
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, []);

  // Sécurité : timeout de secours au cas où la navigation est annulée
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <>
      <Suspense fallback={null}>
        <NavigationTracker onReset={handleReset} />
      </Suspense>

      <AnimatePresence>
        {isLoading && (
          <motion.aside
            key="route-loading-indicator"
            role="status"
            aria-live="polite"
            aria-label="Chargement en cours"
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 120 }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 32,
              mass: 0.8,
            }}
            className="fixed top-[68px] right-4 sm:right-6 z-[9999] pointer-events-none flex items-center gap-2.5 px-3.5 py-2 bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-lg shadow-gray-200/50 rounded-full text-sm font-medium text-gray-700"
          >
            <Loader2 className="w-4 h-4 animate-spin text-rzpanda-primary" />
            <span className="tracking-wide">Chargement</span>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
