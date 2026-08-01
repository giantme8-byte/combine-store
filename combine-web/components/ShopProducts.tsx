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
  const products = await prisma.product.findMany({
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
  });

  const formattedProducts = products.map((product) => ({
    id: product.id,
    slug: product.slug ?? "",

    brand: product.brand,
    name: product.name,
    model: product.model,
    sku: product.sku,

    price: product.price,

    displayOrder: product.displayOrder,

    image: product.images[0]?.url ?? "/placeholder.png",

    category: product.category,
    subCategory: product.subCategory,

    mainColor: product.mainColor,

    featured: product.featured,
    newArrival: product.newArrival,
    bestSeller: product.bestSeller,
    limited: product.limited,
    onSale: product.onSale,
  }));

  return <ShopClient products={formattedProducts} />;
}