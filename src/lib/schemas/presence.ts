import { z } from "zod";

export const statutPresenceEnum = z.enum([
  "ATTENDU",
  "PRESENT",
  "ABSENT",
  "ABSENT_JUSTIFIE",
  "CONGE",
]);

export const togglePresenceSchema = z.object({
  structure_id: z.string().min(1, "Structure requise"),
  enfant_id: z.string().min(1, "Enfant requis"),
  date: z.string().min(1, "Date requise"),
  est_present: z.boolean(),
  profil_id: z.string().optional(),
});

export const updateHeuresPresenceSchema = z.object({
  structure_id: z.string().min(1, "Structure requise"),
  enfant_id: z.string().min(1, "Enfant requis"),
  date: z.string().min(1, "Date requise"),
  heure_arrivee: z.string().nullable().optional(),
  heure_depart: z.string().nullable().optional(),
  observations: z.string().nullable().optional(),
  profil_id: z.string().optional(),
});

export const absenceSchema = z.object({
  structure_id: z.string().min(1, "Structure requise"),
  enfant_id: z.string().min(1, "Enfant requis"),
  date: z.string().min(1, "Date requise"),
  statut: z.enum(["ABSENT", "ABSENT_JUSTIFIE", "CONGE"]),
  motif_absence: z.string().min(1, "Motif requis"),
  certificat_fourni: z.boolean().default(false),
  observations: z.string().optional(),
  profil_id: z.string().optional(),
});

export const pointagePresenceSchema = togglePresenceSchema;
export const declarationAbsenceSchema = absenceSchema;

export type TogglePresenceForm = z.infer<typeof togglePresenceSchema>;
export type UpdateHeuresPresenceForm = z.infer<typeof updateHeuresPresenceSchema>;
export type AbsenceForm = z.infer<typeof absenceSchema>;
export type PointagePresenceForm = TogglePresenceForm;
export type DeclarationAbsenceForm = AbsenceForm;
