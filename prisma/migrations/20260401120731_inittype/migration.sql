-- CreateEnum
CREATE TYPE "StructureType" AS ENUM ('CRECHE', 'MICRO_CRECHE', 'MAM', 'ASS_MAT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GESTIONNAIRE', 'PROFESSIONNEL', 'PARENT');

-- CreateEnum
CREATE TYPE "Sexe" AS ENUM ('FILLE', 'GARCON');

-- CreateEnum
CREATE TYPE "Severite" AS ENUM ('LEGERE', 'MODEREE', 'SEVERE');

-- CreateEnum
CREATE TYPE "TypeRepas" AS ENUM ('PETIT_DEJ', 'DEJEUNER', 'GOUTER', 'DINER');

-- CreateEnum
CREATE TYPE "Quantite" AS ENUM ('TOUT', 'BIEN', 'PEU', 'RIEN');

-- CreateEnum
CREATE TYPE "TypeChange" AS ENUM ('MOUILLEE', 'SELLE', 'LES_DEUX');

-- CreateEnum
CREATE TYPE "QualiteSieste" AS ENUM ('CALME', 'AGITE', 'DIFFICILE', 'REVEILS');

-- CreateEnum
CREATE TYPE "TypeEquipement" AS ENUM ('REFRIGERATEUR', 'CONGELATEUR');

-- CreateEnum
CREATE TYPE "StatutProduit" AS ENUM ('EN_STOCK', 'UTILISE', 'JETE', 'RAPPELE');

-- CreateEnum
CREATE TYPE "Frequence" AS ENUM ('APRES_UTILISATION', 'QUOTIDIEN', 'BIQUOTIDIEN', 'HEBDO', 'BIMENSUEL', 'MENSUEL');

-- CreateEnum
CREATE TYPE "TypeMouvement" AS ENUM ('ENTREE', 'SORTIE');

-- CreateEnum
CREATE TYPE "TypeTransmission" AS ENUM ('GENERAL', 'ENFANT', 'EQUIPE');

-- CreateEnum
CREATE TYPE "TypeExport" AS ENUM ('DDPP', 'PMI', 'INTERNE');

-- CreateEnum
CREATE TYPE "CategorieStock" AS ENUM ('COUCHES', 'ENTRETIEN', 'LAIT', 'COMPOTES', 'AUTRE');

