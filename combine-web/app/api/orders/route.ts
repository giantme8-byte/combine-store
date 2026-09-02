import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import {
  calculateCheckout,
} from "@/lib/checkout";


// ============================================================
// ORDER ITEM INPUT
// ============================================================

type OrderItemInput = {
  productId: number;

  quantity: number;

  /*
   * Exact ProductVariant ID.
   *
   * This identifies the exact:
   *
   * Color × Size
   *
   * combination selected by the customer.
   */

  variantId?: number | null;

  /*
   * Display / snapshot information.
   *
   * These are NOT trusted for pricing.
   */

  color?: string;

  variant?: string;

  dimensions?: string;

  packaging?: string;
};


// ============================================================
// CREATE ORDER BODY
// ============================================================

type CreateOrderBody = {
  customerName: string;

  customerPhone: string;

  customerEmail?: string;

  address: string;

  /*
   * Customer's Malaysian state.
   *
   * Used for ABX shipping calculation.
   *
   * Optional for international orders.
   */

  state?: string;

  /*
   * Customer's shipping country.
   *
   * Malaysia uses the existing ABX shipping rules.
   * Other countries require a manual shipping quotation.
   */

  country?: string;

  shippingCountry?: string;

  shippingType?: "LOCAL" | "INTERNATIONAL";

  /*
   * Customer's Additional Notes.
   *
   * This is saved into:
   *
   * Order.message
   */

  message?: string;

  items: OrderItemInput[];

  /*
   * Required only for normal Malaysia checkout.
   * International customers request a shipping quote first.
   */

  paymentMethodId?: number;

  voucherCode?: string;
};


// ============================================================
// HELPERS
// ============================================================

function cleanString(
  value: unknown
): string {

  return typeof value === "string"
    ? value.trim()
    : "";

}


function normalizeQuantity(
  value: unknown
): number {

  const quantity =
    typeof value === "number"
      ? value
      : Number(value);


  if (
    !Number.isFinite(quantity) ||
    quantity < 1
  ) {

    return 1;

  }


  return Math.floor(
    quantity
  );

}


function normalizeOptionalId(
  value: unknown
): number | null {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return null;

  }


  const id =
    Number(value);


  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {

    return null;

  }


  return id;

}


// ============================================================
// ROUND MONEY
// ============================================================

function roundMoney(
  amount: number
): number {

  return Math.round(
    (
      amount +
      Number.EPSILON
    ) *
    100
  ) / 100;

}


