
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();

    const vouchers = await prisma.voucher.findMany({
      where: {
        isActive: true,
        startAt: {
          lte: now,
        },
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gte: now,
            },
          },
        ],
      },
      orderBy: [
        {
          newCustomerOnly: "asc",
        },
        {
          minSpend: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        code: true,
        type: true,
        value: true,
        minSpend: true,
        maxDiscount: true,
        category: true,
        startAt: true,
        expiresAt: true,
        usageLimit: true,
        usageCount: true,
        usagePerCustomer: true,
        newCustomerOnly: true,
      },
    });

    // Exclude vouchers that have reached their global usage limit.
    const availableVouchers = vouchers.filter(
      (voucher) =>
        voucher.usageLimit === null ||
        voucher.usageCount < voucher.usageLimit
    );

    return NextResponse.json(
      {
        vouchers: availableVouchers,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Failed to load available vouchers:", error);

    return NextResponse.json(
      {
        error: "Unable to load available vouchers.",
      },
      {
        status: 500,
      }
    );
  }
}
