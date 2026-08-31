import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Route Cron pour la purge automatique des inscriptions temporaires non validées et expirées (> 24h).
 * Compatible Vercel Cron, pg_cron ou appel HTTP sécurisé par Bearer token.
 */
export async function GET(request: NextRequest) {
  return handleCleanup(request);
}

export async function POST(request: NextRequest) {
  return handleCleanup(request);
}

async function handleCleanup(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const keyParam = searchParams.get("key");

    // 1. Vérification de la sécurité si CRON_SECRET est défini
    if (cronSecret) {
      const isValidBearer = authHeader === `Bearer ${cronSecret}`;
      const isValidKey = keyParam === cronSecret;

      if (!isValidBearer && !isValidKey) {
        return NextResponse.json(
          { success: false, error: "Non autorisé. Jeton CRON_SECRET manquant ou invalide." },
          { status: 401 }
        );
      }
    } else if (process.env.NODE_ENV === "production") {
      console.warn("[Cron Cleanup] Attention : CRON_SECRET n'est pas configuré en production.");
    }

    const now = new Date();

    // 2. Suppression des inscriptions expirées
    const result = await prisma.inscriptionTemporaire.deleteMany({
      where: {
        expires_at: {
          lt: now,
        },
      },
    });

    console.info(`[Cron Cleanup] ${result.count} inscription(s) temporaire(s) expirée(s) supprimée(s) à ${now.toISOString()}`);

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      executedAt: now.toISOString(),
      message: `${result.count} inscription(s) expirée(s) purgée(s) avec succès.`,
    });
  } catch (error) {
    console.error("[Cron Cleanup] Erreur lors de la purge des inscriptions :", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne lors de la purge des inscriptions.",
      },
      { status: 500 }
    );
  }
}
