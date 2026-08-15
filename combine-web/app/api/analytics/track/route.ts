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

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as TrackRequestBody;

    const visitorId =
      typeof body.visitorId === "string"
        ? body.visitorId.trim()
        : "";

    const event =
      body.event;

    const path =
      typeof body.path === "string"
        ? body.path.slice(0, 500)
        : null;

    const productId =
      typeof body.productId === "number"
        ? body.productId
        : null;

    /*
     * =========================================================
     * VALIDATION
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
     * VISITOR
     * =========================================================
     *
     * Create the anonymous visitor if this is the first time
     * this browser has visited the website.
     *
     * If the visitor already exists, update lastSeenAt.
     */

    await prisma.analyticsVisitor.upsert({
      where: {
        visitorId,
      },

      create: {
        visitorId,
      },

      update: {
        lastSeenAt: new Date(),
      },
    });

    /*
     * =========================================================
     * PRODUCT VALIDATION
     * =========================================================
     *
     * Only accept a productId that actually exists.
     */

    let validProductId:
      number | null = null;

    if (
      productId !== null
    ) {
      const product =
        await prisma.product.findUnique({
          where: {
            id: productId,
          },

          select: {
            id: true,
          },
        });

      if (product) {
        validProductId =
          product.id;
      }
    }

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

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(
      "Analytics tracking error:",
      error
    );

    /*
     * Analytics should NEVER break the customer's website.
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