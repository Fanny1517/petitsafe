import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  WifiOff,
  Camera,
  Receipt,
  Baby,
  Thermometer,
  ShieldAlert,
  MapPin,
  MessageSquarePlus,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "Feuille de route produit - RZPan'Da | RZPan'Da",
  description:
    "Suivez en temps réel le développement et l'évolution des fonctionnalités de RZPan'Da : HACCP, suivi enfants, conformité DDPP et gestion de crèches.",
};

export default function RoadmapPage() {
  const columns = [
    {
      title: "Récemment déployé",
      description: "Les fonctionnalités déjà opérationnelles sur RZPan'Da.",
      badgeColor: "bg-green-50 text-green-700 border-green-100",
      items: [
        {
          title: "Registre biberonnerie ANSES",
          description:
            "Suivi complet des laits maternels et infantiles (heures de préparation, DLC, température, attribution enfant) conforme aux dernières directives sanitaires.",
          icon: <Baby className="h-5 w-5 text-green-600" />,
        },
        {
          title: "Conformité décret 2025-304",
          description:
            "Génération d'exports réglementaires en un clic pour les inspecteurs DDPP et PMI en cas de contrôle.",
          icon: <ShieldAlert className="h-5 w-5 text-green-600" />,
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
              Feuille de route produit
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 md:text-xl leading-relaxed">
              Nous construisons RZPan'Da en collaboration avec les équipes de terrain. Découvrez ce que nous préparons pour simplifier la vie de votre crèche.
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
                  href="/contact"
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
