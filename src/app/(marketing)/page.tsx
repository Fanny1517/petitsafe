import { Navbar } from "@/components/marketing/navbar";
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
