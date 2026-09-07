-- CreateEnum
CREATE TYPE "AxeQualite" AS ENUM ('ACCUEIL_SECURITE', 'DEVELOPPEMENT_EVEIL', 'RELATION_FAMILLES', 'PILOTAGE_RISQUES');

-- CreateEnum
CREATE TYPE "StatutConformite" AS ENUM ('NON_EVALUE', 'A_AMELIORER', 'PARTIELLEMENT_CONFORME', 'CONFORME', 'EXEMPLAIRE');

-- CreateEnum
CREATE TYPE "PrioriteAction" AS ENUM ('BASSE', 'MOYENNE', 'HAUTE', 'URGENTE');

-- CreateEnum
CREATE TYPE "StatutAction" AS ENUM ('A_FAIRE', 'EN_COURS', 'TERMINE', 'REPORTE');

-- CreateTable
CREATE TABLE "CritereReferentiel" (
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
);

-- CreateTable
CREATE TABLE "EvaluationCritere" (
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
);

-- CreateTable
CREATE TABLE "ActionQualite" (
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
);

-- CreateIndex
CREATE UNIQUE INDEX "CritereReferentiel_code_key" ON "CritereReferentiel"("code");

-- CreateIndex
CREATE INDEX "CritereReferentiel_axe_idx" ON "CritereReferentiel"("axe");

-- CreateIndex
CREATE INDEX "CritereReferentiel_ordre_idx" ON "CritereReferentiel"("ordre");

-- CreateIndex
CREATE INDEX "EvaluationCritere_structure_id_periode_idx" ON "EvaluationCritere"("structure_id", "periode");

-- CreateIndex
CREATE INDEX "EvaluationCritere_critere_id_idx" ON "EvaluationCritere"("critere_id");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationCritere_structure_id_critere_id_periode_key" ON "EvaluationCritere"("structure_id", "critere_id", "periode");

-- CreateIndex
CREATE INDEX "ActionQualite_structure_id_idx" ON "ActionQualite"("structure_id");

-- CreateIndex
CREATE INDEX "ActionQualite_critere_id_idx" ON "ActionQualite"("critere_id");

-- CreateIndex
CREATE INDEX "ActionQualite_statut_idx" ON "ActionQualite"("statut");

-- AddForeignKey
ALTER TABLE "EvaluationCritere" ADD CONSTRAINT "EvaluationCritere_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationCritere" ADD CONSTRAINT "EvaluationCritere_critere_id_fkey" FOREIGN KEY ("critere_id") REFERENCES "CritereReferentiel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationCritere" ADD CONSTRAINT "EvaluationCritere_evalue_par_id_fkey" FOREIGN KEY ("evalue_par_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionQualite" ADD CONSTRAINT "ActionQualite_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionQualite" ADD CONSTRAINT "ActionQualite_critere_id_fkey" FOREIGN KEY ("critere_id") REFERENCES "CritereReferentiel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
