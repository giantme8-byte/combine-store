import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  getCurrentUser,
} from "@/lib/auth";

import {
  calculateVoucher,
} from "@/lib/checkout";


// ============================================================
// REQUEST BODY
// ============================================================

type RequestBody = {
  productIds?: unknown;
};


// ============================================================
// RESPONSE TYPE
// ============================================================

type VoucherPrice = {
  price: number;
  discount: number;
  isNewCustomerVoucher: boolean;
};


// ============================================================
// POST
// ============================================================

export async function POST(
  request: Request
) {

  try {

    // ========================================================
    // CURRENT CUSTOMER
    // ========================================================

    /*
     * Resolve the authenticated customer
     * from the server-side session.
     *
     * Anonymous customers do not receive
     * customer-specific voucher pricing.
     */

    const currentUser =
      await getCurrentUser();


    if (!currentUser) {

      return NextResponse.json({
        prices: {},
      });

    }


    const userId =
      currentUser.id;


    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body =
      (await request.json()) as
        RequestBody;


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


    /*
     * Shop only sends the products
     * currently displayed on the page.
     */

    if (
      productIds.length === 0
    ) {

      return NextResponse.json({
        prices: {},
      });

    }


    /*
     * Prevent unnecessarily large requests.
     */

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
    // LOAD PRODUCTS
    // ========================================================

    /*
     * IMPORTANT:
     *
     * Never trust browser-supplied:
     *
     * - price
     * - category
     *
     * We load the real values from Prisma.
     *
     * We also load variant prices because
     * ProductCard displays the lowest variant
     * price when variants exist.
     */

    const products =
      await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },

        select: {
          id: true,

          price: true,

          category: true,

          variants: {
            select: {
              price: true,
            },
          },
        },
      });


    // ========================================================
    // LOAD ACTIVE VOUCHERS
    // ========================================================

    /*
     * IMPORTANT:
     *
     * DO NOT hard-code voucher codes here.
     *
     * Every active Voucher created/managed
     * from Admin Dashboard is considered.
     *
     * calculateVoucher() remains the single
     * source of truth for voucher eligibility.
     *
     * newCustomerOnly is loaded because the
     * ProductCard needs to know how to label
     * the selected voucher.
     */

    const vouchers =
      await prisma.voucher.findMany({
        where: {
          isActive: true,
        },

        select: {
          code: true,
          newCustomerOnly: true,
        },
      });


    // ========================================================
    // CALCULATE CUSTOMER PRICES
    // ========================================================

    const prices:
      Record<
        number,
        VoucherPrice
      > = {};


    await Promise.all(
      products.map(
        async (product) => {

          // ==================================================
          // BASE DISPLAY PRICE
          // ==================================================

          /*
           * ProductCard uses the lowest valid
           * variant price when variants exist.
           *
           * Keep the API calculation consistent
           * with ProductCard.
           */

          const variantPrices =
            (product.variants ?? [])
              .map(
                (variant) =>
                  typeof variant.price ===
                    "number" &&
                  Number.isFinite(
                    variant.price
                  ) &&
                  variant.price > 0
                    ? variant.price
                    : null
              )
              .filter(
                (
                  value
                ): value is number =>
                  value !== null
              );


          const uniqueVariantPrices =
            [
              ...new Set(
                variantPrices
              ),
            ].sort(
              (a, b) =>
                a - b
            );


          const productPrice =
            uniqueVariantPrices.length >
            0
              ? uniqueVariantPrices[0]
              : Number(
                  product.price
                );


          /*
           * Invalid product price.
           */

          if (
            !Number.isFinite(
              productPrice
            ) ||
            productPrice <= 0
          ) {

            return;

          }


          // ==================================================
          // CHECK ALL ACTIVE VOUCHERS
          // ==================================================

          /*
           * We do NOT decide voucher eligibility
           * ourselves.
           *
           * Every active voucher is passed through
           * calculateVoucher().
           */

          const calculations =
            await Promise.all(
              vouchers.map(
                async (voucher) => {

                  const calculation =
                    await calculateVoucher({
                      code:
                        voucher.code,

                      subtotal:
                        productPrice,

                      userId,

                      productCategories: [
                        product.category,
                      ],
                    });


                  return {
                    calculation,

                    isNewCustomerVoucher:
                      voucher.newCustomerOnly,
                  };

                }
              )
            );


          // ==================================================
          // FIND BEST VALID VOUCHER
          // ==================================================

          /*
           * Only successful voucher calculations
           * with a real discount are considered.
           *
           * If multiple vouchers are valid,
           * use the voucher giving the customer
           * the largest discount.
           */

          const validDiscounts =
            calculations
              .filter(
                (item) =>
                  !item.calculation.error &&
                  item.calculation.discount > 0
              )
              .sort(
                (a, b) =>
                  b.calculation.discount -
                  a.calculation.discount
              );


          if (
            validDiscounts.length === 0
          ) {

            return;

          }


          const bestVoucher =
            validDiscounts[0];


          // ==================================================
          // FINAL CUSTOMER PRICE
          // ==================================================

          const discount =
            Math.min(
              bestVoucher.calculation.discount,
              productPrice
            );


          const customerPrice =
            Math.round(
              (
                productPrice -
                discount +
                Number.EPSILON
              ) *
                100
            ) / 100;


          /*
           * Safety check.
           */

          if (
            customerPrice >=
            productPrice
          ) {

            return;

          }


          // ==================================================
          // SAVE CUSTOMER PRICE
          // ==================================================

          prices[
            product.id
          ] = {

            price:
              customerPrice,

            discount:
              Math.round(
                (
                  discount +
                  Number.EPSILON
                ) *
                  100
              ) / 100,

            isNewCustomerVoucher:
              bestVoucher.isNewCustomerVoucher,

          };

        }
      )
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