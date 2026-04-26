-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ARCHIVE', 'EXPORT', 'ROLE_CHANGE', 'LOGIN_FAILED');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "structure_id" TEXT,
    "user_id" TEXT,
    "profil_id" TEXT,
    "profil_nom" TEXT,
    "action" "AuditAction" NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "details" JSONB,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_structure_id_created_at_idx" ON "AuditLog"("structure_id", "created_at");

-- CreateIndex
CREATE INDEX "AuditLog_profil_id_created_at_idx" ON "AuditLog"("profil_id", "created_at");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entity_id_idx" ON "AuditLog"("entity", "entity_id");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "Structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;
