import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du service RZPan'Da : éditeur, hébergeur et stockage des données.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <h1>Mentions légales</h1>
      <p className="meta">Dernière mise à jour : 26 avril 2026</p>

      <h2>Éditeur du site</h2>
      <ul>
        <li><strong>Nom / Raison sociale :</strong> Fanny Zongo</li>
        <li><strong>Adresse :</strong> 12 rue de la Paix, 75002 Paris</li>
        <li><strong>SIRET :</strong> 123 456 789 00012</li>
        <li><strong>Email :</strong> contact@rzpanda.fr</li>
      </ul>

      <h2>Directeur de la publication</h2>
      <p>Fanny Zongo</p>

      <h2>Hébergeur</h2>
      <p>
        <strong>Vercel Inc.</strong>
        <br />
        340 S Lemon Ave #4133, Walnut, CA 91789, USA
        <br />
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
      </p>

      <h2>Base de données</h2>
      <p>
        <strong>Supabase Inc.</strong> — serveurs situés en Union Européenne (Irlande,{" "}
        <code>aws-eu-west-1</code>).
      </p>
      <p>
        Les données personnelles traitées par RZPan&apos;Da sont stockées exclusivement en Union
        Européenne.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site utilise uniquement des cookies <strong>techniques</strong> nécessaires à son
        fonctionnement (authentification, gestion de session). Aucun cookie de mesure d&apos;audience
        ou de publicité n&apos;est déposé.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du site (marque RZPan&apos;Da, logo, textes, illustrations, code) est
        protégé par le droit d&apos;auteur. Toute reproduction sans autorisation préalable est
        interdite.
      </p>
    </>
  );
}
