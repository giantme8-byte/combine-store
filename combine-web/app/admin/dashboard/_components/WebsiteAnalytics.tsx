import { prisma } from "@/lib/prisma";

import WebsiteAnalyticsClient from "./WebsiteAnalyticsClient";

const MALAYSIA_OFFSET_MS =
  8 * 60 * 60 * 1000;

function getMalaysiaDayStart(
  date: Date
) {
  const malaysiaDate =
    new Date(
      date.getTime() +
        MALAYSIA_OFFSET_MS
    );

  return new Date(
    Date.UTC(
      malaysiaDate.getUTCFullYear(),
      malaysiaDate.getUTCMonth(),
      malaysiaDate.getUTCDate()
    ) -
      MALAYSIA_OFFSET_MS
  );
}

function getDayRange(
  date: Date
) {
  const start =
    getMalaysiaDayStart(date);

  const end =
    new Date(
      start.getTime() +
        24 *
          60 *
          60 *
          1000
    );

  return {
    start,
    end,
  };
}

function getDateKey(
  date: Date
) {
  const malaysiaDate =
    new Date(
      date.getTime() +
        MALAYSIA_OFFSET_MS
    );

  return [
    malaysiaDate.getUTCFullYear(),

    String(
      malaysiaDate.getUTCMonth() + 1
    ).padStart(2, "0"),

    String(
      malaysiaDate.getUTCDate()
    ).padStart(2, "0"),
  ].join("-");
}

function formatDay(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-MY",
    {
      weekday: "short",
      timeZone:
        "Asia/Kuala_Lumpur",
    }
  ).format(date);
}

/*
 * ============================================================
 * TOP PRODUCT TYPE
 * ============================================================
 */

type TopProductData = {
  id: number;
  name: string;
  brand: string;
  views: number;
};

/*
 * ============================================================
 * BUILD TOP PRODUCTS
 * ============================================================
 */

function buildTopProducts(
  events: {
    event: string;
    productId: number | null;
  }[],

  productMap: Map<
    number,
    {
      id: number;
      name: string;
      brand: string;
    }
  >
): TopProductData[] {
  const viewCounts =
    new Map<number, number>();

  for (const event of events) {
    if (
      event.event !==
        "PRODUCT_VIEW" ||
      event.productId === null
    ) {
      continue;
    }

    viewCounts.set(
      event.productId,
      (viewCounts.get(
        event.productId
      ) ?? 0) + 1
    );
  }

  return Array.from(
    viewCounts.entries()
  )
    .map(
      ([productId, views]) => {
        const product =
          productMap.get(
            productId
          );

        if (!product) {
          return null;
        }

        return {
          id: product.id,
          name: product.name,
          brand: product.brand,
          views,
        };
      }
    )
    .filter(
      (
        product
      ): product is TopProductData =>
        product !== null
    )
    .sort(
      (a, b) =>
        b.views - a.views
    )
    .slice(0, 10);
}

/*
 * ============================================================
 * WEBSITE ANALYTICS
 * ============================================================
 */

