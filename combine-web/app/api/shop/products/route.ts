import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 24;

function buildWhere(
  params: URLSearchParams
) {
  const brand =
    params.get("brand") ?? "";

  const category =
    params.get("category") ?? "";

  const subCategory =
    params.get("subCategory") ?? "";

  const color =
    params.get("color") ?? "";

  const search =
    params.get("search") ?? "";

  const keyword =
    search.trim();

  return {
    ...(brand &&
    brand !== "All"
      ? {
          brand,
        }
      : {}),

    ...(category &&
    category !== "All"
      ? {
          category,
        }
      : {}),

    ...(subCategory &&
    subCategory !== "All"
      ? {
          subCategory,
        }
      : {}),

    ...(color &&
    color !== "All"
      ? {
          mainColor: color,
        }
      : {}),

    ...(keyword
      ? {
          OR: [
            {
              brand: {
                contains: keyword,
              },
            },
            {
              name: {
                contains: keyword,
              },
            },
            {
              model: {
                contains: keyword,
              },
            },
            {
              sku: {
                contains: keyword,
              },
            },
            {
              category: {
                contains: keyword,
              },
            },
            {
              subCategory: {
                contains: keyword,
              },
            },
            {
              mainColor: {
                contains: keyword,
              },
            },
          ],
        }
      : {}),
  };
}

function getOrderBy(
  sort: string
) {
  switch (sort) {
    case "Price Low":
      return [
        {
          price: "asc" as const,
        },
        {
          id: "asc" as const,
        },
      ];

    case "Price High":
      return [
        {
          price: "desc" as const,
        },
        {
          id: "asc" as const,
        },
      ];

    case "Brand":
      return [
        {
          brand: "asc" as const,
        },
        {
          name: "asc" as const,
        },
        {
          id: "asc" as const,
        },
      ];

    case "Newest":
    default:
      return [
        {
          createdAt: "desc" as const,
        },
        {
          id: "desc" as const,
        },
      ];
  }
}

const select = {
  id: true,
  slug: true,

  brand: true,
  name: true,
  model: true,
  sku: true,

  price: true,

  displayOrder: true,

  category: true,
  subCategory: true,
  mainColor: true,

  createdAt: true,

  featured: true,
  newArrival: true,
  bestSeller: true,
  limited: true,
  onSale: true,

  images: {
    select: {
      url: true,
    },
    orderBy: {
      sortOrder: "asc" as const,
    },
    take: 2,
  },
};

export async function GET(
  request: NextRequest
) {
  try {
    const params =
      request.nextUrl.searchParams;

    const page = Math.max(
      Number(params.get("page") ?? "1"),
      1
    );

    const where =
      buildWhere(params);

    const orderBy =
      getOrderBy(
        params.get("sort") ??
          "Newest"
      );

    const products =
      await prisma.product.findMany({
        where,
        orderBy,
        skip:
          (page - 1) *
          PAGE_SIZE,
        take: PAGE_SIZE,
        select,
      });

    const formatProduct = (
      product: typeof products[number]
    ) => ({
      id: product.id,
      slug:
        product.slug ?? "",

      brand:
        product.brand,
      name:
        product.name,
      model:
        product.model,
      sku:
        product.sku,

      price:
        product.price,

      displayOrder:
        product.displayOrder,

      image:
        product.images[0]?.url ??
        "/placeholder.png",

      secondImage:
        product.images[1]?.url,

      category:
        product.category,
      subCategory:
        product.subCategory,
      mainColor:
        product.mainColor,

      createdAt:
        product.createdAt,

      featured:
        product.featured,
      newArrival:
        product.newArrival,
      bestSeller:
        product.bestSeller,
      limited:
        product.limited,
      onSale:
        product.onSale,
    });

    return NextResponse.json({
      products:
        products.map(
          formatProduct
        ),
      page,
      pageSize:
        PAGE_SIZE,
      hasMore:
        products.length ===
        PAGE_SIZE,
    });
  } catch (error) {
    console.error(
      "Shop products API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load products",
      },
      {
        status: 500,
      }
    );
  }
}