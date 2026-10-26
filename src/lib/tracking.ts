declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: unknown;
    _fbq?: unknown;
    lintrk?: unknown;
    _linkedin_data_partner_ids?: string[];
  }
}

/**
 * Met a jour les signaux Google Consent Mode v2 selon le consentement accorde.
 */
export function updateGtagConsent(analyticsGranted: boolean, marketingGranted: boolean) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: analyticsGranted ? "granted" : "denied",
      ad_storage: marketingGranted ? "granted" : "denied",
      ad_user_data: marketingGranted ? "granted" : "denied",
      ad_personalization: marketingGranted ? "granted" : "denied",
    });
  }
}

/**
 * Initialise Meta Pixel si l'identifiant est configure dans les variables d'environnement.
 */
export function initMetaPixel(pixelId?: string) {
  const id = pixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (typeof window === "undefined" || !id) return;
  if (window.fbq) return;

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    if (s && s.parentNode) {
      s.parentNode.insertBefore(t, s);
    } else {
      b.head.appendChild(t);
    }
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    fbq("init", id);
    fbq("track", "PageView");
  }
}

/**
 * Initialise LinkedIn Insight Tag si l'identifiant partenaire est configure.
 */
export function initLinkedInInsight(partnerId?: string) {
  const id = partnerId || process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
  if (typeof window === "undefined" || !id) return;
  if (window.lintrk) return;

  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(id);

  /* eslint-disable */
  (function (l: any) {
    if (!l) {
      window.lintrk = function (a: any, b: any) {
        (window.lintrk as any).q = (window.lintrk as any).q || [];
        (window.lintrk as any).q.push([a, b]);
      };
      (window.lintrk as any).q = [];
    }
    const s = document.getElementsByTagName("script")[0];
    const b = document.createElement("script");
    b.type = "text/javascript";
    b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    if (s && s.parentNode) {
      s.parentNode.insertBefore(b, s);
    } else {
      document.head.appendChild(b);
    }
  })(window.lintrk);
  /* eslint-enable */
}

/**
 * Declenche l'initialisation des traceurs marketing autorises.
 */
export function initMarketingTrackers() {
  initMetaPixel();
  initLinkedInInsight();
}
