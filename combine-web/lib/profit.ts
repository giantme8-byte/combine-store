export type ProfitResult = {
  costMyr: number;
  profit: number;
  margin: number;
  isProfit: boolean;
  isLoss: boolean;
};

export function calculateProfit(
  sellingPrice: number,
  costPriceCny: number | null,
  exchangeRate: number
): ProfitResult | null {
  if (costPriceCny == null) {
    return null;
  }

  const costMyr =
    costPriceCny * exchangeRate;

  const profit =
    sellingPrice - costMyr;

  const margin =
    sellingPrice > 0
      ? Number(
          (
            (profit / sellingPrice) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    costMyr,
    profit,
    margin,
    isProfit: profit >= 0,
    isLoss: profit < 0,
  };
}