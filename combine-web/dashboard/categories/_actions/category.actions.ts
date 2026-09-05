"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

/*
 * =========================================================
 * CATEGORY
 * =========================================================
 */

function getCategoryData(
  formData: FormData
) {
  const name =
    formData
      .get("name")
      ?.toString()
      .trim() ?? "";

  const slug =
    formData
      .get("slug")
      ?.toString()
      .trim() ?? "";

  const active =
    formData.get("active") === "on";

  if (!name || !slug) {
    throw new Error(
      "Category name and slug are required."
    );
  }

  return {
    name,
    slug,
    active,
  };
}

export async function createCategory(
  formData: FormData
) {
  const data =
    getCategoryData(formData);

  const existingCategory =
    await prisma.category.findFirst({
      where: {
        OR: [
          {
            name: data.name,
          },
          {
            slug: data.slug,
          },
        ],
      },
    });

  if (existingCategory) {
    throw new Error(
      "A category with the same name or slug already exists."
    );
  }

  await prisma.category.create({
    data,
  });

  redirect(
    "/admin/dashboard/categories"
  );
}

export async function updateCategory(
  id: number,
  formData: FormData
) {
  const data =
    getCategoryData(formData);

  const existingCategory =
    await prisma.category.findFirst({
      where: {
        id: {
          not: id,
        },

        OR: [
          {
            name: data.name,
          },
          {
            slug: data.slug,
          },
        ],
      },
    });

  if (existingCategory) {
    throw new Error(
      "A category with the same name or slug already exists."
    );
  }

  await prisma.category.update({
    where: {
      id,
    },

    data,
  });

  redirect(
    "/admin/dashboard/categories"
  );
}

export async function deleteCategory(
  id: number
) {
  await prisma.category.delete({
    where: {
      id,
    },
  });

  redirect(
    "/admin/dashboard/categories"
  );
}


/*
 * =========================================================
 * SUB-CATEGORY
 * =========================================================
 */

function getSubCategoryData(
  formData: FormData
) {
  const name =
    formData
      .get("name")
      ?.toString()
      .trim() ?? "";

  const slug =
    formData
      .get("slug")
      ?.toString()
      .trim() ?? "";

  const categoryIdValue =
    formData
      .get("categoryId")
      ?.toString()
      .trim() ?? "";

  const sortOrderValue =
    formData
      .get("sortOrder")
      ?.toString()
      .trim() ?? "";

  const active =
    formData.get("active") === "on";

  const categoryId =
    Number(categoryIdValue);

  /*
   * If no sort order is provided,
   * use the Prisma default value.
   */

  const sortOrder =
    sortOrderValue === ""
      ? 9999
      : Number(sortOrderValue);

  if (!name || !slug) {
    throw new Error(
      "Sub-category name and slug are required."
    );
  }

  if (
    !categoryIdValue ||
    !Number.isInteger(categoryId) ||
    categoryId <= 0
  ) {
    throw new Error(
      "A valid category is required."
    );
  }

  if (
    !Number.isInteger(sortOrder) ||
    sortOrder < 0
  ) {
    throw new Error(
      "Sort order must be a whole number greater than or equal to 0."
    );
  }

  return {
    name,
    slug,
    categoryId,
    active,
    sortOrder,
  };
}

export async function createSubCategory(
  formData: FormData
) {
  const data =
    getSubCategoryData(formData);

  /*
   * =========================================================
   * VALIDATE PARENT CATEGORY
   * =========================================================
   */

  const category =
    await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },

      select: {
        id: true,
      },
    });

  if (!category) {
    throw new Error(
      "The selected category does not exist."
    );
  }

  /*
   * =========================================================
   * DUPLICATE CHECK
   * =========================================================
   *
   * Name:
   * Same name is allowed under different Categories.
   *
   * Slug:
   * Globally unique according to Prisma schema.
   */

  const existingSubCategory =
    await prisma.subCategory.findFirst({
      where: {
        OR: [
          {
            name: data.name,
            categoryId:
              data.categoryId,
          },

          {
            slug: data.slug,
          },
        ],
      },
    });

  if (existingSubCategory) {
    throw new Error(
      "A sub-category with the same name or slug already exists."
    );
  }

  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  await prisma.subCategory.create({
    data,
  });

  redirect(
    "/admin/dashboard/categories"
  );
}

export async function updateSubCategory(
  id: number,
  formData: FormData
) {
  const data =
    getSubCategoryData(formData);

  /*
   * =========================================================
   * VALIDATE PARENT CATEGORY
   * =========================================================
   */

  const category =
    await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },

      select: {
        id: true,
      },
    });

  if (!category) {
    throw new Error(
      "The selected category does not exist."
    );
  }

  /*
   * =========================================================
   * DUPLICATE CHECK
   * =========================================================
   *
   * Exclude the current Sub-category.
   */

  const existingSubCategory =
    await prisma.subCategory.findFirst({
      where: {
        id: {
          not: id,
        },

        OR: [
          {
            name: data.name,
            categoryId:
              data.categoryId,
          },

          {
            slug: data.slug,
          },
        ],
      },
    });

  if (existingSubCategory) {
    throw new Error(
      "A sub-category with the same name or slug already exists."
    );
  }

  /*
   * =========================================================
   * UPDATE
   * =========================================================
   */

  await prisma.subCategory.update({
    where: {
      id,
    },

    data,
  });

  redirect(
    "/admin/dashboard/categories"
  );
}

export async function deleteSubCategory(
  id: number
) {
  /*
   * Product.subCategoryId uses
   * onDelete: SetNull.
   *
   * Therefore deleting a Sub-category
   * will NOT delete any Products.
   *
   * Their subCategoryId will simply become null.
   */

  await prisma.subCategory.delete({
    where: {
      id,
    },
  });

  redirect(
    "/admin/dashboard/categories"
  );
}