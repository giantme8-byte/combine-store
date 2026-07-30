import { Product } from "@prisma/client";


export function calculateInventorySummary(
  products: Product[],
  exchangeRate: number
) {

  let totalCostMyr = 0;

  let totalRevenue = 0;



  products.forEach((product) => {


    const cost =
      (product.costPriceCny ?? 0) *
      exchangeRate;



    const revenue =
      product.price;



    totalCostMyr += cost;

    totalRevenue += revenue;


  });



  const totalProfit =
    totalRevenue - totalCostMyr;



  const margin =
    totalRevenue === 0
      ? 0
      : (totalProfit / totalRevenue) * 100;



  return {
    totalCostMyr,
    totalRevenue,
    totalProfit,
    margin,
  };

}