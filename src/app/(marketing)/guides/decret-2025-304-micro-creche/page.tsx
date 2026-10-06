import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Décret 2025-304 micro-crèche : ce qu’il change",
  description:
    "Décret 2025-304 : autorisations, direction et qualifications des micro-crèches, avec mise à jour après la décision du Conseil d’État du 27 mai 2026.",
  path: "/guides/decret-2025-304-micro-creche/",
  type: "article",
});

// Date de dernière revue du contenu juridique (à mettre à jour à chaque révision)
const DERNIERE_MISE_A_JOUR = "30 septembre 2026";

// FAQ alignée sur le périmètre réel du décret (plan SEO lignes 45 à 58)
const faq = [
  {
    question: "Le décret 2025-304 crée-t-il des obligations HACCP pour les crèches ?",
    answer:
      "Non. Le décret 2025-304 porte sur les autorisations et certaines règles d’organisation et d’encadrement des EAJE et micro-crèches. Les obligations d’hygiène alimentaire, de traçabilité et de biberonnerie relèvent d’autres textes, notamment les règlements européens (CE) n° 852/2004 et n° 178/2002.",
  },
  {
    question: "Qu’a changé la décision du Conseil d’État du 27 mai 2026 ?",
    answer:
      "Le Conseil d’État a annulé le décret en tant qu’il abrogeait dès le 1er septembre 2026 le III de l’article R. 2324-46-5 du code de la santé publique.",
  },
  {
    question: "Un logiciel HACCP rend-il ma micro-crèche conforme au décret 2025-304 ?",
    answer:
      "Non. Un logiciel comme RZPan'Da aide à enregistrer et retrouver relevés, historiques et justificatifs, mais il ne se substitue ni aux textes ni aux procédures propres à votre structure.",
  },
];

export default function DecretGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />
      <Navbar />
      <main id="main">
        <article className="pb-20 pt-28 md:pt-36 bg-white">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            {/* En-tête */}
            <div className="mb-10">
              <div className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 border border-blue-100">
                Guide réglementaire
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl leading-tight">
                Décret 2025-304 : ce qui change réellement pour les micro-crèches
              </h1>
              <p className="mt-3 text-sm font-medium text-gray-400">
                Dernière mise à jour : <time dateTime="2026-09-30">{DERNIERE_MISE_A_JOUR}</time>
              </p>
              <p className="mt-5 text-lg text-gray-500 md:text-xl leading-relaxed">
                Le décret n° 2025-304 du 1er avril 2025 concerne les autorisations de création, d’extension et de
                transformation des établissements d’accueil du jeune enfant ainsi que certaines règles d’organisation et
                d’encadrement des micro-crèches. Il ne crée pas, à lui seul, les obligations HACCP, de traçabilité
                alimentaire ou de biberonnerie. Le Conseil d’État, par une décision du 27 mai 2026, a annulé le décret en
                tant qu’il abrogeait dès le 1er septembre 2026 le III de l’article R. 2324-46-5 du code de la santé
                publique.
              </p>
            </div>

            {/* Corps du guide */}
            <div className="prose prose-lg max-w-none text-gray-800">
              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Ce que le décret 2025-304 modifie
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Le texte intervient sur deux plans : les procédures d’autorisation de création, d’extension et de
                transformation des établissements d’accueil du jeune enfant, et certaines règles d’organisation et
                d’encadrement propres aux micro-crèches, en particulier la direction et les qualifications des
                professionnels.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Ce qui s’applique aux micro-crèches depuis le 1er septembre 2026
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Une partie des dispositions relatives aux micro-crèches était programmée pour le 1er septembre 2026. Pour
                connaître précisément les règles applicables à votre structure, appuyez-vous sur la version consolidée
                du code de la santé publique publiée sur{" "}
                <a
                  href="https://www.legifrance.gouv.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Légifrance
                </a>{" "}
                et sur les échanges avec vos interlocuteurs habituels (PMI, gestionnaire, conseil départemental).
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Ce que la décision du Conseil d’État du 27 mai 2026 a changé
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Saisi d’un recours contre le décret, le Conseil d’État a annulé celui-ci en tant qu’il abrogeait dès le
                1er septembre 2026 le III de l’article R. 2324-46-5 du code de la santé publique. Les autres dispositions
                du décret ne sont pas visées par cette annulation partielle. Toute lecture du texte antérieure à cette
                décision doit donc être revue.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Ce que le décret ne dit pas sur l’HACCP
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Le décret 2025-304 ne fixe ni seuils de température, ni durées de conservation des relevés, ni règles de
                biberonnerie. L’hygiène alimentaire et la traçabilité relèvent d’autres textes, notamment le règlement
                (CE) n° 852/2004 relatif à l’hygiène des denrées alimentaires et l’article 18 du règlement (CE) n°
                178/2002 sur la traçabilité, déclinés dans le Plan de Maîtrise Sanitaire (PMS) de chaque structure.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Quelles vérifications faire dans votre structure ?
              </h2>
              <ul className="mt-4 list-disc pl-5 text-base text-gray-500 space-y-2">
                <li>Vérifier l’organisation de la direction et les qualifications de l’équipe au regard des textes en vigueur.</li>
                <li>Relire votre dossier d’autorisation si un projet de création, d’extension ou de transformation est en cours.</li>
                <li>Contrôler que votre PMS et vos procédures d’hygiène sont à jour, indépendamment du décret.</li>
                <li>Dater vos vérifications et conserver la source réglementaire utilisée pour chaque règle.</li>
              </ul>
              <p className="mt-6 text-base leading-relaxed text-gray-500">
                Pour organiser vos preuves en vue d’une inspection, consultez notre{" "}
                <Link href="/guides/controle-ddpp-creche-preparation/" className="text-blue-600 hover:underline">
                  guide de préparation aux contrôles DDPP
                </Link>
                .
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                En cas de manquement, quelles conséquences ?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Les conséquences dépendent de la règle concernée, de la nature du manquement et de la situation
                constatée. Il ne faut pas rattacher automatiquement les sanctions liées à l’hygiène alimentaire au décret
                2025-304.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Comment RZPan'Da aide au suivi quotidien
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                RZPan'Da aide à enregistrer et retrouver les relevés, historiques et justificatifs utilisés dans votre
                organisation HACCP : relevés de température, traçabilité des lots, biberonnerie, plan de nettoyage et
                exports. L’outil ne se substitue pas aux textes ni aux procédures propres à votre structure.
              </p>

              {/* FAQ visible, identique au balisage JSON-LD */}
              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Questions fréquentes
              </h2>
              <dl className="mt-6 space-y-6">
                {faq.map((item) => (
                  <div key={item.question}>
                    <dt className="text-base font-bold text-gray-900">{item.question}</dt>
                    <dd className="mt-2 text-base leading-relaxed text-gray-500">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Encart commercial final */}
            <aside className="mt-16 rounded-2xl border border-blue-100 bg-blue-50/30 p-6 md:p-8">
              <h2 className="text-xl font-extrabold text-gray-900">Centralisez vos suivis HACCP avec RZPan'Da</h2>
              <p className="mt-3 text-base text-gray-500 leading-relaxed">
                RZPan'Da aide à enregistrer et retrouver les relevés, historiques et justificatifs utilisés dans votre
                organisation HACCP. L’outil ne se substitue pas aux textes ni aux procédures propres à votre structure.
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
