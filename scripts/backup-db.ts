/**
 * Backup complet de la base de données Supabase au format JSON.
 *
 * Usage : npm run backup
 *
 * Sortie : backups/backup-YYYY-MM-DD.json
 *
 * Le fichier contient un objet { meta, data } où `data` est un dictionnaire
 * { nomModele: [...rows] } pour chaque table Prisma.
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

// Ordre topologique : parents d'abord, enfants ensuite.
// Cet ordre est utilisé tel quel lors du restore pour respecter les FK.
const MODELS = [
  "structure",
  "userStructure",
  "profil",
  "enfant",
  "allergieEnfant",
  "contactUrgence",
  "equipement",
  "zoneNettoyage",
  "tacheNettoyage",
  "stock",
  "mouvementStock",
  "protocole",
  "exportPDF",
  "boiteLait",
  "laitMaternel",
  "biberon",
  "repas",
  "change",
  "sieste",
  "incident",
  "releveTemperature",
  "relevePlat",
  "receptionMarchandise",
  "validationNettoyage",
  "transmission",
  "administrationMedicament",
  "pAI",
  "demandeDemo",
  "auditLog",
] as const;

async function main() {
  const start = Date.now();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const backupDir = join(process.cwd(), "backups");
  mkdirSync(backupDir, { recursive: true });

  const data: Record<string, unknown[]> = {};
  let totalRows = 0;

  for (const model of MODELS) {
    const client = (prisma as unknown as Record<string, { findMany: () => Promise<unknown[]> }>)[model];
    if (!client) {
      console.warn(`⚠ Modèle inconnu : ${model} (ignoré)`);
      continue;
    }
    const rows = await client.findMany();
    data[model] = rows;
    totalRows += rows.length;
    console.log(`  ✓ ${model.padEnd(28)} ${rows.length} ligne(s)`);
  }

  const payload = {
    meta: {
      version: 1,
      created_at: new Date().toISOString(),
      total_rows: totalRows,
      models: MODELS,
    },
    data,
  };

  const filePath = join(backupDir, `backup-${today}.json`);
  writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");

  const sizeMB = (Buffer.byteLength(JSON.stringify(payload)) / 1024 / 1024).toFixed(2);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✓ Backup terminé en ${elapsed}s — ${totalRows} lignes — ${sizeMB} MB`);
  console.log(`  → ${filePath}`);
}

main()
  .catch((err) => {
    console.error("✗ Échec du backup :", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
