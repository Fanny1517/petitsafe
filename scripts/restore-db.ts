/**
 * Restauration d'un backup JSON dans la base de données.
 *
 * Usage : tsx scripts/restore-db.ts backups/backup-2026-04-27.json
 *
 * ⚠ Cette opération INSÈRE les lignes du backup. Si une ligne existe déjà
 *   (même id), elle est mise à jour via upsert.
 *
 * L'ordre d'insertion respecte les contraintes de clé étrangère (parents
 * avant enfants) — ne pas le modifier sans réfléchir aux dépendances.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

// Ordre identique à backup-db.ts : parents d'abord, enfants ensuite.
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

// Champs ISO date à reconvertir en objets Date avant insertion (Prisma exige Date pour DateTime).
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

function reviveDates<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") {
    return (ISO_DATE_REGEX.test(obj) ? new Date(obj) : obj) as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((v) => reviveDates(v)) as T;
  }
  if (typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[k] = reviveDates(v);
    }
    return out as T;
  }
  return obj;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage : tsx scripts/restore-db.ts <fichier-backup.json>");
    process.exit(1);
  }

  const filePath = resolve(file);
  console.log(`Lecture du backup : ${filePath}`);
  const raw = readFileSync(filePath, "utf8");
  const payload = JSON.parse(raw) as {
    meta?: { created_at?: string; total_rows?: number };
    data: Record<string, Record<string, unknown>[]>;
  };

  if (!payload?.data) {
    console.error("✗ Format invalide : champ `data` manquant.");
    process.exit(1);
  }

  console.log(`Backup créé le : ${payload.meta?.created_at ?? "?"}`);
  console.log(`Lignes attendues : ${payload.meta?.total_rows ?? "?"}\n`);

  let totalRestored = 0;
  for (const model of MODELS) {
    const rows = payload.data[model] ?? [];
    if (rows.length === 0) {
      console.log(`  – ${model.padEnd(28)} 0 ligne (rien à restaurer)`);
      continue;
    }
    const client = (prisma as unknown as Record<
      string,
      { upsert: (args: { where: { id: string }; create: unknown; update: unknown }) => Promise<unknown> }
    >)[model];
    if (!client) {
      console.warn(`⚠ Modèle inconnu : ${model} (${rows.length} ligne(s) ignorée(s))`);
      continue;
    }

    let restored = 0;
    for (const row of rows) {
      const data = reviveDates(row) as Record<string, unknown> & { id: string };
      try {
        await client.upsert({
          where: { id: data.id },
          create: data,
          update: data,
        });
        restored += 1;
      } catch (err) {
        console.error(`✗ Échec sur ${model} id=${data.id} :`, (err as Error).message);
      }
    }
    totalRestored += restored;
    console.log(`  ✓ ${model.padEnd(28)} ${restored}/${rows.length} ligne(s)`);
  }

  console.log(`\n✓ Restauration terminée — ${totalRestored} ligne(s) restaurée(s).`);
}

main()
  .catch((err) => {
    console.error("✗ Échec de la restauration :", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
