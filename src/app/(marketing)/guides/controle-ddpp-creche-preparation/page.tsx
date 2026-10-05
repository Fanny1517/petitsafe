import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { buildMarketingMetadata, SITE_URL } from "@/lib/seo";

const DESCRIPTION =
  "Préparez un contrôle DDPP en crèche : documents, traçabilité, relevés, PMS et actions correctives à adapter à l’activité réelle de votre structure.";

export const metadata = buildMarketingMetadata({
  title: "Contrôle DDPP crèche : documents et préparation",
  description: DESCRIPTION,
  path: "/guides/controle-ddpp-creche-preparation/",
  type: "article",
});

export default function GuideDDPPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "Contrôle DDPP en crèche : les documents et preuves à préparer",
            "description": DESCRIPTION,
            "inLanguage": "fr-FR",
            "publisher": {
              "@type": "Organization",
              "name": "RZPan'Da",
              "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/rzpanda-logo.svg`
              }
            },
            "author": {
              "@type": "Person",
              "name": "Fanny Zongo"
            },
            "datePublished": "2026-04-26",
            "dateModified": "2026-10-05",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${SITE_URL}/guides/controle-ddpp-creche-preparation/`
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
                Contrôle DDPP en crèche : les documents et preuves à préparer
              </h1>
              <p className="mt-5 text-lg text-gray-500 md:text-xl leading-relaxed">
                Les pièces demandées lors d’un contrôle dépendent de l’activité réelle de la structure : préparation sur place, livraison de repas, remise en température, stockage, biberonnerie et procédures internes. Cette checklist vous aide à organiser vos preuves ; elle doit être adaptée à votre PMS et aux règles applicables à votre organisation.
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
                Les documents et preuves à organiser
              </h2>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                1. Relevés de température
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Les températures à surveiller, leur fréquence de contrôle et la durée de conservation des relevés dépendent des denrées, du procédé et de votre PMS. Documentez les contrôles pertinents, les écarts observés et les actions correctives, puis indiquez la source réglementaire ou sanitaire utilisée pour chaque seuil.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                2. Traçabilité des lots alimentaires
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Organisez la traçabilité de manière à pouvoir identifier les fournisseurs et les informations utiles pour retrouver l’origine des denrées et répondre à une demande de l’autorité compétente. Les modalités de preuve et de conservation doivent être cohérentes avec votre activité et les textes applicables.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                3. Plan de nettoyage et émargement
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Votre plan de nettoyage précise les zones, fréquences, méthodes, produits et responsabilités. Conservez une trace de sa réalisation et des écarts traités selon l’organisation définie dans votre PMS.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                4. Plats témoins
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Lorsque les règles de restauration collective applicables à votre organisation imposent des plats témoins, l’arrêté du 21 décembre 2009 prévoit une conservation pendant au moins cinq jours en froid positif entre 0 et +3 °C. Vérifiez que votre organisation relève de ce dispositif avant de présenter cette règle comme applicable.
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
                Si votre structure prépare ou conserve des biberons, formalisez un protocole adapté et conservez les éléments utiles à la traçabilité : enfant concerné, type de lait, horaires de préparation ou de réception, conditions de conservation et événements particuliers. Appuyez la procédure sur les recommandations sanitaires applicables et sur vos protocoles internes.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                7. Formation du personnel
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Le règlement (CE) n° 852/2004 prévoit que les personnes manipulant des denrées soient encadrées et disposent d’instructions et/ou d’une formation en hygiène adaptées à leur activité. Les personnes responsables des procédures fondées sur les principes HACCP doivent recevoir une formation appropriée.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                3 erreurs qui fragilisent un dossier de contrôle
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Un écart ne produit pas automatiquement la même conséquence dans toutes les situations. L’autorité apprécie la nature, la gravité et le contexte du manquement. L’objectif est donc de rendre les preuves cohérentes, datées et faciles à retrouver.
              </p>

              <h3 className="mt-8 text-lg font-bold text-red-600">
                Erreur n°1 : ne pas archiver les relevés de température
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Sans historique daté, il devient difficile de démontrer que la chaîne du froid a été maîtrisée, même lorsqu’elle l’a été. Les écarts et les actions correctives doivent eux aussi pouvoir être retrouvés.
              </p>

              <h3 className="mt-8 text-lg font-bold text-red-600">
                Erreur n°2 : confondre PMS existant et PMS à jour
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Un PMS rédigé il y a plusieurs années et jamais revu ne reflète plus forcément votre organisation, vos équipements et votre personnel en poste. Prévoyez une revue régulière et datez chaque mise à jour.
              </p>

              <h3 className="mt-8 text-lg font-bold text-red-600">
                Erreur n°3 : négliger les plats témoins quand ils s’appliquent
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Lorsque votre organisation relève du dispositif des plats témoins, leur absence prive l’autorité d’un moyen d’investigation en cas de toxi-infection alimentaire collective (TIAC). Vérifiez votre situation et formalisez la procédure dans votre PMS.
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
                Pour comprendre le périmètre réel du décret 2025-304, consultez notre <Link href="/guides/decret-2025-304-micro-creche/" className="text-blue-600 hover:underline">guide sur le décret 2025-304</Link>.
              </p>
            </div>

            {/* Aside Callout Box */}
            <aside className="mt-16 rounded-2xl border border-blue-100 bg-blue-50/30 p-6 md:p-8">
              <h2 className="text-xl font-extrabold text-gray-900">
                Centralisez vos preuves HACCP sans multiplier les classeurs
              </h2>
              <p className="mt-3 text-base text-gray-500 leading-relaxed">
                RZPan'Da regroupe relevés, traçabilité, biberonnerie, plan de nettoyage et exports dans un même environnement.
              </p>
              <div className="mt-6">
                <Link
                  href="/register/"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
                >
                  Tester RZPan'Da pendant 30 jours
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
