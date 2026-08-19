import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";


// ============================================================
// GET INQUIRY PRODUCTS
// ============================================================

export async function GET(
  request: NextRequest
) {

  try {

    const ids =
      request.nextUrl.searchParams.get(
        "ids"
      );


    // ========================================================
    // EMPTY IDS
    // ========================================================

    if (!ids) {
      return NextResponse.json([]);
    }


    // ========================================================
    // PRODUCT IDS
    // ========================================================

    const productIds =
      ids
        .split(",")
        .map((id) =>
          Number(id)
        )
        .filter(
          (id) =>
            Number.isInteger(id) &&
            id > 0
        );


    if (
      productIds.length === 0
    ) {
      return NextResponse.json([]);
    }


    // ========================================================
    // LOAD PRODUCTS
    // ========================================================
    //
    // IMPORTANT:
    //
    // Checkout needs:
    //
    // Product
    // ├── images
    // ├── colors
    // └── variants
    //
    // Variant price MUST come from database.
    //
    // ========================================================

    const products =
      await prisma.product.findMany({

        where: {
          id: {
            in: productIds,
          },
        },

        select: {

          id: true,

          sku: true,

          brand: true,

          name: true,

          slug: true,

          price: true,

          availability: true,


          // ==================================================
          // PRODUCT IMAGES
          // ==================================================

          images: {
            select: {
              url: true,
            },

            orderBy: {
              sortOrder: "asc",
            },
          },


          // ==================================================
          // PRODUCT COLORS
          // ==================================================

          colors: {

            select: {

              id: true,

              name: true,

            },

            orderBy: {
              sortOrder: "asc",
            },

          },


          // ==================================================
          // PRODUCT VARIANTS
          // ==================================================

          variants: {

            select: {

              id: true,

              colorId: true,

              size: true,

              price: true,

            },

            orderBy: {
              sortOrder: "asc",
            },

          },

        },

      });


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      products
    );

  } catch (error) {

    console.error(
      "Failed to load inquiry products:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Failed to load inquiry products.",
      },
      {
        status: 500,
      }
    );

  }

}