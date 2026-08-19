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
    /*
     * ========================================================
     * PRODUCT WITH VARIANTS
     * ========================================================
     *
     * Every Variant represents one stock unit.
     *
     * Example:
     *
     * Black / Small   = 1
     * Black / Medium  = 1
     * Black / Large   = 1
     *
     * Therefore every Variant is
     * counted individually.
     */

    if (
      product.variants.length > 0
    ) {
      for (
        const variant of
        product.variants
      ) {
        /*
         * ----------------------------------------------------
         * Effective Exchange Rate
         * ----------------------------------------------------
         *
         * Variant-specific exchange rate
         * takes priority.
         *
         * If empty, use the global
         * Dashboard exchange rate.
         */

        const effectiveExchangeRate =
          variant.exchangeRate ??
          exchangeRate;

        /*
         * ----------------------------------------------------
         * Effective Cost Price
         * ----------------------------------------------------
         *
         * Variant-specific cost takes priority.
         *
         * If empty, fall back to the
         * Product-level cost price.
         */

        const costPriceCny =
          variant.costPriceCny ??
          product.costPriceCny ??
          0;

        const costMyr =
          costPriceCny *
          effectiveExchangeRate;

        /*
         * ----------------------------------------------------
         * Effective Selling Price
         * ----------------------------------------------------
         *
         * Variant-specific selling price
         * takes priority.
         *
         * If empty, fall back to Product.price.
         */

        const sellingPrice =
          variant.price ??
          product.price;

        /*
         * ----------------------------------------------------
         * Variant Stock
         * ----------------------------------------------------
         *
         * Every Variant = 1 stock.
         *
         * Therefore we simply add the
         * Variant cost and selling price.
         */

        totalCostMyr +=
          costMyr;

        totalRevenue +=
          sellingPrice;
      }

      continue;
    }

    /*
     * ========================================================
     * PRODUCT WITHOUT VARIANTS
     * ========================================================
     *
     * A Product without Variants is treated
     * as one stock unit.
     *
     * This preserves the original Dashboard
     * calculation behaviour.
     */

    const productCostMyr =
      (product.costPriceCny ?? 0) *
      exchangeRate;

    totalCostMyr +=
      productCostMyr;

    totalRevenue +=
      product.price;
  }

  /*
   * ==========================================================
   * TOTAL PROFIT
   * ==========================================================
   */

  const totalProfit =
    totalRevenue -
    totalCostMyr;

  /*
   * ==========================================================
   * PROFIT MARGIN
   * ==========================================================
   */

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

  return {
    totalCostMyr,
    totalRevenue,
    totalProfit,
    margin,
  };
}