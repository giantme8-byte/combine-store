"use client";

import {
  useMemo,
  useState,
} from "react";


// ============================================================
// PRODUCT SALES TYPE
// ============================================================

type ProductSales = {
  productId: number;

  productName: string;

  brand: string;

  unitsSold: number;

  totalSales: number;

  totalCost: number;

  profit: number;

  margin: number;
};


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


  // ==========================================================
  // SORT
  // ==========================================================

  const [
    sortBy,
    setSortBy,
  ] = useState<
    "sales" | "units" | "profit"
  >("sales");


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
          10
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
          No completed sales yet.
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
            Product Sales
          </h2>


          <p
            className="
              mt-2
              text-sm
              text-neutral-500
            "
          >
            Actual sales performance by product.
          </p>

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
      {/* SUMMARY */}
      {/* ==================================================== */}

      <div
        className="
          mt-8
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-2
          sm:gap-4
          xl:grid-cols-4
        "
      >

        <div
          className="
            rounded-2xl
            bg-neutral-50
            p-5
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Units Sold
          </p>


          <p
            className="
              mt-2
              text-2xl
              font-light
              text-neutral-900
            "
          >
            {totalUnits.toLocaleString()}
          </p>

        </div>


        <div
          className="
            rounded-2xl
            bg-neutral-50
            p-5
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Total Sales
          </p>


          <p
            className="
              mt-2
              text-2xl
              font-light
              text-neutral-900
            "
          >
            {formatMoney(
              totalSales
            )}
          </p>

        </div>


        <div
          className="
            rounded-2xl
            bg-neutral-50
            p-5
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Total Cost
          </p>


          <p
            className="
              mt-2
              text-2xl
              font-light
              text-neutral-900
            "
          >
            {formatMoney(
              totalCost
            )}
          </p>

        </div>


        <div
          className="
            rounded-2xl
            bg-neutral-50
            p-5
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Actual Profit
          </p>


          <p
            className={`
              mt-2
              text-2xl
              font-light
              ${
                totalProfit >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            `}
          >
            {formatMoney(
              totalProfit
            )}
          </p>

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
              : "Top 10 Products"}
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
          10 && (

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
              ? "Show Top 10"
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
          space-y-3
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
                p-4
                shadow-sm
              "
            >
              {/* Product Header */}

              <div
                className="
                  flex
                  items-start
                  gap-3
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
                    text-[11px]
                    font-medium
                    text-neutral-500
                  "
                >
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      break-words
                      text-sm
                      font-medium
                      leading-5
                      text-neutral-900
                    "
                  >
                    {product.productName}
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[11px]
                      text-neutral-400
                    "
                  >
                    {product.brand}
                  </p>
                </div>

                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-neutral-100
                    px-2.5
                    py-1
                    text-[10px]
                    font-medium
                    text-neutral-700
                  "
                >
                  {product.margin.toFixed(1)}%
                </span>
              </div>

              {/* Metrics */}

              <div
                className="
                  mt-4
                  grid
                  grid-cols-2
                  gap-2
                "
              >
                <div
                  className="
                    rounded-xl
                    bg-neutral-50
                    p-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      text-neutral-400
                    "
                  >
                    Units
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-medium
                      text-neutral-900
                    "
                  >
                    {product.unitsSold.toLocaleString()}
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-neutral-50
                    p-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      text-neutral-400
                    "
                  >
                    Sales
                  </p>

                  <p
                    className="
                      mt-1
                      break-all
                      text-sm
                      font-medium
                      text-neutral-900
                    "
                  >
                    {formatMoney(product.totalSales)}
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-neutral-50
                    p-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      text-neutral-400
                    "
                  >
                    Cost
                  </p>

                  <p
                    className="
                      mt-1
                      break-all
                      text-sm
                      text-neutral-600
                    "
                  >
                    {formatMoney(product.totalCost)}
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-neutral-50
                    p-3
                  "
                >
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      text-neutral-400
                    "
                  >
                    Profit
                  </p>

                  <p
                    className={`
                      mt-1
                      break-all
                      text-sm
                      font-medium
                      ${
                        product.profit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    `}
                  >
                    {formatMoney(product.profit)}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* ==================================================== */}
      {/* TOTAL MARGIN */}
      {/* ==================================================== */}

      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          rounded-2xl
          border
          border-neutral-200
          px-5
          py-4
        "
      >

        <span
          className="
            text-sm
            text-neutral-500
          "
        >
          Overall Actual Margin
        </span>


        <span
          className="
            text-sm
            font-medium
            text-neutral-900
          "
        >
          {totalMargin.toFixed(1)}%
        </span>

      </div>


    </div>

  );

}