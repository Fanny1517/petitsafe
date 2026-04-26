import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions générales d'utilisation du service RZPan'Da.",
  alternates: { canonical: "/cgu" },
};

export default function CGUPage() {
  return (
    <>
      <h1>Conditions Générales d&apos;Utilisation</h1>
      <p className="meta">Dernière mise à jour : 26 avril 2026</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent l&apos;utilisation du service{" "}
        <strong>RZPan&apos;Da</strong>, plateforme SaaS de gestion HACCP, de traçabilité et de suivi
        pour les structures de la petite enfance (crèches, micro-crèches, MAM, assistantes
        maternelles).
      </p>

      <h2>2. Accès au service</h2>
      <p>
        L&apos;inscription à RZPan&apos;Da est <strong>réservée aux professionnels de la petite
        enfance</strong> exerçant une activité déclarée en France (gestionnaires de structure,
        directrices, agents agréés).
      </p>
      <ul>
        <li>1 compte = 1 structure (un même utilisateur peut être rattaché à plusieurs structures).</li>
        <li>
          Chaque agent travaille via un <strong>profil personnel protégé par un PIN</strong> à
          4 chiffres distinct du mot de passe principal du compte.
        </li>
        <li>
          L&apos;utilisateur s&apos;engage à fournir des informations exactes et à maintenir la
          confidentialité de ses identifiants.
        </li>
      </ul>

      <h2>3. Données saisies</h2>
      <p>
        L&apos;utilisateur (la structure) reste <strong>responsable de traitement</strong> des
        données qu&apos;il saisit dans la plateforme, notamment des données concernant les enfants
        accueillis (informations administratives, allergies, suivi médical, signalements,
        photographies). Il s&apos;engage à recueillir les autorisations nécessaires auprès des
        familles.
      </p>
      <p>
        RZPan&apos;Da agit en qualité de <strong>sous-traitant</strong> au sens du RGPD pour le
        compte de la structure.
      </p>

      <h2>4. Disponibilité</h2>
      <p>
        RZPan&apos;Da met en œuvre les moyens raisonnables pour garantir la disponibilité du
        service mais ne peut être tenu responsable d&apos;interruptions liées à la maintenance, à
        l&apos;hébergeur ou à des cas de force majeure.
      </p>

      <h2>5. Tarifs et résiliation</h2>
      <p>
        Le service est facturé selon les formules en vigueur. L&apos;utilisateur peut résilier son
        abonnement à tout moment depuis son compte ; les données sont alors conservées selon les
        durées indiquées dans la politique de confidentialité, puis supprimées.
      </p>

      <h2>6. Responsabilité</h2>
      <p>
        RZPan&apos;Da fournit un outil d&apos;aide à la conformité HACCP et ne se substitue pas aux
        obligations légales et réglementaires de la structure. La validité juridique des registres
        produits relève de la responsabilité de l&apos;utilisateur.
      </p>

      <h2>7. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au <strong>droit français</strong>. En cas de litige, et à
        défaut de résolution amiable, les tribunaux français seront seuls compétents.
      </p>
    </>
  );
}
