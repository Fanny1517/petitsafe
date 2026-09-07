// RZPan'Da — Script d'amorçage du Référentiel Qualité 2025
// Importe et met à jour de façon idempotente les 20 critères nationaux

import { PrismaClient, AxeQualite } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface CritereJson {
  code: string;
  axe: AxeQualite;
  titre: string;
  description: string;
  points_cles: string[];
  guide_ministeriel?: string | null;
  ordre: number;
  poids: number;
  preuves_suggerees: string[];
  source_preuve_auto?: string | null;
}

async function main() {
  console.log("🌱 Début de l'initialisation du Référentiel Qualité 2025...");

  const jsonPath = path.join(__dirname, "..", "prisma", "seeds", "referentiel_qualite_2025.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Fichier introuvable : ${jsonPath}`);
  }

  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const criteres: CritereJson[] = JSON.parse(rawData);

  console.log(`📋 Chargement de ${criteres.length} critères...`);

  for (const c of criteres) {
    await prisma.critereReferentiel.upsert({
      where: { code: c.code },
      update: {
        axe: c.axe,
        titre: c.titre,
        description: c.description,
        points_cles: c.points_cles,
        guide_ministeriel: c.guide_ministeriel ?? null,
        ordre: c.ordre,
        poids: c.poids,
        preuves_suggerees: c.preuves_suggerees,
        source_preuve_auto: c.source_preuve_auto ?? null,
      },
      create: {
        code: c.code,
        axe: c.axe,
        titre: c.titre,
        description: c.description,
        points_cles: c.points_cles,
        guide_ministeriel: c.guide_ministeriel ?? null,
        ordre: c.ordre,
        poids: c.poids,
        preuves_suggerees: c.preuves_suggerees,
        source_preuve_auto: c.source_preuve_auto ?? null,
      },
    });
  }

  console.log(`✅ Les ${criteres.length} critères du référentiel qualité ont été enregistrés avec succès.`);

  // Vérifions les structures existantes
  const structures = await prisma.structure.findMany({ select: { id: true, nom: true } });
  console.log(`🏢 ${structures.length} structure(s) trouvée(s).`);

  for (const s of structures) {
    const existingEvals = await prisma.evaluationCritere.count({
      where: { structure_id: s.id, periode: "2025" }
    });
    console.log(`   - Structure "${s.nom}" (${s.id}) : ${existingEvals} évaluation(s) 2025 existante(s).`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed qualité :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
