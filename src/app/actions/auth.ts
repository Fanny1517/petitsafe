"use server";

import { rateLimit } from "@/lib/security/rate-limit";

/**
 * Vérifie côté serveur que l'IP appelante n'a pas dépassé 5 tentatives/min
 * sur le formulaire de login. Le login Supabase lui-même s'effectue
 * côté client (signInWithPassword) ; cette action sert de garde-fou IP en amont.
 */
export async function checkLoginRateLimit() {
  const rl = await rateLimit("login", { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return {
      ok: false as const,
      error: `Trop de tentatives. Réessayez dans ${rl.retryAfterSec}s.`,
    };
  }
  return { ok: true as const };
}
