import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createHash, randomUUID } from "crypto";

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

async function executeSql(description: string, sql: string) {
  try {
    await prisma.$executeRawUnsafe(sql);
    console.log(`  ✓ ${description}`);
  } catch (err: unknown) {
    console.error(`  ✗ Erreur sur : ${description}`);
    throw err;
  }
}

async function ensureEnum(name: string, values: string[]) {
  const sql = `
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${name}') THEN
        CREATE TYPE "${name}" AS ENUM (${values.map((v) => `'${v}'`).join(", ")});
      END IF;
    END $$;
  `;
  await executeSql(`Enum : ${name}`, sql);
}

async function ensureConstraint(table: string, constraintName: string, constraintDef: string) {
  const sql = `
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '${constraintName}'
      ) THEN
        ALTER TABLE "${table}" ADD CONSTRAINT "${constraintName}" ${constraintDef};
      END IF;
    END $$;
  `;
  await executeSql(`Contrainte : ${constraintName}`, sql);
}

async function main() {
  console.log("=== Début de la mise à niveau sécurisée de Supabase ===");

  // 1. Vérification préalable de la table Presence et de ses données existantes
  const presenceCheck = await prisma.$queryRawUnsafe<Array<{ count: string | number }>>(`
    SELECT count(*) as count FROM "Presence";
  `).catch(() => [{ count: 0 }]);
  const countBefore = Number(presenceCheck[0]?.count ?? 0);
  console.log(`\nContrôle préalable : ${countBefore} enregistrement(s) trouvé(s) dans la table Presence.`);

  // 2. Création des Enums manquants
  console.log("\n--- Phase 1 : Enums PostgreSQL ---");
  await ensureEnum("AxeQualite", ["ACCUEIL_SECURITE", "DEVELOPPEMENT_EVEIL", "RELATION_FAMILLES", "PILOTAGE_RISQUES"]);
  await ensureEnum("StatutConformite", ["NON_EVALUE", "A_AMELIORER", "PARTIELLEMENT_CONFORME", "CONFORME", "EXEMPLAIRE"]);
  await ensureEnum("PrioriteAction", ["BASSE", "MOYENNE", "HAUTE", "URGENTE"]);
  await ensureEnum("StatutAction", ["A_FAIRE", "EN_COURS", "TERMINE", "REPORTE"]);
  await ensureEnum("StatutPresence", ["ATTENDU", "PRESENT", "ABSENT", "ABSENT_JUSTIFIE", "CONGE"]);
  await ensureEnum("TypeEnquete", ["ANNUELLE", "INTEGRATION", "FLASH", "AUTRE"]);
  await ensureEnum("TypeQuestionEnquete", ["NOTE_5", "OUI_NON", "TEXTE", "CHOIX_UNIQUE"]);

  // 3. Création des Tables manquantes (idempotentes)
  console.log("\n--- Phase 2 : Tables PostgreSQL ---");

  await executeSql(
    "Table : CritereReferentiel",
    `CREATE TABLE IF NOT EXISTS "CritereReferentiel" (
      "id" TEXT NOT NULL,
      "code" TEXT NOT NULL,
      "axe" "AxeQualite" NOT NULL,
      "titre" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "points_cles" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "guide_ministeriel" TEXT,
      "ordre" INTEGER NOT NULL DEFAULT 0,
      "poids" INTEGER NOT NULL DEFAULT 1,
      "preuves_suggerees" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "source_preuve_auto" TEXT,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "CritereReferentiel_pkey" PRIMARY KEY ("id")
    );`
  );

  await executeSql(
    "Table : EvaluationCritere",
    `CREATE TABLE IF NOT EXISTS "EvaluationCritere" (
      "id" TEXT NOT NULL,
      "structure_id" TEXT NOT NULL,
      "critere_id" TEXT NOT NULL,
      "periode" TEXT NOT NULL DEFAULT '2025',
      "statut" "StatutConformite" NOT NULL DEFAULT 'NON_EVALUE',
      "observations" TEXT,
      "pistes_amelioration" TEXT,
      "evalue_par_id" TEXT,
      "evalue_par_nom" TEXT,
      "derniere_eval" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "EvaluationCritere_pkey" PRIMARY KEY ("id")
    );`
  );

  await executeSql(
    "Table : ActionQualite",
    `CREATE TABLE IF NOT EXISTS "ActionQualite" (
      "id" TEXT NOT NULL,
      "structure_id" TEXT NOT NULL,
      "critere_id" TEXT,
      "titre" TEXT NOT NULL,
      "description" TEXT,
      "responsable" TEXT,
      "echeance" TIMESTAMP(3),
      "priorite" "PrioriteAction" NOT NULL DEFAULT 'MOYENNE',
      "statut" "StatutAction" NOT NULL DEFAULT 'A_FAIRE',
      "resultat_attendu" TEXT,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "ActionQualite_pkey" PRIMARY KEY ("id")
    );`
  );

  await executeSql(
    "Table : EnqueteSatisfaction",
    `CREATE TABLE IF NOT EXISTS "EnqueteSatisfaction" (
      "id" TEXT NOT NULL,
      "structure_id" TEXT NOT NULL,
      "titre" TEXT NOT NULL,
      "description" TEXT,
      "type_enquete" "TypeEnquete" NOT NULL DEFAULT 'ANNUELLE',
      "public_cible" TEXT DEFAULT 'Parents',
      "cible_reponses" INTEGER DEFAULT 20,
      "date_debut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "date_fin" TIMESTAMP(3),
      "actif" BOOLEAN NOT NULL DEFAULT true,
      "anonyme" BOOLEAN NOT NULL DEFAULT true,
      "token" TEXT NOT NULL,
      "emails_notification" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "EnqueteSatisfaction_pkey" PRIMARY KEY ("id")
    );`
  );

  await executeSql(
    "Table : QuestionEnquete",
    `CREATE TABLE IF NOT EXISTS "QuestionEnquete" (
      "id" TEXT NOT NULL,
      "enquete_id" TEXT NOT NULL,
      "type_question" "TypeQuestionEnquete" NOT NULL DEFAULT 'NOTE_5',
      "axe_qualite" "AxeQualite",
      "libelle" TEXT NOT NULL,
      "description" TEXT,
      "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
      "obligatoire" BOOLEAN NOT NULL DEFAULT true,
      "ordre" INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT "QuestionEnquete_pkey" PRIMARY KEY ("id")
    );`
  );

  await executeSql(
    "Table : ReponseEnquete",
    `CREATE TABLE IF NOT EXISTS "ReponseEnquete" (
      "id" TEXT NOT NULL,
      "enquete_id" TEXT NOT NULL,
      "parent_nom" TEXT,
      "parent_email" TEXT,
      "date_soumission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ReponseEnquete_pkey" PRIMARY KEY ("id")
    );`
  );

  await executeSql(
    "Table : ValeurReponse",
    `CREATE TABLE IF NOT EXISTS "ValeurReponse" (
      "id" TEXT NOT NULL,
      "reponse_id" TEXT NOT NULL,
      "question_id" TEXT NOT NULL,
      "valeur_note" INTEGER,
      "valeur_booleen" BOOLEAN,
      "valeur_texte" TEXT,
      CONSTRAINT "ValeurReponse_pkey" PRIMARY KEY ("id")
    );`
  );

  // 4. Index
  console.log("\n--- Phase 3 : Index ---");
  await executeSql("Index : CritereReferentiel_code_key", `CREATE UNIQUE INDEX IF NOT EXISTS "CritereReferentiel_code_key" ON "CritereReferentiel"("code");`);
  await executeSql("Index : CritereReferentiel_axe_idx", `CREATE INDEX IF NOT EXISTS "CritereReferentiel_axe_idx" ON "CritereReferentiel"("axe");`);
  await executeSql("Index : CritereReferentiel_ordre_idx", `CREATE INDEX IF NOT EXISTS "CritereReferentiel_ordre_idx" ON "CritereReferentiel"("ordre");`);
  await executeSql("Index : EvaluationCritere_structure_id_periode_idx", `CREATE INDEX IF NOT EXISTS "EvaluationCritere_structure_id_periode_idx" ON "EvaluationCritere"("structure_id", "periode");`);
  await executeSql("Index : EvaluationCritere_critere_id_idx", `CREATE INDEX IF NOT EXISTS "EvaluationCritere_critere_id_idx" ON "EvaluationCritere"("critere_id");`);
  await executeSql("Index : EvaluationCritere_unique", `CREATE UNIQUE INDEX IF NOT EXISTS "EvaluationCritere_structure_id_critere_id_periode_key" ON "EvaluationCritere"("structure_id", "critere_id", "periode");`);
  await executeSql("Index : ActionQualite_structure_id_idx", `CREATE INDEX IF NOT EXISTS "ActionQualite_structure_id_idx" ON "ActionQualite"("structure_id");`);
  await executeSql("Index : ActionQualite_critere_id_idx", `CREATE INDEX IF NOT EXISTS "ActionQualite_critere_id_idx" ON "ActionQualite"("critere_id");`);
  await executeSql("Index : ActionQualite_statut_idx", `CREATE INDEX IF NOT EXISTS "ActionQualite_statut_idx" ON "ActionQualite"("statut");`);

  await executeSql("Index : Presence_structure_id_date_idx", `CREATE INDEX IF NOT EXISTS "Presence_structure_id_date_idx" ON "Presence"("structure_id", "date");`);
  await executeSql("Index : Presence_enfant_id_date_idx", `CREATE INDEX IF NOT EXISTS "Presence_enfant_id_date_idx" ON "Presence"("enfant_id", "date");`);
  await executeSql("Index : Presence_unique", `CREATE UNIQUE INDEX IF NOT EXISTS "Presence_structure_id_enfant_id_date_key" ON "Presence"("structure_id", "enfant_id", "date");`);

  await executeSql("Index : InscriptionTemporaire_email_key", `CREATE UNIQUE INDEX IF NOT EXISTS "InscriptionTemporaire_email_key" ON "InscriptionTemporaire"("email");`);
  await executeSql("Index : InscriptionTemporaire_token_key", `CREATE UNIQUE INDEX IF NOT EXISTS "InscriptionTemporaire_token_key" ON "InscriptionTemporaire"("token");`);
  await executeSql("Index : InscriptionTemporaire_token_idx", `CREATE INDEX IF NOT EXISTS "InscriptionTemporaire_token_idx" ON "InscriptionTemporaire"("token");`);
  await executeSql("Index : InscriptionTemporaire_email_idx", `CREATE INDEX IF NOT EXISTS "InscriptionTemporaire_email_idx" ON "InscriptionTemporaire"("email");`);

  await executeSql("Index : EnqueteSatisfaction_token_key", `CREATE UNIQUE INDEX IF NOT EXISTS "EnqueteSatisfaction_token_key" ON "EnqueteSatisfaction"("token");`);
  await executeSql("Index : EnqueteSatisfaction_structure_id_idx", `CREATE INDEX IF NOT EXISTS "EnqueteSatisfaction_structure_id_idx" ON "EnqueteSatisfaction"("structure_id");`);
  await executeSql("Index : EnqueteSatisfaction_token_idx", `CREATE INDEX IF NOT EXISTS "EnqueteSatisfaction_token_idx" ON "EnqueteSatisfaction"("token");`);
  await executeSql("Index : QuestionEnquete_enquete_id_idx", `CREATE INDEX IF NOT EXISTS "QuestionEnquete_enquete_id_idx" ON "QuestionEnquete"("enquete_id");`);
  await executeSql("Index : QuestionEnquete_ordre_idx", `CREATE INDEX IF NOT EXISTS "QuestionEnquete_ordre_idx" ON "QuestionEnquete"("ordre");`);
  await executeSql("Index : ReponseEnquete_enquete_id_idx", `CREATE INDEX IF NOT EXISTS "ReponseEnquete_enquete_id_idx" ON "ReponseEnquete"("enquete_id");`);
  await executeSql("Index : ReponseEnquete_email_idx", `CREATE INDEX IF NOT EXISTS "ReponseEnquete_enquete_id_parent_email_idx" ON "ReponseEnquete"("enquete_id", "parent_email");`);
  await executeSql("Index : ValeurReponse_reponse_id_idx", `CREATE INDEX IF NOT EXISTS "ValeurReponse_reponse_id_idx" ON "ValeurReponse"("reponse_id");`);
  await executeSql("Index : ValeurReponse_question_id_idx", `CREATE INDEX IF NOT EXISTS "ValeurReponse_question_id_idx" ON "ValeurReponse"("question_id");`);

  // 5. Contraintes de clés étrangères
  console.log("\n--- Phase 4 : Contraintes de clés étrangères ---");
  await ensureConstraint("EvaluationCritere", "EvaluationCritere_structure_id_fkey", `FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  await ensureConstraint("EvaluationCritere", "EvaluationCritere_critere_id_fkey", `FOREIGN KEY ("critere_id") REFERENCES "CritereReferentiel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  await ensureConstraint("EvaluationCritere", "EvaluationCritere_evalue_par_id_fkey", `FOREIGN KEY ("evalue_par_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
  await ensureConstraint("ActionQualite", "ActionQualite_structure_id_fkey", `FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  await ensureConstraint("ActionQualite", "ActionQualite_critere_id_fkey", `FOREIGN KEY ("critere_id") REFERENCES "CritereReferentiel"("id") ON DELETE SET NULL ON UPDATE CASCADE`);

  await ensureConstraint("Presence", "Presence_structure_id_fkey", `FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  await ensureConstraint("Presence", "Presence_enfant_id_fkey", `FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  await ensureConstraint("Presence", "Presence_releve_par_id_fkey", `FOREIGN KEY ("releve_par_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE`);

  await ensureConstraint("EnqueteSatisfaction", "EnqueteSatisfaction_structure_id_fkey", `FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  await ensureConstraint("QuestionEnquete", "QuestionEnquete_enquete_id_fkey", `FOREIGN KEY ("enquete_id") REFERENCES "EnqueteSatisfaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  await ensureConstraint("ReponseEnquete", "ReponseEnquete_enquete_id_fkey", `FOREIGN KEY ("enquete_id") REFERENCES "EnqueteSatisfaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  await ensureConstraint("ValeurReponse", "ValeurReponse_reponse_id_fkey", `FOREIGN KEY ("reponse_id") REFERENCES "ReponseEnquete"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  await ensureConstraint("ValeurReponse", "ValeurReponse_question_id_fkey", `FOREIGN KEY ("question_id") REFERENCES "QuestionEnquete"("id") ON DELETE CASCADE ON UPDATE CASCADE`);

  // 6. Enregistrement dans _prisma_migrations
  console.log("\n--- Phase 5 : Enregistrement des migrations dans _prisma_migrations ---");
  const migrationsToRecord = [
    {
      dir: "20260907043100_add_referentiel_qualite",
      file: join(process.cwd(), "prisma", "migrations", "20260907043100_add_referentiel_qualite", "migration.sql"),
    },
    {
      dir: "20260922124500_add_enquetes_presences_inscriptions",
      file: join(process.cwd(), "prisma", "migrations", "20260922124500_add_enquetes_presences_inscriptions", "migration.sql"),
    },
  ];

  for (const m of migrationsToRecord) {
    const existing = await prisma.$queryRawUnsafe<Array<{ id: string }>>(`
      SELECT id FROM "_prisma_migrations" WHERE migration_name = '${m.dir}';
    `);
    if (existing.length > 0) {
      console.log(`  ✓ Migration déjà enregistrée : ${m.dir}`);
      continue;
    }

    const sqlContent = readFileSync(m.file, "utf8");
    const checksum = createHash("sha256").update(sqlContent).digest("hex");
    const id = randomUUID();

    await prisma.$executeRawUnsafe(`
      INSERT INTO "_prisma_migrations" (
        "id",
        "checksum",
        "finished_at",
        "migration_name",
        "logs",
        "rolled_back_at",
        "started_at",
        "applied_steps_count"
      ) VALUES (
        '${id}',
        '${checksum}',
        NOW(),
        '${m.dir}',
        NULL,
        NULL,
        NOW(),
        1
      );
    `);
    console.log(`  ✓ Migration inscrite avec succès : ${m.dir}`);
  }

  // 7. Initialisation des critères qualité (20 critères)
  console.log("\n--- Phase 6 : Amorçage du Référentiel Qualité (20 critères) ---");
  const jsonPath = join(process.cwd(), "prisma", "seeds", "referentiel_qualite_2025.json");
  if (existsSync(jsonPath)) {
    const criteres = JSON.parse(readFileSync(jsonPath, "utf8"));
    let inserted = 0;
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
      inserted++;
    }
    console.log(`  ✓ ${inserted} critères qualité vérifiés et initialisés sur Supabase.`);
  }

  // 8. Vérification finale
  console.log("\n--- Phase 7 : Vérification finale ---");
  const presenceAfter = await prisma.$queryRawUnsafe<Array<{ count: string | number }>>(`
    SELECT count(*) as count FROM "Presence";
  `);
  const countAfter = Number(presenceAfter[0]?.count ?? 0);
  console.log(`  ✓ Lignes dans la table Presence : ${countAfter} (initialement : ${countBefore})`);
  if (countAfter !== countBefore) {
    throw new Error(`Incohérence détectée sur la table Presence : ${countBefore} -> ${countAfter}`);
  }

  const criteresCount = await prisma.critereReferentiel.count();
  console.log(`  ✓ Lignes dans CritereReferentiel : ${criteresCount}`);

  const totalMigrations = await prisma.$queryRawUnsafe<Array<{ count: string | number }>>(`
    SELECT count(*) as count FROM "_prisma_migrations" WHERE finished_at IS NOT NULL;
  `);
  console.log(`  ✓ Total des migrations appliquées sur Supabase : ${Number(totalMigrations[0]?.count ?? 0)} / 13`);

  console.log("\n✓ Mise à niveau sécurisée de la base de production Supabase terminée avec succès !");
}

main()
  .catch((err) => {
    console.error("✗ Erreur lors de la mise à niveau :", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
