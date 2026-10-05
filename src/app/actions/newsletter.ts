"use server";

import { z } from "zod";
import nodemailer from "nodemailer";

const newsletterSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
  website: z.string().optional(), // Piège Honeypot anti-spam
});

/**
 * Crée le transporteur SMTP partagé par les formulaires de capture d'email.
 * Retourne null si le mot de passe SMTP n'est pas configuré.
 */
function createLeadTransporter() {
  const host = process.env.SMTP_HOST || "smtp.office365.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || "info@rzpanda.com";
  const pass = process.env.SMTP_PASS;
  const sendEmail = process.env.SMTP_FROM || user;
  const adminEmail = process.env.ADMIN_EMAIL || sendEmail;

  if (!pass) return null;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  return { transporter, sendEmail, adminEmail };
}

/**
 * Capture d'email pour le guide « Préparer l'évaluation quinquennale » (page Guides).
 * Tant que GUIDE_EVALUATION_PDF_URL n'est pas défini, l'email confirme l'inscription
 * et promet l'envoi à la parution ; l'admin reçoit le lead pour assurer ce suivi.
 */
export async function demanderGuideEvaluation(formData: { email: string; website?: string }) {
  try {
    const parsed = newsletterSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false as const, error: "Adresse email invalide." };
    }

    const { email, website } = parsed.data;

    // Piège Honeypot anti-spam : on simule un succès sans rien envoyer
    if (website && website.trim() !== "") {
      console.warn("Spambot détecté et bloqué sur la demande de guide évaluation :", { email, website });
      return { success: true as const, pdfDisponible: false };
    }

    const smtp = createLeadTransporter();
    if (!smtp) {
      console.error("Mot de passe SMTP manquant dans process.env.SMTP_PASS");
      return { success: false as const, error: "Configuration SMTP incomplète (mot de passe manquant)." };
    }

    const pdfUrl = process.env.GUIDE_EVALUATION_PDF_URL?.trim() || null;
    const contenuPrincipal = pdfUrl
      ? `
        <p>Voici le guide pratique pour structurer l’auto-évaluation, les preuves de terrain, la consultation des familles et le plan d’amélioration à partir du Référentiel national.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${pdfUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
            Télécharger le guide PDF
          </a>
        </div>`
      : `
        <p>Votre demande est bien enregistrée. Le guide pratique pour préparer l’évaluation quinquennale de votre crèche est en cours de finalisation : vous le recevrez à cette adresse dès sa parution.</p>`;

    const clientHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1e3a8a; font-size: 24px; font-weight: 800; margin: 0;">RZPan'Da</h1>
          <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">HACCP, traçabilité et qualité d’accueil pour les crèches</p>
        </div>
        <div style="margin-bottom: 24px; color: #374151; font-size: 14px; line-height: 1.6;">
          <p>Bonjour,</p>
          ${contenuPrincipal}
          <p style="color: #6b7280; font-size: 12px;">Guide pratique : son contenu doit être actualisé si les modalités réglementaires évoluent.</p>
        </div>
        <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">Cet email vous a été envoyé par <strong>RZPan'Da</strong> suite à votre demande sur notre site.</p>
          <p style="margin-top: 4px;">Une question ? Écrivez-nous à <a href="mailto:contact@rzpanda.com" style="color: #2563eb;">contact@rzpanda.com</a>.</p>
        </div>
      </div>
    `;

    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1e3a8a; margin-top: 0;">Nouvelle demande : guide évaluation quinquennale</h2>
        <p><strong>Email du prospect :</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>PDF envoyé :</strong> ${pdfUrl ? "oui" : "non (guide pas encore publié, envoi à faire à la parution)"}</p>
        <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</p>
      </div>
    `;

    await smtp.transporter.sendMail({
      from: `"RZPan'Da" <${smtp.sendEmail}>`,
      to: email,
      subject: pdfUrl
        ? "Votre guide : préparer l’évaluation quinquennale | RZPan'Da"
        : "Demande enregistrée : guide évaluation quinquennale | RZPan'Da",
      html: clientHtml,
    });
    await smtp.transporter.sendMail({
      from: `"RZPan'Da Notif" <${smtp.sendEmail}>`,
      to: smtp.adminEmail,
      replyTo: email,
      subject: `[Lead guide évaluation] Nouvelle demande : ${email}`,
      html: adminHtml,
    });

    return { success: true as const, pdfDisponible: Boolean(pdfUrl) };
  } catch (error) {
    console.error("Erreur lors de la demande de guide évaluation :", error);
    const detail = error instanceof Error ? error.message : "Erreur inconnue";
    return { success: false as const, error: `Erreur lors de l'envoi : ${detail}` };
  }
}

