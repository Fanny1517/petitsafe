# Plan d'implémentation : Envoi d'emails et réinitialisation de mot de passe

Ce plan d'implémentation détaille l'intégration de `nodemailer` pour la page de contact et la mise en place d'une page de réinitialisation de mot de passe avec le flux d'authentification Supabase.

## User Review Required

> [!IMPORTANT]
> - L'Option A utilise `nodemailer` avec Brevo SMTP. Les variables d'environnement SMTP doivent être définies dans `.env.local` et sur Vercel.
> - Pour que la réinitialisation de mot de passe fonctionne sur Supabase en local, les URL de redirection doivent être configurées dans le dashboard Supabase.

## Proposed Changes

### Configuration & Dépendances

#### [MODIFY] [package.json](file:///c:/Users/mbolo/Documents/Work/Start/petitsafe/package.json)
* Ajout de `nodemailer` aux dépendances et `@types/nodemailer` aux dépendances de développement.

#### [MODIFY] [.env.local](file:///c:/Users/mbolo/Documents/Work/Start/petitsafe/.env.local)
* Ajout des variables d'environnement SMTP Brevo.

---

### Envoi d'emails (Formulaire de contact)

#### [MODIFY] [contact.ts](file:///c:/Users/mbolo/Documents/Work/Start/petitsafe/src/app/actions/contact.ts)
* Utilisation de `nodemailer` pour configurer le transporteur SMTP.
* Envoi de deux emails distincts lors de la soumission du formulaire :
  1. Un email à `contact@rzpanda.com` avec le message du client (Reply-To réglé sur l'email du client).
  2. Un accusé de réception à l'email du client.

---

### Réinitialisation de mot de passe (Auth Flow)

#### [MODIFY] [forgot-password/page.tsx](file:///c:/Users/mbolo/Documents/Work/Start/petitsafe/src/app/(auth)/forgot-password/page.tsx)
* Modification du paramètre `redirectTo` dans `supabase.auth.resetPasswordForEmail` pour pointer vers `${window.location.origin}/reset-password`.

#### [MODIFY] [middleware.ts](file:///c:/Users/mbolo/Documents/Work/Start/petitsafe/src/middleware.ts)
* Ajout de `/reset-password` dans la liste `publicRoutes` pour permettre l'affichage du formulaire de réinitialisation avant que la session temporaire ne soit pleinement active.
* Interception de la query string `code` (ex: `?code=...`) à la racine `/` ou sur d'autres routes, échange du code contre une session via `supabase.auth.exchangeCodeForSession(code)`, puis redirection propre vers `/reset-password` en nettoyant l'URL.

#### [NEW] [reset-password/page.tsx](file:///c:/Users/mbolo/Documents/Work/Start/petitsafe/src/app/(auth)/reset-password/page.tsx)
* Création du formulaire de saisie du nouveau mot de passe (avec confirmation).
* Appel de `supabase.auth.updateUser` pour modifier le mot de passe.
* Déconnexion automatique (`supabase.auth.signOut()`) en cas de succès pour forcer l'utilisateur à se reconnecter avec ses nouveaux identifiants, puis redirection vers `/login`.


---

## Verification Plan

### Automated Tests
* Lancement des tests unitaires existants :
  `powershell -ExecutionPolicy Bypass -Command "npm run test"`

### Manual Verification
* Soumission du formulaire de contact et vérification de la bonne réception des logs d'envoi.
* Test complet du flux de mot de passe oublié :
  1. Demande de réinitialisation sur `/forgot-password`.
  2. Clic sur le lien reçu et redirection vers `/reset-password`.
  3. Saisie du nouveau mot de passe, succès, déconnexion et redirection vers `/login`.
