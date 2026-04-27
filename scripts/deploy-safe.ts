/**
 * Déploiement sécurisé : backup BDD frais → git add . → git commit → git push.
 *
 * Usage : npm run deploy-safe "message du commit"
 *
 * Si rien n'a changé après le backup, le commit est sauté et le script termine
 * sans erreur (le backup local reste utile en soi).
 */
import { spawnSync } from "child_process";

function run(cmd: string, args: string[]): void {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: false });
  if (res.status !== 0) {
    console.error(`✗ Échec : ${cmd} ${args.join(" ")}`);
    process.exit(res.status ?? 1);
  }
}

function hasChanges(): boolean {
  const res = spawnSync("git", ["status", "--porcelain"], { encoding: "utf8" });
  return (res.stdout ?? "").trim().length > 0;
}

const message = process.argv[2];
if (!message || !message.trim()) {
  console.error('Usage : npm run deploy-safe "message du commit"');
  process.exit(1);
}

console.log("─── 1/4 Backup BDD ───");
run("npm", ["run", "backup"]);

console.log("\n─── 2/4 git add . ───");
run("git", ["add", "."]);

if (!hasChanges()) {
  console.log("\n✓ Rien à committer — déploiement terminé (backup local créé).");
  process.exit(0);
}

console.log("\n─── 3/4 git commit ───");
run("git", ["commit", "-m", message]);

console.log("\n─── 4/4 git push ───");
run("git", ["push"]);

console.log("\n✓ Déploiement terminé avec succès.");
