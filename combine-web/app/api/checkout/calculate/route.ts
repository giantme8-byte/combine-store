import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  calculateCheckout,
} from "@/lib/checkout";


// ============================================================
// TYPES
// ============================================================

type NormalizedItem = {
  productId: number;

  quantity: number;

  variantId: number | null;
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
      await request.json();


    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    const country =
      typeof body.country === "string"
        ? body.country.trim()
        : "Malaysia";


    const isMalaysia =
      country === "Malaysia";


    const state =
      typeof body.state === "string"
        ? body.state.trim()
        : "";


    if (isMalaysia && !state) {

      return NextResponse.json(
        {
          error:
            "Please select your state.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // VOUCHER
    // ========================================================

    const voucherCode =
      typeof body.voucherCode === "string"
        ? body.voucherCode.trim()
        : "";


    // ========================================================
    // USER ID
    // ========================================================

    const userId =
      Number.isInteger(
        body.userId
      ) &&
      body.userId > 0
        ? body.userId
        : null;


    // ========================================================
    // PAYMENT METHOD TYPE
    // ========================================================

    const paymentMethodType =
      typeof body.paymentMethodType === "string"
        ? body.paymentMethodType.trim()
        : "";


    // ========================================================
    // VALID PAYMENT METHOD TYPE
    // ========================================================

    const normalizedPaymentMethodType =
      paymentMethodType === "BANK_TRANSFER" ||
      paymentMethodType === "QR" ||
      paymentMethodType === "PAYPAL" ||
      paymentMethodType === "WISE"
        ? paymentMethodType
        : undefined;


    // ========================================================
    // ITEMS
    // ========================================================

    if (
      !Array.isArray(
        body.items
      ) ||
      body.items.length === 0
    ) {

      return NextResponse.json(
        {
          error:
            "Your cart is empty.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // NORMALIZE ITEMS
    // ========================================================

    const normalizedItems: (
      | NormalizedItem
      | null
    )[] =
      body.items.map(
        (item: unknown) => {

          // --------------------------------------------------
          // OBJECT CHECK
          // --------------------------------------------------

          if (
            typeof item !== "object" ||
            item === null
          ) {

            return null;

          }


          const record =
            item as Record<
              string,
              unknown
            >;


          // --------------------------------------------------
          // PRODUCT ID
          // --------------------------------------------------

          const productId =
            Number(
              record.productId
            );


          // --------------------------------------------------
          // QUANTITY
          // --------------------------------------------------

          const quantity =
            Number(
              record.quantity
            );


          // --------------------------------------------------
          // VARIANT ID
          // --------------------------------------------------

          const variantId =
            record.variantId ===
              null ||
            record.variantId ===
              undefined ||
            record.variantId === ""
              ? null
              : Number(
                  record.variantId
                );


          // --------------------------------------------------
          // PRODUCT ID VALIDATION
          // --------------------------------------------------

          if (
            !Number.isInteger(
              productId
            ) ||
            productId <= 0
          ) {

            return null;

          }


          // --------------------------------------------------
          // QUANTITY VALIDATION
          // --------------------------------------------------

          if (
            !Number.isInteger(
              quantity
            ) ||
            quantity <= 0
          ) {

            return null;

          }


          // --------------------------------------------------
          // VARIANT ID VALIDATION
          // --------------------------------------------------

          if (
            variantId !== null &&
            (
              !Number.isInteger(
                variantId
              ) ||
              variantId <= 0
            )
          ) {

            return null;

          }


          // --------------------------------------------------
          // VALID ITEM
          // --------------------------------------------------

          return {
            productId,
            quantity,
            variantId,
          };

        }
      );


    // ========================================================
    // INVALID ITEMS
    // ========================================================

    if (
      normalizedItems.some(
        (
          item: NormalizedItem | null
        ) =>
          item === null
      )
    ) {

      return NextResponse.json(
        {
          error:
            "One or more cart items are invalid.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // REMOVE NULL VALUES
    // ========================================================

    const items =
      normalizedItems.filter(
        (
          item: NormalizedItem | null
        ): item is NormalizedItem =>
          item !== null
      );


    // ========================================================
    // SAFETY CHECK
    // ========================================================

    if (
      items.length === 0
    ) {

      return NextResponse.json(
        {
          error:
            "Your cart is empty.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // PRODUCT IDS
    // ========================================================

    const productIds =
      Array.from(
        new Set(
          items.map(
            (
              item: NormalizedItem
            ) =>
              item.productId
          )
        )
      );


    // ========================================================
    // LOAD PRODUCTS
    // ========================================================

    const products =
      await prisma.product.findMany({

        where: {

          id: {
            in:
              productIds,
          },

        },

        select: {

          id: true,

          category: true,

          price: true,

          variants: {

            select: {

              id: true,

              productId: true,

              price: true,

            },

          },

        },

      });


    // ========================================================
    // PRODUCT EXISTENCE
    // ========================================================

    if (
      products.length !==
      productIds.length
    ) {

      return NextResponse.json(
        {
          error:
            "One or more products could not be found.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // PRODUCT MAP
    // ========================================================

    const productMap =
      new Map(
        products.map(
          (product) => [
            product.id,
            product,
          ]
        )
      );


    // ========================================================
    // CALCULATE SUBTOTAL
    // ========================================================

    let subtotal =
      0;


    let totalQuantity =
      0;


    const productCategories:
      string[] = [];


    // ========================================================
    // PROCESS EACH ITEM
    // ========================================================

    for (
      const item of items
    ) {

      const product =
        productMap.get(
          item.productId
        );


      // ------------------------------------------------------
      // PRODUCT CHECK
      // ------------------------------------------------------

      if (!product) {

        return NextResponse.json(
          {
            error:
              "Product could not be found.",
          },
          {
            status: 400,
          }
        );

      }


      // ------------------------------------------------------
      // DEFAULT PRODUCT PRICE
      // ------------------------------------------------------

      let unitPrice =
        product.price;


      // ------------------------------------------------------
      // VARIANT PRICE
      // ------------------------------------------------------

      if (
        item.variantId !==
        null
      ) {

        const variant =
          product.variants.find(
            (
              itemVariant
            ) =>
              itemVariant.id ===
              item.variantId
          );


        // ----------------------------------------------------
        // VARIANT NOT FOUND
        // ----------------------------------------------------

        if (!variant) {

          return NextResponse.json(
            {
              error:
                "Selected product variant could not be found.",
            },
            {
              status: 400,
            }
          );

        }


        // ----------------------------------------------------
        // VARIANT PRODUCT CHECK
        // ----------------------------------------------------

        if (
          variant.productId !==
          product.id
        ) {

          return NextResponse.json(
            {
              error:
                "Invalid product variant.",
            },
            {
              status: 400,
            }
          );

        }


        // ----------------------------------------------------
        // USE VARIANT PRICE
        // ----------------------------------------------------

        if (
          variant.price !==
          null
        ) {

          unitPrice =
            variant.price;

        }

      }


      // ------------------------------------------------------
      // SUBTOTAL
      // ------------------------------------------------------

      subtotal +=
        unitPrice *
        item.quantity;


      // ------------------------------------------------------
      // TOTAL QUANTITY
      // ------------------------------------------------------

      totalQuantity +=
        item.quantity;


      // ------------------------------------------------------
      // PRODUCT CATEGORY
      // ------------------------------------------------------

      if (
        !productCategories.includes(
          product.category
        )
      ) {

        productCategories.push(
          product.category
        );

      }

    }


    // ========================================================
    // ROUND SUBTOTAL
    // ========================================================

    subtotal =
      Math.round(
        (
          subtotal +
          Number.EPSILON
        ) *
        100
      ) /
      100;


    // ========================================================
    // CHECKOUT CALCULATION
    // ========================================================

    const calculation =
      await calculateCheckout({

        subtotal,

        totalQuantity,

        state,

        country,

        voucherCode,

        userId,

        productCategories,

        paymentMethodType:
          normalizedPaymentMethodType,

      });


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json({

      success: true,

      country,

      isInternational: !isMalaysia,

      subtotal:
        calculation.subtotal,

      voucherCode:
        calculation.voucher.code,

      voucherDiscount:
        calculation.voucherDiscount,

      paypalFee:
        calculation.paypalFee,

      voucherError:
        calculation.voucher.error,

      shipping: {

        courier:
          calculation.shipping.courier,

        region:
          calculation.shipping.region,

        fee:
          calculation.shipping.fee,

        isFree:
          calculation.shipping.isFree,

      },

      finalAmount:
        calculation.finalAmount,

    });

  } catch (error) {

    // ========================================================
    // ERROR
    // ========================================================

    console.error(
      "Checkout calculation error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to calculate checkout total.",
      },
      {
        status: 500,
      }
    );

  }

}