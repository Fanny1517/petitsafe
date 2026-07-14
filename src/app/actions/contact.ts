"use server";

import { contactSchema } from "@/lib/schemas/contact";

export async function envoyerMessageContact(formData: {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}) {
  try {
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false as const, error: "Données invalides. Vérifiez le formulaire." };
    }

    // Actuellement, il n'y a pas de service de messagerie installé dans l'application.
    // Nous simulons la réception et affichons le log dans la console du serveur.
    console.log("=== Nouveau message de contact (Simulé) ===");
    console.log("Nom :", parsed.data.nom);
    console.log("Email :", parsed.data.email);
    console.log("Sujet :", parsed.data.sujet);
    console.log("Message :", parsed.data.message);
    console.log("==========================================");

    return { success: true as const };
  } catch {
    return { success: false as const, error: "Erreur lors de l'envoi du message. Réessayez." };
  }
}
