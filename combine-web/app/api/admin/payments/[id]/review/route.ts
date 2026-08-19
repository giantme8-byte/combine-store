import { NextResponse } from "next/server";

import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";


// ============================================================
// TYPES
// ============================================================

type ReviewAction =
  | "VERIFY"
  | "REJECT";


// ============================================================
// POST
// ============================================================

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    // ========================================================
    // ADMIN AUTHORIZATION
    // ========================================================

    const user =
      await requireRole([
        UserRole.OWNER,
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.STAFF,
      ]);


    // ========================================================
    // PARAMS
    // ========================================================

    const {
      id,
    } = await params;


    const paymentId =
      Number(id);


    if (
      !Number.isInteger(
        paymentId
      ) ||
      paymentId <= 0
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid payment ID.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body =
      await request.json();


    const action =
      typeof body.action === "string"
        ? body.action
            .trim()
            .toUpperCase()
        : "";


    const adminNote =
      typeof body.adminNote === "string"
        ? body.adminNote.trim()
        : "";


    // ========================================================
    // ACTION VALIDATION
    // ========================================================

    if (
      action !== "VERIFY" &&
      action !== "REJECT"
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid payment review action.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // REJECT NOTE
    // ========================================================

    if (
      action === "REJECT" &&
      !adminNote
    ) {

      return NextResponse.json(
        {
          error:
            "Please provide a reason for rejecting the payment.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // FIND PAYMENT
    // ========================================================

    const payment =
      await prisma.payment.findUnique({

        where: {
          id:
            paymentId,
        },

        include: {

          order: {
            select: {
              id: true,
              publicToken: true,
              status: true,
            },
          },

        },

      });


    if (!payment) {

      return NextResponse.json(
        {
          error:
            "Payment could not be found.",
        },
        {
          status: 404,
        }
      );

    }


    // ========================================================
    // PAYMENT STATUS CHECK
    //
    // Only SUBMITTED payments can be reviewed.
    //
    // This prevents:
    //
    // PENDING   → ❌
    // REJECTED  → ❌
    // VERIFIED  → ❌
    //
    // SUBMITTED → ✅
    //
    // ========================================================

    if (
      payment.status !==
      "SUBMITTED"
    ) {

      return NextResponse.json(
        {
          error:
            `This payment cannot be reviewed because its current status is ${payment.status}.`,
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // VERIFY PAYMENT
    // ========================================================

    if (
      action === "VERIFY"
    ) {

      const result =
        await prisma.$transaction(
          async (tx) => {

            // ------------------------------------------------
            // Update Payment
            // ------------------------------------------------

            const updatedPayment =
              await tx.payment.update({

                where: {
                  id:
                    payment.id,
                },

                data: {

                  status:
                    "VERIFIED",

                  verifiedAt:
                    new Date(),

                  verifiedBy:
                    user.id,

                  adminNote:
                    adminNote ||
                    null,

                },

              });


            // ------------------------------------------------
            // Update Order
            // ------------------------------------------------

            const updatedOrder =
              await tx.order.update({

                where: {
                  id:
                    payment.order.id,
                },

                data: {

                  status:
                    "PAID",

                },

              });


            return {
              updatedPayment,
              updatedOrder,
            };

          }
        );


      // --------------------------------------------------------
      // RESPONSE
      // --------------------------------------------------------

      return NextResponse.json(
        {

          success: true,

          action:
            "VERIFY",

          payment: {

            id:
              result.updatedPayment.id,

            status:
              result.updatedPayment.status,

            verifiedAt:
              result.updatedPayment.verifiedAt,

            verifiedBy:
              result.updatedPayment.verifiedBy,

            adminNote:
              result.updatedPayment.adminNote,

          },

          order: {

            id:
              result.updatedOrder.id,

            status:
              result.updatedOrder.status,

          },

        },

        {
          status: 200,
        }
      );

    }


    // ========================================================
    // REJECT PAYMENT
    //
    // Payment:
    // SUBMITTED → REJECTED
    //
    // Order:
    // PAYMENT_REVIEW → PENDING_PAYMENT
    //
    // This allows the customer to submit
    // another payment proof.
    //
    // ========================================================

    const result =
      await prisma.$transaction(
        async (tx) => {

          // --------------------------------------------------
          // Update Payment
          // --------------------------------------------------

          const updatedPayment =
            await tx.payment.update({

              where: {
                id:
                  payment.id,
              },

              data: {

                status:
                  "REJECTED",

                verifiedAt:
                  null,

                verifiedBy:
                  null,

                adminNote,

              },

            });


          // --------------------------------------------------
          // Update Order
          // --------------------------------------------------

          const updatedOrder =
            await tx.order.update({

              where: {
                id:
                  payment.order.id,
              },

              data: {

                status:
                  "PENDING_PAYMENT",

              },

            });


          return {
            updatedPayment,
            updatedOrder,
          };

        }
      );


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {

        success: true,

        action:
          "REJECT",

        payment: {

          id:
            result.updatedPayment.id,

          status:
            result.updatedPayment.status,

          verifiedAt:
            result.updatedPayment.verifiedAt,

          verifiedBy:
            result.updatedPayment.verifiedBy,

          adminNote:
            result.updatedPayment.adminNote,

        },

        order: {

          id:
            result.updatedOrder.id,

          status:
            result.updatedOrder.status,

        },

      },

      {
        status: 200,
      }
    );


  } catch (error) {

    console.error(
      "Payment review error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to review payment.",
      },
      {
        status: 500,
      }
    );

  }

}