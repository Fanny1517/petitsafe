import { z } from "zod";
import { AxeQualite, StatutConformite, PrioriteAction, StatutAction } from "@prisma/client";

// Schéma pour la sauvegarde d'une auto-évaluation de critère
export const evaluationCritereSchema = z.object({
  structureId: z.string().uuid("Identifiant de structure invalide"),
  critereId: z.string().uuid("Identifiant de critère invalide"),
  statut: z.nativeEnum(StatutConformite),
  observations: z.string().max(2000, "Les observations ne peuvent dépasser 2000 caractères").optional().nullable(),
  pistes_amelioration: z.string().max(2000, "Les pistes d'amélioration ne peuvent dépasser 2000 caractères").optional().nullable(),
  periode: z.string().regex(/^\d{4}$/, "L'année de référence doit comporter 4 chiffres (ex: 2026)").optional(),
});

export type EvaluationCritereInput = z.infer<typeof evaluationCritereSchema>;

// Schéma pour la création d'une action dans le Plan d'Amélioration de la Qualité (PAQ)
export const actionPAQSchema = z.object({
  structureId: z.string().uuid("Identifiant de structure invalide"),
  critereId: z.string().uuid("Identifiant de critère invalide"),
  titre: z.string().min(3, "Le titre doit comporter au moins 3 caractères").max(200, "Le titre ne peut dépasser 200 caractères"),
  description: z.string().max(1000, "La description ne peut dépasser 1000 caractères").optional().nullable(),
  responsable: z.string().max(100, "Le nom du responsable ne peut dépasser 100 caractères").optional().nullable(),
  priorite: z.nativeEnum(PrioriteAction).default("MOYENNE"),
  echeance: z.string().optional().nullable(),
});

export type ActionPAQInput = z.infer<typeof actionPAQSchema>;

// Schéma pour la mise à jour d'un statut d'action PAQ
export const updateActionPAQSchema = z.object({
  actionId: z.string().uuid("Identifiant d'action invalide"),
  structureId: z.string().uuid("Identifiant de structure invalide"),
  statut: z.nativeEnum(StatutAction),
  commentaire_cloture: z.string().max(1000).optional().nullable(),
});

export type UpdateActionPAQInput = z.infer<typeof updateActionPAQSchema>;

// Schéma de filtrage de la grille d'évaluation
export const filtreQualiteSchema = z.object({
  axe: z.union([z.nativeEnum(AxeQualite), z.literal("TOUS")]).default("TOUS"),
  statut: z.union([z.nativeEnum(StatutConformite), z.literal("TOUS")]).default("TOUS"),
  recherche: z.string().max(100).optional().default(""),
  periode: z.string().regex(/^\d{4}$/).optional(),
});

export type FiltreQualiteInput = z.infer<typeof filtreQualiteSchema>;
