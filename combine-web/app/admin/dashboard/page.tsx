import {
  OrderStatus,
  UserRole,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
  calculateInventorySummary,
} from "@/lib/dashboard";

import {
  requireRole,
} from "@/lib/authorize";

import StatCard from "./_components/StatCard";
import RecentProducts from "./_components/RecentProducts";
import RecentInquiries from "./_components/RecentInquiries";
import BusinessStatCard from "./_components/BusinessStatCard";
import InventoryChart from "./_components/InventoryChart";
import TopBrands from "./_components/TopBrands";
import InventoryAlerts from "./_components/InventoryAlerts";
import DashboardHero from "./_components/DashboardHero";
import WebsiteAnalytics from "./_components/WebsiteAnalytics";
import ProductSalesAnalytics from "./_components/ProductSalesAnalytics";
import SalesAnalytics, {
  type SalesPeriod,
} from "./_components/SalesAnalytics";

import {
  PageHeader,
} from "@/components/ui/page-header";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Button,
} from "@/components/ui/button";

import Link from "next/link";


// ============================================================
// PROPS
// ============================================================

type DashboardPageProps = {
  searchParams: Promise<{
    salesPeriod?: string;
    productSalesPeriod?: string;
  }>;
};


// ============================================================
// VALID SALES PERIODS
// ============================================================

const SALES_PERIODS = [
  "TODAY",
  "YESTERDAY",
  "THIS_WEEK",
  "THIS_MONTH",
  "THIS_YEAR",
] as const;


// ============================================================
// CHECK SALES PERIOD
// ============================================================

function isSalesPeriod(
  value: string
): value is SalesPeriod {

  return SALES_PERIODS.includes(
    value as SalesPeriod
  );

}


function isProductSalesPeriod(
  value: string
): value is SalesPeriod {

  return SALES_PERIODS.includes(
    value as SalesPeriod
  );

}


// ============================================================
// GET SALES DATE RANGE
// ============================================================

function getSalesDateRange(
  period: SalesPeriod
) {

  const now =
    new Date();


  // ==========================================================
  // TODAY
  // ==========================================================

  if (
    period ===
    "TODAY"
  ) {

    const start =
      new Date(
        now
      );

    start.setHours(
      0,
      0,
      0,
      0
    );


    const end =
      new Date(
        now
      );

    end.setHours(
      23,
      59,
      59,
      999
    );


    return {
      gte: start,
      lte: end,
    };

  }


  // ==========================================================
  // YESTERDAY
  // ==========================================================

  if (
    period ===
    "YESTERDAY"
  ) {

    const start =
      new Date(
        now
      );

    start.setDate(
      start.getDate() - 1
    );

    start.setHours(
      0,
      0,
      0,
      0
    );


    const end =
      new Date(
        start
      );

    end.setHours(
      23,
      59,
      59,
      999
    );


    return {
      gte: start,
      lte: end,
    };

  }


  // ==========================================================
  // THIS WEEK
  // ==========================================================

  if (
    period ===
    "THIS_WEEK"
  ) {

    const start =
      new Date(
        now
      );


    /*
     * Monday = first day of week.
     *
     * Sunday:
     * day = 0
     *
     * Monday:
     * day = 1
     */

    const day =
      start.getDay();


    const difference =
      day === 0
        ? 6
        : day - 1;


    start.setDate(
      start.getDate() -
        difference
    );

    start.setHours(
      0,
      0,
      0,
      0
    );


    const end =
      new Date(
        now
      );

    end.setHours(
      23,
      59,
      59,
      999
    );


    return {
      gte: start,
      lte: end,
    };

  }


  // ==========================================================
  // THIS MONTH
  // ==========================================================

  if (
    period ===
    "THIS_MONTH"
  ) {

    const start =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
        0,
        0,
        0,
        0
      );


    const end =
      new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );


    return {
      gte: start,
      lte: end,
    };

  }


  // ==========================================================
  // THIS YEAR
  // ==========================================================

  if (
    period ===
    "THIS_YEAR"
  ) {

    const start =
      new Date(
        now.getFullYear(),
        0,
        1,
        0,
        0,
        0,
        0
      );


    const end =
      new Date(
        now.getFullYear(),
        11,
        31,
        23,
        59,
        59,
        999
      );


    return {
      gte: start,
      lte: end,
    };

  }


  return undefined;

}