export async function demanderGuideDDPP(formData: { email: string; website?: string }) {
  try {
    const parsed = newsletterSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false as const, error: "Adresse email invalide." };
    }

    const { email, website } = parsed.data;

    // Piège Honeypot anti-spam
    if (website && website.trim() !== "") {
      console.warn("Spambot détecté et bloqué sur la demande de guide DDPP :", { email, website });
      return { success: true as const };
    }

    // Transporteur SMTP universel (Infomaniak, Office 365, OVH, etc.)
    const host = process.env.SMTP_HOST || "smtp.office365.com";
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || "info@rzpanda.com";
    const pass = process.env.SMTP_PASS;
    const sendEmail = process.env.SMTP_FROM || user;
    const adminEmail = process.env.ADMIN_EMAIL || sendEmail;

    if (!pass) {
      console.error("Mot de passe SMTP manquant dans process.env.SMTP_PASS");
      return { success: false as const, error: "Configuration SMTP incomplète (mot de passe manquant)." };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true pour le port 465 (SSL/TLS), false pour 587 (STARTTLS)
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rzpanda.com";

    // Template email pour le client avec le guide DDPP 2026
    const clientHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1e3a8a; font-size: 24px; font-weight: 800; margin: 0;">RZPan'Da</h1>
          <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Gestion réglementaire & hygiène pour crèches et micro-crèches</p>
        </div>

        <div style="padding: 20px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin-bottom: 24px;">
          <h2 style="color: #166534; font-size: 18px; font-weight: 700; margin-top: 0;">Votre Guide DDPP 2026 est prêt !</h2>
          <p style="color: #15803d; font-size: 14px; margin-bottom: 0;">
            Merci pour votre intérêt. Voici le guide pratique pour préparer sereinement vos contrôles DDPP / PMI.
          </p>
        </div>

        <div style="margin-bottom: 24px; color: #374151; font-size: 14px; line-height: 1.6;">
          <p>Bonjour,</p>
          <p>Les contrôles de la <strong>DDPP (Direction Départementale de la Protection des Populations)</strong> et de la <strong>PMI</strong> s'intensifient en 2026. Pour vous aider à être 100% conforme sans stress, nous avons condensé les points clés à vérifier dans votre établissement :</p>
          
          <ul style="padding-left: 20px; color: #1f2937;">
            <li><strong>Relevés de températures</strong> : Conservation des données HACCP et traçabilité des enceintes froides.</li>
            <li><strong>Plan de nettoyage & désinfection</strong> : Registres d'émargement et protocole sanitaire à jour.</li>
            <li><strong>Protocole biberonnerie</strong> : Gestion du lait maternel, dates limites d'utilisation (DLU/DLC).</li>
            <li><strong>Transmissions & Registres</strong> : Traçabilité obligatoire des incidents et soins.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${baseUrl}/guides/controle-ddpp-creche-preparation" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
            Consulter le Guide DDPP 2026 en ligne →
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; pt: 20px; margin-top: 32px; padding-top: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">Cet email vous a été envoyé par <strong>RZPan'Da</strong> suite à votre demande sur notre site.</p>
          <p style="margin-top: 4px;">Une question ? Répondez simplement à cet email ou écrivez-nous à <a href="mailto:info@rzpanda.com" style="color: #2563eb;">info@rzpanda.com</a>.</p>
        </div>
      </div>
    `;

    // Mail admin notification
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1e3a8a; margin-top: 0;">Nouvelle demande de Guide DDPP 2026</h2>
        <p>Un utilisateur s'est inscrit pour recevoir le guide DDPP 2026 depuis le site RZPan'Da.</p>
        <p><strong>Email du prospect :</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</p>
      </div>
    `;

    // Envoi séquentiel des emails
    await transporter.sendMail({
      from: `"RZPan'Da" <${sendEmail}>`,
      to: email,
      subject: "Votre Guide DDPP 2026 — RZPan'Da",
      html: clientHtml,
    });
    await transporter.sendMail({
      from: `"RZPan'Da Notif" <${sendEmail}>`,
      to: adminEmail,
      replyTo: email,
      subject: `[Lead Guide DDPP] Nouvelle inscription : ${email}`,
      html: adminHtml,
    });

    return { success: true as const };
  } catch (error) {
    console.error("Erreur lors de l'envoi du guide DDPP :", error);
    const detail = error instanceof Error ? error.message : "Erreur inconnue";
    return { success: false as const, error: `Erreur lors de l'envoi du guide : ${detail}` };
  }
}
