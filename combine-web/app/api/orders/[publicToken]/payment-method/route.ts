import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  calculatePaypalFee,
} from "@/lib/checkout";

// ============================================================
// POST
// ============================================================

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      publicToken: string;
    }>;
  }
) {
  try {
    const {
      publicToken,
    } = await context.params;

    const body =
      await request.json();

    const paymentMethodId =
      Number(
        body?.paymentMethodId
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
            "Invalid payment method.",
        },
        {
          status: 400,
        }
      );
    }

    const order =
      await prisma.order.findUnique({
        where: {
          publicToken,
        },
        select: {
          id: true,
          status: true,
          shippingType: true,
          shippingQuoteStatus: true,
          subtotal: true,
          voucherDiscount: true,
          shippingFee: true,
          paypalFee: true,
          finalAmount: true,
          payment: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!order) {
      return NextResponse.json(
        {
          error:
            "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      order.shippingType !==
      "INTERNATIONAL"
    ) {
      return NextResponse.json(
        {
          error:
            "This payment flow is only available for international orders.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      order.shippingQuoteStatus !==
      "QUOTED"
    ) {
      return NextResponse.json(
        {
          error:
            "International shipping fee has not been quoted yet.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      order.status !==
      "PENDING_PAYMENT"
    ) {
      return NextResponse.json(
        {
          error:
            "This order is no longer awaiting payment.",
        },
        {
          status: 400,
        }
      );
    }

    if (order.payment) {
      return NextResponse.json(
        {
          error:
            "A payment method has already been selected for this order.",
        },
        {
          status: 409,
        }
      );
    }

    const paymentMethod =
      await prisma.paymentMethod.findFirst({
        where: {
          id: paymentMethodId,
          active: true,
        },
        select: {
          id: true,
          name: true,
          type: true,
          bankName: true,
          accountName: true,
          accountNumber: true,
          qrImageUrl: true,
          qrPublicId: true,
          instructions: true,
          wiseName: true,
          wiseEmail: true,
          wiseAccount: true,
        },
      });

    if (!paymentMethod) {
      return NextResponse.json(
        {
          error:
            "Selected payment method is unavailable.",
        },
        {
          status: 400,
        }
      );
    }

    const baseAmount =
      Math.max(
        0,
        Number(order.subtotal) -
          Number(order.voucherDiscount) +
          Number(order.shippingFee)
      );

const paypalFee =
  paymentMethod.type ===
  "PAYPAL"
    ? Number(
        calculatePaypalFee({
          amount: baseAmount,
          paymentMethodType:
            paymentMethod.type,
        })
      )
    : 0;

    const finalAmount =
      Math.round(
        (
          baseAmount +
          paypalFee
        ) * 100
      ) / 100;

    const updatedOrder =
      await prisma.$transaction(
        async (tx) => {
          const currentOrder =
            await tx.order.findUnique({
              where: {
                id: order.id,
              },
              select: {
                payment: {
                  select: {
                    id: true,
                  },
                },
                status: true,
                shippingType: true,
                shippingQuoteStatus: true,
              },
            });

          if (
            !currentOrder ||
            currentOrder.status !==
              "PENDING_PAYMENT" ||
            currentOrder.shippingType !==
              "INTERNATIONAL" ||
            currentOrder.shippingQuoteStatus !==
              "QUOTED"
          ) {
            throw new Error(
              "This order is no longer available for payment."
            );
          }

          if (
            currentOrder.payment
          ) {
            throw new Error(
              "A payment method has already been selected for this order."
            );
          }

          const updated =
            await tx.order.update({
              where: {
                id: order.id,
              },
              data: {
                paypalFee,
                finalAmount,
                payment: {
                  create: {
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
                    wiseName:
                      paymentMethod.wiseName,
                    wiseEmail:
                      paymentMethod.wiseEmail,
                    wiseAccount:
                      paymentMethod.wiseAccount,
                    amount:
                      finalAmount,
                    status:
                      "PENDING",
                  },
                },
              },
              select: {
                id: true,
                publicToken: true,
                finalAmount: true,
                paypalFee: true,
              },
            });

          return updated;
        }
      );

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      paymentMethod: {
        id: paymentMethod.id,
        name: paymentMethod.name,
        type: paymentMethod.type,
      },
    });
  } catch (error) {
    console.error(
      "Set international payment method error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to set payment method.",
      },
      {
        status: 500,
      }
    );
  }
}
