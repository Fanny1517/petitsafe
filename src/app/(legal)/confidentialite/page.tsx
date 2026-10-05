import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité RZPan'Da : données collectées, finalités, durées de conservation et droits RGPD.",
  alternates: { canonical: "/confidentialite/" },
};

export default function ConfidentialitePage() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p className="meta">Dernière mise à jour : 5 octobre 2026</p>

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
      <h3>Familles répondant aux enquêtes de satisfaction</h3>
      <p>
        Voir la section 6, dédiée aux enquêtes de satisfaction auprès des familles.
      </p>

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
          <strong>Supabase Inc.</strong> : base de données et authentification, serveurs en Union
          européenne (Irlande, <code>aws-eu-west-1</code>).
        </li>
        <li><strong>Vercel Inc.</strong> : hébergement applicatif.</li>
        <li><strong>GitHub Inc.</strong> : hébergement du code source et CI.</li>
        {/* À valider DPO : confirmer le prestataire SMTP effectivement utilisé en production (IONOS, Microsoft 365) */}
        <li>
          <strong>IONOS SE</strong> : envoi des emails transactionnels (notifications, réinitialisation
          de mot de passe, alertes d&apos;enquêtes).
        </li>
      </ul>
      <p>
        Les transferts éventuels hors UE sont encadrés par les clauses contractuelles types de la
        Commission européenne.
      </p>

      {/*
        VALIDATION DPO OBLIGATOIRE avant activation publique du module Enquêtes familles.
        Contenu décrit d'après le code actuel : src/app/actions/enquetes.ts,
        src/components/qualite/enquete-parent-form.tsx, src/lib/email.ts.
      */}
      <h2>6. Enquêtes de satisfaction auprès des familles</h2>
      <p>
        Les structures abonnées peuvent diffuser des questionnaires de satisfaction aux familles
        des enfants accueillis, dans le cadre de leur démarche qualité (référentiel national de la
        qualité d&apos;accueil, plan d&apos;amélioration de la qualité, évaluation quinquennale).
      </p>

      <h3>Responsable du traitement</h3>
      <p>
        La structure d&apos;accueil qui diffuse l&apos;enquête est responsable du traitement.
        RZPan&apos;Da intervient en qualité de sous-traitant et héberge les réponses pour son compte.
      </p>

      <h3>Données collectées</h3>
      <ul>
        <li>Nom et prénom du parent répondant.</li>
        <li>Adresse email du parent répondant.</li>
        <li>Réponses au questionnaire : notes de 1 à 5, réponses oui ou non.</li>
        <li>Commentaires libres facultatifs (verbatims), lorsque le questionnaire en prévoit.</li>
        <li>Date et heure de la soumission.</li>
      </ul>
      <p>
        Aucune donnée concernant l&apos;enfant n&apos;est demandée. Nous recommandons aux familles de ne
        pas indiquer, dans les commentaires libres, d&apos;informations de santé ni de données
        permettant d&apos;identifier un enfant, un professionnel ou une autre famille.
      </p>

      <h3>Caractère nominatif des réponses</h3>
      <p>
        Les réponses ne sont pas anonymes : elles sont rattachées au nom et à l&apos;adresse email
        du répondant et sont consultables individuellement par la structure. Les résultats
        présentés dans les tableaux de bord (moyennes, répartitions, taux de satisfaction) sont
        agrégés, mais les verbatims et le détail par répondant restent accessibles aux personnes
        habilitées de la structure.
      </p>

      <h3>Finalités</h3>
      <ul>
        <li>Mesurer la satisfaction des familles et suivre son évolution.</li>
        <li>
          Alimenter l&apos;autoévaluation, le plan d&apos;amélioration de la qualité et le dossier
          d&apos;évaluation de la structure.
        </li>
        <li>
          Garantir la sincérité des résultats : une seule réponse est acceptée par adresse email et
          par enquête.
        </li>
        <li>Informer en temps réel les personnes désignées par la structure de chaque nouvelle réponse.</li>
      </ul>

      <h3>Base légale</h3>
      <p>
        {/* À valider DPO : intérêt légitime ou consentement */}
        Le traitement repose sur l&apos;<strong>intérêt légitime</strong> de la structure à évaluer et
        améliorer la qualité de son accueil. La participation à l&apos;enquête est facultative.
      </p>

      <h3>Destinataires</h3>
      <ul>
        <li>Les utilisateurs habilités de la structure ayant accès au module qualité.</li>
        <li>
          Les adresses email de notification renseignées par la structure, qui reçoivent pour chaque
          réponse le nom, l&apos;email du parent et le contenu de ses réponses.
        </li>
        <li>Les sous-traitants techniques listés à la section 5 (hébergement, envoi d&apos;emails).</li>
      </ul>
      <p>Les réponses ne sont ni vendues, ni cédées, ni utilisées à des fins commerciales.</p>

      <h3>Lien de réponse et jeton d&apos;accès</h3>
      <p>
        Chaque enquête dispose d&apos;un lien unique contenant un jeton aléatoire, commun à toutes les
        familles destinataires. Ce jeton permet uniquement d&apos;afficher le questionnaire et
        d&apos;y répondre : il ne donne accès ni aux réponses des autres familles, ni à aucune autre
        donnée de la structure, et ne nécessite pas de création de compte. Le lien cesse de
        fonctionner lorsque la structure clôture l&apos;enquête, lorsque la date de fin est dépassée,
        lorsque le nombre de réponses prévu est atteint ou lorsque l&apos;enquête est supprimée.
      </p>

      <h3>Durée de conservation</h3>
      <p>
        {/* À valider DPO : fixer une durée maximale (ex. cycle d'évaluation de 5 ans) puis l'automatiser */}
        Les réponses sont conservées tant que la structure n&apos;a pas supprimé l&apos;enquête
        correspondante. La suppression d&apos;une enquête efface définitivement l&apos;ensemble des
        réponses associées. En cas de résiliation de l&apos;abonnement, les règles de la section 4
        s&apos;appliquent.
      </p>

      <h3>Droits des familles</h3>
      <p>
        Les parents répondants disposent des droits listés à la section 7. Ils les exercent en
        priorité auprès de la structure d&apos;accueil, responsable du traitement, ou à défaut via
        l&apos;adresse indiquée à la section 8, qui transmettra la demande à la structure concernée.
      </p>

      <h2>7. Droits RGPD</h2>
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
        Pour les données concernant les enfants et les réponses aux enquêtes de satisfaction, ces
        droits s&apos;exercent auprès de la structure responsable du traitement.
      </p>

      <h2>8. Contact DPO</h2>
      <p>
        Pour toute question relative à vos données ou pour exercer vos droits :{" "}
        <strong><a href="mailto:contact@rzpanda.com" target="_blank" rel="noopener noreferrer">contact@rzpanda.com</a></strong>
      </p>

      <h2>9. Réclamation</h2>
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
