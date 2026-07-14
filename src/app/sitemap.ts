import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.rzpanda.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/login",
    "/register",
    "/a-propos",
    "/contact",
    "/roadmap",
    "/guides",
    "/guides/controle-ddpp-creche-preparation",
    "/guides/decret-2025-304-micro-creche",
    "/mentions-legales",
    "/cgu",
    "/confidentialite",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route.startsWith("/guides") ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route.startsWith("/guides") ? 0.8 : 0.5,
  }));
}
