
import {
  Product,
  ProductVariant,
  ProductColor,
} from "@prisma/client";

export type ProductWithVariants =
  Product & {
    variants: ProductVariant[];
    colors: ProductColor[];
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
    const productCostPriceCny =
      product.costPriceCny ?? 0;

    const productCostMyr =
      productCostPriceCny * exchangeRate;

    const productSellingPrice =
      product.price;

    // ========================================================
    // PRODUCT WITH VARIANTS
    // ========================================================

    if (product.variants.length > 0) {
const uniqueSizes = new Set(
  product.variants
    .map((variant) => variant.size.trim())
    .filter(Boolean)
);

const hasMultipleSizes =
  uniqueSizes.size > 1;

const hasMultipleColors =
  (product.colors?.length ?? 0) > 1;

const hasVariantSpecificPricing =
  hasMultipleSizes || hasMultipleColors;

      // ======================================================
      // SINGLE SIZE
      // Use product-level pricing.
      // Each saved variant counts as one unit.
      // ======================================================

      if (!hasVariantSpecificPricing) {
        const unitCount = Math.max(
          product.variants.length,
          product.colors?.length ?? 0,
          1
        );

        totalCostMyr +=
          productCostMyr * unitCount;

        totalRevenue +=
          productSellingPrice * unitCount;

        continue;
      }

      // ======================================================
      // MULTIPLE SIZES
      // Use variant-level pricing with fallbacks.
      // Each variant counts as one unit.
      // ======================================================

      for (const variant of product.variants) {
        const effectiveExchangeRate =
          variant.exchangeRate ?? exchangeRate;

        const costPriceCny =
          variant.costPriceCny ??
          productCostPriceCny;

        const costMyr =
          costPriceCny * effectiveExchangeRate;

        const sellingPrice =
          variant.price ?? productSellingPrice;

        totalCostMyr += costMyr;
        totalRevenue += sellingPrice;
      }

      continue;
    }

    // ========================================================
    // PRODUCT WITHOUT VARIANTS
    // Each saved color counts as one unit.
    // If no colors exist, count one unit.
    // ========================================================

const unitCount = Math.max(
  product.colors?.length ?? 0,
  1
);

    totalCostMyr +=
      productCostMyr * unitCount;

    totalRevenue +=
      productSellingPrice * unitCount;
  }

  // ==========================================================
  // TOTAL PROFIT
  // ==========================================================

  const totalProfit =
    totalRevenue - totalCostMyr;

  // ==========================================================
  // PROFIT MARGIN
  // ==========================================================

  const margin =
    totalRevenue <= 0
      ? 0
      : Number(
          (
            (totalProfit / totalRevenue) *
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
