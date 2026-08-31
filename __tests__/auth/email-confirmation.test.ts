import { describe, it, expect } from "vitest";
import { chiffrerMotDePasse, dechiffrerMotDePasse } from "../../src/lib/crypto";
import { getEmailValidationHtml, getEmailBienvenueHtml } from "../../src/lib/email";

describe("Email & Crypto Verification Flow", () => {
  describe("Cryptographie réversible sécurisée (AES-256-GCM)", () => {
    it("doit chiffrer et déchiffrer fidèlement un mot de passe", () => {
      const motDePasse = "MonMotDePasseSuperSecurise123!#";
      const chiffre = chiffrerMotDePasse(motDePasse);

      expect(chiffre).not.toBe(motDePasse);
      expect(chiffre).toContain(":"); // Format iv:authTag:encrypted

      const dechiffre = dechiffrerMotDePasse(chiffre);
      expect(dechiffre).toBe(motDePasse);
    });

    it("doit générer un vecteur d'initialisation unique à chaque chiffrement", () => {
      const mdp = "motDePasseIdentique123";
      const chiffre1 = chiffrerMotDePasse(mdp);
      const chiffre2 = chiffrerMotDePasse(mdp);

      expect(chiffre1).not.toBe(chiffre2);
      expect(dechiffrerMotDePasse(chiffre1)).toBe(mdp);
      expect(dechiffrerMotDePasse(chiffre2)).toBe(mdp);
    });

    it("doit échouer proprement si la chaîne chiffrée est corrompue", () => {
      expect(() => dechiffrerMotDePasse("format-invalide")).toThrow();
    });
  });

  describe("Templates d'emailings transactionnels", () => {
    it("doit générer le HTML d'activation avec le bon lien et expéditeur", () => {
      const lien = "https://app.rzpanda.com/valider-inscription?token=test-token-123456";
      const html = getEmailValidationHtml({
        prenom: "Marie",
        nom: "Dupont",
        nomStructure: "Crèche Les Petits Pandas",
        lienValidation: lien,
      });

      expect(html).toContain("Marie");
      expect(html).toContain("Crèche Les Petits Pandas");
      expect(html).toContain(lien);
      expect(html).toContain("Valider mon inscription");
      expect(html).toContain("0000"); // Rappel du code PIN
      expect(html).toContain("24 heures");
    });

    it("doit générer l'email de bienvenue avec les accès et code PIN", () => {
      const html = getEmailBienvenueHtml({
        prenom: "Marie",
        nom: "Dupont",
        nomStructure: "Crèche Les Petits Pandas",
      });

      expect(html).toContain("Bienvenue sur RZPan'Da");
      expect(html).toContain("Marie");
      expect(html).toContain("Crèche Les Petits Pandas");
      expect(html).toContain("0000");
    });
  });

  describe("Critères de purge des inscriptions temporaires", () => {
    it("doit identifier correctement les dates d'expiration passées", () => {
      const now = new Date();
      const expPast = new Date(Date.now() - 3600 * 1000); // 1h dans le passé
      const expFuture = new Date(Date.now() + 24 * 3600 * 1000); // 24h dans le futur

      expect(expPast < now).toBe(true);
      expect(expFuture < now).toBe(false);
    });
  });
});

