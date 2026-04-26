import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité RZPan'Da : données collectées, finalités, durées de conservation et droits RGPD.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p className="meta">Dernière mise à jour : 26 avril 2026</p>

      <p>
        RZPan&apos;Da accorde une importance particulière à la protection des données personnelles.
        La présente politique décrit les traitements mis en œuvre dans le cadre du service.
      </p>

      <h2>1. Données collectées</h2>
      <h3>Professionnels (utilisateurs du compte)</h3>
      <ul>
        <li>Identité : prénom, nom, email, fonction.</li>
        <li>Données de connexion : mot de passe (haché), PIN profil (haché), logs techniques.</li>
        <li>Structure de rattachement.</li>
      </ul>
      <h3>Enfants accueillis</h3>
      <ul>
        <li>Identité : prénom, nom, date de naissance, photographie (facultative).</li>
        <li>Référents légaux : nom, coordonnées.</li>
        <li>Données de santé : allergies, régimes, PAI, traitements médicamenteux ponctuels.</li>
        <li>Suivi quotidien : repas, sommeil, soins, signalements, transmissions aux familles.</li>
      </ul>

      <h2>2. Finalités</h2>
      <ul>
        <li>Tenue du registre <strong>HACCP</strong> et de la traçabilité alimentaire.</li>
        <li>Suivi quotidien des enfants accueillis (transmissions, signalements, biberonnerie).</li>
        <li>
          Conformité aux obligations de la structure (DDPP, PMI, registre des médicaments,
          biberonnerie ANSES, plan de nettoyage).
        </li>
        <li>Sécurité du service (authentification, journalisation des accès).</li>
      </ul>

      <h2>3. Bases légales</h2>
      <ul>
        <li><strong>Exécution du contrat</strong> avec la structure abonnée.</li>
        <li><strong>Obligation légale</strong> de la structure (réglementation petite enfance, HACCP).</li>
        <li><strong>Intérêt légitime</strong> pour la sécurité et l&apos;amélioration du service.</li>
      </ul>

      <h2>4. Durées de conservation</h2>
      <ul>
        <li>
          <strong>Registres HACCP, traçabilité alimentaire, biberonnerie :</strong> 3 ans (durée
          réglementaire de contrôle DDPP).
        </li>
        <li>
          <strong>Données de suivi enfant et signalements :</strong> 5 ans après le départ de
          l&apos;enfant de la structure.
        </li>
        <li>
          <strong>Compte professionnel :</strong> pendant la durée de l&apos;abonnement, puis
          suppression dans les 30 jours suivant la résiliation (sauf obligation légale).
        </li>
        <li><strong>Logs techniques :</strong> 12 mois.</li>
      </ul>

      <h2>5. Sous-traitants</h2>
      <p>RZPan&apos;Da fait appel aux prestataires suivants :</p>
      <ul>
        <li>
          <strong>Supabase Inc.</strong> — base de données et authentification, serveurs en Union
          Européenne (Irlande, <code>aws-eu-west-1</code>).
        </li>
        <li><strong>Vercel Inc.</strong> — hébergement applicatif.</li>
        <li><strong>GitHub Inc.</strong> — hébergement du code source et CI.</li>
      </ul>
      <p>
        Les transferts éventuels hors UE sont encadrés par les clauses contractuelles types de la
        Commission européenne.
      </p>

      <h2>6. Droits RGPD</h2>
      <p>
        Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits
        suivants :
      </p>
      <ul>
        <li>Droit d&apos;<strong>accès</strong> à vos données.</li>
        <li>Droit de <strong>rectification</strong>.</li>
        <li>Droit à l&apos;<strong>effacement</strong> (« droit à l&apos;oubli »).</li>
        <li>Droit à la <strong>limitation</strong> et à l&apos;<strong>opposition</strong>.</li>
        <li>Droit à la <strong>portabilité</strong> de vos données.</li>
      </ul>
      <p>
        Pour les données concernant les enfants, ces droits s&apos;exercent auprès de la structure
        responsable du traitement.
      </p>

      <h2>7. Contact DPO</h2>
      <p>
        Pour toute question relative à vos données ou pour exercer vos droits :{" "}
        <strong>[EMAIL À REMPLIR]</strong>
      </p>

      <h2>8. Réclamation</h2>
      <p>
        Vous avez le droit d&apos;introduire une réclamation auprès de la{" "}
        <strong>CNIL</strong> :{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
          www.cnil.fr/fr/plaintes
        </a>
        .
      </p>
    </>
  );
}
