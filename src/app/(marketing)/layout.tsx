import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

const BASE_URL = `${SITE_URL}/`;

export const metadata: Metadata = {
  // Un titre en simple chaîne annulerait le gabarit du layout racine pour les pages enfants
  title: {
    default: "Logiciel HACCP crèche & micro-crèche | RZPan'Da",
    template: "%s | RZPan'Da",
  },
  description:
    "Centralisez relevés HACCP, traçabilité alimentaire, biberonnerie et plan de nettoyage dans une application conçue pour les crèches et micro-crèches.",
  openGraph: {
    title: "Logiciel HACCP crèche & micro-crèche",
    description:
      "Centralisez relevés HACCP, traçabilité alimentaire, biberonnerie et plan de nettoyage dans une application conçue pour les crèches et micro-crèches.",
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "RZPan'Da",
  },
  twitter: {
    card: "summary_large_image",
    title: "Logiciel HACCP crèche & micro-crèche",
    description:
      "Centralisez relevés HACCP, traçabilité alimentaire, biberonnerie et plan de nettoyage dans une application conçue pour les crèches et micro-crèches.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "RZPan'Da",
      url: BASE_URL,
      description:
        "Centralisez relevés HACCP, traçabilité alimentaire, biberonnerie et plan de nettoyage dans une application conçue pour les crèches et micro-crèches.",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+33 7 83 46 57 48",
        contactType: "customer service",
        availableLanguage: "French",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "RZPan'Da",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Registre HACCP numérique pour la petite enfance : relevés de température, traçabilité alimentaire, biberonnerie ANSES, plan de nettoyage et exports DDPP.",
      offers: [
        {
          "@type": "Offer",
          name: "HACCP Essentiel",
          price: "39",
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "39",
            priceCurrency: "EUR",
            unitText: "MONTH",
          },
        },
        {
          "@type": "Offer",
          name: "RZPan'Da Complet",
          price: "69",
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "69",
            priceCurrency: "EUR",
            unitText: "MONTH",
          },
        },
      ],
    },
  ],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
