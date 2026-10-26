"use client";

import * as CookieConsent from "vanilla-cookieconsent";

interface CookiePreferencesButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function CookiePreferencesButton({
  className = "hover:text-rzpanda-primary hover:underline cursor-pointer",
  children = "Gérer mes cookies",
}: CookiePreferencesButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          CookieConsent.showPreferences();
        } catch {
          // Si le module n'est pas encore pret
        }
      }}
      className={className}
      aria-label="Ouvrir le panneau de gestion des préférences de cookies"
    >
      {children}
    </button>
  );
}
