import nodemailer from "nodemailer";

interface EmailValidationParams {
  email: string;
  prenom: string;
  nom: string;
  nomStructure: string;
  lienValidation: string;
}

interface EmailBienvenueParams {
  email: string;
  prenom: string;
  nom: string;
  nomStructure: string;
}

/**
 * Crée le transporteur SMTP configuré (IONOS info@rzpanda.com par défaut)
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.ionos.fr";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER || "info@rzpanda.com";
  const pass = process.env.SMTP_PASS || "Info.123!";

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Génère le template HTML pour l'email de validation d'inscription
 */
export function getEmailValidationHtml({
  prenom,
  nom,
  nomStructure,
  lienValidation,
}: {
  prenom: string;
  nom: string;
  nomStructure: string;
  lienValidation: string;
}): string {
  const annee = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmez votre inscription à RZPan'Da</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          
          <!-- En-tête avec bannière couleur RZPan'Da -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 32px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                RZPan'Da
              </h1>
              <p style="color: #ccfbf1; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">
                Gestion & Hygiène HACCP pour Crèches et Micro-crèches
              </p>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <p style="font-size: 17px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px;">
                Bonjour ${prenom} ${nom},
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
                Merci d'avoir initié la création de votre espace pour la structure <strong>« ${nomStructure} »</strong> sur RZPan'Da.
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 28px;">
                Pour finaliser la configuration de votre compte et activer votre accès sécurisé, veuillez cliquer sur le bouton ci-dessous :
              </p>

              <!-- Bouton d'action principal -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #0d9488;">
                    <a href="${lienValidation}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);">
                      Valider mon inscription &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Bloc rappel code PIN et sécurité -->
              <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #115e59;">
                  🔒 Information importante : Code PIN d'équipe
                </p>
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #0f766e;">
                  Lors de votre première connexion, votre profil administrateur principal sera pré-configuré avec le code PIN initial <strong>0000</strong>. Vous pourrez personnaliser ce code et ajouter les profils de vos professionnelles dans la section <em>Paramètres &rarr; Équipe</em>.
                </p>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 12px;">
                ⚠️ Ce lien sécurisé est valable pendant <strong>24 heures</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
              </p>

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">

              <p style="font-size: 11px; color: #94a3b8; word-break: break-all; margin: 0;">
                Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
                <a href="${lienValidation}" style="color: #0d9488;">${lienValidation}</a>
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                &copy; ${annee} RZPan'Da. Tous droits réservés.
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">
                Pour toute assistance, écrivez-nous à info@rzpanda.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Génère le template HTML pour l'email de bienvenue suite à la validation
 */
export function getEmailBienvenueHtml({
  prenom,
  nomStructure,
}: {
  prenom: string;
  nom?: string;
  nomStructure: string;
}): string {
  const annee = new Date().getFullYear();
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://app.rzpanda.com"}/login`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur RZPan'Da</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          
          <!-- En-tête -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 32px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">
                🎉 Bienvenue sur RZPan'Da !
              </h1>
              <p style="color: #ccfbf1; margin: 6px 0 0 0; font-size: 13px;">
                Votre structure « ${nomStructure} » est prête
              </p>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <p style="font-size: 17px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px;">
                Félicitations ${prenom},
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
                Votre compte et votre structure <strong>${nomStructure}</strong> ont été activés avec succès. Vous pouvez dès à présent accéder à l'ensemble de vos modules de suivi et de traçabilité.
              </p>

              <!-- Résumé des accès -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #0f172a;">
                  Vos accès rapides :
                </p>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.7;">
                  <li><strong>Identifiant :</strong> votre adresse email</li>
                  <li><strong>Code PIN administrateur initial :</strong> <span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">0000</span></li>
                </ul>
              </div>

              <!-- Bouton connexion -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 24px auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #0d9488;">
                    <a href="${loginUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);">
                      Accéder à mon tableau de bord &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                &copy; ${annee} RZPan'Da. L'équipe support reste à votre écoute : info@rzpanda.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Envoie l'email de validation d'inscription
 */
export async function envoyerEmailValidationInscription({
  email,
  prenom,
  nom,
  nomStructure,
  lienValidation,
}: EmailValidationParams): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    const expediteur = process.env.SMTP_FROM || '"RZPan\'Da" <info@rzpanda.com>';

    await transporter.sendMail({
      from: expediteur,
      to: email,
      subject: `Confirmation de votre inscription — ${nomStructure}`,
      html: getEmailValidationHtml({
        prenom,
        nom,
        nomStructure,
        lienValidation,
      }),
      text: `Bonjour ${prenom} ${nom},\n\nMerci d'avoir créé votre compte RZPan'Da pour « ${nomStructure} ».\n\nVeuillez valider votre inscription en visitant ce lien (valable 24h) :\n${lienValidation}\n\nCode PIN initial : 0000.\n\nL'équipe RZPan'Da`,
    });

    return { success: true };
  } catch (error) {
    console.error("[envoyerEmailValidationInscription] Erreur envoi SMTP :", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur d'envoi de l'email.",
    };
  }
}

