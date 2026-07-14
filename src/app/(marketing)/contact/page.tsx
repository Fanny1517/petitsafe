"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { envoyerMessageContact } from "@/app/actions/contact";

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !email || !sujet || !message) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsPending(true);
    try {
      const res = await envoyerMessageContact({ nom, email, sujet, message });
      if (res.success) {
        setIsSuccess(true);
        toast.success("Votre message a été envoyé avec succès !");
        setNom("");
        setEmail("");
        setSujet("");
        setMessage("");
      } else {
        toast.error(res.error || "Une erreur est survenue lors de l'envoi.");
      }
    } catch {
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main id="main">
        {/* Contact Hero Header */}
        <section className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-36 bg-rzpanda-bg border-b border-gray-100">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.06),transparent_55%)]"></div>
          <div className="mx-auto max-w-5xl px-5 md:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              Contactez-nous
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 md:text-xl leading-relaxed">
              Une question sur la conformité réglementaire, l'abonnement ou besoin d'une démonstration personnalisée ? Notre équipe vous répond sous 24h.
            </p>
          </div>
        </section>

        {/* Contact Layout */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* Left Side: Contact Information */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Nos coordonnées
                  </h2>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                    N'hésitez pas à nous écrire ou à nous appeler directement. Nous sommes à votre entière disposition.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Mail */}
                  <div className="flex gap-4 items-start">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Email</h3>
                      <a href="mailto:contact@rzpanda.com" className="text-sm text-blue-600 hover:underline mt-1 block">
                        contact@rzpanda.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4 items-start">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Téléphone</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        +33 7 83 46 57 48
                      </p>
                    </div>
                  </div>

                  {/* Office */}
                  <div className="flex gap-4 items-start">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Localisation</h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        Rennes, France<br />
                        Hébergé de manière sécurisée en Europe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Contact Form Card */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
                  {isSuccess ? (
                    <div className="text-center py-10 space-y-4">
                      <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-gray-900">
                        Message envoyé !
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                        Merci pour votre intérêt. Nous avons bien reçu votre message et un conseiller reviendra vers vous par email très rapidement.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSuccess(false)}
                        className="mt-6 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Envoyer un autre message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Nom complet *
                          </label>
                          <input
                            id="name"
                            type="text"
                            required
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            placeholder="Marie Dupont"
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition bg-white text-gray-800 placeholder:text-gray-400"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Adresse email *
                          </label>
                          <input
                            id="email-input"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="marie@creche.fr"
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition bg-white text-gray-800 placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label htmlFor="subject" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Sujet du message *
                        </label>
                        <input
                          id="subject"
                          type="text"
                          required
                          value={sujet}
                          onChange={(e) => setSujet(e.target.value)}
                          placeholder="Demande d'information, partenariat..."
                          className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition bg-white text-gray-800 placeholder:text-gray-400"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message-textarea" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message-textarea"
                          required
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Bonjour, je souhaiterais en savoir plus sur les tarifs réseaux de micro-crèches..."
                          className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition bg-white text-gray-800 placeholder:text-gray-400"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700 shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none w-full"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            Envoyer le message
                            <Send className="h-4.5 w-4.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
