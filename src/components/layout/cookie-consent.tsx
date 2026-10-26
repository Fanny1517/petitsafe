"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { initMarketingTrackers, updateGtagConsent } from "@/lib/tracking";

export function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom right",
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "right",
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          readOnly: true,
          enabled: true,
        },
        analytics: {
          enabled: false,
          autoClear: {
            cookies: [{ name: /^(_ga|_gid|_gat)/ }],
          },
        },
        marketing: {
          enabled: false,
          autoClear: {
            cookies: [
              { name: /^(_fbp|_fbc)/ },
              { name: /^li_/ },
              { name: /^bcookie/ },
              { name: /^lidc/ },
            ],
          },
        },
      },
      language: {
        default: "fr",
        translations: {
          fr: {
            consentModal: {
              title: "Respect de votre vie privée",
              description:
                "Nous utilisons des cookies techniques indispensables au bon fonctionnement du site et de la plateforme RZPan'Da. Avec votre accord, nous utilisons également des cookies pour mesurer notre audience et optimiser nos communications.",
              acceptAllBtn: "Accepter tout",
              acceptNecessaryBtn: "Refuser tout",
              showPreferencesBtn: "Personnaliser",
              footer: `
                <a href="/confidentialite/" class="cc__link">Politique de confidentialité</a>
                <span aria-hidden="true"> · </span>
                <a href="/mentions-legales/" class="cc__link">Mentions légales</a>
              `,
            },
            preferencesModal: {
              title: "Préférences des cookies",
              acceptAllBtn: "Accepter tout",
              acceptNecessaryBtn: "Refuser tout",
              savePreferencesBtn: "Enregistrer mes choix",
              closeIconLabel: "Fermer",
              serviceCounterLabel: "services",
              sections: [
                {
                  title: "Gestion de vos préférences",
                  description:
                    "Lors de votre navigation sur notre site, des cookies peuvent être déposés sur votre terminal. Vous pouvez à tout moment activer ou désactiver chaque catégorie selon vos choix. Pour en savoir plus, consultez notre <a href=\"/confidentialite/\" class=\"cc__link\">politique de confidentialité</a>.",
                },
                {
                  title: "Cookies strictement nécessaires",
                  description:
                    "Ces cookies garantissent le fonctionnement optimal de l'application, l'authentification sécurisée des utilisateurs et la mémorisation de vos préférences de sécurité. Ils ne stockent aucune donnée personnelle à des fins publicitaires.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Mesure d'audience",
                  description:
                    "Ces cookies nous aident à mesurer l'audience et à analyser l'utilisation du site afin d'améliorer l'expérience utilisateur et les performances techniques de nos outils (Google Analytics 4).",
                  linkedCategory: "analytics",
                },
                {
                  title: "Publicité et réseaux sociaux",
                  description:
                    "Ces traceurs permettent d'évaluer la pertinence de nos campagnes de communication et d'adapter nos messages sur les plateformes professionnelles partenaires, notamment LinkedIn et Meta.",
                  linkedCategory: "marketing",
                },
                {
                  title: "Plus d'informations",
                  description:
                    "Pour toute question relative à notre gestion des cookies et à la protection de vos données personnelles, vous pouvez consulter notre <a href=\"/confidentialite/\" class=\"cc__link\">politique de confidentialité</a> ou contacter notre délégué à la protection des données à l'adresse <a href=\"mailto:contact@rzpanda.com\" class=\"cc__link\">contact@rzpanda.com</a>.",
                },
              ],
            },
          },
        },
      },
      onConsent: () => {
        const analytics = CookieConsent.acceptedCategory("analytics");
        const marketing = CookieConsent.acceptedCategory("marketing");
        updateGtagConsent(analytics, marketing);
        if (marketing) {
          initMarketingTrackers();
        }
      },
      onChange: () => {
        const analytics = CookieConsent.acceptedCategory("analytics");
        const marketing = CookieConsent.acceptedCategory("marketing");
        updateGtagConsent(analytics, marketing);
        if (marketing) {
          initMarketingTrackers();
        }
      },
    });
  }, []);

  return null;
}
