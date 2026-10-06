import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { readFileSync, existsSync } from "fs";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL_PRODUCTION) {
    return process.env.DATABASE_URL_PRODUCTION;
  }
  const envPath = join(process.cwd(), ".env");
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("DATABASE_URL_PRODUCTION=")) {
        return trimmed.slice("DATABASE_URL_PRODUCTION=".length).replace(/^["']|["']$/g, "");
      }
    }
  }
  return "postgresql://postgres.lmclmnomqaxevkjkxpqn:X13racd7hgrDp7To@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
}

const url = getDatabaseUrl();

const prisma = new PrismaClient({
  datasources: {
    db: { url },
  },
});

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
  "presence",
  "inscriptionTemporaire",
  "critereReferentiel",
  "evaluationCritere",
  "actionQualite",
  "enqueteSatisfaction",
  "questionEnquete",
  "reponseEnquete",
  "valeurReponse",
  "demandeDemo",
  "auditLog",
] as const;

async function main() {
  console.log("=== Début de la sauvegarde de la base de production Supabase ===");
  const start = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const backupDir = join(process.cwd(), "backups");
  mkdirSync(backupDir, { recursive: true });

  const data: Record<string, unknown[]> = {};
  let totalRows = 0;

  for (const model of MODELS) {
    const client = (prisma as unknown as Record<string, { findMany: () => Promise<unknown[]> }>)[model];
    if (!client) {
      console.warn(`  [ignoré] Modèle non présent dans le client Prisma : ${model}`);
      continue;
    }

    try {
      const rows = await client.findMany();
      data[model] = rows;
      totalRows += rows.length;
      console.log(`  ✓ ${model.padEnd(28)} ${rows.length} ligne(s)`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("does not exist")) {
        console.log(`  - ${model.padEnd(28)} table non présente sur Supabase (sera créée lors de la migration)`);
        data[model] = [];
      } else {
        throw err;
      }
    }
  }

  const payload = {
    meta: {
      version: 1,
      target: "production-supabase",
      created_at: new Date().toISOString(),
      total_rows: totalRows,
      models: MODELS,
    },
    data,
  };

  const specificFile = join(backupDir, "backup-prod-pre-migration.json");
  const datedFile = join(backupDir, `backup-prod-${today}.json`);

  writeFileSync(specificFile, JSON.stringify(payload, null, 2), "utf8");
  writeFileSync(datedFile, JSON.stringify(payload, null, 2), "utf8");

  const sizeMB = (Buffer.byteLength(JSON.stringify(payload)) / 1024 / 1024).toFixed(2);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`\n✓ Sauvegarde réussie en ${elapsed}s : ${totalRows} lignes réelles sauvegardées (${sizeMB} MB)`);
  console.log(`  → ${specificFile}`);
  console.log(`  → ${datedFile}`);
}

main()
  .catch((err) => {
    console.error("✗ Erreur lors de la sauvegarde Supabase :", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