-- CreateTable
CREATE TABLE "Structure" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "StructureType" NOT NULL,
    "adresse" TEXT,
    "code_postal" TEXT,
    "ville" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "capacite_accueil" INTEGER,
    "numero_agrement" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Structure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStructure" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "UserStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enfant" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3) NOT NULL,
    "sexe" "Sexe",
    "groupe" TEXT,
    "photo_url" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "date_entree" TIMESTAMP(3),

    CONSTRAINT "Enfant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllergieEnfant" (
    "id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "allergene" TEXT NOT NULL,
    "severite" "Severite" NOT NULL,
    "protocole" TEXT,
    "document_pai" TEXT,

    CONSTRAINT "AllergieEnfant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactUrgence" (
    "id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "lien" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "est_autorise_recuperer" BOOLEAN NOT NULL DEFAULT true,
    "ordre_priorite" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ContactUrgence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biberon" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure_preparation" TIMESTAMP(3) NOT NULL,
    "type_lait" TEXT NOT NULL,
    "nom_lait" TEXT,
    "numero_lot" TEXT NOT NULL,
    "date_peremption_lait" TIMESTAMP(3),
    "date_ouverture_boite" TIMESTAMP(3),
    "nombre_dosettes" INTEGER,
    "quantite_preparee_ml" INTEGER NOT NULL,
    "heure_service" TIMESTAMP(3),
    "quantite_bue_ml" INTEGER,
    "nettoyage_effectue" BOOLEAN NOT NULL DEFAULT false,
    "heure_nettoyage" TIMESTAMP(3),
    "preparateur_nom" TEXT NOT NULL,
    "conforme_anses" BOOLEAN NOT NULL DEFAULT true,
    "observations" TEXT,
    "professionnel_id" TEXT NOT NULL,

    CONSTRAINT "Biberon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repas" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type_repas" "TypeRepas" NOT NULL,
    "entree" TEXT,
    "entree_quantite" "Quantite",
    "plat" TEXT,
    "plat_quantite" "Quantite",
    "dessert" TEXT,
    "dessert_quantite" "Quantite",
    "observations" TEXT,
    "professionnel_id" TEXT NOT NULL,

    CONSTRAINT "Repas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Change" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure" TIMESTAMP(3) NOT NULL,
    "type_change" "TypeChange" NOT NULL,
    "observations" TEXT,
    "professionnel_id" TEXT NOT NULL,

    CONSTRAINT "Change_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sieste" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure_debut" TIMESTAMP(3) NOT NULL,
    "heure_fin" TIMESTAMP(3),
    "duree_minutes" INTEGER,
    "qualite" "QualiteSieste",
    "professionnel_id" TEXT NOT NULL,

    CONSTRAINT "Sieste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipement" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "TypeEquipement" NOT NULL,
    "temperature_max" DOUBLE PRECISION NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Equipement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleveTemperature" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "equipement_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure" TIMESTAMP(3) NOT NULL,
    "heure_modifiee" TIMESTAMP(3),
    "temperature" DOUBLE PRECISION NOT NULL,
    "conforme" BOOLEAN NOT NULL,
    "action_corrective" TEXT,
    "professionnel_id" TEXT NOT NULL,

    CONSTRAINT "ReleveTemperature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelevePlat" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "nom_plat" TEXT NOT NULL,
    "temperature_avant" DOUBLE PRECISION NOT NULL,
    "heure_avant" TIMESTAMP(3) NOT NULL,
    "temperature_apres" DOUBLE PRECISION NOT NULL,
    "heure_apres" TIMESTAMP(3) NOT NULL,
    "conforme" BOOLEAN NOT NULL,
    "action_corrective" TEXT,
    "professionnel_id" TEXT NOT NULL,

    CONSTRAINT "RelevePlat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceptionMarchandise" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fournisseur" TEXT NOT NULL,
    "nom_produit" TEXT NOT NULL,
    "numero_lot" TEXT NOT NULL,
    "dlc" TIMESTAMP(3) NOT NULL,
    "temperature_reception" DOUBLE PRECISION,
    "emballage_conforme" BOOLEAN NOT NULL DEFAULT true,
    "photo_etiquette_url" TEXT,
    "photo_bon_livraison" TEXT,
    "conforme" BOOLEAN NOT NULL DEFAULT true,
    "motif_non_conformite" TEXT,
    "statut" "StatutProduit" NOT NULL DEFAULT 'EN_STOCK',
    "motif_destruction" TEXT,
    "professionnel_id" TEXT NOT NULL,

    CONSTRAINT "ReceptionMarchandise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneNettoyage" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "couleur_code" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ZoneNettoyage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TacheNettoyage" (
    "id" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "frequence" "Frequence" NOT NULL,
    "methode" TEXT NOT NULL,
    "produit" TEXT,
    "notes" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TacheNettoyage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationNettoyage" (
    "id" TEXT NOT NULL,
    "tache_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure" TIMESTAMP(3) NOT NULL,
    "professionnel_id" TEXT NOT NULL,
    "professionnel_nom" TEXT NOT NULL,
    "observations" TEXT,

    CONSTRAINT "ValidationNettoyage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "categorie" "CategorieStock" NOT NULL,
    "produit_nom" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "unite" TEXT NOT NULL,
    "seuil_alerte" DOUBLE PRECISION NOT NULL,
    "derniere_maj" TIMESTAMP(3) NOT NULL,
    "maj_par" TEXT NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MouvementStock" (
    "id" TEXT NOT NULL,
    "stock_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type_mouv" "TypeMouvement" NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "motif" TEXT,
    "par" TEXT NOT NULL,

    CONSTRAINT "MouvementStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transmission" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "enfant_id" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "contenu" TEXT NOT NULL,
    "auteur" TEXT NOT NULL,
    "type_transm" "TypeTransmission" NOT NULL,

    CONSTRAINT "Transmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Protocole" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "contenu_markdown" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "cree_par" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Protocole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportPDF" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "type_export" "TypeExport" NOT NULL,
    "periode_debut" TIMESTAMP(3) NOT NULL,
    "periode_fin" TIMESTAMP(3) NOT NULL,
    "genere_par" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportPDF_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandeDemo" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "type_structure" TEXT NOT NULL,
    "nombre_structures" TEXT NOT NULL,
    "date_demande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "structure_id" TEXT,

    CONSTRAINT "DemandeDemo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserStructure_user_id_idx" ON "UserStructure"("user_id");

-- CreateIndex
CREATE INDEX "UserStructure_structure_id_idx" ON "UserStructure"("structure_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserStructure_user_id_structure_id_key" ON "UserStructure"("user_id", "structure_id");

-- CreateIndex
CREATE INDEX "Enfant_structure_id_idx" ON "Enfant"("structure_id");

-- CreateIndex
CREATE INDEX "Enfant_structure_id_actif_idx" ON "Enfant"("structure_id", "actif");

-- CreateIndex
CREATE INDEX "AllergieEnfant_enfant_id_idx" ON "AllergieEnfant"("enfant_id");

-- CreateIndex
CREATE INDEX "ContactUrgence_enfant_id_idx" ON "ContactUrgence"("enfant_id");

-- CreateIndex
CREATE INDEX "Biberon_structure_id_date_idx" ON "Biberon"("structure_id", "date");

-- CreateIndex
CREATE INDEX "Biberon_enfant_id_date_idx" ON "Biberon"("enfant_id", "date");

-- CreateIndex
CREATE INDEX "Repas_structure_id_date_idx" ON "Repas"("structure_id", "date");

-- CreateIndex
CREATE INDEX "Repas_enfant_id_date_idx" ON "Repas"("enfant_id", "date");

-- CreateIndex
CREATE INDEX "Change_structure_id_date_idx" ON "Change"("structure_id", "date");

-- CreateIndex
CREATE INDEX "Change_enfant_id_date_idx" ON "Change"("enfant_id", "date");

-- CreateIndex
CREATE INDEX "Sieste_structure_id_date_idx" ON "Sieste"("structure_id", "date");

-- CreateIndex
CREATE INDEX "Sieste_enfant_id_date_idx" ON "Sieste"("enfant_id", "date");

-- CreateIndex
CREATE INDEX "Equipement_structure_id_idx" ON "Equipement"("structure_id");

-- CreateIndex
CREATE INDEX "ReleveTemperature_structure_id_date_idx" ON "ReleveTemperature"("structure_id", "date");

-- CreateIndex
CREATE INDEX "ReleveTemperature_equipement_id_date_idx" ON "ReleveTemperature"("equipement_id", "date");

-- CreateIndex
CREATE INDEX "RelevePlat_structure_id_date_idx" ON "RelevePlat"("structure_id", "date");

-- CreateIndex
CREATE INDEX "ReceptionMarchandise_structure_id_date_idx" ON "ReceptionMarchandise"("structure_id", "date");

-- CreateIndex
CREATE INDEX "ReceptionMarchandise_structure_id_dlc_idx" ON "ReceptionMarchandise"("structure_id", "dlc");

-- CreateIndex
CREATE INDEX "ZoneNettoyage_structure_id_idx" ON "ZoneNettoyage"("structure_id");

-- CreateIndex
CREATE INDEX "TacheNettoyage_zone_id_idx" ON "TacheNettoyage"("zone_id");

-- CreateIndex
CREATE INDEX "ValidationNettoyage_tache_id_date_idx" ON "ValidationNettoyage"("tache_id", "date");

-- CreateIndex
CREATE INDEX "Stock_structure_id_idx" ON "Stock"("structure_id");

-- CreateIndex
CREATE INDEX "MouvementStock_stock_id_idx" ON "MouvementStock"("stock_id");

-- CreateIndex
CREATE INDEX "Transmission_structure_id_date_idx" ON "Transmission"("structure_id", "date");

-- CreateIndex
CREATE INDEX "Transmission_enfant_id_date_idx" ON "Transmission"("enfant_id", "date");

-- CreateIndex
CREATE INDEX "Protocole_structure_id_idx" ON "Protocole"("structure_id");

-- CreateIndex
CREATE INDEX "ExportPDF_structure_id_idx" ON "ExportPDF"("structure_id");

-- AddForeignKey
ALTER TABLE "UserStructure" ADD CONSTRAINT "UserStructure_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enfant" ADD CONSTRAINT "Enfant_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllergieEnfant" ADD CONSTRAINT "AllergieEnfant_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactUrgence" ADD CONSTRAINT "ContactUrgence_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biberon" ADD CONSTRAINT "Biberon_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biberon" ADD CONSTRAINT "Biberon_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repas" ADD CONSTRAINT "Repas_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repas" ADD CONSTRAINT "Repas_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Change" ADD CONSTRAINT "Change_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Change" ADD CONSTRAINT "Change_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sieste" ADD CONSTRAINT "Sieste_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sieste" ADD CONSTRAINT "Sieste_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipement" ADD CONSTRAINT "Equipement_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleveTemperature" ADD CONSTRAINT "ReleveTemperature_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleveTemperature" ADD CONSTRAINT "ReleveTemperature_equipement_id_fkey" FOREIGN KEY ("equipement_id") REFERENCES "Equipement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelevePlat" ADD CONSTRAINT "RelevePlat_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceptionMarchandise" ADD CONSTRAINT "ReceptionMarchandise_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneNettoyage" ADD CONSTRAINT "ZoneNettoyage_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TacheNettoyage" ADD CONSTRAINT "TacheNettoyage_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "ZoneNettoyage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationNettoyage" ADD CONSTRAINT "ValidationNettoyage_tache_id_fkey" FOREIGN KEY ("tache_id") REFERENCES "TacheNettoyage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transmission" ADD CONSTRAINT "Transmission_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transmission" ADD CONSTRAINT "Transmission_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocole" ADD CONSTRAINT "Protocole_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportPDF" ADD CONSTRAINT "ExportPDF_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeDemo" ADD CONSTRAINT "DemandeDemo_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
