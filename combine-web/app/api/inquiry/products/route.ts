import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids");

  if (!ids) {
    return NextResponse.json([]);
  }

  const productIds = ids
    .split(",")
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id));

  if (productIds.length === 0) {
    return NextResponse.json([]);
  }

const products = await prisma.product.findMany({
  where: {
    id: {
      in: productIds,
    },
  },
  include: {
    images: true,
  },
});

  return NextResponse.json(products);
}