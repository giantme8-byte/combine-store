export function calculateProfit(
  sellingPrice: number,
  costPriceCny: number | null,
  exchangeRate: number
) {
  if (costPriceCny == null) {
    return null;
  }

  const costMyr = costPriceCny * exchangeRate;
  const profit = sellingPrice - costMyr;

  const margin =
    sellingPrice > 0
      ? (profit / sellingPrice) * 100
      : 0;

  return {
    costMyr,
    profit,
    margin,
  };
}