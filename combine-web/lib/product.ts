import { Product } from "@prisma/client";

type ProfitInput = Pick<
  Product,
  "costPriceCny" | "price"
>;

export function calculateProductProfit(
  product: ProfitInput,
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
      : Number(
          (
            (profit / product.price) *
            100
          ).toFixed(2)
        );

  return {
    costMyr,
    profit,
    margin,
    isProfit: profit >= 0,
    isLoss: profit < 0,
  };
}