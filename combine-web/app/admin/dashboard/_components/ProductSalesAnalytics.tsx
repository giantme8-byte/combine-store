"use client";

import {
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";


// ============================================================
// PRODUCT SALES TYPE
// ============================================================

type ProductSales = {
  productId: number;

  productName: string;

  brand: string;

  views: number;

  orders: number;

  unitsSold: number;

  totalSales: number;

  totalCost: number;

  profit: number;

  margin: number;

  conversion: number;
};


// ============================================================
// SALES PERIOD
// ============================================================

export type ProductSalesPeriod =
  | "TODAY"
  | "YESTERDAY"
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "THIS_YEAR";


// ============================================================
// PROPS
// ============================================================

type ProductSalesAnalyticsProps = {
  products: ProductSales[];
};


// ============================================================
// FORMAT MONEY
// ============================================================

function formatMoney(
  value: number
) {

  return `RM ${value.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

}


// ============================================================
// COMPONENT
// ============================================================

export default function ProductSalesAnalytics({
  products,
}: ProductSalesAnalyticsProps) {

  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const [
    isPending,
    startTransition,
  ] = useTransition();


  const currentPeriod =
    (
      searchParams.get(
        "productSalesPeriod"
      ) as ProductSalesPeriod | null
    ) ??
    "TODAY";


  function changePeriod(
    period: ProductSalesPeriod
  ) {

    if (
      period ===
      currentPeriod
    ) {
      return;
    }


    const params =
      new URLSearchParams(
        searchParams.toString()
      );


    params.set(
      "productSalesPeriod",
      period
    );


    startTransition(() => {

      router.replace(
        `${pathname}?${params.toString()}`,
        {
          scroll:
            false,
        }
      );

    });

  }


  function getPeriodButtonClass(
    period: ProductSalesPeriod
  ) {

    const active =
      currentPeriod ===
      period;


    return `
      shrink-0
      rounded-full
      px-3.5
      py-2
      text-xs
      font-medium
      transition
      ${
        active
          ? "bg-black text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }
      ${
        isPending
          ? "pointer-events-none opacity-70"
          : ""
      }
    `;

  }


  // ==========================================================
  // SORT
  // ==========================================================

  const [
    sortBy,
    setSortBy,
  ] = useState<
    "sales" | "views" | "orders" | "units" | "profit"
  >("views");


  // ==========================================================
  // SHOW ALL
  // ==========================================================

  const [
    showAll,
    setShowAll,
  ] = useState(false);


  // ==========================================================
  // SORTED PRODUCTS
  // ==========================================================

  const sortedProducts =
    useMemo(() => {

      return [
        ...products,
      ].sort(
        (
          a,
          b
        ) => {

          if (
            sortBy ===
            "views"
          ) {

            return (
              b.views -
              a.views
            );

          }

          if (
            sortBy ===
            "orders"
          ) {

            return (
              b.orders -
              a.orders
            );

          }

          if (
            sortBy ===
            "units"
          ) {

            return (
              b.unitsSold -
              a.unitsSold
            );

          }


          if (
            sortBy ===
            "profit"
          ) {

            return (
              b.profit -
              a.profit
            );

          }


          return (
            b.totalSales -
            a.totalSales
          );

        }
      );

    }, [
      products,
      sortBy,
    ]);


  // ==========================================================
  // VISIBLE PRODUCTS
  // ==========================================================

  const visibleProducts =
    showAll
      ? sortedProducts
      : sortedProducts.slice(
          0,
          5
        );


  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (
    products.length ===
    0
  ) {

    return (

      <div
        className="
          rounded-3xl
          border
          border-neutral-200
          bg-white
          p-8
          shadow-sm
        "
      >

        <p
          className="
            text-xs
            font-medium
            uppercase
            tracking-[0.28em]
            text-neutral-400
          "
        >
          Analytics
        </p>


        <h2
          className="
            mt-2
            text-2xl
            font-light
            text-neutral-900
          "
        >
          Product Sales
        </h2>


        <p
          className="
            mt-8
            text-sm
            text-neutral-500
          "
        >
          No product analytics data yet.
        </p>

      </div>

    );

  }


  // ==========================================================
  // TOTALS
  // ==========================================================

  const totalUnits =
    products.reduce(
      (
        sum,
        product
      ) =>
        sum +
        product.unitsSold,
      0
    );


  const totalSales =
    products.reduce(
      (
        sum,
        product
      ) =>
        sum +
        product.totalSales,
      0
    );


  const totalCost =
    products.reduce(
      (
        sum,
        product
      ) =>
        sum +
        product.totalCost,
      0
    );


  const totalProfit =
    products.reduce(
      (
        sum,
        product
      ) =>
        sum +
        product.profit,
      0
    );


  const totalMargin =
    totalSales > 0
      ? (
          totalProfit /
          totalSales
        ) *
        100
      : 0;


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <div
      className="
        rounded-3xl
        border
        border-neutral-200
        bg-white
        p-8
        shadow-sm
      "
    >


      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.28em]
              text-neutral-400
            "
          >
            Analytics
          </p>


          <h2
            className="
              mt-2
              text-2xl
              font-light
              text-neutral-900
            "
          >
            Product Sales Performance
          </h2>


          <p
            className="
              mt-2
              text-sm
              text-neutral-500
            "
          >
            Views, orders, sales, cost, profit, margin, and conversion by product.
          </p>

          <p
            className="
              mt-2
              text-xs
              text-neutral-400
            "
          >
            Conversion = orders ÷ product views.
          </p>

        </div>


        {/* ================================================== */}
        {/* PERIOD FILTER */}
        {/* ================================================== */}

        <div
          className="
            w-full
            overflow-x-auto
            pb-1
            lg:w-auto
          "
        >

          <div
            className="
              flex
              min-w-max
              gap-2
            "
          >

            {(
              [
                ["TODAY", "Today"],
                ["YESTERDAY", "Yesterday"],
                ["THIS_WEEK", "This Week"],
                ["THIS_MONTH", "This Month"],
                ["THIS_YEAR", "This Year"],
              ] as const
            ).map(
              ([period, label]) => (

                <button
                  key={period}
                  type="button"
                  onClick={() =>
                    changePeriod(
                      period
                    )
                  }
                  disabled={
                    isPending
                  }
                  className={
                    getPeriodButtonClass(
                      period
                    )
                  }
                >
                  {label}
                </button>

              )
            )}

          </div>

        </div>


        {/* ================================================== */}
        {/* SORT */}
        {/* ================================================== */}

        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >

          <button
            type="button"
            onClick={() =>
              setSortBy(
                "views"
              )
            }
            className={`
              rounded-full
              px-4
              py-2
              text-xs
              font-medium
              transition
              ${
                sortBy ===
                "views"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }
            `}
          >
            Views
          </button>

          <button
            type="button"
            onClick={() =>
              setSortBy(
                "orders"
              )
            }
            className={`
              rounded-full
              px-4
              py-2
              text-xs
              font-medium
              transition
              ${
                sortBy ===
                "orders"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }
            `}
          >
            Orders
          </button>

          <button
            type="button"
            onClick={() =>
              setSortBy(
                "sales"
              )
            }
            className={`
              rounded-full
              px-4
              py-2
              text-xs
              font-medium
              transition
              ${
                sortBy ===
                "sales"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }
            `}
          >
            Sales
          </button>


          <button
            type="button"
            onClick={() =>
              setSortBy(
                "units"
              )
            }
            className={`
              rounded-full
              px-4
              py-2
              text-xs
              font-medium
              transition
              ${
                sortBy ===
                "units"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }
            `}
          >
            Units
          </button>


          <button
            type="button"
            onClick={() =>
              setSortBy(
                "profit"
              )
            }
            className={`
              rounded-full
              px-4
              py-2
              text-xs
              font-medium
              transition
              ${
                sortBy ===
                "profit"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }
            `}
          >
            Profit
          </button>

        </div>

      </div>


      {/* ==================================================== */}
      {/* TABLE HEADER */}
      {/* ==================================================== */}

      <div
        className="
          mt-8
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              font-medium
              text-neutral-900
            "
          >
            {showAll
              ? "All Products"
              : "Top 5 Products"}
          </p>


          <p
            className="
              mt-1
              text-xs
              text-neutral-400
            "
          >
            Showing{" "}
            {visibleProducts.length.toLocaleString()}{" "}
            of{" "}
            {sortedProducts.length.toLocaleString()}{" "}
            products
          </p>

        </div>


        {/* ================================================== */}
        {/* VIEW ALL */}
        {/* ================================================== */}

        {sortedProducts.length >
          5 && (

          <button
            type="button"
            onClick={() =>
              setShowAll(
                (
                  current
                ) =>
                  !current
              )
            }
            className="
              rounded-full
              border
              border-neutral-200
              bg-white
              px-4
              py-2
              text-xs
              font-medium
              text-neutral-700
              transition
              hover:bg-neutral-50
            "
          >
            {showAll
              ? "Show Top 5"
              : "View All Products"}
          </button>

        )}

      </div>


      {/* ==================================================== */}
      {/* TABLE */}
      {/* ==================================================== */}

      {/* ==================================================== */}
      {/* DESKTOP TABLE */}
      {/* ==================================================== */}

      <div
        className="
          mt-4
          hidden
          overflow-x-auto
          md:block
        "
      >

        <table
          className="
            w-full
            min-w-[900px]
            border-collapse
          "
        >

          <thead>

            <tr
              className="
                border-b
                border-neutral-200
              "
            >

              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                #
              </th>


              <th
                className="
                  px-4
                  py-4
                  text-left
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                Product
              </th>


              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                Views
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                Orders
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                Units
              </th>


              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                Sales
              </th>


              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                Cost
              </th>


              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                Profit
              </th>


              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                Margin
              </th>

              <th
                className="
                  px-4
                  py-4
                  text-right
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400
                "
              >
                Conversion
              </th>

            </tr>

          </thead>


          <tbody>

            {visibleProducts.map(
              (
                product,
                index
              ) => (

                <tr
                  key={
                    product.productId
                  }
                  className="
                    border-b
                    border-neutral-100
                    transition
                    hover:bg-neutral-50
                  "
                >

                  {/* ======================================== */}
                  {/* RANK */}
                  {/* ======================================== */}

                  <td
                    className="
                      px-4
                      py-5
                      text-sm
                      font-medium
                      text-neutral-400
                    "
                  >
                    {index + 1}
                  </td>


                  {/* ======================================== */}
                  {/* PRODUCT */}
                  {/* ======================================== */}

                  <td
                    className="
                      px-4
                      py-5
                    "
                  >

                    <div>

                      <p
                        className="
                          font-medium
                          text-neutral-900
                        "
                      >
                        {
                          product.productName
                        }
                      </p>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-neutral-400
                        "
                      >
                        {
                          product.brand
                        }
                      </p>

                    </div>

                  </td>


                  {/* ======================================== */}
                  {/* VIEWS */}
                  {/* ======================================== */}

                  <td
                    className="
                      px-4
                      py-5
                      text-right
                      text-sm
                      text-neutral-700
                    "
                  >
                    {
                      product.views.toLocaleString()
                    }
                  </td>

                  {/* ======================================== */}
                  {/* ORDERS */}
                  {/* ======================================== */}

                  <td
                    className="
                      px-4
                      py-5
                      text-right
                      text-sm
                      text-neutral-700
                    "
                  >
                    {
                      product.orders.toLocaleString()
                    }
                  </td>

                  {/* ======================================== */}
                  {/* UNITS */}
                  {/* ======================================== */}

                  <td
                    className="
                      px-4
                      py-5
                      text-right
                      text-sm
                      text-neutral-700
                    "
                  >
                    {
                      product.unitsSold.toLocaleString()
                    }
                  </td>


                  {/* ======================================== */}
                  {/* SALES */}
                  {/* ======================================== */}

                  <td
                    className="
                      px-4
                      py-5
                      text-right
                      text-sm
                      font-medium
                      text-neutral-900
                    "
                  >
                    {
                      formatMoney(
                        product.totalSales
                      )
                    }
                  </td>


                  {/* ======================================== */}
                  {/* COST */}
                  {/* ======================================== */}

                  <td
                    className="
                      px-4
                      py-5
                      text-right
                      text-sm
                      text-neutral-600
                    "
                  >
                    {
                      formatMoney(
                        product.totalCost
                      )
                    }
                  </td>


                  {/* ======================================== */}
                  {/* PROFIT */}
                  {/* ======================================== */}

                  <td
                    className={`
                      px-4
                      py-5
                      text-right
                      text-sm
                      font-medium
                      ${
                        product.profit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    `}
                  >
                    {
                      formatMoney(
                        product.profit
                      )
                    }
                  </td>


                  {/* ======================================== */}
                  {/* MARGIN */}
                  {/* ======================================== */}

                  <td
                    className="
                      px-4
                      py-5
                      text-right
                    "
                  >

                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-neutral-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-neutral-700
                      "
                    >
                      {
                        product.margin.toFixed(
                          1
                        )
                      }%
                    </span>

                  </td>

                  <td
                    className="
                      px-4
                      py-5
                      text-right
                    "
                  >

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-medium
                        ${
                          product.conversion >= 5
                            ? "bg-green-100 text-green-700"
                            : product.conversion > 0
                              ? "bg-neutral-100 text-neutral-700"
                              : "bg-red-50 text-red-500"
                        }
                      `}
                    >
                      {
                        product.conversion.toFixed(
                          2
                        )
                      }%
                    </span>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>


      {/* ==================================================== */}
      {/* MOBILE PRODUCT CARDS */}
      {/* ==================================================== */}

      <div
        className="
          mt-4
          space-y-2
          md:hidden
        "
      >
        {visibleProducts.map(
          (product, index) => (
            <div
              key={product.productId}
              className="
                rounded-2xl
                border
                border-neutral-200
                bg-white
                px-3
                py-3
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-neutral-100
                    text-[10px]
                    font-medium
                    text-neutral-500
                  "
                >
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                      leading-5
                      text-neutral-900
                    "
                  >
                    {product.productName}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-neutral-400">
                    {product.brand}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                    Views
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                    {product.views.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-neutral-100 pt-2.5">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                    Orders
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-neutral-800">
                    {product.orders.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                    Sales
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-neutral-800">
                    {formatMoney(product.totalSales)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                    Conversion
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-neutral-800">
                    {product.conversion.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>


    </div>

  );

}