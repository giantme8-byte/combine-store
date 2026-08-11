import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest
) {
  const q =
    request.nextUrl.searchParams
      .get("q")
      ?.trim() ?? "";

  /*
   * Ignore empty searches.
   */
  if (!q) {
    return NextResponse.json([]);
  }

  /*
   * Prevent unnecessarily large
   * search queries.
   */
  const keyword = q.slice(0, 100);

  try {
    const products =
      await prisma.product.findMany({
        where: {
          OR: [
            {
              brand: {
                contains: keyword,
                mode: "insensitive",
              },
            },

            {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },

            {
              model: {
                contains: keyword,
                mode: "insensitive",
              },
            },

            {
              sku: {
                contains: keyword,
                mode: "insensitive",
              },
            },

            {
              category: {
                contains: keyword,
                mode: "insensitive",
              },
            },

            {
              subCategory: {
                contains: keyword,
                mode: "insensitive",
              },
            },

            {
              mainColor: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          ],
        },

        /*
         * Only return fields required
         * by SearchAutocomplete.
         */
        select: {
          id: true,

          slug: true,

          brand: true,

          name: true,

          model: true,

          images: {
            select: {
              url: true,
            },

            orderBy: {
              sortOrder: "asc",
            },

            take: 1,
          },
        },

        /*
         * Keep autocomplete lightweight.
         */
        take: 8,

        /*
         * Give autocomplete a predictable
         * ordering.
         */
        orderBy: [
          {
            featured: "desc",
          },

          {
            createdAt: "desc",
          },

          {
            id: "desc",
          },
        ],
      });

    return NextResponse.json(
      products,
      {
        headers: {
          "Cache-Control":
            "private, max-age=30",
        },
      }
    );
  } catch (error) {
    console.error(
      "Search API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to search products.",
      },
      {
        status: 500,
      }
    );
  }
}