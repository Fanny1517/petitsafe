import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  notifyMetaConsent,
  resetContactSuccessState,
  resetMetaConsentState,
  trackContactSuccess,
  trackRegistrationActivated,
  updateGtagConsent,
} from "@/lib/tracking";

describe("Gestion du consentement et de Google Consent Mode v2", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    resetMetaConsentState();
    resetContactSuccessState();
    (globalThis as any).window = {
      dataLayer: [],
      gtag: vi.fn(),
      fbq: vi.fn(),
    };
  });

  afterEach(() => {
    (globalThis as any).window = originalWindow;
  });

  it("met a jour les signaux Consent Mode v2 quand tout est refuse", () => {
    updateGtagConsent(false, false);

    expect((window as any).gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("met a jour analytics_storage a granted quand la mesure d'audience est accordee", () => {
    updateGtagConsent(true, false);

    expect((window as any).gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("met a jour les signaux publicitaires a granted quand le marketing est accorde", () => {
    updateGtagConsent(false, true);

    expect((window as any).gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("met a jour tous les signaux a granted quand tout est accepte", () => {
    updateGtagConsent(true, true);

    expect((window as any).gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("emet une seule fois rz_marketing_consent_granted quand le marketing est accepte", () => {
    notifyMetaConsent(true);
    notifyMetaConsent(true);

    expect((window as any).dataLayer).toEqual([
      { event: "rz_marketing_consent_granted" },
    ]);
    expect((window as any).fbq).toHaveBeenCalledWith("consent", "grant");
  });

  it("revoque le consentement Meta et reinitialise le verrou en cas de retrait", () => {
    notifyMetaConsent(true);
    notifyMetaConsent(false);

    expect((window as any).fbq).toHaveBeenLastCalledWith("consent", "revoke");

    notifyMetaConsent(true);
    expect((window as any).dataLayer).toEqual([
      { event: "rz_marketing_consent_granted" },
      { event: "rz_marketing_consent_granted" },
    ]);
  });

  it("pousse rz_registration_activated avec registration_type trial dans dataLayer", () => {
    trackRegistrationActivated("trial");

    expect((window as any).dataLayer).toEqual([
      {
        event: "rz_registration_activated",
        registration_type: "trial",
      },
    ]);
  });

  it("pousse rz_contact_success une seule fois sans donnee personnelle dans dataLayer", () => {
    trackContactSuccess();
    trackContactSuccess();

    expect((window as any).dataLayer).toEqual([
      {
        event: "rz_contact_success",
        form_id: "contact",
        lead_type: "demo",
      },
    ]);
  });
});
