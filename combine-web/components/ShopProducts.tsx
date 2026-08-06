import { prisma } from "@/lib/prisma";

import ShopClient from "./ShopClient";

type ShopProductsProps = {
  brand?: string;
  category?: string;
};

export default async function ShopProducts({
  brand,
  category,
}: ShopProductsProps) {
  const where = {
    ...(brand
      ? {
          brand,
        }
      : {}),

    ...(category && category !== "All"
      ? {
          category,
        }
      : {}),
  };

  const select = {
    id: true,
    slug: true,

    brand: true,
    name: true,
    model: true,
    sku: true,

    price: true,

    displayOrder: true,

    category: true,
    subCategory: true,
    mainColor: true,

    createdAt: true,

    featured: true,
    newArrival: true,
    bestSeller: true,
    limited: true,
    onSale: true,

    images: {
      select: {
        url: true,
      },
      orderBy: {
        sortOrder: "asc" as const,
      },
    },
  };

  const orderBy = [
    {
      featured: "desc" as const,
    },
    {
      displayOrder: "asc" as const,
    },
    {
      createdAt: "desc" as const,
    },
  ];

  const [
    products,
    featuredProducts,
  ] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      select,
    }),

    prisma.product.findMany({
      where: {
        featured: true,
      },

      orderBy,

      take: 12,

      select,
    }),
  ]);

  const formatProduct = (
    product: typeof products[number]
  ) => ({
    id: product.id,
    slug: product.slug ?? "",

    brand: product.brand,
    name: product.name,
    model: product.model,
    sku: product.sku,

    price: product.price,

    displayOrder: product.displayOrder,

    image:
      product.images[0]?.url ??
      "/placeholder.png",

    secondImage:
      product.images[1]?.url,

    category: product.category,
    subCategory: product.subCategory,
    mainColor: product.mainColor,

    createdAt: product.createdAt,

    featured: product.featured,
    newArrival: product.newArrival,
    bestSeller: product.bestSeller,
    limited: product.limited,
    onSale: product.onSale,
  });

  return (
    <ShopClient
      products={products.map(
        formatProduct
      )}
      featuredProducts={featuredProducts.map(
        formatProduct
      )}
    />
  );
}