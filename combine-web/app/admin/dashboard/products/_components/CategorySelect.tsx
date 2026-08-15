"use client";

import type {
  Category,
  Product,
  SubCategory,
} from "@prisma/client";

import { useMemo, useState } from "react";

type CategorySelectProps = {
  categories: Category[];

  subCategories: SubCategory[];

  product?: Product;
};

export default function CategorySelect({
  categories,
  subCategories,
  product,
}: CategorySelectProps) {
  const [selectedCategory, setSelectedCategory] =
    useState(
      product?.categoryId
        ? String(product.categoryId)
        : ""
    );

  const [selectedSubCategory, setSelectedSubCategory] =
    useState(
      product?.subCategoryId
        ? String(product.subCategoryId)
        : ""
    );

  /*
   * =========================================================
   * FILTER SUB-CATEGORIES
   * =========================================================
   *
   * Only show Sub-categories belonging to
   * the selected Category.
   */

  const availableSubCategories =
    useMemo(() => {
      if (!selectedCategory) {
        return [];
      }

      return subCategories
        .filter(
          (subCategory) =>
            String(
              subCategory.categoryId
            ) === selectedCategory
        )
        .sort((a, b) =>
          a.name.localeCompare(
            b.name
          )
        );
    }, [
      selectedCategory,
      subCategories,
    ]);

  /*
   * =========================================================
   * CATEGORY CHANGE
   * =========================================================
   *
   * When Category changes, reset Sub-category
   * because the previous Sub-category may no longer
   * belong to the selected Category.
   */

  function handleCategoryChange(
    value: string
  ) {
    setSelectedCategory(value);

    setSelectedSubCategory("");
  }

  return (
    <>
      {/* ===================================================== */}
      {/* CATEGORY */}
      {/* ===================================================== */}

      <div className="space-y-2">
        <label
          htmlFor="categoryId"
          className="mb-1 block text-sm font-semibold text-neutral-700"
        >
          Category
        </label>

        <select
          id="categoryId"
          name="categoryId"
          value={selectedCategory}
          onChange={(e) =>
            handleCategoryChange(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
          required
        >
          <option value="">
            Select Category
          </option>

          {categories.map(
            (category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            )
          )}
        </select>
      </div>

      {/* ===================================================== */}
      {/* SUB CATEGORY */}
      {/* ===================================================== */}

      <div className="space-y-2">
        <label
          htmlFor="subCategoryId"
          className="mb-1 block text-sm font-semibold text-neutral-700"
        >
          Sub Category
        </label>

        <select
          id="subCategoryId"
          name="subCategoryId"
          value={selectedSubCategory}
          onChange={(e) =>
            setSelectedSubCategory(
              e.target.value
            )
          }
          disabled={
            !selectedCategory ||
            availableSubCategories.length === 0
          }
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
        >
          <option value="">
            {!selectedCategory
              ? "Select Category First"
              : availableSubCategories.length === 0
              ? "No Sub Categories"
              : "Select Sub Category"}
          </option>

          {availableSubCategories.map(
            (subCategory) => (
              <option
                key={subCategory.id}
                value={subCategory.id}
              >
                {subCategory.name}
              </option>
            )
          )}
        </select>

        {selectedCategory &&
          availableSubCategories.length ===
            0 && (
            <p className="text-xs text-neutral-400">
              No sub-categories have been
              created for this category yet.
            </p>
          )}
      </div>
    </>
  );
}