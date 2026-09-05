"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

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

type TodayStats = {
  visitors: number;
  pageViews: number;
  productViews: number;
  whatsappClicks: number;
};

type PeriodVisitors = {
  sevenDays: number;
  thirtyDays: number;
};

type WebsiteAnalyticsClientProps = {
  dailyData: DailyData[];

  topProductsToday: TopProduct[];

  topProducts7Days: TopProduct[];

  topProducts30Days: TopProduct[];

  todayStats: TodayStats;

  periodVisitors: PeriodVisitors;
};

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
  periodVisitors,
}: WebsiteAnalyticsClientProps) {
  const [range, setRange] =
    useState<AnalyticsRange>(
      "today"
    );

  /*
   * ==========================================================
   * SELECTED DAYS
   * ==========================================================
   */

  const selectedDays =
    useMemo(() => {
      if (range === "today") {
        return 1;
      }

      if (range === "7days") {
        return 7;
      }

      return 30;
    }, [range]);

  /*
   * ==========================================================
   * CHART DATA
   * ==========================================================
   */

  const chartData =
    useMemo(() => {
      if (range === "today") {
        return dailyData.slice(-1);
      }

      return dailyData.slice(
        -selectedDays
      );
    }, [
      dailyData,
      range,
      selectedDays,
    ]);

  /*
   * ==========================================================
   * PERIOD STATS
   * ==========================================================
   */

  const stats =
    useMemo(() => {
      /*
       * TODAY
       *
       * Uses today's real unique visitors.
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
       * 7 DAYS / 30 DAYS
       *
       * Visitors are NOT summed from dailyData.
       *
       * They come from the server-side
       * period-wide unique visitor calculation.
       */

      const pageViews =
        chartData.reduce(
          (sum, day) =>
            sum + day.pageViews,
          0
        );

      const productViews =
        chartData.reduce(
          (sum, day) =>
            sum + day.productViews,
          0
        );

      const whatsappClicks =
        chartData.reduce(
          (sum, day) =>
            sum + day.whatsappClicks,
          0
        );

      return {
        visitors:
          range === "7days"
            ? periodVisitors.sevenDays
            : periodVisitors.thirtyDays,

        pageViews,

        productViews,

        whatsappClicks,
      };
    }, [
      range,
      chartData,
      todayStats,
      periodVisitors,
    ]);

  /*
   * ==========================================================
   * TOP PRODUCTS
   * ==========================================================
   */

  const topProducts =
    useMemo(() => {
      if (range === "today") {
        return topProductsToday;
      }

      if (range === "7days") {
        return topProducts7Days;
      }

      return topProducts30Days;
    }, [
      range,
      topProductsToday,
      topProducts7Days,
      topProducts30Days,
    ]);

  /*
   * ==========================================================
   * RANGE LABEL
   * ==========================================================
   */

  const rangeLabel =
    range === "today"
      ? "Today"
      : range === "7days"
      ? "Last 7 Days"
      : "Last 30 Days";

  /*
   * ==========================================================
   * RETURN
   * ==========================================================
   */

  return (
    <div className="space-y-6">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>
          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-neutral-400

              sm:text-xs
            "
          >
            Website Performance
          </p>

          <h2
            className="
              mt-1.5
              text-xl
              font-light
              text-neutral-900

              sm:text-2xl
            "
          >
            Website Analytics
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-neutral-500

              sm:text-sm
            "
          >
            {rangeLabel}
          </p>
        </div>

        {/* ================================================== */}
        {/* RANGE SWITCHER */}
        {/* ================================================== */}

        <div
          className="
            flex
            w-full
            rounded-xl
            bg-neutral-100
            p-1

            sm:w-auto
          "
        >

          <button
            type="button"
            onClick={() =>
              setRange("today")
            }
            className={`
              flex-1
              rounded-lg
              px-3
              py-2
              text-xs
              font-medium
              transition

              sm:flex-none
              sm:px-4

              ${
                range === "today"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-500 hover:text-black"
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
              flex-1
              rounded-lg
              px-3
              py-2
              text-xs
              font-medium
              transition

              sm:flex-none
              sm:px-4

              ${
                range === "7days"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-500 hover:text-black"
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
              flex-1
              rounded-lg
              px-3
              py-2
              text-xs
              font-medium
              transition

              sm:flex-none
              sm:px-4

              ${
                range === "30days"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-500 hover:text-black"
              }
            `}
          >
            30 Days
          </button>

        </div>

      </div>

      {/* ================================================== */}
      {/* STATISTICS */}
      {/* ================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-3

          lg:grid-cols-4
          lg:gap-4
        "
      >

        {/* Visitors */}

        <div
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm

            sm:rounded-3xl
            sm:p-6
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Visitors
          </p>

          <p
            className="
              mt-3
              text-3xl
              font-extralight
              tracking-tight
              text-neutral-900

              sm:text-4xl
            "
          >
            {stats.visitors}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-neutral-400

              sm:text-xs
            "
          >
            Unique visitors
          </p>
        </div>

        {/* Page Views */}

        <div
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm

            sm:rounded-3xl
            sm:p-6
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Page Views
          </p>

          <p
            className="
              mt-3
              text-3xl
              font-extralight
              tracking-tight
              text-neutral-900

              sm:text-4xl
            "
          >
            {stats.pageViews}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-neutral-400

              sm:text-xs
            "
          >
            Total page views
          </p>
        </div>

        {/* Product Views */}

        <div
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm

            sm:rounded-3xl
            sm:p-6
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Product Views
          </p>

          <p
            className="
              mt-3
              text-3xl
              font-extralight
              tracking-tight
              text-neutral-900

              sm:text-4xl
            "
          >
            {stats.productViews}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-neutral-400

              sm:text-xs
            "
          >
            Product page views
          </p>
        </div>

        {/* WhatsApp */}

        <div
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm

            sm:rounded-3xl
            sm:p-6
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            WhatsApp
          </p>

          <p
            className="
              mt-3
              text-3xl
              font-extralight
              tracking-tight
              text-neutral-900

              sm:text-4xl
            "
          >
            {stats.whatsappClicks}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-neutral-400

              sm:text-xs
            "
          >
            WhatsApp clicks
          </p>
        </div>

      </div>

      {/* ================================================== */}
      {/* CHART + TOP PRODUCTS */}
      {/* ================================================== */}

      <div
        className="
          grid
          gap-6

          xl:grid-cols-[1.5fr_1fr]
        "
      >

        {/* ================================================= */}
        {/* VISITORS CHART */}
        {/* ================================================= */}

        <div
          className="
            min-w-0
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm

            sm:rounded-3xl
            sm:p-6
          "
        >

          <div className="mb-6">

            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-neutral-400

                sm:text-xs
              "
            >
              Traffic
            </p>

            <h3
              className="
                mt-1.5
                text-xl
                font-light
                text-neutral-900

                sm:text-2xl
              "
            >
              Visitors
            </h3>

          </div>

          <div
            className="
              h-[280px]
              w-full

              sm:h-[340px]
            "
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#9CA3AF",
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#9CA3AF",
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="visitors"
                  name="Visitors"
                  fill="#111827"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* ================================================= */}
        {/* TOP PRODUCTS */}
        {/* ================================================= */}

        <div
          className="
            min-w-0
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            shadow-sm

            sm:rounded-3xl
            sm:p-6
          "
        >

          <div className="mb-6">

            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-neutral-400

                sm:text-xs
              "
            >
              Products
            </p>

            <h3
              className="
                mt-1.5
                text-xl
                font-light
                text-neutral-900

                sm:text-2xl
              "
            >
              Top Products
            </h3>

          </div>

          {topProducts.length ===
          0 ? (

            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-neutral-300
                py-10
                text-center
                text-sm
                text-neutral-500
              "
            >
              No product views yet.
            </div>

          ) : (

            <div className="space-y-3">

              {topProducts.map(
                (
                  product,
                  index
                ) => (

                  <div
                    key={product.id}
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-neutral-200
                      p-3

                      sm:p-4
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
                        font-medium
                        text-neutral-500
                      "
                    >
                      {index + 1}
                    </div>

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
                          font-medium
                          text-neutral-900
                        "
                      >
                        {product.name}
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[11px]
                          text-neutral-500

                          sm:text-xs
                        "
                      >
                        {product.brand}
                      </p>

                    </div>

                    <div
                      className="
                        shrink-0
                        text-right
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-medium
                          text-neutral-900
                        "
                      >
                        {product.views}
                      </p>

                      <p
                        className="
                          text-[10px]
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

        </div>

      </div>

    </div>
  );
}