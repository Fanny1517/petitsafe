import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateGtagConsent } from "@/lib/tracking";

describe("Gestion du consentement et de Google Consent Mode v2", () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    (globalThis as any).window = {
      dataLayer: [],
      gtag: vi.fn(),
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
});
