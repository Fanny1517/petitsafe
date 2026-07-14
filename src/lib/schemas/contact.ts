import { z } from "zod";

export const contactSchema = z.object({
  nom: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().trim().email("Adresse email invalide"),
  sujet: z.string().trim().min(3, "Le sujet doit contenir au moins 3 caractères"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères"),
});
