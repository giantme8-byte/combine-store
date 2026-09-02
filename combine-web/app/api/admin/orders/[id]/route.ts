import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


// ============================================================
// DELETE ORDER
// ============================================================

export async function DELETE(
  _request: Request,
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
    // AUTHORIZATION
    // ========================================================

    const currentUser =
      await getCurrentUser();


    if (!currentUser) {

      return NextResponse.json(
        {
          error:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );

    }


    if (
      currentUser.role !== "OWNER" &&
      currentUser.role !== "ADMIN"
    ) {

      return NextResponse.json(
        {
          error:
            "You do not have permission to delete orders.",
        },
        {
          status: 403,
        }
      );

    }


    // ========================================================
    // ORDER ID
    // ========================================================

    const {
      id,
    } = await params;


    const orderId =
      Number(id);


    if (
      !Number.isInteger(
        orderId
      ) ||
      orderId <= 0
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid order ID.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // CHECK ORDER
    // ========================================================

    const order =
      await prisma.order.findUnique({

        where: {
          id: orderId,
        },

        select: {
          id: true,
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


    // ========================================================
    // DELETE ORDER
    //
    // Prisma Cascade will also delete:
    //
    // - OrderItem
    // - Payment
    // - VoucherUsage
    //
    // ========================================================

    await prisma.order.delete({

      where: {
        id: orderId,
      },

    });


    // ========================================================
    // SUCCESS
    // ========================================================

    return NextResponse.json({

      success:
        true,

      orderId:
        order.id,

    });


  } catch (error) {

    console.error(
      "Delete order error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to delete order.",
      },
      {
        status: 500,
      }
    );

  }

}