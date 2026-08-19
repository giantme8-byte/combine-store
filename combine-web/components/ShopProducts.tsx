import { prisma } from "@/lib/prisma";

import ShopClient from "./ShopClient";

const PAGE_SIZE = 24;

const MALAYSIA_OFFSET_MS =
  8 * 60 * 60 * 1000;

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
 *
 * Recommended is handled separately.
 *
 * Recommended means:
 *
 * - Daily deterministic random order
 * - Same order throughout the same Malaysia day
 * - Pagination remains stable
 *
 * Other sorting modes continue using Prisma orderBy.
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

    case "Recommended":
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
 * Malaysia Date Key
 * =========================================================
 *
 * Returns:
 *
 * YYYY-MM-DD
 *
 * based on Asia/Kuala_Lumpur.
 *
 * Example:
 *
 * 2026-08-19
 *
 * The date key is used as the daily random seed.
 * =========================================================
 */

function getMalaysiaDateKey(
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

/*
 * =========================================================
 * Deterministic Hash
 * =========================================================
 *
 * Produces a stable unsigned integer from a string.
 *
 * The same input always produces the same output.
 *
 * This allows us to create a "random-looking"
 * product order without Math.random().
 * =========================================================
 */

function hashString(
  value: string
) {
  let hash = 2166136261;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^= value.charCodeAt(
      index
    );

    hash =
      Math.imul(
        hash,
        16777619
      );
  }

  hash +=
    hash << 13;

  hash ^=
    hash >>> 7;

  hash +=
    hash << 3;

  hash ^=
    hash >>> 17;

  hash +=
    hash << 5;

  return (
    hash >>> 0
  );
}

/*
 * =========================================================
 * Daily Deterministic Shuffle
 * =========================================================
 *
 * IMPORTANT:
 *
 * We do NOT use Math.random().
 *
 * Every product receives a stable random score based on:
 *
 * daily seed + product ID
 *
 * Therefore:
 *
 * Same day:
 *   Product A → same position
 *   Product B → same position
 *
 * Next day:
 *   New seed
 *   New order
 *
 * This guarantees pagination stability.
 * =========================================================
 */

function shuffleProductsDaily<
  T extends {
    id: number;
  }
>(
  items: T[],
  dateKey: string
): T[] {
  const seed =
    `combine-recommended-${dateKey}`;

  return [...items].sort(
    (a, b) => {
      const scoreA =
        hashString(
          `${seed}-${a.id}`
        );

      const scoreB =
        hashString(
          `${seed}-${b.id}`
        );

      if (
        scoreA !==
        scoreB
      ) {
        return (
          scoreA -
          scoreB
        );
      }

      /*
       * Extremely unlikely hash collision
       * fallback.
       */

      return a.id - b.id;
    }
  );
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

  /*
   * =======================================================
   * Recommended Mode
   * =======================================================
   *
   * IMPORTANT:
   *
   * No sort parameter means Recommended.
   *
   * "Recommended" is also explicitly supported.
   *
   * Therefore:
   *
   * /shop
   *
   * and:
   *
   * /shop?sort=Recommended
   *
   * both use daily random ordering.
   * =======================================================
   */

  const isRecommended =
    !sort ||
    sort === "Recommended";

  /*
   * =======================================================
   * Normal Database Ordering
   * =======================================================
   */

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
   * Daily Random Seed
   * =======================================================
   */

  const todayKey =
    getMalaysiaDateKey(
      new Date()
    );

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
     */

    productCategoryRecords,

    /*
     * Product Sub-Category Relations
     */

    productSubCategoryRecords,
  ] = await Promise.all([
    /*
     * =====================================================
     * Current Page Products
     * =====================================================
     *
     * Recommended:
     *
     * 1. Fetch ALL matching products
     * 2. Apply deterministic daily shuffle
     * 3. Slice current page
     *
     * This is necessary because normal database
     * pagination cannot preserve a custom daily
     * random order by itself.
     *
     * Normal sorting:
     *
     * Use Prisma database pagination.
     * =====================================================
     */

    isRecommended
      ? prisma.product
          .findMany({
            where,

            select:
              productSelect,
          })
          .then(
            (
              allProducts
            ) => {
              const shuffled =
                shuffleProductsDaily(
                  allProducts,
                  todayKey
                );

              return shuffled.slice(
                skip,
                skip + PAGE_SIZE
              );
            }
          )
      : prisma.product.findMany({
          where,

          orderBy,

          skip,

          take:
            PAGE_SIZE,

          select:
            productSelect,
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

      distinct: [
        "brand",
      ],

      orderBy: {
        brand: "asc",
      },
    }),

    /*
     * =====================================================
     * Category Options
     *
     * Only active Categories are loaded.
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
          sortOrder:
            "asc",
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
          createdAt:
            "desc",
        },

        {
          id: "desc",
        },
      ],

      take: 12,

      select:
        productSelect,
    }),

    /*
     * =====================================================
     * Existing Product Categories
     *
     * Only Categories that are actually connected
     * to Products should appear on Shop.
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
     * Only Sub-Categories that are actually connected
     * to Products should appear on Shop.
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

  for (
    const product of
      productCategoryRecords
  ) {
    if (
      product.categoryRecord
    ) {
      existingCategoryIds.add(
        product
          .categoryRecord
          .id
      );

      existingCategoryNames.add(
        product
          .categoryRecord
          .name
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

  for (
    const product of
      productSubCategoryRecords
  ) {
    if (
      product.subCategoryRecord
    ) {
      existingSubCategoryIds.add(
        product
          .subCategoryRecord
          .id
      );

      existingSubCategoryNames.add(
        product
          .subCategoryRecord
          .name
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
      product.slug ??
      "",

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
      product.images[0]
        ?.url ??
      "/placeholder.png",

    secondImage:
      product.images[1]
        ?.url,

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
   * Every Brand comes from an actual Product.
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
   * Only Categories that:
   *
   * 1. Are active
   * 2. Have at least one Product
   * =========================================================
   */

  const categoryOptions = [
    "All",

    ...categories
      .filter(
        (
          categoryItem
        ) =>
          existingCategoryIds.has(
            categoryItem.id
          ) &&
          existingCategoryNames.has(
            categoryItem.name
          )
      )
      .map(
        (
          categoryItem
        ) =>
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
   * Only Sub-Categories that:
   *
   * 1. Are active
   * 2. Belong to selected Category when selected
   * 3. Have at least one Product
   * 4. Follow Admin sortOrder
   * =========================================================
   */

  const subCategoryOptions = [
    "All",

    ...subCategories
      .filter(
        (
          subCategoryItem
        ) =>
          existingSubCategoryIds.has(
            subCategoryItem.id
          ) &&
          existingSubCategoryNames.has(
            subCategoryItem.name
          )
      )
      .map(
        (
          subCategoryItem
        ) =>
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