"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

/*
 * ============================================================
 * ANALYTICS RANGE
 * ============================================================
 */

type AnalyticsRange =
  | "today"
  | "7days"
  | "30days";

/*
 * ============================================================
 * DAILY DATA
 * ============================================================
 */

type DailyData = {
  date: string;
  label: string;
  visitors: number;
  pageViews: number;
  productViews: number;
  whatsappClicks: number;
};

/*
 * ============================================================
 * TOP PRODUCT
 * ============================================================
 */

type TopProduct = {
  id: number;
  name: string;
  brand: string;
  views: number;
};

/*
 * ============================================================
 * PROPS
 * ============================================================
 */

type WebsiteAnalyticsClientProps = {
  dailyData: DailyData[];

  topProductsToday: TopProduct[];

  topProducts7Days: TopProduct[];

  topProducts30Days: TopProduct[];

  todayStats: {
    visitors: number;
    pageViews: number;
    productViews: number;
    whatsappClicks: number;
  };
};

/*
 * ============================================================
 * FORMAT NUMBER
 * ============================================================
 */

function formatNumber(
  value: number
) {
  return value.toLocaleString();
}

/*
 * ============================================================
 * GET RANGE DAYS
 * ============================================================
 */

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

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export default function WebsiteAnalyticsClient({
  dailyData,
  topProductsToday,
  topProducts7Days,
  topProducts30Days,
  todayStats,
}: WebsiteAnalyticsClientProps) {
  /*
   * ==========================================================
   * RANGE
   * ==========================================================
   */

  const [
    range,
    setRange,
  ] = useState<AnalyticsRange>(
    "today"
  );

  /*
   * ==========================================================
   * SELECTED DAYS
   * ==========================================================
   */

  const selectedDays =
    useMemo(() => {
      const days =
        getRangeDays(
          range
        );

      return dailyData.slice(
        -days
      );
    }, [
      dailyData,
      range,
    ]);

  /*
   * ==========================================================
   * SUMMARY
   * ==========================================================
   */

  const summary =
    useMemo(() => {
      /*
       * ------------------------------------------------------
       * TODAY
       * ------------------------------------------------------
       */

      if (
        range ===
        "today"
      ) {
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
       * ------------------------------------------------------
       * 7 / 30 DAYS
       * ------------------------------------------------------
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
   * ==========================================================
   * MAX VISITORS
   * ==========================================================
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
   * ==========================================================
   * RANGE LABEL
   * ==========================================================
   */

  const rangeLabel =
    range ===
    "today"
      ? "Today"
      : range ===
        "7days"
        ? "Last 7 Days"
        : "Last 30 Days";

  /*
   * ==========================================================
   * TOP PRODUCTS
   * ==========================================================
   *
   * The selected range controls which Top Products dataset
   * is displayed.
   *
   * Today:
   * topProductsToday
   *
   * 7 Days:
   * topProducts7Days
   *
   * 30 Days:
   * topProducts30Days
   * ==========================================================
   */

  const topProducts =
    range === "today"
      ? topProductsToday
      : range === "7days"
        ? topProducts7Days
        : topProducts30Days;

  /*
   * ==========================================================
   * RETURN
   * ==========================================================
   */

  return (
    <section
      className="
        space-y-6
      "
    >
      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

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

          <p
            className="
              mt-1
              text-sm
              text-neutral-500
            "
          >
            Anonymous visitor activity
            across your website.
          </p>
        </div>

        {/* ================================================== */}
        {/* RANGE SWITCHER */}
        {/* ================================================== */}

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
          {/* ================================================ */}
          {/* TODAY */}
          {/* ================================================ */}

          <button
            type="button"
            onClick={() =>
              setRange(
                "today"
              )
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

          {/* ================================================ */}
          {/* 7 DAYS */}
          {/* ================================================ */}

          <button
            type="button"
            onClick={() =>
              setRange(
                "7days"
              )
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

          {/* ================================================ */}
          {/* 30 DAYS */}
          {/* ================================================ */}

          <button
            type="button"
            onClick={() =>
              setRange(
                "30days"
              )
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

      {/* ==================================================== */}
      {/* STATISTICS */}
      {/* ==================================================== */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* ================================================== */}
        {/* UNIQUE VISITORS */}
        {/* ================================================== */}

        <Card>
          <CardContent
            className="
              p-6
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  Unique Visitors
                </p>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    text-neutral-900
                  "
                >
                  {formatNumber(
                    summary.visitors
                  )}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-neutral-400
                  "
                >
                  {rangeLabel}
                </p>
              </div>

              <span
                className="
                  text-2xl
                "
              >
                👤
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ================================================== */}
        {/* PAGE VIEWS */}
        {/* ================================================== */}

        <Card>
          <CardContent
            className="
              p-6
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  Page Views
                </p>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    text-neutral-900
                  "
                >
                  {formatNumber(
                    summary.pageViews
                  )}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-neutral-400
                  "
                >
                  {rangeLabel}
                </p>
              </div>

              <span
                className="
                  text-2xl
                "
              >
                👀
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ================================================== */}
        {/* PRODUCT VIEWS */}
        {/* ================================================== */}

        <Card>
          <CardContent
            className="
              p-6
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  Product Views
                </p>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    text-neutral-900
                  "
                >
                  {formatNumber(
                    summary.productViews
                  )}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-neutral-400
                  "
                >
                  {rangeLabel}
                </p>
              </div>

              <span
                className="
                  text-2xl
                "
              >
                🛍️
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ================================================== */}
        {/* WHATSAPP CLICKS */}
        {/* ================================================== */}

        <Card>
          <CardContent
            className="
              p-6
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  WhatsApp Clicks
                </p>

                <p
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    text-neutral-900
                  "
                >
                  {formatNumber(
                    summary.whatsappClicks
                  )}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-neutral-400
                  "
                >
                  {rangeLabel}
                </p>
              </div>

              <span
                className="
                  text-2xl
                "
              >
                💬
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ==================================================== */}
      {/* CHART + TOP PRODUCTS */}
      {/* ==================================================== */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-3
        "
      >
        {/* ================================================== */}
        {/* VISITORS CHART */}
        {/* ================================================== */}

        <Card
          className="
            lg:col-span-2
          "
        >
          <CardHeader>
            <CardTitle>
              Visitors — {rangeLabel}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {selectedDays.length ===
            0 ? (
              <div
                className="
                  flex
                  h-64
                  items-center
                  justify-center
                "
              >
                <p
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  No visitor data yet.
                </p>
              </div>
            ) : (
              <div
                className="
                  flex
                  h-64
                  items-end
                  justify-center
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
                          (
                            day.visitors /
                            maxVisitors
                          ) *
                          100
                        )
                      );

                    /*
                     * =================================================
                     * IMPORTANT:
                     *
                     * Today contains only one day.
                     *
                     * Previously that one bar used
                     * flex-1 + w-full, causing it to
                     * occupy almost the entire chart.
                     *
                     * We give the single-day bar a
                     * fixed width instead.
                     * =================================================
                     */

                    const isSingleDay =
                      selectedDays.length ===
                      1;

                    return (
                      <div
                        key={`${day.date}-${index}`}
                        className={`
                          flex
                          h-full
                          flex-col
                          items-center
                          justify-end
                          gap-2
                          ${
                            isSingleDay
                              ? "w-24"
                              : "min-w-0 flex-1"
                          }
                        `}
                      >
                        {/* ================================== */}
                        {/* VALUE */}
                        {/* ================================== */}

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

                        {/* ================================== */}
                        {/* BAR AREA */}
                        {/* ================================== */}

                        <div
                          className="
                            flex
                            w-full
                            flex-1
                            items-end
                            justify-center
                          "
                        >
                          <div
                            className={`
                              rounded-t-xl
                              bg-neutral-900
                              transition-all
                              duration-500
                              ${
                                isSingleDay
                                  ? "w-16"
                                  : "w-full"
                              }
                            `}
                            style={{
                              height:
                                `${height}%`,
                            }}
                          />
                        </div>

                        {/* ================================== */}
                        {/* DAY LABEL */}
                        {/* ================================== */}

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

        {/* ================================================== */}
        {/* TOP PRODUCTS */}
        {/* ================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>
              Top Products
            </CardTitle>
          </CardHeader>

          <CardContent>
            {topProducts.length ===
            0 ? (
              <div
                className="
                  py-10
                  text-center
                "
              >
                <p
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  No product views yet.
                </p>
              </div>
            ) : (
              <div
                className="
                  space-y-5
                "
              >
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
                      {/* ================================== */}
                      {/* RANK */}
                      {/* ================================== */}

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

                      {/* ================================== */}
                      {/* PRODUCT */}
                      {/* ================================== */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
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

                        <p
                          className="
                            mt-1
                            truncate
                            text-xs
                            text-neutral-400
                          "
                        >
                          {
                            product.brand
                          }
                        </p>
                      </div>

                      {/* ================================== */}
                      {/* VIEWS */}
                      {/* ================================== */}

                      <div
                        className="
                          shrink-0
                          text-right
                        "
                      >
                        <p
                          className="
                            text-sm
                            font-semibold
                            text-neutral-900
                          "
                        >
                          {formatNumber(
                            product.views
                          )}
                        </p>

                        <p
                          className="
                            text-[11px]
                            text-neutral-400
                          "
                        >
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