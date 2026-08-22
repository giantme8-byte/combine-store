import { NextResponse } from "next/server";

import {
  AnalyticsEventType,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

type TrackRequestBody = {
  visitorId?: string;
  event?: AnalyticsEventType;
  path?: string;
  productId?: number | null;
};

const allowedEvents =
  new Set<AnalyticsEventType>([
    AnalyticsEventType.PAGE_VIEW,
    AnalyticsEventType.PRODUCT_VIEW,
    AnalyticsEventType.WHATSAPP_CLICK,
    AnalyticsEventType.INSTAGRAM_CLICK,
  ]);

function isValidVisitorId(
  value: string
) {
  /*
   * crypto.randomUUID() generates UUID v4.
   *
   * Example:
   * 550e8400-e29b-41d4-a716-446655440000
   */

  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as TrackRequestBody;

    /*
     * =========================================================
     * BASIC INPUT
     * =========================================================
     */

    const visitorId =
      typeof body.visitorId === "string"
        ? body.visitorId.trim()
        : "";

    const event =
      body.event;

    const path =
      typeof body.path === "string"
        ? body.path.trim().slice(0, 500)
        : null;

    const productId =
      typeof body.productId === "number" &&
      Number.isInteger(body.productId) &&
      body.productId > 0
        ? body.productId
        : null;

    /*
     * =========================================================
     * VALIDATE VISITOR ID
     * =========================================================
     */

    if (!visitorId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing visitorId.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidVisitorId(visitorId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid visitorId.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =========================================================
     * VALIDATE EVENT
     * =========================================================
     */

    if (
      !event ||
      !allowedEvents.has(event)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid analytics event.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =========================================================
     * EVENT / PRODUCT RULES
     * =========================================================
     *
     * PAGE_VIEW
     * → productId should not be provided.
     *
     * PRODUCT_VIEW
     * → productId is required.
     *
     * WHATSAPP_CLICK
     * → productId optional.
     *
     * INSTAGRAM_CLICK
     * → productId optional.
     */

    if (
      event ===
        AnalyticsEventType.PAGE_VIEW &&
      productId !== null
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PAGE_VIEW cannot contain productId.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      event ===
        AnalyticsEventType.PRODUCT_VIEW &&
      productId === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "PRODUCT_VIEW requires productId.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =========================================================
     * VALIDATE PRODUCT
     * =========================================================
     *
     * Only PRODUCT_VIEW strictly requires
     * a valid existing product.
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
            success: false,
            error: "Product not found.",
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
     * =========================================================
     * VISITOR
     * =========================================================
     *
     * Create the anonymous visitor if this browser
     * has never been seen before.
     *
     * Existing visitors automatically update
     * lastSeenAt because it uses @updatedAt.
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
     * =========================================================
     * CREATE EVENT
     * =========================================================
     */

    await prisma.analyticsEvent.create({
      data: {
        visitorId,
        event,
        path,
        productId:
          validProductId,
      },
    });

    /*
     * =========================================================
     * SUCCESS
     * =========================================================
     */

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(
      "Analytics tracking error:",
      error
    );

    /*
     * Analytics must NEVER break
     * the customer's website.
     */

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}