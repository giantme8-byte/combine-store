import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const slugs = request.nextUrl.searchParams.get("slugs");

  if (!slugs) {
    return NextResponse.json([]);
  }

  const slugList = slugs
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  if (slugList.length === 0) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: slugList,
      },
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  // 保持与 localStorage 相同的顺序
  const orderedProducts = slugList
    .map((slug) =>
      products.find((product) => product.slug === slug)
    )
    .filter(Boolean);

  return NextResponse.json(orderedProducts);
}