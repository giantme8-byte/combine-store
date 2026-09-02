import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function buildOrderNumber(
  orderId: number,
  createdAt: Date
): string {

  const dateParts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Kuala_Lumpur",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(
      createdAt
    );

  const year =
    dateParts.find(
      (part) =>
        part.type === "year"
    )?.value ?? "";

  const month =
    dateParts.find(
      (part) =>
        part.type === "month"
    )?.value ?? "";

  const day =
    dateParts.find(
      (part) =>
        part.type === "day"
    )?.value ?? "";

  return (
    `CL-${year}${month}${day}-${String(orderId).padStart(4, "0")}`
  );
}


async function main() {

  console.log(
    "Starting Order Reference backfill..."
  );


  const orders =
    await prisma.order.findMany({

      where: {
        orderNumber: null,
      },

      select: {
        id: true,
        createdAt: true,
      },

      orderBy: {
        id: "asc",
      },

    });


  console.log(
    `Found ${orders.length} orders without Order Reference.`
  );


  for (const order of orders) {

    const orderNumber =
      buildOrderNumber(
        order.id,
        order.createdAt
      );


    await prisma.order.update({

      where: {
        id:
          order.id,
      },

      data: {
        orderNumber,
      },

    });


    console.log(
      `Order #${order.id} → ${orderNumber}`
    );

  }


  console.log(
    "Order Reference backfill completed."
  );

}


main()
  .catch((error) => {

    console.error(
      "Backfill failed:",
      error
    );

    process.exit(1);

  })
  .finally(async () => {

    await prisma.$disconnect();

  });