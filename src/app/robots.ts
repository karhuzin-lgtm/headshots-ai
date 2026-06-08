import type { MetadataRoute } from "next";

const baseUrl = "https://headshots.alekseimedia.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/try/result", "/try/payment-return"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
