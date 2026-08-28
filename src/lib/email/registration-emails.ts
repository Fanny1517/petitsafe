import nodemailer from "nodemailer";

interface EmailValidationParams {
  email: string;
  prenom: string;
  nom: string;
  nomStructure: string;
  token: string;
}

interface EmailBienvenueParams {
  email: string;
  prenom: string;
  nom: string;
  nomStructure: string;
}

/**
 * Crée le transporteur Nodemailer réutilisable basé sur les variables d'environnement
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.office365.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || "info@rzpanda.com";
  const pass = process.env.SMTP_PASS;

  if (!pass) {
    throw new Error("Configuration SMTP incomplète (process.env.SMTP_PASS manquant).");
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    }),
    senderEmail: process.env.SMTP_FROM || user,
  };
}

/**
 * Envoie l'email contenant le lien de validation pour finaliser l'inscription.
 */
export async function envoyerEmailValidation({
  email,
  prenom,
  nom,
  nomStructure,
  token,
}: EmailValidationParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { transporter, senderEmail } = getTransporter();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const validationUrl = `${appUrl}/valider-inscription?token=${token}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Validez votre inscription RZPan'Da</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
    
    <!-- En-tête avec bannière & logo -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center;">
      <div style="display: inline-block; background: #ffffff; width: 56px; height: 56px; line-height: 56px; border-radius: 50%; font-size: 28px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
        🐼
      </div>
      <h1 style="color: #ffffff; margin: 12px 0 4px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
        RZPan'Da
      </h1>
      <p style="color: #94a3b8; margin: 0; font-size: 13px; font-weight: 500;">
        Conformité HACCP &amp; Traçabilité Petite Enfance
      </p>
    </div>

    <!-- Contenu principal -->
    <div style="padding: 32px 28px;">
      <h2 style="font-size: 19px; color: #0f172a; margin-top: 0; margin-bottom: 16px; font-weight: 600;">
        Bonjour ${prenom} ${nom},
      </h2>
      
      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
        Merci d'avoir initié la création de votre espace pour la structure <strong>« ${nomStructure} »</strong> sur <strong>RZPan'Da</strong>.
      </p>

      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 28px;">
        Pour activer définitivement votre compte administrateur et accéder à votre tableau de bord, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
      </p>

      <!-- Bouton d'action -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${validationUrl}" 
           style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);">
          ✅ Valider mon inscription
        </a>
      </div>

      <!-- Bloc d'information d'expiration -->
      <div style="background-color: #f1f5f9; border-left: 4px solid #0d9488; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
          ⏱️ <strong>Lien sécurisé valable 24 heures.</strong> Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
        </p>
      </div>

      <!-- Lien alternatif -->
      <p style="font-size: 12px; color: #64748b; margin-top: 24px; line-height: 1.5; word-break: break-all;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
        <a href="${validationUrl}" style="color: #0d9488; text-decoration: underline;">${validationUrl}</a>
      </p>
    </div>

    <!-- Pied de page -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} RZPan'Da — Tous droits réservés.</p>
      <p style="margin: 0;">Plateforme dédiée aux crèches, micro-crèches, MAM et assistant(e)s maternel(le)s.</p>
    </div>

  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"RZPan'Da" <${senderEmail}>`,
      to: email,
      subject: "Validez votre inscription sur RZPan'Da",
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error("[envoyerEmailValidation] Erreur:", error);
    const detail = error instanceof Error ? error.message : "Erreur inconnue";
    return { success: false, error: detail };
  }
}

/**
 * Envoie l'email de bienvenue une fois l'inscription activée avec succès.
 */
export async function envoyerEmailBienvenue({
  email,
  prenom,
  nom,
  nomStructure,
}: EmailBienvenueParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { transporter, senderEmail } = getTransporter();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const loginUrl = `${appUrl}/login`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur RZPan'Da</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
    
    <!-- En-tête festif -->
    <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 36px 24px; text-align: center;">
      <div style="display: inline-block; background: #ffffff; width: 64px; height: 64px; line-height: 64px; border-radius: 50%; font-size: 32px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
        🎉
      </div>
      <h1 style="color: #ffffff; margin: 14px 0 4px 0; font-size: 24px; font-weight: 700;">
        Félicitations &amp; Bienvenue !
      </h1>
      <p style="color: #ccfbf1; margin: 0; font-size: 14px; font-weight: 500;">
        Votre structure « ${nomStructure} » est prête
      </p>
    </div>

    <!-- Contenu principal -->
    <div style="padding: 32px 28px;">
      <h2 style="font-size: 18px; color: #0f172a; margin-top: 0; margin-bottom: 14px; font-weight: 600;">
        Bonjour ${prenom} ${nom},
      </h2>
      
      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
        Votre adresse email est confirmée et votre espace <strong>RZPan'Da</strong> est désormais 100% opérationnel.
      </p>

      <!-- Récapitulatif des identifiants & astuce PIN -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-top: 0; margin-bottom: 12px;">
          Vos informations de connexion
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;">Identifiant / Email :</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Structure créée :</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${nomStructure}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Rôle :</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0d9488;">Gestionnaire &amp; Administrateur</td>
          </tr>
        </table>
      </div>

      <!-- Encart important PIN par défaut -->
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px; margin-bottom: 28px;">
        <div style="display: flex; align-items: flex-start;">
          <div>
            <p style="margin: 0 0 6px 0; font-weight: 700; color: #1e40af; font-size: 14px;">
              🔑 Code PIN initial pour l'équipe : 0000
            </p>
            <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">
              Un profil administrateur principal (« Directrice ») a été initialisé avec le mot de passe PIN par défaut <strong>0000</strong> pour déverrouiller vos sessions tablettes et transmissions. Vous pourrez le personnaliser à tout moment dans <strong>Paramètres → Équipe</strong>.
            </p>
          </div>
        </div>
      </div>

      <!-- Bouton d'accès direct -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${loginUrl}" 
           style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);">
          Accéder à mon espace
        </a>
      </div>
    </div>

    <!-- Pied de page -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} RZPan'Da — Simplifiez votre quotidien en crèche.</p>
      <p style="margin: 0;">Besoin d'aide ? Répondez directement à cet email ou contactez notre support.</p>
    </div>

  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"RZPan'Da" <${senderEmail}>`,
      to: email,
      subject: "Bienvenue sur RZPan'Da — Votre compte est activé !",
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error("[envoyerEmailBienvenue] Erreur:", error);
    const detail = error instanceof Error ? error.message : "Erreur inconnue";
    return { success: false, error: detail };
  }
}
