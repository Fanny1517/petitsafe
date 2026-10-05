import type { Metadata } from "next";

// URL publique unique du site (sans slash final), partagée par metadataBase, sitemap, robots et JSON-LD
const rawSiteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://rzpanda.com";
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");
export const SITE_NAME = "RZPan'Da";

type MarketingMetadataInput = {
  /** Titre court de la page, le suffixe " | RZPan'Da" est ajouté par le gabarit du layout marketing */
  title: string;
  description: string;
  /** Chemin relatif de la page (ex: "/guides/"), résolu via metadataBase */
  path: string;
  /** Type Open Graph : "website" pour les pages vitrines, "article" pour les guides */
  type?: "website" | "article";
  /** true : titre utilisé tel quel, sans le suffixe " | RZPan'Da" (titres contenant déjà la marque) */
  absoluteTitle?: boolean;
};

/**
 * Construit des métadonnées complètes pour une page marketing.
 * Next.js fusionne les métadonnées de façon superficielle : sans openGraph/twitter
 * propres, une page hériterait du titre et de l'URL de la page d'accueil lors d'un partage.
 */
export function buildMarketingMetadata({
  title,
  description,
  path,
  type = "website",
  absoluteTitle = false,
}: MarketingMetadataInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type,
      locale: "fr_FR",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
