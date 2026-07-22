import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "Contrôle DDPP en crèche : comment s’y préparer sans stress | RZPan'Da",
  description:
    "Préparer un contrôle DDPP en micro-crèche : les 7 documents attendus, les erreurs qui coûtent cher, la méthode pour sortir un dossier complet en 3 clics.",
};

export default function GuideDDPPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "Contrôle DDPP en crèche : comment s’y préparer sans stress",
            "description": "Préparer un contrôle DDPP en micro-crèche : les 7 documents attendus, les erreurs qui coûtent cher, la méthode pour sortir un dossier complet en 3 clics.",
            "inLanguage": "fr-FR",
            "publisher": {
              "@type": "Organization",
              "name": "RZPan'Da",
              "logo": {
                "@type": "ImageObject",
                "url": "https://rzpanda.fr/logo.png"
              }
            },
            "author": {
              "@type": "Person",
              "name": "Fanny Zongo"
            },
            "datePublished": "2026-04-26",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://rzpanda.fr/guides/controle-ddpp-creche-preparation"
            }
          })
        }}
      />
      <Navbar />
      <main id="main">
        <article className="pb-20 pt-28 md:pt-36 bg-white">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            {/* Header */}
            <div className="mb-10">
              <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 border border-blue-100">
                Guide DDPP
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl leading-tight">
                Contrôle DDPP en crèche : la méthode pour être prête à tout moment
              </h1>
              <p className="mt-5 text-lg text-gray-500 md:text-xl leading-relaxed">
                Un contrôle DDPP se joue sur la traçabilité. Voici les 7 documents toujours attendus, les pièges à éviter, et comment réunir tout ça en 3 clics.
              </p>
              <div className="mt-6">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-[22px] py-[14px] text-base font-semibold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
                  aria-label="Démarrer l'essai gratuit"
                >
                  Démarrer l'essai gratuit
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none text-gray-800">
              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Ce que la DDPP vérifie en priorité
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Lors d'une inspection de la Direction Départementale de la Protection des Populations (DDPP, anciennement Services Vétérinaires), l'inspecteur se concentre sur les éléments qui garantissent la sécurité sanitaire des aliments servis aux enfants. Cela inclut la conformité des locaux de préparation, l'état de propreté et d'entretien des équipements, l'application stricte des règles d'hygiène par le personnel (lavage des mains, port de tenues adaptées), le respect des températures de conservation, et surtout l'existence et la tenue rigoureuse du Plan de Maîtrise Sanitaire (PMS). L'objectif est de s'assurer de l'absence de tout risque microbiologique ou chimique pouvant nuire à la santé des tout-petits.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Les 7 documents à avoir sous la main
              </h2>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                1. Relevés de température
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Obligateurs dans le cadre du HACCP, les relevés de température doivent être effectués quotidiennement sur vos équipements réfrigérés (entre 0 °C et 4 °C) et sur vos plats chauds avant service (minimum 63 °C). Chaque relevé doit être daté, signé par l'auxiliaire responsable et conservé 3 ans. En cas de dépassement, une action corrective doit être immédiatement tracée.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                2. Traçabilité des lots alimentaires
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Pour chaque livraison, vous devez enregistrer le nom du fournisseur, la date de livraison, le numéro de lot et la DLC (Date Limite de Consommation) de chaque produit. Ces informations permettent, en cas d'alerte sanitaire, de retrouver en quelques secondes l'origine d'un produit servi aux enfants. Conservez également les bons de livraison 3 ans minimum.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                3. Plan de nettoyage et émargement
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Votre plan de nettoyage définit les tâches de nettoyage et désinfection à réaliser quotidiennement, hebdomadairement et mensuellement (surfaces, équipements, réfrigérateurs, sols, toilettes). Chaque tâche doit être signée par l'auxiliaire qui l'a réalisée. Sans émargement, le nettoyage n'est pas considéré comme prouvé lors d'une inspection PMI ou sanitaire.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                4. Plats témoins
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Obligation réglementaire souvent méconnue : pour tout repas préparé ou réchauffé sur place, vous devez conserver un échantillon de chaque plat (environ 100 g) pendant 5 jours à une température entre 0 °C et 4 °C. En cas d'intoxication alimentaire, ces échantillons permettent aux autorités d'identifier l'aliment en cause et de vous protéger juridiquement.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                5. PMS (Plan de Maîtrise Sanitaire)
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Le PMS est le document central de votre démarche HACCP. Il regroupe l'ensemble de vos procédures d'hygiène et de sécurité alimentaire : BPH (bonnes pratiques d'hygiène), plan de nettoyage, gestion des allergènes, procédures en cas de rupture de la chaîne du froid, et formation du personnel. Il doit être accessible à tout moment lors d'une inspection et mis à jour régulièrement.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                6. Registre biberonnerie
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Si votre crèche prépare des biberons, vous devez tenir un registre détaillant pour chaque biberon : le nom de l'enfant, le type de lait (maternel ou infantile), la quantité préparée, l'heure de préparation, la température et la quantité consommée. Ce registre est obligatoire et fait l'objet d'un contrôle systématique lors des visites de la PMI.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                7. Formation du personnel
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Tout personnel en contact avec les aliments doit avoir reçu une formation à l'hygiène alimentaire (règlement CE 852/2004). Conservez les attestations de formation de chaque salarié, ainsi que le programme des formations réalisées. En cas d'inspection, l'absence de justificatif de formation peut entraîner une mise en demeure.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Les 3 erreurs qui coûtent cher
              </h2>
              
              <h3 className="mt-8 text-lg font-bold text-red-600">
                Erreur n°1 — Ne pas archiver les relevés de température.
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                C'est l'infraction la plus fréquemment relevée lors des contrôles sanitaires. Sans historique daté et signé, vous ne pouvez pas prouver que la chaîne du froid a été respectée — même si c'est le cas. Résultat : mise en demeure, voire fermeture temporaire de la structure.
              </p>

              <h3 className="mt-8 text-lg font-bold text-red-600">
                Erreur n°2 — Confondre PMS existant et PMS à jour.
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Avoir un PMS rédigé il y a 5 ans sans le mettre à jour équivaut à ne pas en avoir. Votre plan doit refléter votre organisation actuelle, vos équipements et votre personnel en poste.
              </p>

              <h3 className="mt-8 text-lg font-bold text-red-600">
                Erreur n°3 — Oublier les plats témoins.
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Cette obligation est souvent ignorée, surtout dans les petites structures. En cas d'intoxication alimentaire collective (TIAC) sans plat témoin conservé, votre responsabilité peut être directement engagée, sans possibilité de vous défendre face aux assurances ou aux autorités.
              </p>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-[22px] py-[14px] text-base font-semibold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
                  aria-label="Démarrer l'essai gratuit 30 jours"
                >
                  Démarrer l'essai gratuit 30 jours
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Sortir votre dossier en 3 clics
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                C'est pour simplifier ce quotidien administratif que nous avons conçu RZPan'Da. Plutôt que de manipuler des classeurs papier volumineux et de risquer d'oublier des relevés, notre application vous permet d'enregistrer vos températures de frigo, la traçabilité des étiquettes et l'émargement du plan de nettoyage en quelques secondes sur tablette. Lors d'une inspection DDPP ou PMI, il vous suffit de vous rendre dans l'onglet 'Exports DDPP', de sélectionner la période demandée et de générer un rapport PDF complet. Tout est propre, horodaté et instantanément accessible.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Pour en savoir plus sur l'évolution des réglementations en crèche, consultez notre <Link href="/guides/decret-2025-304-micro-creche" className="text-blue-600 hover:underline">guide complet sur le décret 2025-304</Link>.
              </p>
            </div>

            {/* Aside Callout Box */}
            <aside className="mt-16 rounded-2xl border border-blue-100 bg-blue-50/30 p-6 md:p-8">
              <h2 className="text-xl font-extrabold text-gray-900">
                Mettez-vous en conformité sans y passer vos soirées.
              </h2>
              <p className="mt-3 text-base text-gray-500 leading-relaxed">
                RZPan'Da couvre HACCP, biberonnerie ANSES, suivi enfants et exports DDPP. Essai gratuit 30 jours, sans carte bancaire.
              </p>
              <div className="mt-6">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
                  aria-label="Démarrer l'essai gratuit 30 jours"
                >
                  Démarrer l'essai gratuit 30 jours
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
