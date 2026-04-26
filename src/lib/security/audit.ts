import { prisma } from "@/lib/supabase/prisma";
import { AuditAction, Prisma } from "@prisma/client";
import { getClientIp } from "@/lib/security/rate-limit";

export type AuditEntity =
  | "enfant"
  | "profil"
  | "structure"
  | "export"
  | "administration_medicament"
  | "pai"
  | "boite_lait"
  | "lait_maternel";

interface LogAuditInput {
  structureId?: string;
  userId?: string;
  profilId?: string;
  profilNom?: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  details?: Prisma.InputJsonValue;
}

/**
 * Enregistre une action sensible dans la table AuditLog.
 * Conçu pour ne JAMAIS faire échouer l'action métier appelante :
 * en cas d'erreur d'audit, on log en console et on continue.
 */
export async function logAudit(input: LogAuditInput): Promise<void> {
  try {
    let ip: string | undefined;
    try {
      ip = await getClientIp();
    } catch {
      ip = undefined;
    }
    await prisma.auditLog.create({
      data: {
        structure_id: input.structureId ?? null,
        user_id: input.userId ?? null,
        profil_id: input.profilId ?? null,
        profil_nom: input.profilNom ?? null,
        action: input.action,
        entity: input.entity,
        entity_id: input.entityId ?? null,
        details: input.details ?? Prisma.JsonNull,
        ip: ip ?? null,
      },
    });
  } catch (e) {
    console.error("[audit] Échec d'écriture du log:", e);
  }
}

export { AuditAction };
