"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

type AnalyticsRange =
  | "today"
  | "7days"
  | "30days";

type DailyData = {
  date: string;
  label: string;
  visitors: number;
  pageViews: number;
  productViews: number;
  whatsappClicks: number;
};

type TopProduct = {
  id: number;
  name: string;
  brand: string;
  views: number;
};

type WebsiteAnalyticsClientProps = {
  dailyData: DailyData[];

  topProducts: TopProduct[];

  todayStats: {
    visitors: number;
    pageViews: number;
    productViews: number;
    whatsappClicks: number;
  };
};

function formatNumber(
  value: number
) {
  return value.toLocaleString();
}

function getRangeDays(
  range: AnalyticsRange
) {
  switch (range) {
    case "today":
      return 1;

    case "7days":
      return 7;

    case "30days":
      return 30;
  }
}

export default function WebsiteAnalyticsClient({
  dailyData,
  topProducts,
  todayStats,
}: WebsiteAnalyticsClientProps) {
  const [range, setRange] =
    useState<AnalyticsRange>(
      "today"
    );

  /*
   * =========================================================
   * SELECTED DAYS
   * =========================================================
   */

  const selectedDays =
    useMemo(() => {
      const days =
        getRangeDays(range);

      return dailyData.slice(
        -days
      );
    }, [
      dailyData,
      range,
    ]);

  /*
   * =========================================================
   * SUMMARY
   * =========================================================
   */

  const summary =
    useMemo(() => {
      /*
       * Today
       *
       * Unique visitors need to use the
       * original visitor IDs.
       *
       * The dailyData already contains
       * unique visitors per day, so today
       * can safely use todayStats.
       */

      if (range === "today") {
        return {
          visitors:
            todayStats.visitors,

          pageViews:
            todayStats.pageViews,

          productViews:
            todayStats.productViews,

          whatsappClicks:
            todayStats.whatsappClicks,
        };
      }

      /*
       * For 7 / 30 days:
       *
       * We sum daily values.
       *
       * Page views, product views and
       * WhatsApp clicks are additive.
       *
       * Visitors are daily unique visitors.
       */

      return {
        visitors:
          selectedDays.reduce(
            (
              total,
              day
            ) =>
              total +
              day.visitors,
            0
          ),

        pageViews:
          selectedDays.reduce(
            (
              total,
              day
            ) =>
              total +
              day.pageViews,
            0
          ),

        productViews:
          selectedDays.reduce(
            (
              total,
              day
            ) =>
              total +
              day.productViews,
            0
          ),

        whatsappClicks:
          selectedDays.reduce(
            (
              total,
              day
            ) =>
              total +
              day.whatsappClicks,
            0
          ),
      };
    }, [
      range,
      selectedDays,
      todayStats,
    ]);

  /*
   * =========================================================
   * CHART
   * =========================================================
   */

  const maxVisitors =
    Math.max(
      1,
      ...selectedDays.map(
        (day) =>
          day.visitors
      )
    );

  /*
   * =========================================================
   * TITLE
   * =========================================================
   */

  const rangeLabel =
    range === "today"
      ? "Today"
      : range === "7days"
      ? "Last 7 Days"
      : "Last 30 Days";

  return (
    <section className="space-y-6">

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >

        <div>

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Website Analytics
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-semibold
              text-neutral-900
            "
          >
            Website Performance
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Anonymous visitor activity
            across your website.
          </p>

        </div>


        {/* ================================================= */}
        {/* Range Switcher */}
        {/* ================================================= */}

        <div
          className="
            flex
            w-fit
            rounded-xl
            border
            border-neutral-200
            bg-white
            p-1
          "
        >

          <button
            type="button"
            onClick={() =>
              setRange("today")
            }
            className={`
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              transition
              ${
                range ===
                "today"
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              }
            `}
          >
            Today
          </button>


          <button
            type="button"
            onClick={() =>
              setRange("7days")
            }
            className={`
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              transition
              ${
                range ===
                "7days"
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              }
            `}
          >
            7 Days
          </button>


          <button
            type="button"
            onClick={() =>
              setRange("30days")
            }
            className={`
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              transition
              ${
                range ===
                "30days"
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              }
            `}
          >
            30 Days
          </button>

        </div>

      </div>


      {/* ================================================= */}
      {/* Statistics */}
      {/* ================================================= */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* Unique Visitors */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-neutral-500">
                  Unique Visitors
                </p>

                <p className="mt-2 text-3xl font-semibold text-neutral-900">
                  {formatNumber(
                    summary.visitors
                  )}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  {rangeLabel}
                </p>

              </div>

              <span className="text-2xl">
                👤
              </span>

            </div>

          </CardContent>
        </Card>


        {/* Page Views */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-neutral-500">
                  Page Views
                </p>

                <p className="mt-2 text-3xl font-semibold text-neutral-900">
                  {formatNumber(
                    summary.pageViews
                  )}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  {rangeLabel}
                </p>

              </div>

              <span className="text-2xl">
                👀
              </span>

            </div>

          </CardContent>
        </Card>


        {/* Product Views */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-neutral-500">
                  Product Views
                </p>

                <p className="mt-2 text-3xl font-semibold text-neutral-900">
                  {formatNumber(
                    summary.productViews
                  )}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  {rangeLabel}
                </p>

              </div>

              <span className="text-2xl">
                🛍️
              </span>

            </div>

          </CardContent>
        </Card>


        {/* WhatsApp Clicks */}

        <Card>
          <CardContent className="p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-neutral-500">
                  WhatsApp Clicks
                </p>

                <p className="mt-2 text-3xl font-semibold text-neutral-900">
                  {formatNumber(
                    summary.whatsappClicks
                  )}
                </p>

                <p className="mt-2 text-xs text-neutral-400">
                  {rangeLabel}
                </p>

              </div>

              <span className="text-2xl">
                💬
              </span>

            </div>

          </CardContent>
        </Card>

      </div>


      {/* ================================================= */}
      {/* Chart + Top Products */}
      {/* ================================================= */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-3
        "
      >

        {/* ================================================= */}
        {/* Visitors Chart */}
        {/* ================================================= */}

        <Card className="lg:col-span-2">

          <CardHeader>
            <CardTitle>
              Visitors — {rangeLabel}
            </CardTitle>
          </CardHeader>

          <CardContent>

            {selectedDays.length ===
            0 ? (

              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-neutral-500">
                  No visitor data yet.
                </p>
              </div>

            ) : (

              <div
                className="
                  flex
                  h-64
                  items-end
                  gap-2
                  border-b
                  border-neutral-200
                  pb-0
                  sm:gap-3
                "
              >

                {selectedDays.map(
                  (
                    day,
                    index
                  ) => {

                    const height =
                      Math.max(
                        4,
                        Math.round(
                          (day.visitors /
                            maxVisitors) *
                            100
                        )
                      );

                    return (
                      <div
                        key={`${day.date}-${index}`}
                        className="
                          flex
                          h-full
                          flex-1
                          flex-col
                          items-center
                          justify-end
                          gap-2
                        "
                      >

                        <span
                          className="
                            text-[10px]
                            font-medium
                            text-neutral-600
                            sm:text-xs
                          "
                        >
                          {day.visitors}
                        </span>


                        <div
                          className="
                            flex
                            w-full
                            flex-1
                            items-end
                          "
                        >

                          <div
                            className="
                              w-full
                              rounded-t-xl
                              bg-black
                              transition-all
                              duration-500
                            "
                            style={{
                              height: `${height}%`,
                            }}
                          />

                        </div>


                        <span
                          className="
                            pb-3
                            text-[10px]
                            text-neutral-400
                            sm:text-xs
                          "
                        >
                          {day.label}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* Top Products */}
        {/* ================================================= */}

        <Card>

          <CardHeader>
            <CardTitle>
              Top Products
            </CardTitle>
          </CardHeader>

          <CardContent>

            {topProducts.length ===
            0 ? (

              <div className="py-10 text-center">

                <p className="text-sm text-neutral-500">
                  No product views yet.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {topProducts.map(
                  (
                    product,
                    index
                  ) => (

                    <div
                      key={
                        product.id
                      }
                      className="
                        flex
                        items-start
                        gap-4
                      "
                    >

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-neutral-100
                          text-xs
                          font-semibold
                          text-neutral-600
                        "
                      >
                        {index + 1}
                      </div>


                      <div className="min-w-0 flex-1">

                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-neutral-900
                          "
                        >
                          {
                            product.name
                          }
                        </p>

                        <p className="mt-1 truncate text-xs text-neutral-400">
                          {
                            product.brand
                          }
                        </p>

                      </div>


                      <div className="shrink-0 text-right">

                        <p className="text-sm font-semibold text-neutral-900">
                          {
                            formatNumber(
                              product.views
                            )
                          }
                        </p>

                        <p className="text-[11px] text-neutral-400">
                          views
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </CardContent>

        </Card>

      </div>

    </section>
  );
}