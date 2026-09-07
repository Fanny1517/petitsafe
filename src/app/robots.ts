import type { MetadataRoute } from "next";

const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://rzpanda.com";
const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/portail-parents/", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
