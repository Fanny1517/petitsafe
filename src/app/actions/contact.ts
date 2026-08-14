"use server";

import { contactSchema } from "@/lib/schemas/contact";
import nodemailer from "nodemailer";

export async function envoyerMessageContact(formData: {
  nom: string;
  email: string;
  sujet: string;
  message: string;
  website?: string;
}) {
  try {
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false as const, error: "Données invalides. Vérifiez le formulaire." };
    }

    const { nom, email, sujet, message, website } = parsed.data;

    // Piège Honeypot Anti-Spam : si le champ masqué est rempli, un robot a soumis le formulaire
    if (website && website.trim() !== "") {
      console.warn("Spambot détecté et bloqué via Honeypot :", { email, website });
      return { success: true as const }; // Succès silencieux pour ne pas alerter le robot
    }

    // Création du transporteur Nodemailer configuré pour Microsoft Office 365
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.office365.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // STARTTLS sur port 587
      auth: {
        user: process.env.SMTP_USER || "info@rzpanda.com",
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers: "SSLv3", // Assure la compatibilité TLS avec Office 365
      },
    });

    // Template HTML pour l'email administrateur
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1e3a8a; margin-top: 0;">Nouveau message de contact reçu</h2>
        <p style="margin-bottom: 15px;">Un nouveau message a été soumis via le formulaire de contact de RZPan'Da.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; border-bottom: 1px solid #f3f4f6;">Nom :</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${nom}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Email :</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Sujet :</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${sujet}</td>
          </tr>
        </table>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; font-weight: bold; margin-bottom: 8px; color: #4b5563;">Message :</p>
          <p style="margin: 0; white-space: pre-wrap; color: #1f2937; line-height: 1.5;">${message}</p>
        </div>
      </div>
    `;

    // Template HTML pour l'accusé de réception client
    const clientHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">RZPan'Da</h1>
        </div>
        
        <p>Bonjour <strong>${nom}</strong>,</p>
        
        <p>Nous vous confirmons la bonne réception de votre message concernant le sujet suivant : <strong>"${sujet}"</strong>.</p>
        
        <p>Notre équipe examine votre demande avec attention et reviendra vers vous par email dans les plus brefs délais.</p>
        
        <p style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 14px; color: #6b7280; text-align: center;">
          Ceci est un accusé de réception automatique. Merci de ne pas y répondre directement.
        </p>
      </div>
    `;

    const adminMailOptions = {
      from: `"RZPan'Da Formulaire" <${process.env.SMTP_USER || "info@rzpanda.com"}>`,
      to: process.env.ADMIN_EMAIL || "info@rzpanda.com",
      replyTo: email,
      subject: `[Contact RZPan'Da] ${sujet} - de ${nom}`,
      html: adminHtml,
    };

    const clientMailOptions = {
      from: `"L'équipe RZPan'Da" <${process.env.SMTP_USER || "info@rzpanda.com"}>`,
      to: email,
      subject: "Accusé de réception - Votre message à RZPan'Da",
      html: clientHtml,
    };

    // Envoi des deux emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);

    return { success: true as const };
  } catch (error) {
    console.error("Erreur d'envoi d'email SMTP Office 365 :", error);
    return { success: false as const, error: "Erreur lors de l'envoi du message. Réessayez." };
  }
}

