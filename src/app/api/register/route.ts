import { prisma } from "@/lib/supabase/prisma";
import { rateLimit } from "@/lib/security/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  userId: z.string().uuid(),
  typeStructure: z.enum(["CRECHE", "MICRO_CRECHE", "MAM", "ASS_MAT"]),
  nomStructure: z.string().min(2).max(120).trim(),
  modulesActifs: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const rl = await rateLimit("register", { max: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${rl.retryAfterSec}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides." }, { status: 400 });
    }
    const { userId, typeStructure, nomStructure, modulesActifs } = parsed.data;

    const structure = await prisma.structure.create({
      data: {
        nom: nomStructure,
        type: typeStructure,
        modules_actifs:
          modulesActifs ?? [
            "temperatures",
            "tracabilite",
            "nettoyage",
            "biberonnerie",
            "repas",
            "changes",
            "siestes",
            "transmissions",
            "stocks",
            "protocoles",
          ],
      },
    });
    await prisma.userStructure.create({
      data: { user_id: userId, structure_id: structure.id, role: "GESTIONNAIRE" },
    });
    return NextResponse.json({ success: true, structureId: structure.id });
  } catch (error) {
    console.error("Erreur inscription:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la structure." }, { status: 500 });
  }
}
