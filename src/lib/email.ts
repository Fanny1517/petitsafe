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
