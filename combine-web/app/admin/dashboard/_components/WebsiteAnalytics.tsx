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

export default async function WebsiteAnalytics() {
  const now = new Date();

  /*
   * =========================================================
   * DATE RANGE
   * =========================================================
   *
   * We load the latest 30 days once.
   *
   * The client can then switch between:
   *
   * Today
   * 7 Days
   * 30 Days
   *
   * without refreshing the Dashboard.
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
   * SERIALIZE PRODUCT MAP
   * =========================================================
   */

  const productMap =
    new Map(
      products.map(
        (product) => [
          product.id,
          {
            id: product.id,
            name:
              product.name,
            brand:
              product.brand,
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
   * TODAY STATS
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
   * RANGE SUMMARY
   * =========================================================
   *
   * The client will use the same 30-day dataset to calculate
   * Today / 7 Days / 30 Days.
   */

  /*
   * =========================================================
   * TOP PRODUCTS
   * =========================================================
   */

  const topProductData =
    productIds
      .map((productId) => {
        const product =
          productMap.get(
            productId
          );

        if (!product) {
          return null;
        }

        const views =
          events.filter(
            (event) =>
              event.event ===
                "PRODUCT_VIEW" &&
              event.productId ===
                productId
          ).length;

        return {
          id: product.id,
          name:
            product.name,
          brand:
            product.brand,
          views,
        };
      })
      .filter(
        (
          product
        ): product is {
          id: number;
          name: string;
          brand: string;
          views: number;
        } =>
          product !== null
      )
      .sort(
        (a, b) =>
          b.views - a.views
      )
      .slice(0, 10);

  /*
   * =========================================================
   * SEND DATA TO CLIENT
   * =========================================================
   */

  return (
    <WebsiteAnalyticsClient
      dailyData={dailyData}
      topProducts={topProductData}
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
    />
  );
}