import { prisma } from "@/lib/prisma";

import ShopClient from "./ShopClient";

const PAGE_SIZE = 24;

type ShopProductsProps = {
  brand?: string;
  category?: string;
  subCategory?: string[];
  color?: string;
  search?: string;
  sort?: string;
  page?: string;
};

/*
 * =========================================================
 * Build Product Where
 * =========================================================
 */

function buildWhere({
  brand,
  category,
  subCategory,
  color,
  search,
}: {
  brand?: string;
  category?: string;
  subCategory?: string[];
  color?: string;
  search?: string;
}) {
  const keyword =
    search?.trim().slice(0, 100) ?? "";

  return {
    ...(brand &&
    brand !== "All"
      ? {
          brand,
        }
      : {}),

    ...(category &&
    category !== "All"
      ? {
          category,
        }
      : {}),

    /*
     * =====================================================
     * Multiple Sub Categories
     *
     * Example:
     *
     * ["Shoulder Bags", "Crossbody Bags"]
     *
     * becomes:
     *
     * subCategory IN (
     *   "Shoulder Bags",
     *   "Crossbody Bags"
     * )
     * =====================================================
     */

    ...(subCategory &&
    subCategory.length > 0
      ? {
          subCategory: {
            in: subCategory,
          },
        }
      : {}),

    ...(color &&
    color !== "All"
      ? {
          mainColor: color,
        }
      : {}),

    /*
     * =====================================================
     * Search
     * =====================================================
     */

    ...(keyword
      ? {
          OR: [
            {
              brand: {
                contains: keyword,
              },
            },

            {
              name: {
                contains: keyword,
              },
            },

            {
              model: {
                contains: keyword,
              },
            },

            {
              sku: {
                contains: keyword,
              },
            },

            {
              category: {
                contains: keyword,
              },
            },

            {
              subCategory: {
                contains: keyword,
              },
            },

            {
              mainColor: {
                contains: keyword,
              },
            },
          ],
        }
      : {}),
  };
}

/*
 * =========================================================
 * Product Ordering
 * =========================================================
 */

function getOrderBy(sort?: string) {
  switch (sort) {
    case "Price Low":
      return [
        {
          price: "asc" as const,
        },
        {
          id: "asc" as const,
        },
      ];

    case "Price High":
      return [
        {
          price: "desc" as const,
        },
        {
          id: "asc" as const,
        },
      ];

    case "Brand":
      return [
        {
          brand: "asc" as const,
        },
        {
          name: "asc" as const,
        },
        {
          id: "asc" as const,
        },
      ];

    case "Newest":
    default:
      return [
        {
          featured: "desc" as const,
        },
        {
          displayOrder: "asc" as const,
        },
        {
          createdAt: "desc" as const,
        },
        {
          id: "desc" as const,
        },
      ];
  }
}

/*
 * =========================================================
 * Product Select
 * =========================================================
 */

const productSelect = {
  id: true,

  slug: true,

  brand: true,

  name: true,

  model: true,

  sku: true,

  price: true,

  displayOrder: true,

  category: true,

  subCategory: true,

  mainColor: true,

  createdAt: true,

  featured: true,

  newArrival: true,

  bestSeller: true,

  limited: true,

  onSale: true,

  images: {
    select: {
      url: true,
    },

    orderBy: {
      sortOrder: "asc" as const,
    },

    /*
     * ProductCard only needs:
     *
     * 1. Main image
     * 2. Hover image
     */

    take: 2,
  },
};

/*
 * =========================================================
 * Shop Products
 * =========================================================
 */