export default async function WebsiteAnalytics() {
  const now = new Date();

  /*
   * =========================================================
   * DATE RANGE
   * =========================================================
   *
   * Latest 30 calendar days.
   *
   * Used for:
   *
   * Today
   * Last 7 Days
   * Last 30 Days
   * =========================================================
   */

  const today =
    getDayRange(now);

  const thirtyDaysAgo =
    new Date(
      today.start.getTime() -
        29 *
          24 *
          60 *
          60 *
          1000
    );

  /*
   * =========================================================
   * ANALYTICS EVENTS
   * =========================================================
   */

  const events =
    await prisma.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
          lt: today.end,
        },
      },

      select: {
        id: true,
        visitorId: true,
        event: true,
        path: true,
        productId: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

  /*
   * =========================================================
   * PRODUCT DATA
   * =========================================================
   */

  const productIds =
    Array.from(
      new Set(
        events
          .map(
            (event) =>
              event.productId
          )
          .filter(
            (
              id
            ): id is number =>
              id !== null
          )
      )
    );

  const products =
    productIds.length > 0
      ? await prisma.product.findMany({
          where: {
            id: {
              in: productIds,
            },
          },

          select: {
            id: true,
            name: true,
            brand: true,
          },
        })
      : [];

  /*
   * =========================================================
   * PRODUCT MAP
   * =========================================================
   */

  const productMap =
    new Map(
      products.map(
        (product) => [
          product.id,
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
          },
        ]
      )
    );

  /*
   * =========================================================
   * DAILY DATA
   * =========================================================
   */

  const dailyData: {
    date: string;
    label: string;
    visitors: number;
    pageViews: number;
    productViews: number;
    whatsappClicks: number;
  }[] = [];

  for (
    let index = 0;
    index < 30;
    index++
  ) {
    const dayStart =
      new Date(
        thirtyDaysAgo.getTime() +
          index *
            24 *
            60 *
            60 *
            1000
      );

    const dayEnd =
      new Date(
        dayStart.getTime() +
          24 *
            60 *
            60 *
            1000
      );

    const dayEvents =
      events.filter(
        (event) =>
          event.createdAt >=
            dayStart &&
          event.createdAt <
            dayEnd
      );

    /*
     * Daily Unique Visitors
     *
     * This remains daily unique.
     * 7/30-day unique visitors are calculated
     * separately below.
     */

    const visitors =
      new Set(
        dayEvents.map(
          (event) =>
            event.visitorId
        )
      );

    dailyData.push({
      date:
        getDateKey(dayStart),

      label:
        formatDay(dayStart),

      visitors:
        visitors.size,

      pageViews:
        dayEvents.filter(
          (event) =>
            event.event ===
            "PAGE_VIEW"
        ).length,

      productViews:
        dayEvents.filter(
          (event) =>
            event.event ===
            "PRODUCT_VIEW"
        ).length,

      whatsappClicks:
        dayEvents.filter(
          (event) =>
            event.event ===
            "WHATSAPP_CLICK"
        ).length,
    });
  }

  /*
   * =========================================================
   * TODAY EVENTS
   * =========================================================
   */

  const todayEvents =
    events.filter(
      (event) =>
        event.createdAt >=
          today.start &&
        event.createdAt <
          today.end
    );

  const todayVisitors =
    new Set(
      todayEvents.map(
        (event) =>
          event.visitorId
      )
    );

  /*
   * =========================================================
   * 7 DAY RANGE
   * =========================================================
   *
   * Today + previous 6 calendar days.
   *
   * Total = 7 calendar days.
   * =========================================================
   */

  const sevenDaysStart =
    new Date(
      today.start.getTime() -
        6 *
          24 *
          60 *
          60 *
          1000
    );

  const sevenDaysEvents =
    events.filter(
      (event) =>
        event.createdAt >=
          sevenDaysStart &&
        event.createdAt <
          today.end
    );

  /*
   * =========================================================
   * 7 DAY UNIQUE VISITORS
   * =========================================================
   *
   * IMPORTANT:
   *
   * Count each visitor only once across
   * the entire 7-day period.
   *
   * A visitor who comes back multiple days
   * is still one unique visitor.
   * =========================================================
   */

  const sevenDaysVisitors =
    new Set(
      sevenDaysEvents.map(
        (event) =>
          event.visitorId
      )
    );

  /*
   * =========================================================
   * 30 DAY RANGE
   * =========================================================
   */

  const thirtyDaysEvents =
    events.filter(
      (event) =>
        event.createdAt >=
          thirtyDaysAgo &&
        event.createdAt <
          today.end
    );

  /*
   * =========================================================
   * 30 DAY UNIQUE VISITORS
   * =========================================================
   *
   * Count each visitor only once across
   * the entire 30-day period.
   * =========================================================
   */

  const thirtyDaysVisitors =
    new Set(
      thirtyDaysEvents.map(
        (event) =>
          event.visitorId
      )
    );

  /*
   * =========================================================
   * TOP PRODUCTS — TODAY
   * =========================================================
   */

  const topProductsToday =
    buildTopProducts(
      todayEvents,
      productMap
    );

  /*
   * =========================================================
   * TOP PRODUCTS — 7 DAYS
   * =========================================================
   */

  const topProducts7Days =
    buildTopProducts(
      sevenDaysEvents,
      productMap
    );

  /*
   * =========================================================
   * TOP PRODUCTS — 30 DAYS
   * =========================================================
   */

  const topProducts30Days =
    buildTopProducts(
      thirtyDaysEvents,
      productMap
    );

  /*
   * =========================================================
   * SEND DATA TO CLIENT
   * =========================================================
   */

  return (
    <WebsiteAnalyticsClient
      dailyData={
        dailyData
      }

      topProductsToday={
        topProductsToday
      }

      topProducts7Days={
        topProducts7Days
      }

      topProducts30Days={
        topProducts30Days
      }

      todayStats={{
        visitors:
          todayVisitors.size,

        pageViews:
          todayEvents.filter(
            (event) =>
              event.event ===
              "PAGE_VIEW"
          ).length,

        productViews:
          todayEvents.filter(
            (event) =>
              event.event ===
              "PRODUCT_VIEW"
          ).length,

        whatsappClicks:
          todayEvents.filter(
            (event) =>
              event.event ===
              "WHATSAPP_CLICK"
          ).length,
      }}

      periodVisitors={{
        sevenDays:
          sevenDaysVisitors.size,

        thirtyDays:
          thirtyDaysVisitors.size,
      }}
    />
  );
}