// ============================================================
// DASHBOARD
// ============================================================

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  const user =
    await requireRole([
      UserRole.OWNER,
      UserRole.ADMIN,
      UserRole.MANAGER,
    ]);


  // ==========================================================
  // SEARCH PARAMS
  // ==========================================================

  const params =
    await searchParams;


  const requestedPeriod =
    params.salesPeriod ??
    "TODAY";


  const salesPeriod: SalesPeriod =
    isSalesPeriod(
      requestedPeriod
    )
      ? requestedPeriod
      : "TODAY";


  const requestedProductSalesPeriod =
    params.productSalesPeriod ??
    "TODAY";


  const productSalesPeriod: SalesPeriod =
    isProductSalesPeriod(
      requestedProductSalesPeriod
    )
      ? requestedProductSalesPeriod
      : "TODAY";


  // ==========================================================
  // SALES DATE RANGE
  // ==========================================================

  const salesDateRange =
    getSalesDateRange(
      salesPeriod
    );


  const productSalesDateRange =
    getSalesDateRange(
      productSalesPeriod
    );


  // ==========================================================
  // ORDER WHERE
  // ==========================================================

  const actualSalesOrderWhere = {

    payment: {
      is: {
        status: "VERIFIED" as const,
      },
    },

    ...(salesDateRange
      ? {
          createdAt:
            salesDateRange,
        }
      : {}),

  };


  const productSalesOrderWhere = {

    payment: {
      is: {
        status: "VERIFIED" as const,
      },
    },

    ...(productSalesDateRange
      ? {
          createdAt:
            productSalesDateRange,
        }
      : {}),

  };


  // ==========================================================
  // NEW ARRIVAL DATE RANGE
  // ==========================================================

  const newArrivalSince = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  );

  const newArrivalUntil = new Date();


  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const [
    products,
    categories,
    brands,
    wishlist,
    inquiries,

    pendingInquiries,
    contactedInquiries,
    completedInquiries,
    cancelledInquiries,

    featuredProducts,
    newArrivalProducts,
    bestSellerProducts,

    allProducts,
    settings,

    actualSales,

    shippingCollected,

    productSales,

    productViews,

    productOrderRows,

  ] = await Promise.all([


    // ========================================================
    // PRODUCTS
    // ========================================================

    prisma.product.count(),


    // ========================================================
    // CATEGORIES
    // ========================================================

    prisma.category.count(),


    // ========================================================
    // BRANDS
    // ========================================================

    prisma.brand.count(),


    // ========================================================
    // WISHLIST
    // ========================================================

    prisma.wishlistItem.count(),


    // ========================================================
    // INQUIRIES
    // ========================================================

    prisma.inquiry.count(),


    // ========================================================
    // PENDING
    // ========================================================

    prisma.inquiry.count({
      where: {
        status:
          "PENDING",
      },
    }),


    // ========================================================
    // CONTACTED
    // ========================================================

    prisma.inquiry.count({
      where: {
        status:
          "CONTACTED",
      },
    }),


    // ========================================================
    // COMPLETED
    // ========================================================

    prisma.inquiry.count({
      where: {
        status:
          "COMPLETED",
      },
    }),


    // ========================================================
    // CANCELLED
    // ========================================================

    prisma.inquiry.count({
      where: {
        status:
          "CANCELLED",
      },
    }),


    // ========================================================
    // FEATURED
    // ========================================================

    prisma.product.count({
      where: {
        featured:
          true,
      },
    }),


    // ========================================================
    // NEW ARRIVAL
    // ========================================================

    prisma.product.count({
      where: {
        newArrival: true,
        createdAt: {
          gt: newArrivalSince,
          lte: newArrivalUntil,
        },
      },
    }),


    // ========================================================
    // BEST SELLER
    // ========================================================

    prisma.product.count({
      where: {
        bestSeller:
          true,
      },
    }),


    // ========================================================
    // ALL PRODUCTS
    // ========================================================

    prisma.product.findMany({
      include: {
        variants:
          true,
      },
    }),


    // ========================================================
    // SETTINGS
    // ========================================================

    prisma.setting.findFirst(),


    // ========================================================
    // ACTUAL SALES
    // ========================================================

    prisma.orderItem.aggregate({

      where: {

        order:
          actualSalesOrderWhere,

      },

      _sum: {

        quantity:
          true,

        totalPrice:
          true,

        totalCost:
          true,

        profit:
          true,

      },

    }),


    // ========================================================
    // SHIPPING COLLECTED
    // ========================================================

    prisma.order.aggregate({

      where:
        actualSalesOrderWhere,

      _sum: {

        shippingFee:
          true,

      },

    }),


    // ========================================================
    // PRODUCT SALES
    // ========================================================

    prisma.orderItem.groupBy({

      by: [
        "productId",
      ],

      where: {

        order:
          productSalesOrderWhere,

      },

      _sum: {

        quantity:
          true,

        totalPrice:
          true,

        totalCost:
          true,

        profit:
          true,

      },

    }),


    // ========================================================
    // PRODUCT VIEWS
    // ========================================================

    prisma.analyticsEvent.groupBy({

      by: [
        "productId",
      ],

      where: {

        event:
          "PRODUCT_VIEW",

        productId: {
          not: null,
        },

        ...(productSalesDateRange
          ? {
              createdAt:
                productSalesDateRange,
            }
          : {}),

      },

      _count: {

        _all:
          true,

      },

    }),


    // ========================================================
    // PRODUCT ORDERS
    // ========================================================

    prisma.orderItem.findMany({

      where: {

        order:
          productSalesOrderWhere,

      },

      select: {

        productId:
          true,

        orderId:
          true,

      },

    }),

  ]);


  // ============================================================
  // EXCHANGE RATE
  // ============================================================

  const exchangeRate =
    settings?.exchangeRate ??
    0.59;


  // ============================================================
  // INVENTORY SUMMARY
  // ============================================================

  const summary =
    calculateInventorySummary(
      allProducts,
      exchangeRate
    );


  // ============================================================
  // ACTUAL SALES SUMMARY
  // ============================================================

  const actualUnitsSold =
    actualSales._sum.quantity ??
    0;


  const actualTotalSales =
    actualSales._sum.totalPrice ??
    0;


  const actualShippingCollected =
    shippingCollected._sum.shippingFee ??
    0;


  const actualTotalCost =
    actualSales._sum.totalCost ??
    0;


  const actualProfit =
    actualSales._sum.profit ??
    (
      actualTotalSales -
      actualTotalCost
    );


  const actualMargin =
    actualTotalSales > 0
      ? (
          actualProfit /
          actualTotalSales
        ) *
        100
      : 0;


  // ============================================================
  // PRODUCT MAP
  // ============================================================

  const productMap =
    new Map(
      allProducts.map(
        (
          product
        ) => [
          product.id,
          product,
        ]
      )
    );


  // ============================================================
  // PRODUCT ANALYTICS DATA
  // ============================================================

  const productViewsMap =
    new Map(
      productViews.map(
        (
          item
        ) => [
          item.productId,
          item._count._all,
        ]
      )
    );


  const productOrdersMap =
    new Map<
      number,
      Set<number>
    >();


  for (
    const row
    of productOrderRows
  ) {

    if (
      !productOrdersMap.has(
        row.productId
      )
    ) {

      productOrdersMap.set(
        row.productId,
        new Set<number>()
      );

    }


    productOrdersMap
      .get(
        row.productId
      )!
      .add(
        row.orderId
      );

  }


  const productSalesMap =
    new Map(
      productSales.map(
        (
          item
        ) => [
          item.productId,
          item,
        ]
      )
    );


  const productSalesData =
    allProducts
      .map(
        (
          product
        ) => {

          const sales =
            productSalesMap.get(
              product.id
            );


          const views =
            productViewsMap.get(
              product.id
            ) ??
            0;


          const orders =
            productOrdersMap.get(
              product.id
            )?.size ??
            0;


          const unitsSold =
            sales?._sum.quantity ??
            0;


          const totalSales =
            sales?._sum.totalPrice ??
            0;


          const totalCost =
            sales?._sum.totalCost ??
            0;


          const profit =
            sales?._sum.profit ??
            (
              totalSales -
              totalCost
            );


          const margin =
            totalSales > 0
              ? (
                  profit /
                  totalSales
                ) *
                100
              : 0;


          const conversion =
            views > 0
              ? (
                  orders /
                  views
                ) *
                100
              : 0;


          return {

            productId:
              product.id,

            productName:
              product.name,

            brand:
              product.brand,

            views,

            orders,

            unitsSold,

            totalSales,

            totalCost,

            profit,

            margin,

            conversion,

          };

        }
      )
      .sort(
        (
          a,
          b
        ) =>
          b.totalSales -
          a.totalSales
      );


  // ============================================================
  // CATEGORY DATA
  // ============================================================

  const categoryData =
    Object.values(
      allProducts.reduce(
        (
          acc,
          product
        ) => {

          const category =
            product.category;


          if (!acc[category]) {

            acc[category] = {

              name:
                category,

              value:
                0,

            };

          }


          acc[category].value++;


          return acc;

        },
        {} as Record<
          string,
          {
            name: string;
            value: number;
          }
        >
      )
    );


  // ============================================================
  // BRAND DATA
  // ============================================================

  const brandData =
    Object.values(
      allProducts.reduce(
        (
          acc,
          product
        ) => {

          const brand =
            product.brand;


          if (!acc[brand]) {

            acc[brand] = {

              name:
                brand,

              value:
                0,

            };

          }


          acc[brand].value++;


          return acc;

        },
        {} as Record<
          string,
          {
            name: string;
            value: number;
          }
        >
      )
    );


  // ============================================================
  // PERMISSION
  // ============================================================

  const canManage =
    user.role !==
    UserRole.STAFF;


  // ============================================================
  // RETURN
  // ============================================================

  return (

    <main className="space-y-5 sm:space-y-8">


      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <PageHeader
        title="Dashboard"
        description="Monitor your store performance and business overview."
      />


      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <DashboardHero
        companyName={
          settings?.companyName
        }
      />


      {/* ====================================================== */}
      {/* STATISTICS */}
      {/* ====================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:gap-4
          md:grid-cols-2
          md:gap-5
          xl:grid-cols-4
          2xl:grid-cols-6
        "
      >

        <StatCard
          title="Products"
          value={
            products
          }
          icon="📦"
        />


        <StatCard
          title="Categories"
          value={
            categories
          }
          icon="📂"
        />


        <StatCard
          title="Brands"
          value={
            brands
          }
          icon="🏷️"
        />


        <StatCard
          title="Wishlist"
          value={
            wishlist
          }
          icon="❤️"
        />


        <StatCard
          title="Inquiries"
          value={
            inquiries
          }
          icon="📩"
        />


        <StatCard
          title="Featured"
          value={
            featuredProducts
          }
          icon="⭐"
        />


        <StatCard
          title="New Arrival"
          value={
            newArrivalProducts
          }
          icon="🆕"
        />


        <StatCard
          title="Best Seller"
          value={
            bestSellerProducts
          }
          icon="🔥"
        />


        <StatCard
          title="Pending"
          value={
            pendingInquiries
          }
          icon="🟡"
        />


        <StatCard
          title="Contacted"
          value={
            contactedInquiries
          }
          icon="🔵"
        />


        <StatCard
          title="Completed"
          value={
            completedInquiries
          }
          icon="🟢"
        />


        <StatCard
          title="Cancelled"
          value={
            cancelledInquiries
          }
          icon="🔴"
        />

      </div>


      {/* ====================================================== */}
      {/* BUSINESS ANALYTICS */}
      {/* ====================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <BusinessStatCard
          title="Inventory Value"
          value={`RM ${summary.totalCostMyr.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          icon="📦"
        />


        <BusinessStatCard
          title="Potential Revenue"
          value={`RM ${summary.totalRevenue.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          icon="💰"
        />


        <BusinessStatCard
          title="Estimated Profit"
          value={`RM ${summary.totalProfit.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          icon="📈"
          color={
            summary.totalProfit >= 0
              ? "text-green-600"
              : "text-red-600"
          }
        />


        <BusinessStatCard
          title="Average Margin"
          value={`${summary.margin.toFixed(1)}%`}
          icon="🎯"
          color={
            summary.margin >= 30
              ? "text-green-600"
              : summary.margin >= 15
                ? "text-yellow-600"
                : "text-red-600"
          }
        />

      </div>


      {/* ====================================================== */}
      {/* ACTUAL SALES */}
      {/* ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-4
          shadow-sm

          sm:rounded-3xl
          sm:p-6

          lg:p-8
        "
      >

        {/* ==================================================== */}
        {/* HEADER */}
        {/* ==================================================== */}

        <div
          className="
            flex
            flex-col
            gap-6
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
              Sales Analytics
            </p>


            <h2
              className="
                mt-2
                text-2xl
                font-light
                text-neutral-900
              "
            >
              Actual Sales
            </h2>


            <p
              className="
                mt-2
                text-sm
                text-neutral-500
              "
            >
              Sales generated from successful orders.
            </p>

          </div>


          {/* ================================================== */}
          {/* PERIOD FILTER */}
          {/* ================================================== */}

<SalesAnalytics
  value={
    salesPeriod
  }
/>

        </div>


        {/* ==================================================== */}
        {/* SALES CARDS */}
        {/* ==================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
            sm:gap-4
            md:grid-cols-2
            xl:grid-cols-6
          "
        >

          <BusinessStatCard
            title="Total Sales"
            value={`RM ${actualTotalSales.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`}
            icon="💰"
          />


          <BusinessStatCard
            title="Shipping Collected"
            value={`RM ${actualShippingCollected.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`}
            icon="🚚"
          />


          <BusinessStatCard
            title="Total Cost"
            value={`RM ${actualTotalCost.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`}
            icon="📦"
          />


          <BusinessStatCard
            title="Actual Profit"
            value={`RM ${actualProfit.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`}
            icon="📈"
            color={
              actualProfit >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          />


          <BusinessStatCard
            title="Actual Margin"
            value={`${actualMargin.toFixed(1)}%`}
            icon="🎯"
            color={
              actualMargin >= 30
                ? "text-green-600"
                : actualMargin >= 15
                  ? "text-yellow-600"
                  : "text-red-600"
            }
          />


          <BusinessStatCard
            title="Units Sold"
            value={
              actualUnitsSold.toLocaleString()
            }
            icon="🛍️"
          />

        </div>

      </section>


      {/* ====================================================== */}
      {/* PRODUCT SALES */}
      {/* ====================================================== */}

      <ProductSalesAnalytics
        products={
          productSalesData
        }
      />


      {/* ====================================================== */}
      {/* WEBSITE ANALYTICS */}
      {/* ====================================================== */}

      <WebsiteAnalytics />


      {/* ====================================================== */}
      {/* EXISTING DASHBOARD CONTENT */}
      {/* ====================================================== */}

      <div
        className="
          grid
          gap-5
          lg:grid-cols-3
        "
      >

        <div
          className="
            space-y-6
            lg:col-span-2
          "
        >

          <InventoryChart
            title="Products by Category"
            data={
              categoryData
            }
          />


          <InventoryChart
            title="Products by Brand"
            data={
              brandData
            }
          />


          <RecentProducts />


          <RecentInquiries />

        </div>


        <div
          className="
            space-y-6
          "
        >

          {canManage && (

            <Card>

              <CardHeader>

                <CardTitle>
                  Quick Actions
                </CardTitle>

              </CardHeader>


              <CardContent
                className="space-y-3"
              >

                <Link
                  href="/admin/dashboard/products/new"
                >

                  <Button
                    className="
                      w-full
                      justify-start
                    "
                  >
                    ➕ Add Product
                  </Button>

                </Link>


                <Link
                  href="/admin/dashboard/categories/new"
                >

                  <Button
                    variant="secondary"
                    className="
                      w-full
                      justify-start
                    "
                  >
                    ➕ Add Category
                  </Button>

                </Link>


                <Link
                  href="/admin/dashboard/brands/new"
                >

                  <Button
                    variant="secondary"
                    className="
                      w-full
                      justify-start
                    "
                  >
                    ➕ Add Brand
                  </Button>

                </Link>

              </CardContent>

            </Card>

          )}


          <TopBrands />


          <InventoryAlerts />

        </div>

      </div>

    </main>

  );

}