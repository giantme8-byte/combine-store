import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { calculateVoucher } from "@/lib/checkout";


// ============================================================
// CONSTANTS
// ============================================================

const NEW_CUSTOMER_VOUCHER_CODE =
  "WELCOME50";


// ============================================================
// POST
// ============================================================

export async function POST(
  request: Request
) {

  try {

    // ==========================================================
    // REQUEST BODY
    // ==========================================================

    const body =
      await request.json();


    const productId =
      Number(body.productId);


    const variantId =
      body.variantId === null ||
      body.variantId === undefined ||
      body.variantId === ""
        ? null
        : Number(body.variantId);


    // ==========================================================
    // BASIC VALIDATION
    // ==========================================================

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {

      return NextResponse.json(
        {
          eligible: false,
          discount: 0,
        }
      );

    }


    if (
      variantId !== null &&
      (
        !Number.isInteger(variantId) ||
        variantId <= 0
      )
    ) {

      return NextResponse.json(
        {
          eligible: false,
          discount: 0,
        }
      );

    }


    // ==========================================================
    // CURRENT USER
    // ==========================================================

    const currentUser =
      await getCurrentUser();


    const userId =
      currentUser?.id ?? null;


    // ==========================================================
    // PRODUCT
    // ==========================================================

    const product =
      await prisma.product.findUnique({

        where: {
          id: productId,
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


    if (!product) {

      return NextResponse.json(
        {
          eligible: false,
          discount: 0,
        },
        {
          status: 404,
        }
      );

    }


    // ==========================================================
    // CURRENT PRICE
    // ==========================================================

    let currentPrice =
      product.price;


    if (
      variantId !== null
    ) {

      const variant =
        product.variants.find(
          (item) =>
            item.id === variantId
        );


      if (!variant) {

        return NextResponse.json(
          {
            eligible: false,
            discount: 0,
          },
          {
            status: 400,
          }
        );

      }


      if (
        variant.productId !==
        product.id
      ) {

        return NextResponse.json(
          {
            eligible: false,
            discount: 0,
          },
          {
            status: 400,
          }
        );

      }


      if (
        variant.price !== null
      ) {

        currentPrice =
          variant.price;

      }

    }


    // ==========================================================
    // NO PRICE
    // ==========================================================

    if (
      currentPrice <= 0
    ) {

      return NextResponse.json({

        eligible: false,

        discount: 0,

        price: currentPrice,

      });

    }


    // ==========================================================
    // CALCULATE VOUCHER
    // ==========================================================

    const voucher =
      await calculateVoucher({

        code:
          NEW_CUSTOMER_VOUCHER_CODE,

        subtotal:
          currentPrice,

        userId,

        productCategories:
          [product.category],

      });


    // ==========================================================
    // NOT ELIGIBLE
    // ==========================================================

    if (
      voucher.error ||
      voucher.discount <= 0
    ) {

      return NextResponse.json({

        eligible: false,

        discount: 0,

        price:
          currentPrice,

      });

    }


    // ==========================================================
    // NEW CUSTOMER PRICE
    // ==========================================================

    const newCustomerPrice =
      Math.max(
        Math.round(
          (
            currentPrice -
            voucher.discount +
            Number.EPSILON
          ) *
            100
        ) /
          100,
        0
      );


    // ==========================================================
    // SUCCESS
    // ==========================================================

    return NextResponse.json({

      eligible: true,

      price:
        currentPrice,

      discount:
        voucher.discount,

      newCustomerPrice,

    });

  } catch (error) {

    console.error(
      "New customer price error:",
      error
    );


    return NextResponse.json(
      {
        eligible: false,
        discount: 0,
      },
      {
        status: 500,
      }
    );

  }

}