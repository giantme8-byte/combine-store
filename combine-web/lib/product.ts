import { Product } from "@prisma/client";

type ProfitInput = Pick<
  Product,
  "costPriceCny" | "price"
>;

export function calculateProductProfit(
  product: ProfitInput,
  exchangeRate: number
) {
  const costPrice =
    (product.costPriceCny ?? 0) *
    exchangeRate;

  const profit =
    product.price - costPrice;

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
    costPrice,
    profit,
    margin,
    isProfit: profit >= 0,
    isLoss: profit < 0,
  };
}