// ============================================================
// ORDER REFERENCE
// ============================================================
//
// Format:
// CL-YYYYMMDD-OOOO
//
// The date follows the order creation date in Malaysia time.
// The last four digits follow the real Order ID.
//
// Example:
// Order #50 created on 2026-09-01
// → CL-20260901-0050
//
// IMPORTANT:
// publicToken remains the secure public URL token.
// orderNumber is only the customer/admin-facing reference.
//

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
        CreateOrderBody;


    // ========================================================
    // CURRENT CUSTOMER
    // ========================================================

    /*
     * Never trust a userId sent from the browser.
     *
     * We always resolve the authenticated user
     * from the server-side session.
     */

    const currentUser =
      await getCurrentUser();


    const userId =
      currentUser?.id ?? null;


    // ========================================================
    // CUSTOMER INFORMATION
    // ========================================================

    const customerName =
      cleanString(
        body.customerName
      );


    const customerPhone =
      cleanString(
        body.customerPhone
      );


    const customerEmail =
      cleanString(
        body.customerEmail
      ) || null;


    const address =
      cleanString(
        body.address
      );


    const state =
      cleanString(
        body.state
      );


    const country =
      cleanString(
        body.country ||
        body.shippingCountry
      ) || "Malaysia";


    const isMalaysia =
      country.toLowerCase() ===
      "malaysia";


    const shippingType =
      isMalaysia
        ? "LOCAL"
        : "INTERNATIONAL";


    const message =
      cleanString(
        body.message
      ) || null;


    // ========================================================
    // CUSTOMER VALIDATION
    // ========================================================

    if (
      !customerName
    ) {

      return NextResponse.json(
        {
          error:
            "Customer name is required.",
        },
        {
          status: 400,
        }
      );

    }


    if (
      !customerPhone
    ) {

      return NextResponse.json(
        {
          error:
            "Customer phone number is required.",
        },
        {
          status: 400,
        }
      );

    }


    if (
      !address
    ) {

      return NextResponse.json(
        {
          error:
            "Delivery address is required.",
        },
        {
          status: 400,
        }
      );

    }


    if (
      isMalaysia &&
      !state
    ) {

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
    // ITEMS VALIDATION
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
            "Your order must contain at least one product.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // PAYMENT METHOD
    // ========================================================
    //
    // Malaysia orders can proceed directly to payment.
    //
    // International orders MUST NOT select or create a payment
    // method yet. The customer first requests a shipping quote.
    //

    const paymentMethodId =
      Number(
        body.paymentMethodId
      );


    let paymentMethod:
      Awaited<
        ReturnType<
          typeof prisma.paymentMethod.findFirst
        >
      > = null;


    if (
      isMalaysia
    ) {

      if (
        !Number.isInteger(
          paymentMethodId
        ) ||
        paymentMethodId <= 0
      ) {

        return NextResponse.json(
          {
            error:
              "Please select a valid payment method.",
          },
          {
            status: 400,
          }
        );

      }


      paymentMethod =
        await prisma.paymentMethod.findFirst({

          where: {
            id:
              paymentMethodId,

            active:
              true,
          },

        });


      if (
        !paymentMethod
      ) {

        return NextResponse.json(
          {
            error:
              "The selected payment method is no longer available.",
          },
          {
            status: 400,
          }
        );

      }

    }


    // ========================================================
    // NORMALIZE PRODUCT IDS
    // ========================================================

    const productIds =
      Array.from(
        new Set(
          body.items.map(
            (item) =>
              Number(
                item.productId
              )
          )
        )
      );


    if (
      productIds.some(
        (id) =>
          !Number.isInteger(id) ||
          id <= 0
      )
    ) {

      return NextResponse.json(
        {
          error:
            "One or more products are invalid.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // LOAD PRODUCTS
    // ========================================================
    //
    // IMPORTANT:
    //
    // The browser NEVER decides the final price.
    //
    // We always load:
    //
    // Product
    // ProductVariant
    // Color
    //
    // directly from Prisma.
    //
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

          sku: true,

          brand: true,

          name: true,

          category: true,

          price: true,

          costPriceCny: true,

          availability: true,

          variants: {

            include: {

              color: {

                select: {

                  id: true,

                  name: true,

                },

              },

            },

            orderBy: {
              sortOrder:
                "asc",
            },

          },

        },

      });


    // ========================================================
    // GLOBAL EXCHANGE RATE
    // ========================================================

    const settings =
      await prisma.setting.findFirst({
        select: {
          exchangeRate: true,
        },
      });

    const globalExchangeRate =
      settings?.exchangeRate ??
      0.59;


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
    // VERIFY PRODUCTS + VARIANTS
    // ========================================================

    for (
      const item of body.items
    ) {

      const productId =
        Number(
          item.productId
        );


      const product =
        productMap.get(
          productId
        );


      // ------------------------------------------------------
      // PRODUCT DOES NOT EXIST
      // ------------------------------------------------------

      if (
        !product
      ) {

        return NextResponse.json(
          {
            error:
              "One or more selected products could not be found.",
          },
          {
            status: 400,
          }
        );

      }


      // ------------------------------------------------------
      // SOLD OUT
      // ------------------------------------------------------

      if (
        product.availability ===
        "SOLD_OUT"
      ) {

        return NextResponse.json(
          {
            error:
              `${product.name} is currently sold out.`,
          },
          {
            status: 400,
          }
        );

      }


      // ======================================================
      // EXACT VARIANT
      // ======================================================

      const variantId =
        normalizeOptionalId(
          item.variantId
        );


      /*
       * Products with Variants MUST use
       * a valid exact Variant.
       *
       * We do NOT allow:
       *
       * Variant missing
       * ↓
       * Product.price fallback
       *
       * This prevents price bypass.
       */

      if (
        product.variants.length > 0
      ) {

        let selectedVariant =
          null as
            | (typeof product.variants)[number]
            | null;


        // ----------------------------------------------------
        // Exact Variant ID
        // ----------------------------------------------------

        if (
          variantId !== null
        ) {

          selectedVariant =
            product.variants.find(
              (variant) =>
                variant.id ===
                variantId
            ) ?? null;


          if (
            !selectedVariant
          ) {

            return NextResponse.json(
              {
                error:
                  `${product.name} has an invalid product variant selection.`,
              },
              {
                status: 400,
              }
            );

          }

        }


        // ----------------------------------------------------
        // Legacy Color + Size fallback
        // ----------------------------------------------------

        if (
          !selectedVariant
        ) {

          const colorName =
            cleanString(
              item.color
            );


          const size =
            cleanString(
              item.variant
            );


          if (
            !size
          ) {

            return NextResponse.json(
              {
                error:
                  `${product.name} requires a size or variant selection.`,
              },
              {
                status: 400,
              }
            );

          }


          const matchingVariants =
            product.variants.filter(
              (variant) => {

                const sameSize =
                  variant.size
                    .trim()
                    .toLowerCase() ===
                  size
                    .trim()
                    .toLowerCase();


                if (
                  !sameSize
                ) {

                  return false;

                }


                if (
                  colorName
                ) {

                  return (
                    variant.color?.name
                      ?.trim()
                      .toLowerCase() ===
                    colorName
                      .trim()
                      .toLowerCase()
                  );

                }


                return true;

              }
            );


          if (
            matchingVariants.length ===
            0
          ) {

            return NextResponse.json(
              {
                error:
                  `${product.name} has an invalid color or size selection.`,
              },
              {
                status: 400,
              }
            );

          }


          if (
            matchingVariants.length >
              1 &&
            colorName ===
              ""
          ) {

            return NextResponse.json(
              {
                error:
                  `${product.name} requires a color selection.`,
              },
              {
                status: 400,
              }
            );

          }


          selectedVariant =
            matchingVariants[0];

        }


        // ====================================================
        // VARIANT PRICE
        // ====================================================

        if (
          selectedVariant.price ===
            null ||
          !Number.isFinite(
            selectedVariant.price
          ) ||
          selectedVariant.price <= 0
        ) {

          return NextResponse.json(
            {
              error:
                `${product.name} does not have a confirmed price for the selected variant. Please contact us on WhatsApp for pricing.`,
            },
            {
              status: 400,
            }
          );

        }


        continue;

      }


      // ======================================================
      // PRODUCT WITHOUT VARIANTS
      // ======================================================

      if (
        !Number.isFinite(
          product.price
        ) ||
        product.price <= 0
      ) {

        return NextResponse.json(
          {
            error:
              `${product.name} does not have a confirmed selling price. Please contact us on WhatsApp for pricing.`,
          },
          {
            status: 400,
          }
        );

      }

    }


    // ========================================================
    // BUILD ORDER ITEMS
    // ========================================================

    const orderItems =
      body.items.map(
        (item) => {

          const product =
            productMap.get(
              Number(
                item.productId
              )
            )!;


          const quantity =
            normalizeQuantity(
              item.quantity
            );


          const variantId =
            normalizeOptionalId(
              item.variantId
            );


          // ==================================================
          // PRODUCT WITH VARIANTS
          // ==================================================

          if (
            product.variants.length >
            0
          ) {

            let selectedVariant =
              null as
                | (typeof product.variants)[number]
                | null;


            // ------------------------------------------------
            // Exact Variant ID
            // ------------------------------------------------

            if (
              variantId !== null
            ) {

              selectedVariant =
                product.variants.find(
                  (variant) =>
                    variant.id ===
                    variantId
                ) ?? null;

            }


            // ------------------------------------------------
            // Legacy Color + Size
            // ------------------------------------------------

            if (
              !selectedVariant
            ) {

              const colorName =
                cleanString(
                  item.color
                );


              const size =
                cleanString(
                  item.variant
                );


              const matchingVariants =
                product.variants.filter(
                  (variant) => {

                    const sameSize =
                      variant.size
                        .trim()
                        .toLowerCase() ===
                      size
                        .trim()
                        .toLowerCase();


                    if (
                      !sameSize
                    ) {

                      return false;

                    }


                    if (
                      colorName
                    ) {

                      return (
                        variant.color?.name
                          ?.trim()
                          .toLowerCase() ===
                        colorName
                          .trim()
                          .toLowerCase()
                      );

                    }


                    return true;

                  }
                );


              selectedVariant =
                matchingVariants[0] ??
                null;

            }


            if (
              !selectedVariant
            ) {

              throw new Error(
                `${product.name} has an invalid product variant selection.`
              );

            }


            // ------------------------------------------------
            // DATABASE PRICE
            // ------------------------------------------------

            const unitPrice =
              Number(
                selectedVariant.price
              );


            if (
              !Number.isFinite(
                unitPrice
              ) ||
              unitPrice <= 0
            ) {

              throw new Error(
                `${product.name} does not have a confirmed price for the selected variant.`
              );

            }


            const totalPrice =
              roundMoney(
                unitPrice *
                quantity
              );


            // ==================================================
            // COST / PROFIT SNAPSHOT
            // ==================================================

            /*
             * ProductVariant stores:
             *
             * costPriceCny
             * exchangeRate
             *
             * Cost in MYR is calculated from the exact
             * Variant selected by the customer.
             *
             * We snapshot the result into OrderItem so
             * future changes to the product cost do not
             * change historical order profit.
             */

            /*
             * COST / PROFIT SNAPSHOT
             *
             * Cost priority:
             * 1. Variant costPriceCny
             * 2. Product costPriceCny
             *
             * Exchange-rate priority:
             * 1. Variant exchangeRate
             * 2. Global Settings exchangeRate
             */

            const costPriceCny =
              selectedVariant.costPriceCny ??
              product.costPriceCny;


            const exchangeRate =
              selectedVariant.exchangeRate ??
              globalExchangeRate;


            const unitCost =
              costPriceCny !== null &&
              Number.isFinite(
                costPriceCny
              ) &&
              costPriceCny >= 0 &&
              Number.isFinite(
                exchangeRate
              ) &&
              exchangeRate > 0
                ? roundMoney(
                    costPriceCny *
                    exchangeRate
                  )
                : null;


            const totalCost =
              unitCost !== null
                ? roundMoney(
                    unitCost *
                    quantity
                  )
                : null;


            const profit =
              totalCost !== null
                ? roundMoney(
                    totalPrice -
                    totalCost
                  )
                : null;


            return {

              productId:
                product.id,

              /*
               * Exact ProductVariant.
               */

              variantId:
                selectedVariant.id,

              brand:
                product.brand,

              productName:
                product.name,

              sku:
                product.sku,

              color:
                cleanString(
                  item.color
                ) || null,

              variant:
                cleanString(
                  item.variant
                ) || null,

              dimensions:
                cleanString(
                  item.dimensions
                ) || null,

              packaging:
                cleanString(
                  item.packaging
                ) || null,

              quantity,

              unitPrice,

              totalPrice,

              unitCost,

              totalCost,

              profit,

            };

          }


          // ==================================================
          // PRODUCT WITHOUT VARIANTS
          // ==================================================

          const unitPrice =
            Number(
              product.price
            );


          if (
            !Number.isFinite(
              unitPrice
            ) ||
            unitPrice <= 0
          ) {

            throw new Error(
              `${product.name} does not have a confirmed selling price.`
            );

          }


          const totalPrice =
            roundMoney(
              unitPrice *
              quantity
            );


          // ==================================================
          // COST / PROFIT SNAPSHOT
          // ==================================================
          // Products without Variants use Product.costPriceCny
          // and the global Settings exchange rate.
          // The calculated values are saved to OrderItem as a
          // historical snapshot for this order.

          const costPriceCny =
            product.costPriceCny;

          const unitCost =
            costPriceCny !== null &&
            Number.isFinite(costPriceCny) &&
            costPriceCny >= 0 &&
            Number.isFinite(globalExchangeRate) &&
            globalExchangeRate > 0
              ? roundMoney(
                  costPriceCny *
                  globalExchangeRate
                )
              : null;

          const totalCost =
            unitCost !== null
              ? roundMoney(
                  unitCost * quantity
                )
              : null;

          const profit =
            totalCost !== null
              ? roundMoney(
                  totalPrice -
                  totalCost
                )
              : null;


          return {

            productId:
              product.id,

            variantId:
              null,

            brand:
              product.brand,

            productName:
              product.name,

            sku:
              product.sku,

            color:
              cleanString(
                item.color
              ) || null,

            variant:
              cleanString(
                item.variant
              ) || null,

            dimensions:
              cleanString(
                item.dimensions
              ) || null,

            packaging:
              cleanString(
                item.packaging
              ) || null,

            quantity,

            unitPrice,

            totalPrice,

            unitCost,

            totalCost,

            profit,

          };

        }
      );


    // ========================================================
    // SUBTOTAL
    // ========================================================

    const subtotal =
      roundMoney(
        orderItems.reduce(
          (
            total,
            item
          ) =>
            total +
            item.totalPrice,
          0
        )
      );


    // ========================================================
    // TOTAL QUANTITY
    // ========================================================

    const totalQuantity =
      orderItems.reduce(
        (
          total,
          item
        ) =>
          total +
          item.quantity,
        0
      );


    // ========================================================
    // PRODUCT CATEGORIES
    // ========================================================

    const productCategories:
      string[] = [];


    for (
      const item of orderItems
    ) {

      const product =
        productMap.get(
          item.productId
        );


      if (
        product &&
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
    // VOUCHER CODE
    // ========================================================

    const voucherCode =
      cleanString(
        body.voucherCode
      ) || null;


    // ========================================================
    // CHECKOUT CALCULATION
    // ========================================================

    /*
     * IMPORTANT:
     *
     * This is the FINAL server-side calculation.
     *
     * The browser's displayed:
     *
     * subtotal
     * voucherDiscount
     * shippingFee
     * finalAmount
     *
     * are NOT trusted.
     */

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
          paymentMethod?.type ?? null,

      });


    // ========================================================
    // VOUCHER VALIDATION
    // ========================================================

    if (
      voucherCode &&
      calculation.voucher.error
    ) {

      return NextResponse.json(
        {
          error:
            calculation.voucher.error,
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // FINAL VALUES
    // ========================================================

    const voucherDiscount =
      roundMoney(
        calculation.voucherDiscount
      );


    const shippingFee =
      roundMoney(
        calculation.shippingFee
      );


    const paypalFee =
      roundMoney(
        calculation.paypalFee ?? 0
      );


    const finalAmount =
      roundMoney(
        calculation.finalAmount
      );


    const shippingRegion =
      calculation.shipping.region;


    const shippingQuoteStatus =
      isMalaysia
        ? "NOT_REQUIRED"
        : "PENDING";


    // ========================================================
    // PAYMENT SNAPSHOT
    // ========================================================

    const paymentData =
      paymentMethod
        ? {

            paymentMethodId:
              paymentMethod.id,

            paymentMethodName:
              paymentMethod.name,

            paymentMethodType:
              paymentMethod.type,

            bankName:
              paymentMethod.bankName,

            accountName:
              paymentMethod.accountName,

            accountNumber:
              paymentMethod.accountNumber,

            qrImageUrl:
              paymentMethod.qrImageUrl,

            qrPublicId:
              paymentMethod.qrPublicId,

            amount:
              finalAmount,

            status:
              "PENDING" as const,

          }
        : null;


    // ========================================================
    // CREATE ORDER
    // ========================================================

    const order =
      await prisma.$transaction(
        async (tx) => {

          // ==================================================
          // RECHECK VOUCHER
          // ==================================================

          let voucherId:
            number | null =
              calculation.voucher.voucherId;


          /*
           * If a voucher was used, perform one more
           * database-level check before creating the order.
           */

          if (
            voucherCode &&
            voucherId
          ) {

            const voucher =
              await tx.voucher.findUnique({

                where: {
                  id:
                    voucherId,
                },

              });


            if (
              !voucher
            ) {

              throw new Error(
                "The selected voucher is no longer available."
              );

            }


            // ------------------------------------------------
            // Active
            // ------------------------------------------------

            if (
              !voucher.isActive
            ) {

              throw new Error(
                "This voucher is no longer available."
              );

            }


            // ------------------------------------------------
            // Expiry
            // ------------------------------------------------

            const now =
              new Date();


            if (
              now <
              voucher.startAt
            ) {

              throw new Error(
                "This voucher is not available yet."
              );

            }


            if (
              voucher.expiresAt &&
              now >
                voucher.expiresAt
            ) {

              throw new Error(
                "This voucher has expired."
              );

            }


            // ------------------------------------------------
            // Atomic usage-limit reservation
            // ------------------------------------------------
            //
            // IMPORTANT:
            //
            // Do NOT rely on voucher.usageCount from the earlier
            // findUnique() call for the final usage-limit check.
            //
            // Two customers can reach this transaction at almost
            // the same time. A normal read followed by increment
            // can therefore allow usageCount to exceed usageLimit.
            //
            // We reserve one usage directly in the database. When
            // a limit exists, the update only succeeds while the
            // current database value is still below that limit.
            // This makes the final usage reservation atomic.
            //
            // This update also acquires the voucher row before the
            // per-customer usage check below, which helps serialize
            // concurrent uses of the same voucher inside the same
            // transaction.
            // ------------------------------------------------

            if (
              voucher.usageLimit !==
                null
            ) {

              const usageUpdate =
                await tx.voucher.updateMany({

                  where: {

                    id:
                      voucher.id,

                    usageCount: {
                      lt:
                        voucher.usageLimit,
                    },

                  },

                  data: {

                    usageCount: {
                      increment: 1,
                    },

                  },

                });


              if (
                usageUpdate.count !==
                1
              ) {

                throw new Error(
                  "This voucher has reached its usage limit."
                );

              }

            } else {

              await tx.voucher.update({

                where: {

                  id:
                    voucher.id,

                },

                data: {

                  usageCount: {
                    increment: 1,
                  },

                },

              });

            }


            // ------------------------------------------------
            // New customer only — final transaction check
            // ------------------------------------------------
            //
            // The checkout calculation checks this rule first,
            // but the final order-creation transaction must check
            // it again. The voucher usage reservation above locks
            // the voucher row before this query, so concurrent
            // attempts using the same new-customer voucher are
            // serialized before the existing-order check.
            // ------------------------------------------------

            if (
              voucher.newCustomerOnly
            ) {

              if (
                !userId
              ) {

                throw new Error(
                  "Please log in to use this voucher."
                );

              }


              const existingCustomerOrder =
                await tx.order.findFirst({

                  where: {

                    userId,

                  },

                  select: {

                    id: true,

                  },

                });


              if (
                existingCustomerOrder
              ) {

                throw new Error(
                  "This voucher is only available to new customers."
                );

              }

            }


            // ------------------------------------------------
            // Per customer usage
            // ------------------------------------------------

            if (
              voucher.usagePerCustomer !==
                null
            ) {

              if (
                !userId
              ) {

                throw new Error(
                  "Please log in to use this voucher."
                );

              }


              const customerUsageCount =
                await tx.voucherUsage.count({

                  where: {

                    voucherId:
                      voucher.id,

                    userId,

                  },

                });


              if (
                customerUsageCount >=
                voucher.usagePerCustomer
              ) {

                throw new Error(
                  "You have already reached the usage limit for this voucher."
                );

              }

            }

          }


          // ==================================================
          // CREATE ORDER
          // ==================================================

          const createdOrder =
            await tx.order.create({

              data: {

                customerName,

                customerPhone,

                customerEmail,

                address,

                /*
                 * Shipping country.
                 */

                shippingCountry:
                  country,

                /*
                 * Shipping type.
                 *
                 * INTERNATIONAL orders remain pending until
                 * the shipping fee is manually quoted.
                 */

                shippingType,

                /*
                 * International shipping quotation status.
                 */

                shippingQuoteStatus,

                /*
                 * Link the order to the authenticated
                 * Customer Account when available.
                 *
                 * Guest checkout remains supported because
                 * userId is optional in the Prisma schema.
                 */

                userId,

                /*
                 * Customer Additional Notes.
                 *
                 * Saved into Order.message.
                 */

                message,

                /*
                 * Server-calculated subtotal.
                 */

                subtotal,

                /*
                 * Voucher snapshot.
                 */

                voucherCode,

                voucherDiscount,

                /*
                 * ABX shipping snapshot.
                 */

                shippingFee,

                shippingRegion,

                /*
                 * PayPal processing fee snapshot.
                 *
                 * This is only charged when the
                 * selected payment method is PAYPAL.
                 */

                paypalFee,

                /*
                 * Server-calculated final amount.
                 */

                finalAmount,

                status:
                  "PENDING_PAYMENT",

                items: {

                  create:
                    orderItems,

                },

                ...(paymentData
                  ? {
                      payment: {
                        create:
                          paymentData,
                      },
                    }
                  : {}),

              },

              include: {

                items: true,

                payment: true,

              },

            });


          /*
           * The Order ID is generated by the database, so the
           * customer-facing Order Reference must be generated
           * immediately after the Order is created.
           *
           * Example:
           * id = 50
           * createdAt = 2026-09-01
           * → CL-20260901-0050
           */

          const orderNumber =
            buildOrderNumber(
              createdOrder.id,
              createdOrder.createdAt
            );


          const orderWithNumber =
            await tx.order.update({

              where: {
                id:
                  createdOrder.id,
              },

              data: {
                orderNumber,
              },

              include: {

                items: true,

                payment: true,

              },

            });


          // ========================================================
          // CREATE VOUCHER USAGE
          // ========================================================

          if (
            voucherCode &&
            voucherId
          ) {

            await tx.voucherUsage.create({

              data: {

                voucherId,

                orderId:
                  createdOrder.id,

                userId,

                discount:
                  voucherDiscount,

              },

            });

          }


          return orderWithNumber;

        }
      );


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {

        success: true,

        order: {

          id:
            order.id,

          publicToken:
            order.publicToken,

          orderNumber:
            order.orderNumber,

          status:
            order.status,

          subtotal:
            order.subtotal,

          voucherCode:
            order.voucherCode,

          voucherDiscount:
            order.voucherDiscount,

          shippingFee:
            order.shippingFee,

          shippingRegion:
            order.shippingRegion,

          shippingCountry:
            order.shippingCountry,

          shippingType:
            order.shippingType,

          shippingQuoteStatus:
            order.shippingQuoteStatus,

          paypalFee:
            order.paypalFee,

          finalAmount:
            order.finalAmount,

          payment:
            order.payment
              ? {

                  id:
                    order.payment.id,

                  paymentMethodName:
                    order.payment
                      .paymentMethodName,

                  paymentMethodType:
                    order.payment
                      .paymentMethodType,

                  bankName:
                    order.payment
                      .bankName,

                  accountName:
                    order.payment
                      .accountName,

                  accountNumber:
                    order.payment
                      .accountNumber,

                  qrImageUrl:
                    order.payment
                      .qrImageUrl,

                  amount:
                    order.payment
                      .amount,

                  status:
                    order.payment
                      .status,

                }

              : null,

        },

      },

      {
        status: 201,
      }
    );


  } catch (error) {

    console.error(
      "Create order error:",
      error
    );


    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create order.",
      },
      {
        status: 500,
      }
    );

  }

}