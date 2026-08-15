import { prisma } from "@/lib/prisma";

import ShopClient from "./ShopClient";

const PAGE_SIZE = 24;

type ShopProductsProps = {
  brand?: string;
  category?: string;
  subCategory?: string[];
  /*
   * Kept for compatibility with any existing
   * page-level props.
   *
   * Color is no longer used by the Shop filter.
   */
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
  search,
}: {
  brand?: string;
  category?: string;
  subCategory?: string[];
  search?: string;
}) {
  const keyword =
    search?.trim().slice(0, 100) ?? "";

  return {
    /*
     * =====================================================
     * Brand
     * =====================================================
     */

    ...(brand &&
    brand !== "All"
      ? {
          brand,
        }
      : {}),

    /*
     * =====================================================
     * Category Relation
     * =====================================================
     */

    ...(category &&
    category !== "All"
      ? {
          categoryRecord: {
            is: {
              name: category,
            },
          },
        }
      : {}),

    /*
     * =====================================================
     * Multiple Sub Categories
     * =====================================================
     */

    ...(subCategory &&
    subCategory.length > 0
      ? {
          subCategoryRecord: {
            is: {
              name: {
                in: subCategory,
              },
            },
          },
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

            {
              categoryRecord: {
                is: {
                  name: {
                    contains: keyword,
                  },
                },
              },
            },

            {
              subCategoryRecord: {
                is: {
                  name: {
                    contains: keyword,
                  },
                },
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
    featuredProducts,

    /*
     * Product Category Relations
     *
     * Used only to determine which
     * categories actually have products.
     */
    productCategoryRecords,

    /*
     * Product Sub-Category Relations
     *
     * Used only to determine which
     * sub-categories actually have products.
     */
    productSubCategoryRecords,
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
     *
     * Brands are automatically based on
     * actual products.
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
     * Only active Categories are loaded.
     *
     * Product existence is checked separately
     * below using Product.categoryRecord.
     * =====================================================
     */

    prisma.category.findMany({
      where: {
        active: true,
      },

      select: {
        id: true,
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
     * Only active Sub-Categories are loaded.
     *
     * They are filtered by selected Category
     * and sorted by Admin sortOrder.
     * =====================================================
     */

    prisma.subCategory.findMany({
      where: {
        active: true,

        ...(category &&
        category !== "All"
          ? {
              category: {
                is: {
                  name: category,
                },
              },
            }
          : {}),
      },

      select: {
        id: true,
        name: true,
        sortOrder: true,
        categoryId: true,
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

    /*
     * =====================================================
     * Existing Product Categories
     *
     * This query gives us the actual Categories
     * currently connected to Products.
     *
     * Therefore an empty Category will never
     * appear on the customer-facing Shop.
     * =====================================================
     */

    prisma.product.findMany({
      where: {
        categoryRecord: {
          isNot: null,
        },
      },

      select: {
        categoryRecord: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),

    /*
     * =====================================================
     * Existing Product Sub-Categories
     *
     * This query gives us the actual Sub-Categories
     * currently connected to Products.
     *
     * Therefore an empty Sub-Category will never
     * appear on the customer-facing Shop.
     * =====================================================
     */

    prisma.product.findMany({
      where: {
        subCategoryRecord: {
          isNot: null,
        },
      },

      select: {
        subCategoryRecord: {
          select: {
            id: true,
            name: true,
            categoryId: true,
          },
        },
      },
    }),
  ]);

  /*
   * =========================================================
   * Build Existing Category Set
   * =========================================================
   */

  const existingCategoryIds =
    new Set<number>();

  const existingCategoryNames =
    new Set<string>();

  for (const product of
    productCategoryRecords) {
    if (
      product.categoryRecord
    ) {
      existingCategoryIds.add(
        product.categoryRecord.id
      );

      existingCategoryNames.add(
        product.categoryRecord.name
      );
    }
  }

  /*
   * =========================================================
   * Build Existing Sub-Category Set
   * =========================================================
   */

  const existingSubCategoryIds =
    new Set<number>();

  const existingSubCategoryNames =
    new Set<string>();

  for (const product of
    productSubCategoryRecords) {
    if (
      product.subCategoryRecord
    ) {
      existingSubCategoryIds.add(
        product.subCategoryRecord.id
      );

      existingSubCategoryNames.add(
        product.subCategoryRecord.name
      );
    }
  }

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
   * Brand Options
   *
   * These already come from Product,
   * so every listed Brand has at least
   * one Product.
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
   *
   * IMPORTANT:
   *
   * Only Categories that:
   *
   * 1. Are active
   * 2. Have at least one Product
   *
   * will appear.
   * =========================================================
   */

  const categoryOptions = [
    "All",

    ...categories
      .filter(
        (categoryItem) =>
          existingCategoryIds.has(
            categoryItem.id
          ) &&
          existingCategoryNames.has(
            categoryItem.name
          )
      )
      .map(
        (categoryItem) =>
          categoryItem.name
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
   * IMPORTANT:
   *
   * Only Sub-Categories that:
   *
   * 1. Are active
   * 2. Belong to the selected Category
   *    when a Category is selected
   * 3. Have at least one Product
   * 4. Follow Admin sortOrder
   *
   * will appear.
   * =========================================================
   */

  const subCategoryOptions = [
    "All",

    ...subCategories
      .filter(
        (subCategoryItem) =>
          existingSubCategoryIds.has(
            subCategoryItem.id
          ) &&
          existingSubCategoryNames.has(
            subCategoryItem.name
          )
      )
      .map(
        (subCategoryItem) =>
          subCategoryItem.name
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
      }}
    />
  );
}