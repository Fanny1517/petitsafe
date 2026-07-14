import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main">
        <article className="pb-20 pt-28 md:pt-36 bg-white">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <div className="legal-content text-gray-800">
              {children}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
