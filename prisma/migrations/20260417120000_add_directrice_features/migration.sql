-- CreateEnum
CREATE TYPE "TypeBoiteLait" AS ENUM ('POUDRE', 'LIQUIDE');

-- CreateEnum
CREATE TYPE "VoieAdministration" AS ENUM ('ORALE', 'CUTANEE', 'NASALE', 'OCULAIRE', 'AURICULAIRE', 'RECTALE', 'INHALEE', 'AUTRE');

-- CreateEnum
CREATE TYPE "StatutLaitMaternel" AS ENUM ('DISPONIBLE', 'UTILISE', 'JETE', 'PERIME');

-- AlterTable
ALTER TABLE "Biberon" ADD COLUMN     "boite_lait_id" TEXT,
ADD COLUMN     "lait_maternel_id" TEXT;

-- CreateTable
CREATE TABLE "BoiteLait" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "type" "TypeBoiteLait" NOT NULL DEFAULT 'POUDRE',
    "numero_lot" TEXT NOT NULL,
    "dlc" TIMESTAMP(3) NOT NULL,
    "date_ouverture" TIMESTAMP(3),
    "notes" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoiteLait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaitMaternel" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "date_recueil" TIMESTAMP(3) NOT NULL,
    "congele" BOOLEAN NOT NULL DEFAULT false,
    "date_decongelation" TIMESTAMP(3),
    "quantite_ml" INTEGER NOT NULL,
    "quantite_restante_ml" INTEGER,
    "dlc" TIMESTAMP(3) NOT NULL,
    "statut" "StatutLaitMaternel" NOT NULL DEFAULT 'DISPONIBLE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaitMaternel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdministrationMedicament" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "nom_medicament" TEXT NOT NULL,
    "posologie" TEXT NOT NULL,
    "voie" "VoieAdministration" NOT NULL DEFAULT 'ORALE',
    "date_administration" TIMESTAMP(3) NOT NULL,
    "ordonnance_fournie" BOOLEAN NOT NULL DEFAULT false,
    "observations" TEXT,
    "signe" BOOLEAN NOT NULL DEFAULT false,
    "signe_par_id" TEXT,
    "signe_par_nom" TEXT,
    "signe_le" TIMESTAMP(3),
    "temoin_id" TEXT,
    "temoin_nom" TEXT,
    "temoin_signe_le" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdministrationMedicament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PAI" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "allergenes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "medicaments_autorises" TEXT,
    "protocole_urgence" TEXT,
    "medecin_nom" TEXT,
    "medecin_telephone" TEXT,
    "numero_urgence" TEXT,
    "document_url" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_revision" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "PAI_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BoiteLait_structure_id_idx" ON "BoiteLait"("structure_id");

-- CreateIndex
CREATE INDEX "BoiteLait_structure_id_actif_idx" ON "BoiteLait"("structure_id", "actif");

-- CreateIndex
CREATE INDEX "LaitMaternel_structure_id_idx" ON "LaitMaternel"("structure_id");

-- CreateIndex
CREATE INDEX "LaitMaternel_structure_id_statut_idx" ON "LaitMaternel"("structure_id", "statut");

-- CreateIndex
CREATE INDEX "LaitMaternel_enfant_id_statut_idx" ON "LaitMaternel"("enfant_id", "statut");

-- CreateIndex
CREATE INDEX "LaitMaternel_structure_id_dlc_idx" ON "LaitMaternel"("structure_id", "dlc");

-- CreateIndex
CREATE INDEX "AdministrationMedicament_structure_id_date_administration_idx" ON "AdministrationMedicament"("structure_id", "date_administration");

-- CreateIndex
CREATE INDEX "AdministrationMedicament_enfant_id_date_administration_idx" ON "AdministrationMedicament"("enfant_id", "date_administration");

-- CreateIndex
CREATE UNIQUE INDEX "PAI_enfant_id_key" ON "PAI"("enfant_id");

-- CreateIndex
CREATE INDEX "PAI_structure_id_idx" ON "PAI"("structure_id");

-- CreateIndex
CREATE INDEX "Biberon_boite_lait_id_idx" ON "Biberon"("boite_lait_id");

-- CreateIndex
CREATE INDEX "Biberon_lait_maternel_id_idx" ON "Biberon"("lait_maternel_id");

-- AddForeignKey
ALTER TABLE "Biberon" ADD CONSTRAINT "Biberon_boite_lait_id_fkey" FOREIGN KEY ("boite_lait_id") REFERENCES "BoiteLait"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biberon" ADD CONSTRAINT "Biberon_lait_maternel_id_fkey" FOREIGN KEY ("lait_maternel_id") REFERENCES "LaitMaternel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoiteLait" ADD CONSTRAINT "BoiteLait_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaitMaternel" ADD CONSTRAINT "LaitMaternel_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaitMaternel" ADD CONSTRAINT "LaitMaternel_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrationMedicament" ADD CONSTRAINT "AdministrationMedicament_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrationMedicament" ADD CONSTRAINT "AdministrationMedicament_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrationMedicament" ADD CONSTRAINT "AdministrationMedicament_signe_par_id_fkey" FOREIGN KEY ("signe_par_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrationMedicament" ADD CONSTRAINT "AdministrationMedicament_temoin_id_fkey" FOREIGN KEY ("temoin_id") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAI" ADD CONSTRAINT "PAI_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAI" ADD CONSTRAINT "PAI_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
