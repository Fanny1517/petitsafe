import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const SWEEP_EVERY = 1000;
let opsSinceSweep = 0;

function sweepExpired(now: number) {
  buckets.forEach((b, key) => {
    if (b.resetAt <= now) buckets.delete(key);
  });
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = h.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * Rate limiter en mémoire — fenêtre glissante simple.
 * En prod multi-instance, remplacer par Upstash/Redis. Suffisant pour
 * une seule instance Vercel (Fluid Compute réutilise les instances).
 */
export async function rateLimit(
  bucketName: string,
  opts: { max: number; windowMs: number; key?: string } = { max: 5, windowMs: 60_000 }
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const key = `${bucketName}:${opts.key ?? (await getClientIp())}`;
  const now = Date.now();

  if (++opsSinceSweep >= SWEEP_EVERY) {
    opsSinceSweep = 0;
    sweepExpired(now);
  }

  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true };
  }

  if (b.count >= opts.max) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }

  b.count += 1;
  return { ok: true };
}
