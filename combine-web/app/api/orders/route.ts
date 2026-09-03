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
   */

  state: string;

  /*
   * Customer's Additional Notes.
   *
   * This is saved into:
   *
   * Order.message
   */

  message?: string;

  items: OrderItemInput[];

  paymentMethodId: number;

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
// ADD ONE CALENDAR MONTH
// ============================================================

function addOneCalendarMonth(date: Date): Date {
  const year = date.getUTCFullYear();
  const monthIndex = date.getUTCMonth();
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const milliseconds = date.getUTCMilliseconds();

  const targetMonthIndex = monthIndex + 1;

  const lastDayOfTargetMonth =
    new Date(
      Date.UTC(
        year,
        targetMonthIndex + 1,
        0
      )
    ).getUTCDate();

  const targetDay = Math.min(
    day,
    lastDayOfTargetMonth
  );

  return new Date(
    Date.UTC(
      year,
      targetMonthIndex,
      targetDay,
      hours,
      minutes,
      seconds,
      milliseconds
    )
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

    const paymentMethodId =
      Number(
        body.paymentMethodId
      );


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


    const paymentMethod =
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
              unitPrice *
              quantity;


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
            unitPrice *
            quantity;


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

        voucherCode,

        userId,

        productCategories,

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


    const finalAmount =
      roundMoney(
        calculation.finalAmount
      );


    const shippingRegion =
      calculation.shipping.region;


    // ========================================================
    // PAYMENT SNAPSHOT
    // ========================================================

    const paymentData = {

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

    };


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


            // ------------------------------------------------
            // Expiry
            // ------------------------------------------------
            //
            // Normal Voucher:
            // - Uses the admin-defined expiresAt.
            // - NULL means no expiry.
            //
            // New Customer Voucher:
            // - Ignores voucher.expiresAt.
            // - Starts from the customer's account creation time.
            // - Expires one calendar month later.
            //
            // This is checked again inside the transaction
            // so the final order cannot bypass the rule.
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

              const customer =
                await tx.user.findUnique({
                  where: {
                    id: userId,
                  },
                  select: {
                    createdAt: true,
                  },
                });

              if (!customer) {

                throw new Error(
                  "Customer account could not be found."
                );

              }

              const customerVoucherExpiry =
                addOneCalendarMonth(
                  customer.createdAt
                );

              if (
                now >=
                customerVoucherExpiry
              ) {

                throw new Error(
                  "This new customer voucher has expired."
                );

              }

            } else if (
              voucher.expiresAt &&
              now >=
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
                 * Server-calculated final amount.
                 */

                finalAmount,

                status:
                  "PENDING_PAYMENT",

                items: {

                  create:
                    orderItems,

                },

                payment: {

                  create:
                    paymentData,

                },

              },

              include: {

                items: true,

                payment: true,

              },

            });


          // ==================================================
          // CREATE VOUCHER USAGE
          // ==================================================

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


          return createdOrder;

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