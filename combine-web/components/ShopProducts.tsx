import { prisma } from "@/lib/prisma";
import ShopClient from "./ShopClient";

type ShopProductsProps = {
  brand?: string;
};

export default async function ShopProducts({
  brand,
}: ShopProductsProps) {
const products = await prisma.product.findMany({
  where: brand
    ? {
        brand,
      }
    : undefined,

  orderBy: {
    createdAt: "desc",
  },

  include: {
    images: {
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

  image:
    product.images[0]?.url ??
    "/placeholder.png",

  category: product.category,
  subCategory: product.subCategory,

  mainColor: product.mainColor,

  featured: product.featured,
  newArrival: product.newArrival,
  bestSeller: product.bestSeller,
  limited: product.limited,
  onSale: product.onSale,
}));

  return (
    <ShopClient products={formattedProducts} />
  );
}