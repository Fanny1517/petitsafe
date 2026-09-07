import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du service RZPan'Da : éditeur, hébergeur et stockage des données.",
  alternates: { canonical: "/mentions-legales/" },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <h1>Mentions légales</h1>
      {/*<p className="meta">Dernière mise à jour : 26 avril 2026</p>*/}

      <h2>Éditeur du site</h2>
      <ul>
        <li><strong>Dénomination / Raison sociale :</strong> RZ PANDA</li>
        <li><strong>Forme juridique :</strong> Société par actions simplifiée</li>
        <li><strong>Capital social :</strong> 1000,00 Euros</li>
        <li><strong>Adresse du siège:</strong> 3500 Rennes</li>
        <li><strong>Immatriculation au RCS, numéro :</strong> 109 172 742 R.C.S Rennes</li>
        <li><strong>Numéro d'identification Européen - EUID :</strong> FR3501.109172742</li>
        <li><strong>Email :</strong> contact@rzpanda.com</li>
      </ul>

      <h2>Hébergeur</h2>
    
      <p>
        <strong>Vercel Inc.</strong>
        <br />
        440 N Barranca Avenue #4133, Covina, CA 91723, USA
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
