"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "rzpanda-cookies-accepted";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      // localStorage indisponible (mode privé strict) : on n'affiche pas le bandeau
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Information cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white shadow-lg"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 py-3 text-sm text-gray-700 sm:flex-row sm:justify-between">
        <p className="text-center sm:text-left">
          Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement.
        </p>
        <button
          type="button"
          onClick={accept}
          className="h-10 shrink-0 rounded-xl bg-rzpanda-primary px-5 font-medium text-white transition-colors hover:bg-rzpanda-primary/90 active:bg-rzpanda-primary/80"
        >
          Compris
        </button>
      </div>
    </div>
  );
}
