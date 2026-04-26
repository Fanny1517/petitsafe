-- CreateEnum
CREATE TYPE "TypeIncident" AS ENUM ('CHUTE', 'MORSURE', 'GRIFFURE', 'PLEURS_PROLONGES', 'FIEVRE', 'AUTRE');

-- CreateEnum
CREATE TYPE "GraviteIncident" AS ENUM ('MINEUR', 'MODERE', 'GRAVE');

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT NOT NULL,
    "enfant_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heure" TIMESTAMP(3) NOT NULL,
    "type_incident" "TypeIncident" NOT NULL,
    "description" TEXT NOT NULL,
    "gravite" "GraviteIncident" NOT NULL,
    "action_prise" TEXT NOT NULL,
    "parents_prevenu" BOOLEAN NOT NULL DEFAULT false,
    "professionnel_id" TEXT NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Incident_structure_id_date_idx" ON "Incident"("structure_id", "date");

-- CreateIndex
CREATE INDEX "Incident_enfant_id_date_idx" ON "Incident"("enfant_id", "date");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_enfant_id_fkey" FOREIGN KEY ("enfant_id") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
