import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          brand: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          model: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          sku: {
            contains: q,
            mode: "insensitive",
          },
        },
      ],
    },

    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },

    take: 8,
  });

  return NextResponse.json(products);
}