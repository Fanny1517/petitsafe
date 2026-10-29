import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { CookieConsentBanner } from "@/components/layout/cookie-consent";
import { TrackingScripts } from "@/components/layout/tracking-scripts";
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
    icon: "/rzpanda-icon.png",
    apple: "/rzpanda-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          id="google-consent-mode-v2-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
        <script
          id="gtm-init"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5B9RQN6M');`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-rzpanda-fond antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5B9RQN6M"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieConsentBanner />
        <TrackingScripts />
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
