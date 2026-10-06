import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RZPan'Da : gestion HACCP et traçabilité petite enfance",
    template: "%s | RZPan'Da",
  },
  description:
    "RZPan'Da : le SaaS de gestion HACCP, PMS et traçabilité alimentaire pour les crèches, micro-crèches, MAM et assistantes maternelles en France.",
  // Même URL de secours que sitemap.ts et robots.ts pour éviter des canonicals en localhost
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "RZPan'Da : gestion HACCP et traçabilité petite enfance",
    description:
      "Conformité HACCP, traçabilité alimentaire, biberonnerie ANSES, suivi enfants : tout en un.",
    siteName: "RZPan'Da",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "RZPan'Da",
    description: "Le SaaS HACCP pour la petite enfance.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/rzpanda-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-rzpanda-fond antialiased">
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
