import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// ============================================================
// ROUND MONEY
// ============================================================

function roundMoney(
  amount: number
): number {

  return (
    Math.round(
      (
        amount +
        Number.EPSILON
      ) * 100
    ) / 100
  );

}


// ============================================================
// MAIN
// ============================================================

async function main() {

  console.log(
    "Starting OrderItem cost backfill..."
  );


  // ==========================================================
  // GLOBAL EXCHANGE RATE
  // ==========================================================

  const settings =
    await prisma.setting.findFirst({
      select: {
        exchangeRate: true,
      },
    });


  const globalExchangeRate =
    settings?.exchangeRate ??
    0.59;


  console.log(
    `Global exchange rate: ${globalExchangeRate}`
  );


  // ==========================================================
  // FIND LEGACY ORDER ITEMS
  // ==========================================================

  const orderItems =
    await prisma.orderItem.findMany({

      where: {
        OR: [
          {
            unitCost: null,
          },
          {
            totalCost: null,
          },
          {
            profit: null,
          },
        ],
      },

      include: {

        product: {
          select: {
            id: true,
            name: true,
            costPriceCny: true,
          },
        },

        productVariant: {
          select: {
            id: true,
            costPriceCny: true,
            exchangeRate: true,
          },
        },

      },

      orderBy: {
        id: "asc",
      },

    });


  console.log(
    `Found ${orderItems.length} OrderItem(s) requiring backfill.`
  );


  // ==========================================================
  // COUNTERS
  // ==========================================================

  let updated = 0;
  let skipped = 0;


  // ==========================================================
  // PROCESS
  // ==========================================================

  for (
    const item of orderItems
  ) {

    // --------------------------------------------------------
    // COST PRICE PRIORITY
    //
    // 1. Exact ProductVariant cost
    // 2. Product cost
    // --------------------------------------------------------

    const costPriceCny =
      item.productVariant?.costPriceCny ??
      item.product.costPriceCny;


    // --------------------------------------------------------
    // EXCHANGE RATE PRIORITY
    //
    // 1. Exact ProductVariant exchange rate
    // 2. Global Settings exchange rate
    // --------------------------------------------------------

    const exchangeRate =
      item.productVariant?.exchangeRate ??
      globalExchangeRate;


    // --------------------------------------------------------
    // VALIDATE COST
    // --------------------------------------------------------

    if (
      costPriceCny === null ||
      !Number.isFinite(
        costPriceCny
      ) ||
      costPriceCny < 0
    ) {

      console.log(
        `SKIPPED #${item.id} - ${item.productName}: no valid cost price.`
      );

      skipped++;

      continue;

    }


    if (
      !Number.isFinite(
        exchangeRate
      ) ||
      exchangeRate <= 0
    ) {

      console.log(
        `SKIPPED #${item.id} - ${item.productName}: invalid exchange rate.`
      );

      skipped++;

      continue;

    }


    // --------------------------------------------------------
    // CALCULATE UNIT COST
    // --------------------------------------------------------

    const unitCost =
      roundMoney(
        costPriceCny *
        exchangeRate
      );


    // --------------------------------------------------------
    // CALCULATE TOTAL COST
    // --------------------------------------------------------

    const totalCost =
      roundMoney(
        unitCost *
        item.quantity
      );


    // --------------------------------------------------------
    // CALCULATE PROFIT
    // --------------------------------------------------------

    const profit =
      roundMoney(
        item.totalPrice -
        totalCost
      );


    // --------------------------------------------------------
    // UPDATE
    //
    // Only fill missing values.
    // Existing values are NOT overwritten.
    // --------------------------------------------------------

    await prisma.orderItem.update({

      where: {
        id: item.id,
      },

      data: {

        ...(item.unitCost === null
          ? {
              unitCost,
            }
          : {}),

        ...(item.totalCost === null
          ? {
              totalCost,
            }
          : {}),

        ...(item.profit === null
          ? {
              profit,
            }
          : {}),

      },

    });


    console.log(
      `UPDATED #${item.id} - ${item.productName} | ` +
      `Unit Cost RM ${unitCost.toFixed(2)} | ` +
      `Total Cost RM ${totalCost.toFixed(2)} | ` +
      `Profit RM ${profit.toFixed(2)}`
    );


    updated++;

  }


  // ==========================================================
  // SUMMARY
  // ==========================================================

  console.log("");
  console.log(
    "============================================================"
  );
  console.log(
    "BACKFILL COMPLETE"
  );
  console.log(
    "============================================================"
  );

  console.log(
    `Updated: ${updated}`
  );

  console.log(
    `Skipped: ${skipped}`
  );

  console.log(
    `Total checked: ${orderItems.length}`
  );

}


// ============================================================
// RUN
// ============================================================

main()
  .catch(
    (error) => {

      console.error(
        "Backfill failed:"
      );

      console.error(
        error
      );

      process.exit(
        1
      );

    }
  )
  .finally(
    async () => {

      await prisma.$disconnect();

    }
  );