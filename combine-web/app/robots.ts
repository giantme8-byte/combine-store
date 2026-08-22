import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",

      allow: "/",

      disallow: [
        "/admin/",
        "/api/",
        "/login",
        "/register",
        "/profile/",
        "/cart",
        "/checkout",
        "/inquiry/",
        "/order/",
        "/maintenance",
      ],
    },

    sitemap:
      "https://combine.com/sitemap.xml",
  };
}