import { prisma } from "../src/lib/supabase/prisma";

async function main() {
  console.log("Migration Présences démarrée...");
  try {
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        CREATE TYPE "StatutPresence" AS ENUM ('ATTENDU', 'PRESENT', 'ABSENT', 'ABSENT_JUSTIFIE', 'CONGE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log("✓ Enum StatutPresence créé ou existant");

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Presence" (
        "id" TEXT NOT NULL,
        "structure_id" TEXT NOT NULL,
        "enfant_id" TEXT NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "statut" "StatutPresence" NOT NULL DEFAULT 'ATTENDU',
        "est_present" BOOLEAN NOT NULL DEFAULT false,
        "heure_arrivee" TIMESTAMP(3),
        "heure_depart" TIMESTAMP(3),
        "motif_absence" TEXT,
        "certificat_fourni" BOOLEAN NOT NULL DEFAULT false,
        "observations" TEXT,
        "releve_par_id" TEXT,
        "releve_par_nom" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Presence_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Presence_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Presence_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Presence_releve_par_id_fkey" FOREIGN KEY ("releve_par_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);
    console.log("✓ Table Presence créée ou existante");

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Presence_structure_id_enfant_id_date_key" ON "Presence"("structure_id", "enfant_id", "date");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Presence_structure_id_date_idx" ON "Presence"("structure_id", "date");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Presence_enfant_id_date_idx" ON "Presence"("enfant_id", "date");
    `);
    console.log("✓ Index créés avec succès");

    console.log("Migration terminée avec succès !");
  } catch (e) {
    console.error("Erreur lors de la migration:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