/**
 * Envoie l'email de bienvenue suite à la validation
 */
export async function envoyerEmailBienvenue({
  email,
  prenom,
  nom,
  nomStructure,
}: EmailBienvenueParams): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    const expediteur = process.env.SMTP_FROM || '"RZPan\'Da" <info@rzpanda.com>';

    await transporter.sendMail({
      from: expediteur,
      to: email,
      subject: `Bienvenue sur RZPan'Da — Votre espace ${nomStructure} est activé !`,
      html: getEmailBienvenueHtml({
        prenom,
        nom,
        nomStructure,
      }),
      text: `Bonjour ${prenom},\n\nVotre structure « ${nomStructure} » est maintenant active sur RZPan'Da.\n\nVotre code PIN initial est 0000.\n\nConnectez-vous sur https://app.rzpanda.com/login\n\nL'équipe RZPan'Da`,
    });

    return { success: true };
  } catch (error) {
    console.error("[envoyerEmailBienvenue] Erreur envoi SMTP :", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur d'envoi de l'email de bienvenue.",
    };
  }
}

export interface DetailReponseNotification {
  question: string;
  reponse: string;
  axe?: string | null;
}

export interface NotificationNouvelleEvaluationParams {
  titreCampagne: string;
  nomStructure: string;
  structureId: string;
  parentNom: string;
  parentEmail: string;
  dateSoumission: Date;
  destinataires: string[];
  reponsesDetail: DetailReponseNotification[];
  lienAdmin: string;
}

/**
 * Génère le template HTML pour la notification d'une nouvelle évaluation parent
 */
