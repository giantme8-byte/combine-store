import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { calculateProductProfit } from "@/lib/product";

import ProductGallery from "./_components/ProductGalleryCard";
import ProductInformationCard from "./_components/ProductInformationCard";
import ProductPricingCard from "./_components/ProductPricingCard";
// import ProductTags from "./_components/ProductTags";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

const [product, settings] = await Promise.all([
  prisma.product.findUnique({
    where: {
      id: Number(id),
    },

    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  }),

  prisma.setting.findFirst(),
]);

  if (!product) {
    notFound();
  }

  const exchangeRate =
    settings?.exchangeRate ?? 0.60;

  const pricing =
    calculateProductProfit(
      product,
      exchangeRate
    );

  return (
    <main className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-light">
            {product.name}
          </h1>

          <p className="mt-2 text-gray-500">
            SKU: {product.sku ?? "-"}
          </p>

        </div>

      </div>

      <div className="grid gap-8 xl:grid-cols-[520px_1fr]">

        <ProductGallery
          product={product}
        />

<div className="space-y-6">

  <ProductInformationCard
    product={product}
  />

  <ProductPricingCard
    product={product}
    pricing={pricing}
    exchangeRate={exchangeRate}
  />

</div>

      </div>

    </main>
  );
}