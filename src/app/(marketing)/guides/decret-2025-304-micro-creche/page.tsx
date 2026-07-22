import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "Décret 2025-304 Micro-Crèche : Ce qui change en Septembre 2026",
  description:
    "Quelles sont les obligations HACCP et de biberonnerie du Décret 2025-304 pour les crèches ? Préparez votre conformité avant la date limite.",
};

export default function DecretGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Est-il obligatoire d'avoir un outil numérique pour la traçabilité HACCP en crèche ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Non, le format papier reste légalement toléré mais il est extrêmement difficile à tenir sans faille au quotidien (risques d'oubli, de perte d'étiquette, de signature manquante)."
                }
              },
              {
                "@type": "Question",
                "name": "Quelles sont les sanctions en cas de non-conformité au décret 2025-304 ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Les inspecteurs peuvent prononcer une mise en demeure avec un délai court de mise en conformité, des sanctions financières, ou dans les cas les plus graves (TIAC ou récidive), une fermeture administrative temporaire de la structure."
                }
              },
              {
                "@type": "Question",
                "name": "Comment gérer le lait maternel apporté par les parents en micro-crèche ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Il doit faire l'objet d'une traçabilité spécifique : identification claire du nom de l'enfant sur le biberon, relevé de température à réception, stockage immédiat entre 0 °C et 4 °C, et consommation dans les délais stricts fixés par la réglementation."
                }
              }
            ]
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
                Guide réglementaire
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl leading-tight">
                Décret n° 2025-304 : Guide de mise en conformité HACCP pour les crèches et micro-crèches
              </h1>
              <p className="mt-5 text-lg text-gray-500 md:text-xl leading-relaxed">
                Le Décret n° 2025-304 renforce les exigences relatives au Plan de Maîtrise Sanitaire et à la traçabilité des repas et des biberons en structure d'accueil de la petite enfance. La date limite de mise en conformité est fixée à septembre 2026. Ce guide rassemble les informations essentielles pour vous aider à préparer et réussir vos contrôles sanitaires DDPP et PMI.
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
                Pourquoi le Décret 2025-304 change-t-il la donne ?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Les exigences de sécurité sanitaire au sein des crèches et micro-crèches se sont considérablement durcies. Le Décret 2025-304 vise à garantir une traçabilité sans faille des aliments et des biberons servis aux tout-petits, en éliminant les zones d'ombre souvent liées au suivi sur registre papier.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Pour les gestionnaires d'établissements, ce texte ne laisse plus de place à l'improvisation : les relevés de températures, l'archivage des étiquettes et la gestion de la biberonnerie doivent pouvoir être justifiés immédiatement en cas d'inspection par la DDPP ou la PMI.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Les 4 piliers d'obligations imposés par le décret
              </h2>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                1. La traçabilité renforcée de la chaîne du froid
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Chaque jour, votre établissement doit consigner sans discontinuité :
              </p>
              <ul className="mt-3 list-disc pl-5 text-base text-gray-500 space-y-2">
                <li>Le contrôle à la réception des livraisons de repas ou de matières premières.</li>
                <li>La température quotidienne des enceintes frigorifiques (réfrigérateurs, chambres froides).</li>
                <li>Le suivi des températures de liaison chaude et froide avant le service.</li>
              </ul>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                2. La gestion stricte des biberons et de la biberonnerie
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Le décret apporte une attention particulière à la préparation et au stockage du lait maternel et infantile :
              </p>
              <ul className="mt-3 list-disc pl-5 text-base text-gray-500 space-y-2">
                <li>Horodatage obligatoire des ouvertures de boîtes de lait et des préparations.</li>
                <li>Respect strict des durées maximums de conservation au frais.</li>
                <li>Traçabilité de l'entretien et de la désinfection des équipements de biberonnerie selon les recommandations ANSES.</li>
              </ul>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                3. La conservation des plats témoins et la gestion des allergènes
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                <strong>Plats témoins</strong> : Conservation obligatoire d'échantillons de chaque composant de repas pendant 5 à 7 jours à température réglementaire (+2 °C à +4 °C).
              </p>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                <strong>Allergènes</strong> : Mise à disposition d'un registre actualisé des allergènes contenus dans chaque menu pour information immédiate aux familles et aux agents de contrôle.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                4. L'archivage et la traçabilité documentaire
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Toutes les fiches d'autocontrôle, de nettoyage et de relevés doivent être conservées et archivées pour une durée minimale de 6 mois à 1 an selon la nature des registres.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Risques et sanctions : Que se passe-t-il à partir de septembre 2026 ?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Lors d'un contrôle de la DDPP ou de la PMI, tout manquement aux obligations du Décret 2025-304 (registres incomplets, oublis de relevés, étiquettes perdues) peut entraîner :
              </p>
              <ul className="mt-3 list-disc pl-5 text-base text-gray-500 space-y-2">
                <li>Une mise en demeure d'exécuter des mesures correctives sous un délai très court.</li>
                <li>Un avertissement officiel impactant l'agrément de la structure.</li>
                <li>En cas de récidive ou de risque direct pour la santé des enfants, une fermeture administrative temporaire ou définitive.</li>
              </ul>
              <div className="mt-6 rounded-xl bg-blue-50/50 border border-blue-100/50 p-5 text-base text-blue-800 leading-relaxed">
                Le conseil de l'expert : Ne laissez pas l'accumulation de registres papier fragiliser votre structure lors d'un contrôle impromptu.
              </div>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Comment mettre votre crèche en conformité en 3 étapes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100/80">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Étape 1</div>
                  <h4 className="font-bold text-gray-900 mb-1">Audit des pratiques</h4>
                  <p className="text-sm text-gray-500">Passer en revue vos procédures et identifier les faiblesses actuelles.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100/80">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Étape 2</div>
                  <h4 className="font-bold text-gray-900 mb-1">Digitalisation HACCP</h4>
                  <p className="text-sm text-gray-500">Passer à des relevés numériques horodatés et sécurisés.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100/80">
                  <div className="text-sm font-semibold text-blue-600 mb-2">Étape 3</div>
                  <h4 className="font-bold text-gray-900 mb-1">Formation de l'équipe</h4>
                  <p className="text-sm text-gray-500">Accompagner le personnel de la petite enfance en quelques minutes.</p>
                </div>
              </div>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                Étape 1 : Auditer vos procédures actuelles
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Passez en revue votre Plan de Maîtrise Sanitaire. Identifiez les faiblesses : fiches de températures parfois oubliées le matin, difficulté à retrouver l'étiquette d'un lot datant d'il y a 3 semaines, etc.
              </p>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                Étape 2 : Passer au registre numérique horodaté
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                Abandonnez le papier pour un outil numérique simple. La saisie sur tablette ou smartphone garantit :
              </p>
              <ul className="mt-3 list-disc pl-5 text-base text-gray-500 space-y-2">
                <li>Un horodatage infalsifiable exigé par la réglementation.</li>
                <li>Des alertes automatiques si une température dépasse le seuil légal.</li>
                <li>Un archivage sécurisé dans le cloud, accessible en 1 clic lors des inspections.</li>
              </ul>

              <h3 className="mt-8 text-lg font-bold text-gray-900">
                Étape 3 : Impliquer et former votre équipe
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                L'outil utilisé au quotidien doit être intuitif pour l'ensemble du personnel de la petite enfance (EJE, auxiliaires de puériculture, agents d'entretien). Choisissez une solution ergonomique qui ne prend pas plus de 2 minutes par jour.
              </p>
              <p className="mt-6 text-base leading-relaxed text-gray-500">
                Pour préparer au mieux vos inspections sur le terrain, découvrez également notre <Link href="/guides/controle-ddpp-creche-preparation" className="text-blue-600 hover:underline">guide pratique de préparation aux contrôles DDPP</Link>.
              </p>

              <h2 className="mt-12 text-2xl font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">
                Simplifiez votre conformité au Décret 2025-304 avec RZPan'Da
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Conçu spécialement pour les contraintes des crèches et micro-crèches, RZPan'Da réunit l'ensemble des exigences du Décret 2025-304 dans une interface ultra-simple :
              </p>
              <ul className="mt-3 list-disc pl-5 text-base text-gray-500 space-y-2">
                <li>Relevés de températures en 2 clics avec alertes instantanées.</li>
                <li>Prise en photo des étiquettes de traçabilité directement conservées et classées.</li>
                <li>Suivi complet de la biberonnerie et du plan de nettoyage.</li>
                <li>Rapport PDF d'inspection imprimable ou exportable immédiatement pour les agents de la DDPP/PMI.</li>
              </ul>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Soyez prêt avant l'échéance de septembre 2026.
              </p>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-[22px] py-[14px] text-base font-semibold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
                  aria-label="Tester RZPan'Da gratuitement pendant 30 jours (Sans engagement)"
                >
                  Tester RZPan'Da gratuitement pendant 30 jours (Sans engagement)
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>

            {/* Aside Callout Box */}
            <aside className="mt-16 rounded-2xl border border-blue-100 bg-blue-50/30 p-6 md:p-8">
              <h2 className="text-xl font-extrabold text-gray-900">
                Mettez-vous en conformité sans y passer vos soirées.
              </h2>
              <p className="mt-3 text-base text-gray-500 leading-relaxed">
                RZPan'Da couvre la traçabilité HACCP, la biberonnerie ANSES, le suivi des enfants et les rapports pour la DDPP. Essai gratuit de 30 jours, sans engagement et sans carte bancaire.
              </p>
              <div className="mt-6">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-blue-700 shadow-md active:scale-95"
                  aria-label="Tester RZPan'Da gratuitement pendant 30 jours"
                >
                  Tester RZPan'Da gratuitement pendant 30 jours
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
