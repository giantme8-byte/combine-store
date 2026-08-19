import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const paymentMethods =
      await prisma.paymentMethod.findMany({
        where: {
          active: true,
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],

        select: {
          id: true,
          name: true,
          type: true,

          bankName: true,
          accountName: true,
          accountNumber: true,

          qrImageUrl: true,

          instructions: true,
        },
      });

    return NextResponse.json(
      paymentMethods
    );
  } catch (error) {
    console.error(
      "Failed to load payment methods:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load payment methods.",
      },
      {
        status: 500,
      }
    );
  }
}