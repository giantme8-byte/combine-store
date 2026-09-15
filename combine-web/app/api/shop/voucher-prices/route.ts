import {
  NextResponse,
} from "next/server";

import {
  getCustomerVoucherPrices,
} from "@/lib/customer-voucher-prices";


// ============================================================
// REQUEST BODY
// ============================================================

type RequestBody = {
  productIds?: unknown;
};


// ============================================================
// POST
// ============================================================

export async function POST(
  request: Request
) {

  try {

    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body =
      (await request.json()) as
        RequestBody;


    // ========================================================
    // VALIDATE PRODUCT IDS
    // ========================================================

    if (
      !Array.isArray(
        body.productIds
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid product IDs.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // NORMALIZE PRODUCT IDS
    // ========================================================

    const productIds =
      Array.from(
        new Set(
          body.productIds
            .map(
              (value) =>
                Number(value)
            )
            .filter(
              (value) =>
                Number.isInteger(
                  value
                ) &&
                value > 0
            )
        )
      );


    // ========================================================
    // EMPTY PRODUCT LIST
    // ========================================================

    if (
      productIds.length === 0
    ) {

      return NextResponse.json({
        prices: {},
      });

    }


    // ========================================================
    // REQUEST SIZE LIMIT
    // ========================================================

    if (
      productIds.length > 100
    ) {

      return NextResponse.json(
        {
          error:
            "Too many product IDs.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // CALCULATE CUSTOMER VOUCHER PRICES
    // ========================================================

    const prices =
      await getCustomerVoucherPrices(
        productIds
      );


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json({
      prices,
    });

  } catch (error) {

    console.error(
      "SHOP VOUCHER PRICE ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to calculate voucher prices.",
      },
      {
        status: 500,
      }
    );

  }

}