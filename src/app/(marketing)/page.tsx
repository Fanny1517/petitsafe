import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";

export const metadata: Metadata = {
  title: "Logiciel HACCP Crèche & Micro-Crèche - RZPan'Da | Décret 2025-304",
  description: "Simplifiez la traçabilité HACCP de votre crèche avec RZPan'Da. Conforme au décret 2025-304 et aux normes ANSES. Préparez vos contrôles DDPP/PMI en 3 clics.",
  alternates: { canonical: "/" },
};
import { Hero } from "@/components/marketing/hero";
import { RegulatoryContext } from "@/components/marketing/regulatory-context";
import { Features } from "@/components/marketing/features";
import { Timeline } from "@/components/marketing/timeline";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { CTAFinal } from "@/components/marketing/cta-final";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <RegulatoryContext />
        <Features />
        <Timeline />
        <Pricing />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
