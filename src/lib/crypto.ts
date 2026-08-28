import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommandé pour GCM

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.DATABASE_URL || "rzpanda-default-encryption-key-must-be-secure-32b";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Chiffre une chaîne en AES-256-GCM (format ivHex:authTagHex:encryptedHex)
 */
export function chiffrerMotDePasse(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Déchiffre une chaîne chiffrée au format ivHex:authTagHex:encryptedHex
 */
export function dechiffrerMotDePasse(cipherText: string): string {
  const parts = cipherText.split(":");
  if (parts.length !== 3) {
    throw new Error("Format de chaîne chiffrée invalide (attendu iv:tag:data).");
  }

  const [ivHex, tagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const key = getEncryptionKey();

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export const encryptData = chiffrerMotDePasse;
export const decryptData = dechiffrerMotDePasse;
export function genererTokenValidation(): string {
  return crypto.randomBytes(32).toString("hex");
}
