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

  // =========================================================
  // DATABASE
  // =========================================================

  const [product, settings] =
    await Promise.all([
      prisma.product.findUnique({
        where: {
          id: Number(id),
        },

        include: {
          // -------------------------------------------------
          // Product Images
          // -------------------------------------------------

          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },

          // -------------------------------------------------
          // Product Variants
          //
          // Each Variant contains:
          //
          // - Color
          // - Size
          // - Cost Price CNY
          // - Exchange Rate
          // - Selling Price
          //
          // -------------------------------------------------

          variants: {
            include: {
              color: true,
            },

            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      }),

      prisma.setting.findFirst(),
    ]);

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!product) {
    notFound();
  }

  // =========================================================
  // DEFAULT EXCHANGE RATE
  // =========================================================
  //
  // Variant.exchangeRate takes priority.
  //
  // If a Variant does not have its own exchange rate,
  // Product / Dashboard exchange rate is used.
  //
  // =========================================================

  const exchangeRate =
    settings?.exchangeRate ?? 0.60;

  // =========================================================
  // PRODUCT-LEVEL PRICING
  // =========================================================
  //
  // Used as fallback for products without Variants.
  //
  // =========================================================

  const pricing =
    calculateProductProfit(
      product,
      exchangeRate
    );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="space-y-8">

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

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

      {/* ================================================= */}
      {/* Main Content */}
      {/* ================================================= */}

      <div className="grid gap-8 xl:grid-cols-[520px_1fr]">

        {/* ================================================= */}
        {/* Gallery */}
        {/* ================================================= */}

        <ProductGallery
          product={product}
        />

        {/* ================================================= */}
        {/* Information + Pricing */}
        {/* ================================================= */}

        <div className="space-y-6">

          <ProductInformationCard
            product={product}
          />

          <ProductPricingCard
            product={product}
            variants={product.variants}
            pricing={pricing}
            exchangeRate={exchangeRate}
          />

        </div>

      </div>

    </main>
  );
}