export function getEmailNouvelleEvaluationHtml({
  titreCampagne,
  nomStructure,
  parentNom,
  parentEmail,
  dateSoumission,
  reponsesDetail,
  lienAdmin,
}: Omit<NotificationNouvelleEvaluationParams, "destinataires" | "structureId">): string {
  const annee = new Date().getFullYear();
  const dateFormatted = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateSoumission);

  const reponsesRows = reponsesDetail
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #f1f5f9; ${idx % 2 === 0 ? "background-color: #fafaf9;" : ""}">
        <td style="padding: 12px 14px; font-size: 13px; color: #1e293b; font-weight: 500; vertical-align: top;">
          ${item.axe ? `<span style="display: inline-block; padding: 2px 6px; font-size: 10px; font-weight: 700; color: #0f766e; background: #ccfbf1; border-radius: 4px; margin-bottom: 4px;">${item.axe}</span><br>` : ""}
          ${item.question}
        </td>
        <td style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #0d9488; text-align: right; vertical-align: middle; white-space: nowrap;">
          ${item.reponse}
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle évaluation reçue — ${titreCampagne}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          
          <!-- En-tête -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 30px; text-align: center;">
              <span style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                Baromètre Qualité &bull; Axe 2
              </span>
              <h1 style="color: #ffffff; margin: 6px 0 0 0; font-size: 22px; font-weight: 800;">
                Nouvelle évaluation parent transmise
              </h1>
              <p style="color: #ccfbf1; margin: 4px 0 0 0; font-size: 13px;">
                ${nomStructure} &bull; ${titreCampagne}
              </p>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding: 30px;">

              <!-- Carte Informations Parent -->
              <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #115e59;">
                  👤 Informations du parent déclarant
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #0f766e;">
                  <tr>
                    <td style="padding: 3px 0; font-weight: 600; width: 130px;">Nom & Prénom :</td>
                    <td style="padding: 3px 0; color: #134e4a; font-weight: 700;">${parentNom}</td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0; font-weight: 600;">Adresse email :</td>
                    <td style="padding: 3px 0; color: #134e4a;">
                      <a href="mailto:${parentEmail}" style="color: #0d9488; text-decoration: underline;">${parentEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 3px 0; font-weight: 600;">Date & Heure :</td>
                    <td style="padding: 3px 0; color: #134e4a;">${dateFormatted}</td>
                  </tr>
                </table>
              </div>

              <!-- Titre réponses -->
              <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 800; color: #0f172a;">
                📊 Détail des réponses de l'évaluation
              </h3>

              <!-- Table des questions & réponses -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 26px; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f1f5f9; border-bottom: 2px solid #e2e8f0;">
                    <th style="padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">
                      Question
                    </th>
                    <th style="padding: 10px 14px; text-align: right; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">
                      Réponse
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${reponsesRows}
                </tbody>
              </table>

              <!-- Bouton d'action Admin -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 20px auto;">
                <tr>
                  <td align="center" style="border-radius: 12px; background-color: #0d9488;">
                    <a href="${lienAdmin}" target="_blank" style="display: inline-block; padding: 14px 30px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);">
                      Consulter les résultats dans l'administration &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
                Vous recevez cette notification car votre adresse email est configurée comme destinataire des alertes de cette enquête.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                &copy; ${annee} RZPan'Da &bull; Module Qualité & Traçabilité Petite Enfance
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Envoie une notification par email lors de la soumission d'une nouvelle évaluation
 * Destinataires : emails de notification de la campagne + ADMIN_EMAIL dans .env
 */
export async function envoyerNotificationNouvelleEvaluation(
  params: NotificationNouvelleEvaluationParams
): Promise<{ success: boolean; sentTo?: string[]; error?: string }> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    
    // Regrouper et dédoublonner les destinataires avec ADMIN_EMAIL
    const allEmails = new Set<string>();
    
    (params.destinataires || []).forEach((e) => {
      const clean = e.trim().toLowerCase();
      if (clean && clean.includes("@")) allEmails.add(clean);
    });

    if (adminEmail && adminEmail.includes("@")) {
      allEmails.add(adminEmail.toLowerCase());
    }

    const recipients = Array.from(allEmails);
    if (recipients.length === 0) {
      console.warn("[envoyerNotificationNouvelleEvaluation] Aucun destinataire configuré.");
      return { success: true, sentTo: [] };
    }

    const transporter = createTransporter();
    const expediteur = process.env.SMTP_FROM || '"RZPan\'Da" <info@rzpanda.com>';

    await transporter.sendMail({
      from: expediteur,
      to: recipients.join(", "),
      subject: `🔔 Nouvelle évaluation parent reçue — ${params.titreCampagne} (${params.parentNom})`,
      html: getEmailNouvelleEvaluationHtml(params),
      text: `Nouvelle évaluation parent reçue pour ${params.nomStructure} - Campagne : ${params.titreCampagne}\n\nParent : ${params.parentNom} (${params.parentEmail})\nDate : ${params.dateSoumission.toLocaleString("fr-FR")}\n\nAccédez à l'administration : ${params.lienAdmin}`,
    });

    console.log(`[envoyerNotificationNouvelleEvaluation] Notification envoyée avec succès à ${recipients.join(", ")}`);
    return { success: true, sentTo: recipients };
  } catch (error) {
    console.error("[envoyerNotificationNouvelleEvaluation] Erreur envoi SMTP :", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de l'envoi de la notification",
    };
  }
}

