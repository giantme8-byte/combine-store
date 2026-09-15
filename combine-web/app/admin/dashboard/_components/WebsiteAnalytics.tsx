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
 * TOP PRODUCT
 * ============================================================
 */

type TopProductData = {
  id: number;
  name: string;
  brand: string;
  views: number;
};

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
 * ADD TO CART PRODUCTS
 * ============================================================
 */

type AddToCartProductData = {
  id: number;
  name: string;
  brand: string;
  quantity: number;
};

function buildAddToCartProducts(
  events: {
    event: string;
    productId: number | null;
    quantity: number;
  }[],
  productMap: Map<
    number,
    {
      id: number;
      name: string;
      brand: string;
    }
  >
): AddToCartProductData[] {
  const quantities =
    new Map<number, number>();

  for (const event of events) {
    if (
      event.event !==
        "ADD_TO_CART" ||
      event.productId === null
    ) {
      continue;
    }

    quantities.set(
      event.productId,
      (quantities.get(
        event.productId
      ) ?? 0) + event.quantity
    );
  }

  return Array.from(
    quantities.entries()
  )
    .map(
      ([productId, quantity]) => {
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
          quantity,
        };
      }
    )
    .filter(
      (
        product
      ): product is AddToCartProductData =>
        product !== null
    )
    .sort(
      (a, b) =>
        b.quantity - a.quantity
    )
    .slice(0, 10);
}

/*
 * ============================================================
 * WEBSITE ANALYTICS
 * ============================================================
 */

export default async function WebsiteAnalytics() {
  const now =
    new Date();

  /*
   * ==========================================================
   * DATE RANGE
   * ==========================================================
   */

  const today =
    getDayRange(now);

  const yesterday =
    {
      start:
        new Date(
          today.start.getTime() -
            24 *
              60 *
              60 *
              1000
        ),
      end:
        today.start,
    };

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
   * ==========================================================
   * ANALYTICS EVENTS
   * ==========================================================
   */

  const events =
    await prisma.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte:
            thirtyDaysAgo,
          lt:
            today.end,
        },
      },

      select: {
        id: true,
        visitorId: true,
        event: true,
        path: true,
        productId: true,
        quantity: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

  /*
   * ==========================================================
   * PRODUCT DATA
   * ==========================================================
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
              in:
                productIds,
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
   * ==========================================================
   * PRODUCT MAP
   * ==========================================================
   */

  const productMap =
    new Map(
      products.map(
        (product) => [
          product.id,
          {
            id:
              product.id,
            name:
              product.name,
            brand:
              product.brand,
          },
        ]
      )
    );

  /*
   * ==========================================================
   * DAILY DATA
   * ==========================================================
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
        getDateKey(
          dayStart
        ),

      label:
        formatDay(
          dayStart
        ),

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
   * ==========================================================
   * TODAY
   * ==========================================================
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
   * ==========================================================
   * YESTERDAY
   * ==========================================================
   */

  const yesterdayEvents =
    events.filter(
      (event) =>
        event.createdAt >=
          yesterday.start &&
        event.createdAt <
          yesterday.end
    );

  const yesterdayVisitors =
    new Set(
      yesterdayEvents.map(
        (event) =>
          event.visitorId
      )
    );

  /*
   * ==========================================================
   * 7 DAYS
   * ==========================================================
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

  const sevenDaysVisitors =
    new Set(
      sevenDaysEvents.map(
        (event) =>
          event.visitorId
      )
    );

  /*
   * ==========================================================
   * 30 DAYS
   * ==========================================================
   */

  const thirtyDaysEvents =
    events.filter(
      (event) =>
        event.createdAt >=
          thirtyDaysAgo &&
        event.createdAt <
          today.end
    );

  const thirtyDaysVisitors =
    new Set(
      thirtyDaysEvents.map(
        (event) =>
          event.visitorId
      )
    );

  /*
   * ==========================================================
   * TOP PRODUCTS
   * ==========================================================
   */

  const topProductsToday =
    buildTopProducts(
      todayEvents,
      productMap
    );

  const topProductsYesterday =
    buildTopProducts(
      yesterdayEvents,
      productMap
    );

  const topProducts7Days =
    buildTopProducts(
      sevenDaysEvents,
      productMap
    );

  const topProducts30Days =
    buildTopProducts(
      thirtyDaysEvents,
      productMap
    );

  /*
   * ==========================================================
   * ADD TO CART PRODUCTS
   * ==========================================================
   */

  const addToCartProductsToday =
    buildAddToCartProducts(
      todayEvents,
      productMap
    );

  const addToCartProductsYesterday =
    buildAddToCartProducts(
      yesterdayEvents,
      productMap
    );

  const addToCartProducts7Days =
    buildAddToCartProducts(
      sevenDaysEvents,
      productMap
    );

  const addToCartProducts30Days =
    buildAddToCartProducts(
      thirtyDaysEvents,
      productMap
    );

  /*
   * ==========================================================
   * SEND DATA TO CLIENT
   * ==========================================================
   */

  return (
    <WebsiteAnalyticsClient
      dailyData={
        dailyData
      }

      topProductsToday={
        topProductsToday
      }

      topProductsYesterday={
        topProductsYesterday
      }

      topProducts7Days={
        topProducts7Days
      }

      topProducts30Days={
        topProducts30Days
      }

      addToCartProductsToday={
        addToCartProductsToday
      }

      addToCartProductsYesterday={
        addToCartProductsYesterday
      }

      addToCartProducts7Days={
        addToCartProducts7Days
      }

      addToCartProducts30Days={
        addToCartProducts30Days
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

      yesterdayStats={{
        visitors:
          yesterdayVisitors.size,

        pageViews:
          yesterdayEvents.filter(
            (event) =>
              event.event ===
              "PAGE_VIEW"
          ).length,

        productViews:
          yesterdayEvents.filter(
            (event) =>
              event.event ===
              "PRODUCT_VIEW"
          ).length,

        whatsappClicks:
          yesterdayEvents.filter(
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