export default async function ShopProducts({
  brand,
  category,
  subCategory,
  color,
  search,
  sort,
  page,
}: ShopProductsProps) {
  /*
   * =======================================================
   * Build Query
   * =======================================================
   */

  const where = buildWhere({
    brand,
    category,
    subCategory,
    color,
    search,
  });

  const orderBy =
    getOrderBy(sort);

  /*
   * =======================================================
   * Parse Requested Page
   * =======================================================
   */

  const requestedPage =
    Number(page ?? "1");

  const parsedPage =
    Number.isFinite(
      requestedPage
    ) &&
    requestedPage >= 1
      ? Math.floor(
          requestedPage
        )
      : 1;

  /*
   * =======================================================
   * Fetch Total
   * =======================================================
   */

  const total =
    await prisma.product.count({
      where,
    });

  /*
   * =======================================================
   * Calculate Pages
   * =======================================================
   */

  const totalPages =
    Math.ceil(
      total / PAGE_SIZE
    );

  /*
   * =======================================================
   * Safe Current Page
   * =======================================================
   */

  const safeCurrentPage =
    totalPages > 0
      ? Math.min(
          parsedPage,
          totalPages
        )
      : 1;

  /*
   * =======================================================
   * Pagination Offset
   * =======================================================
   */

  const skip =
    (safeCurrentPage - 1) *
    PAGE_SIZE;

  /*
   * =======================================================
   * Database Queries
   * =======================================================
   */

  const [
    products,
    brands,
    categories,
    subCategories,
    colors,
    featuredProducts,
  ] = await Promise.all([
    /*
     * =====================================================
     * Current Page Products
     * =====================================================
     */

    prisma.product.findMany({
      where,

      orderBy,

      skip,

      take: PAGE_SIZE,

      select: productSelect,
    }),

    /*
     * =====================================================
     * Brand Options
     * =====================================================
     */

    prisma.product.findMany({
      select: {
        brand: true,
      },

      distinct: ["brand"],

      orderBy: {
        brand: "asc",
      },
    }),

    /*
     * =====================================================
     * Category Options
     *
     * Categories come directly from
     * the Admin Dashboard Category table.
     *
     * Only active categories are shown.
     * =====================================================
     */

    prisma.category.findMany({
      where: {
        active: true,
      },

      select: {
        name: true,
      },

      orderBy: {
        name: "asc",
      },
    }),

    /*
     * =====================================================
     * Sub Category Options
     *
     * IMPORTANT:
     *
     * These now come from the dedicated
     * SubCategory table.
     *
     * They are NOT hard-coded.
     *
     * Therefore:
     *
     * Admin Dashboard
     *      ↓
     * SubCategory table
     *      ↓
     * Public Shop
     * =====================================================
     */

    prisma.subCategory.findMany({
      where: {
        active: true,
      },

      select: {
        name: true,
        sortOrder: true,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    }),

    /*
     * =====================================================
     * Color Options
     * =====================================================
     */

    prisma.product.findMany({
      where: {
        mainColor: {
          not: null,
        },
      },

      select: {
        mainColor: true,
      },

      distinct: ["mainColor"],

      orderBy: {
        mainColor: "asc",
      },
    }),

    /*
     * =====================================================
     * Featured Products
     * =====================================================
     */

    prisma.product.findMany({
      where: {
        featured: true,
      },

      orderBy: [
        {
          createdAt: "desc",
        },

        {
          id: "desc",
        },
      ],

      take: 12,

      select: productSelect,
    }),
  ]);

  /*
   * =========================================================
   * Format Product
   * =========================================================
   */

  const formatProduct = (
    product:
      | (typeof products)[number]
      | (typeof featuredProducts)[number]
  ) => ({
    id: product.id,

    slug:
      product.slug ?? "",

    brand:
      product.brand,

    name:
      product.name,

    model:
      product.model,

    sku:
      product.sku,

    price:
      product.price,

    displayOrder:
      product.displayOrder,

    image:
      product.images[0]?.url ??
      "/placeholder.png",

    secondImage:
      product.images[1]?.url,

    category:
      product.category,

    subCategory:
      product.subCategory,

    mainColor:
      product.mainColor,

    createdAt:
      product.createdAt,

    featured:
      product.featured,

    newArrival:
      product.newArrival,

    bestSeller:
      product.bestSeller,

    limited:
      product.limited,

    onSale:
      product.onSale,
  });

  /*
   * =========================================================
   * Format Results
   * =========================================================
   */

  const formattedProducts =
    products.map(
      formatProduct
    );

  const formattedFeaturedProducts =
    featuredProducts.map(
      formatProduct
    );

  /*
   * =========================================================
   * Filter Options
   * =========================================================
   */

  const brandOptions = [
    "All",

    ...brands
      .map(
        (item) =>
          item.brand
      )
      .filter(
        (
          value
        ): value is string =>
          Boolean(value)
      ),
  ];

  /*
   * =========================================================
   * Category Options
   * =========================================================
   */

  const categoryOptions = [
    "All",

    ...categories
      .map(
        (item) =>
          item.name
      )
      .filter(
        (
          value
        ): value is string =>
          Boolean(value)
      ),
  ];

  /*
   * =========================================================
   * Sub Category Options
   *
   * These names come directly from
   * the SubCategory database table.
   * =========================================================
   */

  const subCategoryOptions = [
    "All",

    ...subCategories
      .map(
        (item) =>
          item.name
      )
      .filter(
        (
          value
        ): value is string =>
          Boolean(value)
      ),
  ];

  /*
   * =========================================================
   * Color Options
   * =========================================================
   */

  const colorOptions = [
    "All",

    ...colors
      .map(
        (item) =>
          item.mainColor
      )
      .filter(
        (
          value
        ): value is string =>
          value !== null
      ),
  ];

  /*
   * =========================================================
   * Render
   * =========================================================
   */

  return (
    <ShopClient
      products={
        formattedProducts
      }

      featuredProducts={
        formattedFeaturedProducts
      }

      total={
        total
      }

      pageSize={
        PAGE_SIZE
      }

      currentPage={
        safeCurrentPage
      }

      totalPages={
        totalPages
      }

      filterOptions={{
        categories:
          categoryOptions,

        brands:
          brandOptions,

        subCategories:
          subCategoryOptions,

        colors:
          colorOptions,
      }}
    />
  );
}