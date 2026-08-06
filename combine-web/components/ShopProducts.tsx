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
  const [
    products,
    featuredProducts,
  ] = await Promise.all([
    prisma.product.findMany({
      where: {
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
      },

      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],

      select: {
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
            sortOrder: "asc",
          },
        },
      },
    }),

    prisma.product.findMany({
      where: {
        featured: true,
      },

      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 8,

      select: {
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
            sortOrder: "asc",
          },
        },
      },
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


  const formattedProducts =
    products.map(formatProduct);


  const formattedFeatured =
    featuredProducts.map(formatProduct);


  return (
    <ShopClient
      products={formattedProducts}
      featuredProducts={formattedFeatured}
    />
  );
}