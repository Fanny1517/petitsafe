-- CreateEnum
CREATE TYPE "StatutPresence" AS ENUM ('ATTENDU', 'PRESENT', 'ABSENT', 'ABSENT_JUSTIFIE', 'CONGE');

-- CreateEnum
CREATE TYPE "TypeEnquete" AS ENUM ('ANNUELLE', 'INTEGRATION', 'FLASH', 'AUTRE');

-- CreateEnum
CREATE TYPE "TypeQuestionEnquete" AS ENUM ('NOTE_5', 'OUI_NON', 'TEXTE', 'CHOIX_UNIQUE');

-- CreateTable
CREATE TABLE "Presence" (
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
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InscriptionTemporaire" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_encrypted" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "nom_structure" TEXT NOT NULL,
    "type_structure" "StructureType" NOT NULL,
    "modules_actifs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InscriptionTemporaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnqueteSatisfaction" (
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
);

-- CreateTable
CREATE TABLE "QuestionEnquete" (
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
);

-- CreateTable
CREATE TABLE "ReponseEnquete" (
    "id" TEXT NOT NULL,
    "enquete_id" TEXT NOT NULL,
    "parent_nom" TEXT,
    "parent_email" TEXT,
    "date_soumission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReponseEnquete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValeurReponse" (
    "id" TEXT NOT NULL,
    "reponse_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "valeur_note" INTEGER,
    "valeur_booleen" BOOLEAN,
    "valeur_texte" TEXT,

    CONSTRAINT "ValeurReponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Presence_structure_id_date_idx" ON "Presence"("structure_id", "date");

-- CreateIndex
CREATE INDEX "Presence_enfant_id_date_idx" ON "Presence"("enfant_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Presence_structure_id_enfant_id_date_key" ON "Presence"("structure_id", "enfant_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "InscriptionTemporaire_email_key" ON "InscriptionTemporaire"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InscriptionTemporaire_token_key" ON "InscriptionTemporaire"("token");

-- CreateIndex
CREATE INDEX "InscriptionTemporaire_token_idx" ON "InscriptionTemporaire"("token");

-- CreateIndex
CREATE INDEX "InscriptionTemporaire_email_idx" ON "InscriptionTemporaire"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EnqueteSatisfaction_token_key" ON "EnqueteSatisfaction"("token");

-- CreateIndex
CREATE INDEX "EnqueteSatisfaction_structure_id_idx" ON "EnqueteSatisfaction"("structure_id");

-- CreateIndex
CREATE INDEX "EnqueteSatisfaction_token_idx" ON "EnqueteSatisfaction"("token");

-- CreateIndex
CREATE INDEX "QuestionEnquete_enquete_id_idx" ON "QuestionEnquete"("enquete_id");

-- CreateIndex
CREATE INDEX "QuestionEnquete_ordre_idx" ON "QuestionEnquete"("ordre");

-- CreateIndex
CREATE INDEX "ReponseEnquete_enquete_id_idx" ON "ReponseEnquete"("enquete_id");

-- CreateIndex
CREATE INDEX "ReponseEnquete_enquete_id_parent_email_idx" ON "ReponseEnquete"("enquete_id", "parent_email");

-- CreateIndex
CREATE INDEX "ValeurReponse_reponse_id_idx" ON "ValeurReponse"("reponse_id");

-- CreateIndex
CREATE INDEX "ValeurReponse_question_id_idx" ON "ValeurReponse"("question_id");

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_releve_par_id_fkey" FOREIGN KEY ("releve_par_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnqueteSatisfaction" ADD CONSTRAINT "EnqueteSatisfaction_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionEnquete" ADD CONSTRAINT "QuestionEnquete_enquete_id_fkey" FOREIGN KEY ("enquete_id") REFERENCES "EnqueteSatisfaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReponseEnquete" ADD CONSTRAINT "ReponseEnquete_enquete_id_fkey" FOREIGN KEY ("enquete_id") REFERENCES "EnqueteSatisfaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValeurReponse" ADD CONSTRAINT "ValeurReponse_reponse_id_fkey" FOREIGN KEY ("reponse_id") REFERENCES "ReponseEnquete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValeurReponse" ADD CONSTRAINT "ValeurReponse_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "QuestionEnquete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
