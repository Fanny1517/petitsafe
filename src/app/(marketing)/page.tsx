import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { QualityRoadmap } from "@/components/marketing/quality-roadmap";
import { Timeline } from "@/components/marketing/timeline";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { CTAFinal } from "@/components/marketing/cta-final";
import { Footer } from "@/components/marketing/footer";
import { buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Logiciel HACCP crèche & micro-crèche",
  description:
    "Centralisez relevés HACCP, traçabilité alimentaire, biberonnerie et plan de nettoyage dans une application conçue pour les crèches et micro-crèches.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        {/* Bloc RegulatoryContext retiré (plan SEO) : à réactiver uniquement avec des chiffres sourcés et datés */}
        <Features />
        <QualityRoadmap />
        <Timeline />
        <Pricing />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
