import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const baseUrl =
  "https://combineluxe.com";


  /*
   * =========================================================
   * PRODUCTS
   * =========================================================
   *
   * Include all public product pages.
   *
   * We do not filter by availability because an out-of-stock
   * product can still have a valid public product page.
   */

  const products =
    await prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },

      orderBy: {
        updatedAt: "desc",
      },
    });


  /*
   * =========================================================
   * STATIC PAGES
   * =========================================================
   */

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,

      lastModified:
        new Date(),

      changeFrequency:
        "weekly",

      priority: 1,
    },

    {
      url:
        `${baseUrl}/shop`,

      lastModified:
        new Date(),

      changeFrequency:
        "daily",

      priority: 0.9,
    },

    {
      url:
        `${baseUrl}/brands`,

      lastModified:
        new Date(),

      changeFrequency:
        "weekly",

      priority: 0.8,
    },

    {
      url:
        `${baseUrl}/about`,

      lastModified:
        new Date(),

      changeFrequency:
        "monthly",

      priority: 0.8,
    },

    {
      url:
        `${baseUrl}/contact`,

      lastModified:
        new Date(),

      changeFrequency:
        "monthly",

      priority: 0.8,
    },

    {
      url:
        `${baseUrl}/privacy-policy`,

      lastModified:
        new Date(),

      changeFrequency:
        "yearly",

      priority: 0.3,
    },

    {
      url:
        `${baseUrl}/terms-and-conditions`,

      lastModified:
        new Date(),

      changeFrequency:
        "yearly",

      priority: 0.3,
    },

    {
      url:
        `${baseUrl}/shipping-policy`,

      lastModified:
        new Date(),

      changeFrequency:
        "yearly",

      priority: 0.3,
    },
  ];


  /*
   * =========================================================
   * PRODUCT PAGES
   * =========================================================
   */

  const productPages:
    MetadataRoute.Sitemap =
    products.map(
      (product) => ({
        url:
          `${baseUrl}/shop/${product.slug}`,

        lastModified:
          product.updatedAt,

        changeFrequency:
          "weekly",

        priority: 0.7,
      })
    );


  /*
   * =========================================================
   * FINAL SITEMAP
   * =========================================================
   */

  return [
    ...staticPages,
    ...productPages,
  ];
}