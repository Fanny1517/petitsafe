# PetitSafe

Application de gestion HACCP et de suivi quotidien pour structures de la petite enfance (crèches, micro-crèches, MAM, assistantes maternelles).

Stack : Next.js 14 (App Router), Prisma 5, Supabase (Postgres + Auth), TypeScript, Tailwind CSS.

---

## Démarrage rapide

```bash
npm install
cp .env.example .env.local   # remplir DATABASE_URL, DIRECT_URL, clés Supabase
npm run db:migrate
npm run dev
```

---

## Backup & restauration de la base de données

Un backup automatique tourne tous les jours à 03:00 UTC via GitHub Actions
(`.github/workflows/backup.yml`). Le résultat est stocké comme artifact GitHub
(rétention 30 jours, gratuit dans la limite des quotas du dépôt).

### Lancer un backup manuel (en local)

Dump JSON complet de toutes les tables Prisma vers `backups/backup-YYYY-MM-DD.json` :

```bash
npm run backup
```

Le dossier `backups/` est ignoré par git.

Pour déclencher le workflow GitHub à la demande : onglet **Actions** → **Backup
BDD quotidien** → **Run workflow**. L'artifact est ensuite téléchargeable depuis
la page du run.

### Restaurer depuis un fichier de backup

```bash
npm run restore -- backups/backup-2026-04-27.json
# ou directement :
tsx scripts/restore-db.ts backups/backup-2026-04-27.json
```

Le script utilise `upsert` table par table, dans un ordre qui respecte les
contraintes de clé étrangère (parents avant enfants). Les lignes existantes
sont mises à jour, les manquantes sont créées.

⚠ Avant une restauration en production, valider d'abord sur une base de
préproduction. Les `id` UUID du backup sont conservés tels quels.

### Secrets GitHub requis

Le workflow `backup.yml` lit deux secrets depuis **Settings → Secrets and
variables → Actions** :

- `DATABASE_URL` — URL pooled Supabase (avec `pgbouncer=true`).
- `DIRECT_URL` — URL directe (port 5432) pour les migrations Prisma.

---

## Scripts npm

| Commande              | Description                                        |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | Démarre le serveur de développement Next.js        |
| `npm run build`       | Build de production                                |
| `npm run start`       | Démarre le serveur de production                   |
| `npm run lint`        | Lint Next.js                                       |
| `npm run test`        | Tests unitaires (Vitest)                           |
| `npm run test:e2e`    | Tests end-to-end (Playwright)                      |
| `npm run db:migrate`  | Applique les migrations Prisma                     |
| `npm run db:seed`     | Seed la base via `prisma/seed.ts`                  |
| `npm run db:studio`   | Ouvre Prisma Studio                                |
| `npm run backup`      | Dump JSON complet de la BDD vers `backups/`        |
| `npm run restore --`  | Restaure depuis un fichier de backup               |
