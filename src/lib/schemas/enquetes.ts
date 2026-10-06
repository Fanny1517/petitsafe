import { z } from "zod";
import { AxeQualite, TypeEnquete, TypeQuestionEnquete } from "@prisma/client";

export const QuestionEnqueteSchema = z.object({
  id: z.string().optional(),
  libelle: z.string().min(3, "La question doit comporter au moins 3 caractères"),
  type_question: z.nativeEnum(TypeQuestionEnquete),
  obligatoire: z.boolean().default(true),
  ordre: z.number().int().default(0),
  axe_qualite: z.nativeEnum(AxeQualite).optional().nullable(),
  options: z.array(z.string()).optional(),
});

export const CreerEnqueteSchema = z.object({
  structureId: z.string().min(1, "Identifiant de structure manquant"),
  titre: z.string().min(3, "Le titre doit comporter au moins 3 caractères"),
  description: z.string().optional().nullable(),
  type_enquete: z.nativeEnum(TypeEnquete).default(TypeEnquete.ANNUELLE),
  date_debut: z.string().optional().nullable(),
  date_fin: z.string().optional().nullable(),
  cible_reponses: z.number().int().min(1).optional().nullable(),
  anonyme: z.boolean().default(true),
  emails_notification: z.array(z.string().email("Adresse email invalide")).optional().default([]),
  questions: z.array(QuestionEnqueteSchema).min(1, "L'enquête doit comporter au moins une question"),
});

export const ReponseValeurSchema = z.object({
  question_id: z.string().min(1),
  valeur_note: z.number().int().min(1).max(5).optional().nullable(),
  valeur_booleen: z.boolean().optional().nullable(),
  valeur_texte: z.string().optional().nullable(),
});

export const SoumettreReponseParentSchema = z.object({
  token: z.string().min(1, "Jeton d'accès manquant"),
  parent_nom: z.string().trim().min(2, "Veuillez renseigner votre nom et prénom"),
  parent_email: z.string().trim().email("Veuillez renseigner une adresse email valide"),
  reponses: z.array(ReponseValeurSchema).min(1, "Veuillez répondre aux questions obligatoires"),
});

export type CreerEnqueteInput = z.infer<typeof CreerEnqueteSchema>;
export type QuestionEnqueteInput = z.infer<typeof QuestionEnqueteSchema>;
export type SoumettreReponseParentInput = z.infer<typeof SoumettreReponseParentSchema>;
export type ReponseValeurInput = z.infer<typeof ReponseValeurSchema>;

