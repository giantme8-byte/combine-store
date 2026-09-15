import { NextResponse } from "next/server";
import { AnalyticsEventType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type TrackRequestBody = {
  visitorId?: string;
  event?: AnalyticsEventType;
  path?: string;
  productId?: number | null;
  quantity?: number;
};

const allowedEvents =
  new Set<AnalyticsEventType>([
    AnalyticsEventType.PAGE_VIEW,
    AnalyticsEventType.PRODUCT_VIEW,
    AnalyticsEventType.WHATSAPP_CLICK,
    AnalyticsEventType.INSTAGRAM_CLICK,
    AnalyticsEventType.ADD_TO_CART,
  ]);

/*
 * ============================================================
 * VISITOR ID
 * ============================================================
 */

function isValidVisitorId(
  value: string
) {
  /*
   * crypto.randomUUID() generates UUID v4.
   */
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidV4Regex.test(value);
}

/*
 * ============================================================
 * POST
 * ============================================================
 */

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as TrackRequestBody;

    /*
     * ----------------------------------------------------------
     * VISITOR ID
     * ----------------------------------------------------------
     */

    const visitorId =
      typeof body.visitorId === "string"
        ? body.visitorId.trim()
        : "";

    if (!visitorId) {
      return NextResponse.json(
        {
          error:
            "Missing visitorId.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isValidVisitorId(
        visitorId
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid visitorId.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ----------------------------------------------------------
     * EVENT
     * ----------------------------------------------------------
     */

    const event =
      body.event;

    if (
      !event ||
      !allowedEvents.has(event)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid analytics event.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ----------------------------------------------------------
     * PATH
     * ----------------------------------------------------------
     */

    const path =
      typeof body.path === "string"
        ? body.path.trim()
        : null;

    /*
     * ----------------------------------------------------------
     * PRODUCT ID
     * ----------------------------------------------------------
     */

    const productId =
      body.productId == null
        ? null
        : Number(body.productId);

    if (
      productId !== null &&
      (!Number.isInteger(productId) ||
        productId <= 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid productId.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ----------------------------------------------------------
     * EVENT RULES
     * ----------------------------------------------------------
     */

    if (
      event ===
        AnalyticsEventType.PAGE_VIEW &&
      productId !== null
    ) {
      return NextResponse.json(
        {
          error:
            "PAGE_VIEW cannot have productId.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      (event ===
        AnalyticsEventType.PRODUCT_VIEW ||
        event ===
          AnalyticsEventType.ADD_TO_CART) &&
      productId === null
    ) {
      return NextResponse.json(
        {
          error:
            "This event requires productId.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ----------------------------------------------------------
     * QUANTITY
     * ----------------------------------------------------------
     *
     * Only ADD_TO_CART uses the quantity.
     *
     * Other analytics events always use 1.
     *
     * ----------------------------------------------------------
     */

    const quantity =
      body.quantity == null
        ? 1
        : Number(body.quantity);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      quantity > 1000
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid quantity.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ----------------------------------------------------------
     * VERIFY PRODUCT
     * ----------------------------------------------------------
     */

    let validProductId:
      number | null = null;

    if (productId !== null) {
      const product =
        await prisma.product.findUnique({
          where: {
            id: productId,
          },
          select: {
            id: true,
          },
        });

      if (!product) {
        return NextResponse.json(
          {
            error:
              "Product not found.",
          },
          {
            status: 404,
          }
        );
      }

      validProductId =
        product.id;
    }

    /*
     * ----------------------------------------------------------
     * VISITOR
     * ----------------------------------------------------------
     */

    await prisma.analyticsVisitor.upsert({
      where: {
        visitorId,
      },
      create: {
        visitorId,
      },
      update: {},
    });

    /*
     * ----------------------------------------------------------
     * EVENT
     * ----------------------------------------------------------
     */

    await prisma.analyticsEvent.create({
      data: {
        visitorId,
        event,
        path,
        productId:
          validProductId,
        quantity:
          event ===
          AnalyticsEventType.ADD_TO_CART
            ? quantity
            : 1,
      },
    });

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "[analytics/track]",
      error
    );

    /*
     * Analytics must NEVER break
     * the customer-facing website.
     */
    return NextResponse.json(
      {
        error:
          "Analytics tracking failed.",
      },
      {
        status: 500,
      }
    );
  }
}