import { Product } from "@prisma/client";

export type InventorySummary = {
  totalCostMyr: number;
  totalRevenue: number;
  totalProfit: number;
  margin: number;
};

export function calculateInventorySummary(
  products: Product[],
  exchangeRate: number
): InventorySummary {
  let totalCostMyr = 0;
  let totalRevenue = 0;

  for (const product of products) {
    totalCostMyr +=
      (product.costPriceCny ?? 0) *
      exchangeRate;

    totalRevenue += product.price;
  }

  const totalProfit =
    totalRevenue - totalCostMyr;

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