import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalize(
  value: string | null | undefined
) {
  return (
    value
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      ?? ""
  );
}

async function main() {
  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    " Product Category Relation Migration"
  );
  console.log(
    "=============================================="
  );
  console.log("");

  /*
   * =========================================================
   * LOAD DATA
   * =========================================================
   */

  const products =
    await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        subCategory: true,
        categoryId: true,
        subCategoryId: true,
      },
      orderBy: {
        id: "asc",
      },
    });

  const categories =
    await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

  const existingSubCategories =
    await prisma.subCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
      },
    });

  console.log(
    `Products found: ${products.length}`
  );

  console.log(
    `Categories found: ${categories.length}`
  );

  console.log(
    `Existing Sub-categories: ${existingSubCategories.length}`
  );

  console.log("");

  /*
   * =========================================================
   * CATEGORY LOOKUP
   * =========================================================
   */

  const categoryMap =
    new Map<
      string,
      (typeof categories)[number]
    >();

  for (const category of categories) {
    categoryMap.set(
      normalize(category.name),
      category
    );
  }

  /*
   * =========================================================
   * DISCOVER SUB-CATEGORIES
   * =========================================================
   *
   * Read the existing Product.subCategory values.
   *
   * We do NOT modify Product data here.
   */

  const discoveredSubCategories =
    new Map<
      string,
      {
        name: string;
        categoryId: number;
      }
    >();

  let productsWithoutCategory = 0;
  let productsWithoutSubCategory = 0;

  for (const product of products) {
    const category =
      categoryMap.get(
        normalize(product.category)
      );

    if (!category) {
      productsWithoutCategory++;

      continue;
    }

    if (
      !product.subCategory ||
      !product.subCategory.trim()
    ) {
      productsWithoutSubCategory++;

      continue;
    }

    const subCategoryName =
      product.subCategory.trim();

    const key =
      `${category.id}:${normalize(
        subCategoryName
      )}`;

    if (
      !discoveredSubCategories.has(key)
    ) {
      discoveredSubCategories.set(
        key,
        {
          name: subCategoryName,
          categoryId: category.id,
        }
      );
    }
  }

  console.log(
    `Unique Sub-categories discovered: ${discoveredSubCategories.size}`
  );

  console.log("");

  /*
   * =========================================================
   * VALIDATION
   * =========================================================
   */

  if (
    productsWithoutCategory > 0
  ) {
    console.log(
      `WARNING: ${productsWithoutCategory} products have no matching Category.`
    );
  }

  if (
    productsWithoutSubCategory > 0
  ) {
    console.log(
      `INFO: ${productsWithoutSubCategory} products have no Sub-category.`
    );
  }

  /*
   * =========================================================
   * EXISTING SUB-CATEGORY MAP
   * =========================================================
   */

  const subCategoryMap =
    new Map<
      string,
      (typeof existingSubCategories)[number]
    >();

  for (
    const subCategory of
      existingSubCategories
  ) {
    if (
      !subCategory.categoryId
    ) {
      continue;
    }

    const key =
      `${subCategory.categoryId}:${normalize(
        subCategory.name
      )}`;

    subCategoryMap.set(
      key,
      subCategory
    );
  }

  /*
   * =========================================================
   * DETERMINE NEW SUB-CATEGORIES
   * =========================================================
   */

  const newSubCategories: {
    name: string;
    slug: string;
    categoryId: number;
    sortOrder: number;
  }[] = [];

  for (
    const [
      key,
      discovered,
    ] of discoveredSubCategories
  ) {
    if (
      subCategoryMap.has(key)
    ) {
      continue;
    }

    /*
     * Generate a slug.
     *
     * Example:
     * Shoulder Bags
     * →
     * shoulder-bags
     */

    const baseSlug =
      discovered.name
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    /*
     * We include the Category ID in the lookup,
     * but keep the normal slug if available.
     */

    let slug =
      baseSlug;

    const slugExists =
      existingSubCategories.some(
        (item) =>
          item.slug === slug
      );

    if (slugExists) {
      slug =
        `${baseSlug}-${discovered.categoryId}`;
    }

    newSubCategories.push({
      name: discovered.name,
      slug,
      categoryId:
        discovered.categoryId,
      sortOrder: 9999,
    });
  }

  /*
   * =========================================================
   * PREVIEW
   * =========================================================
   */

  console.log(
    "----------------------------------------------"
  );

  console.log(
    `Existing Sub-categories: ${existingSubCategories.length}`
  );

  console.log(
    `New Sub-categories to create: ${newSubCategories.length}`
  );

  console.log(
    "----------------------------------------------"
  );

  if (
    newSubCategories.length > 0
  ) {
    console.log("");

    console.log(
      "NEW SUB-CATEGORIES:"
    );

    for (
      const subCategory of
        newSubCategories
    ) {
      const category =
        categories.find(
          (item) =>
            item.id ===
            subCategory.categoryId
        );

      console.log(
        `- ${category?.name ?? "Unknown"} → ${subCategory.name}`
      );
    }
  }

  /*
   * =========================================================
   * TRANSACTION
   * =========================================================
   *
   * Everything below happens inside one transaction.
   */

  await prisma.$transaction(
    async (tx) => {
      /*
       * -------------------------------------------------------
       * CREATE MISSING SUB-CATEGORIES
       * -------------------------------------------------------
       */

      for (
        const subCategory of
          newSubCategories
      ) {
        const created =
          await tx.subCategory.create({
            data: {
              name:
                subCategory.name,

              slug:
                subCategory.slug,

              categoryId:
                subCategory.categoryId,

              active: true,

              sortOrder:
                subCategory.sortOrder,
            },
          });

        const key =
          `${created.categoryId}:${normalize(
            created.name
          )}`;

        subCategoryMap.set(
          key,
          created
        );
      }

      /*
       * -------------------------------------------------------
       * REFRESH CATEGORY RELATIONS
       * -------------------------------------------------------
       */

      const freshCategories =
        await tx.category.findMany({
          select: {
            id: true,
            name: true,
          },
        });

      const freshCategoryMap =
        new Map<
          string,
          (typeof freshCategories)[number]
        >();

      for (
        const category of
          freshCategories
      ) {
        freshCategoryMap.set(
          normalize(category.name),
          category
        );
      }

      /*
       * -------------------------------------------------------
       * UPDATE PRODUCTS
       * -------------------------------------------------------
       */

      let updatedProducts = 0;

      for (
        const product of products
      ) {
        /*
         * Skip products that already have
         * a category relation.
         */

        if (
          product.categoryId !== null
        ) {
          continue;
        }

        const category =
          freshCategoryMap.get(
            normalize(
              product.category
            )
          );

        if (!category) {
          continue;
        }

        let subCategoryId:
          number | null = null;

        if (
          product.subCategory &&
          product.subCategory.trim()
        ) {
          const key =
            `${category.id}:${normalize(
              product.subCategory
            )}`;

          const subCategory =
            subCategoryMap.get(
              key
            );

          if (subCategory) {
            subCategoryId =
              subCategory.id;
          }
        }

        await tx.product.update({
          where: {
            id: product.id,
          },

          data: {
            categoryId:
              category.id,

            subCategoryId,
          },
        });

        updatedProducts++;
      }

      console.log("");

      console.log(
        `Products updated: ${updatedProducts}`
      );
    },
    {
      maxWait: 10000,
      timeout: 120000,
    }
  );

  /*
   * =========================================================
   * FINAL VERIFICATION
   * =========================================================
   */

  const finalProductCount =
    await prisma.product.count({
      where: {
        categoryId: {
          not: null,
        },
      },
    });

  const finalSubCategoryCount =
    await prisma.subCategory.count();

  const productsWithSubCategory =
    await prisma.product.count({
      where: {
        subCategoryId: {
          not: null,
        },
      },
    });

  console.log("");

  console.log(
    "=============================================="
  );

  console.log(
    "Migration completed successfully."
  );

  console.log(
    `Products linked to Category: ${finalProductCount}`
  );

  console.log(
    `Products linked to Sub-category: ${productsWithSubCategory}`
  );

  console.log(
    `Total Sub-categories: ${finalSubCategoryCount}`
  );

  console.log(
    "Existing category/subCategory text fields were preserved."
  );

  console.log(
    "=============================================="
  );

  console.log("");
}

main()
  .catch((error) => {
    console.error("");
    console.error(
      "Migration failed:"
    );
    console.error(error);

    process.exit(1);
  })
  .finally(
    async () => {
      await prisma.$disconnect();
    }
  );