import { Product } from "@prisma/client";

export function calculateProductProfit(
  product: Product,
  exchangeRate: number
) {
  const costMyr =
    (product.costPriceCny ?? 0) *
    exchangeRate;

  const profit =
    product.price - costMyr;

  const margin =
    product.price === 0
      ? 0
      : (profit / product.price) * 100;

  return {
    costMyr,
    profit,
    margin,
  };
}