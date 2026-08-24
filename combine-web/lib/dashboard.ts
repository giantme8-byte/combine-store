import {
  Product,
  ProductVariant,
} from "@prisma/client";

export type ProductWithVariants =
  Product & {
    variants: ProductVariant[];
  };

export type InventorySummary = {
  totalCostMyr: number;
  totalRevenue: number;
  totalProfit: number;
  margin: number;
};

export function calculateInventorySummary(
  products: ProductWithVariants[],
  exchangeRate: number
): InventorySummary {
  let totalCostMyr = 0;
  let totalRevenue = 0;

  for (const product of products) {
    // ========================================================
    // PRODUCT WITH VARIANTS
    // ========================================================

    if (product.variants.length > 0) {
      /*
       * ======================================================
       * DETERMINE PRICING MODE
       * ======================================================
       *
       * 1 Size:
       *   Product Pricing is used.
       *
       * Multiple Sizes:
       *   Variant Pricing is used.
       *
       * Every Variant represents one stock unit.
       */

      const uniqueSizes =
        new Set(
          product.variants.map(
            (variant) =>
              variant.size.trim()
          )
        );

      const hasMultipleSizes =
        uniqueSizes.size > 1;


      // ======================================================
      // 1 SIZE
      // ======================================================
      //
      // Examples:
      //
      // Black / One Size
      // White / One Size
      // Brown / One Size
      //
      // Product Pricing is the source of truth.
      //
      // Every Color / Size combination = 1 stock.
      //
      // Therefore:
      //
      // Product Cost × Variant Count
      // Product Price × Variant Count
      // ======================================================

      if (!hasMultipleSizes) {
        const productCostPriceCny =
          product.costPriceCny ?? 0;

        const productCostMyr =
          productCostPriceCny *
          exchangeRate;

        const productSellingPrice =
          product.price;


        for (
          const variant of
          product.variants
        ) {
          /*
           * Every Variant represents
           * exactly one stock unit.
           *
           * Variant-specific pricing is NOT
           * used when there is only one Size.
           */

          totalCostMyr +=
            productCostMyr;

          totalRevenue +=
            productSellingPrice;
        }


        continue;
      }


      // ======================================================
      // MULTIPLE SIZES
      // ======================================================
      //
      // Each Variant has its own Pricing.
      //
      // Every Variant = 1 stock.
      //
      // Variant Cost:
      //   Variant Cost → Product Cost fallback
      //
      // Variant Exchange Rate:
      //   Variant Rate → Global Rate fallback
      //
      // Variant Selling Price:
      //   Variant Price → Product Price fallback
      // ======================================================

      for (
        const variant of
        product.variants
      ) {
        // ----------------------------------------------------
        // Effective Exchange Rate
        // ----------------------------------------------------

        const effectiveExchangeRate =
          variant.exchangeRate ??
          exchangeRate;


        // ----------------------------------------------------
        // Effective Cost Price
        // ----------------------------------------------------

        const costPriceCny =
          variant.costPriceCny ??
          product.costPriceCny ??
          0;


        // ----------------------------------------------------
        // Cost MYR
        // ----------------------------------------------------

        const costMyr =
          costPriceCny *
          effectiveExchangeRate;


        // ----------------------------------------------------
        // Selling Price
        // ----------------------------------------------------

        const sellingPrice =
          variant.price ??
          product.price;


        // ----------------------------------------------------
        // Every Variant = 1 Stock
        // ----------------------------------------------------

        totalCostMyr +=
          costMyr;

        totalRevenue +=
          sellingPrice;
      }


      continue;
    }


    // ========================================================
    // PRODUCT WITHOUT VARIANTS
    // ========================================================
    //
    // No Color / Size combinations exist.
    //
    // Product itself = 1 stock unit.
    //
    // Product Pricing is used.
    // ========================================================

    const productCostPriceCny =
      product.costPriceCny ?? 0;


    const productCostMyr =
      productCostPriceCny *
      exchangeRate;


    const productSellingPrice =
      product.price;


    totalCostMyr +=
      productCostMyr;

    totalRevenue +=
      productSellingPrice;
  }


  // ==========================================================
  // TOTAL PROFIT
  // ==========================================================

  const totalProfit =
    totalRevenue -
    totalCostMyr;


  // ==========================================================
  // PROFIT MARGIN
  // ==========================================================

  const margin =
    totalRevenue <= 0
      ? 0
      : Number(
          (
            (totalProfit /
              totalRevenue) *
            100
          ).toFixed(2)
        );


  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    totalCostMyr,
    totalRevenue,
    totalProfit,
    margin,
  };
}