import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  WifiOff,
  Camera,
  Receipt,
  Baby,
  Thermometer,
  FileDown,
  MapPin,
  MessageSquarePlus,
  ClipboardList,
  MessageSquareHeart,
  ListChecks,
  FileStack,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Logiciel qualité crèche : feuille de route",
  description:
    "Feuille de route RZPan'Da : Référentiel national, auto-évaluation, enquêtes familles, plan d’amélioration et préparation quinquennale.",
  path: "/roadmap/",
});

export default function RoadmapPage() {
  const columns = [
    {
      title: "Récemment déployé",
      description: "Les fonctionnalités déjà opérationnelles sur RZPan'Da.",
      badgeColor: "bg-green-50 text-green-700 border-green-100",
      items: [
        {
          title: "Auto-évaluation du Référentiel national",
          description:
            "Grille guidée fondée sur les critères du Référentiel national de la qualité d’accueil du jeune enfant, rattachement automatique des preuves de terrain, radar de progression et score RZPan'Da de 0 à 100 %. Ce score est un indicateur interne de progression, pas une note officielle.",
          icon: <ClipboardList className="h-5 w-5 text-green-600" />,
        },
        {
          title: "Enquêtes familles et baromètre de satisfaction",
          description:
            "Questionnaires accessibles sur mobile sans mot de passe, envoi automatique des liens par email, réponses confidentielles, réservées à la structure, graphiques de synthèse, verbatims et exports pour suivre la perception des familles.",
          icon: <MessageSquareHeart className="h-5 w-5 text-green-600" />,
        },
        {
          title: "Plan d’amélioration qualité (PAQ)",
          description:
            "Transformez les constats en actions suivies : priorité, responsable, échéance, statut et preuve de réalisation, avec une vue tableau ou Kanban.",
          icon: <ListChecks className="h-5 w-5 text-green-600" />,
        },
        {
          title: "Dossier de préparation à l’évaluation quinquennale",
          description:
            "Regroupez l’auto-évaluation, les preuves, les enquêtes familles et le plan d’amélioration dans un dossier de synthèse exportable en PDF en un clic. Le format sera maintenu à jour selon les modalités réglementaires applicables.",
          icon: <FileStack className="h-5 w-5 text-green-600" />,
        },
        {
          title: "Registre biberonnerie ANSES",
          description:
            "Suivi complet des laits maternels et infantiles (heures de préparation, DLC, température, attribution enfant) conforme aux dernières directives sanitaires.",
          icon: <Baby className="h-5 w-5 text-green-600" />,
        },
        {
          title: "Exports de traçabilité et historiques",
          description:
            "Générez des exports à partir des relevés et historiques enregistrés dans RZPan'Da pour préparer vos dossiers de contrôle.",
          icon: <FileDown className="h-5 w-5 text-green-600" />,
        },
        {
          title: "Suivi des températures simplifié",
          description:
            "Enregistrement instantané des températures de réfrigérateurs et congélateurs avec alertes en cas de dépassement de seuil.",
          icon: <Thermometer className="h-5 w-5 text-green-600" />,
        },
      ],
    },
    {
      title: "En cours",
      description: "Ce sur quoi nos développeurs travaillent en ce moment.",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
      items: [
        // Modules qualité (plan SEO lignes 26 à 33) : « 4 modules RZPan'Da », jamais « 4 axes du Référentiel »
        
        {
          title: "Portail parents enrichi",
          description:
            "Partage fluide et sécurisé des activités, photos et transmissions de la journée avec les parents via une interface dédiée.",
          icon: <Camera className="h-5 w-5 text-blue-600" />,
        },
        {
          title: "Statistiques d'occupation",
          description:
            "Rapports automatiques de présence et d'absences pour optimiser le taux d'occupation et la gestion des plannings.",
          icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
        },
      ],
    },
    {
      title: "À venir",
      description: "Les prochains chantiers planifiés pour les mois prochains.",
      badgeColor: "bg-gray-50 text-gray-700 border-gray-100",
      items: [
        {
          title: "Module Facturation & CAF",
          description:
            "Génération automatique des factures, attestations fiscales et exports pour les télétransmissions d'aides CAF.",
          icon: <Receipt className="h-5 w-5 text-gray-600" />,
        },
        {
          title: "Mode hors-ligne",
          description:
            "Possibilité d'enregistrer vos relevés de température et tâches même sans connexion internet active dans la crèche.",
          icon: <WifiOff className="h-5 w-5 text-gray-600" />,
        },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <main id="main">
        {/* Roadmap Hero Header */}
        <section className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-36 bg-rzpanda-bg border-b border-gray-100">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.06),transparent_55%)]"></div>
          <div className="mx-auto max-w-5xl px-5 md:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              Feuille de route : HACCP, qualité d’accueil et évaluation en crèche
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 md:text-xl leading-relaxed">
              RZPan'Da évolue d’un outil de traçabilité quotidienne vers une plateforme de pilotage de la qualité pour les crèches et micro-crèches. Cette page distingue clairement ce qui est disponible, en cours de développement et planifié.
            </p>
          </div>
        </section>

        {/* Roadmap Columns */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {columns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className="rounded-3xl border border-gray-100 bg-gray-50/30 p-6 md:p-8"
                >
                  <div className="mb-6">
                    <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold border ${column.badgeColor}`}>
                      {column.title}
                    </span>
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                      {column.description}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {column.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition duration-200 group"
                      >
                        <div className="flex gap-4 items-start">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 group-hover:scale-105 transition">
                            {item.icon}
                          </span>
                          <div>
                            <h3 className="text-base font-bold text-gray-900 leading-snug">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestion CTA */}
            <div className="mt-20 rounded-3xl border border-blue-100 bg-blue-50/20 p-8 md:p-12 text-center max-w-3xl mx-auto">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-6">
                <MessageSquarePlus className="h-6 w-6" />
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Vous avez besoin d'une fonctionnalité spécifique ?
              </h2>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
                La majorité de nos outils sont nés de suggestions de gestionnaires et professionnels en crèche. Partagez vos idées ou vos contraintes réglementaires avec notre équipe technique.
              </p>
              <div className="mt-8">
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-95 shadow-md"
                >
                  Proposer une fonctionnalité
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
