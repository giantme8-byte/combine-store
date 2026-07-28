"use client";

import { CATEGORY_OPTIONS } from "@/lib/categories";
import type { Category, Product } from "@prisma/client";
import { useMemo, useState } from "react";

type CategorySelectProps = {
  categories: Category[];
  product?: Product;
};

export default function CategorySelect({
  categories,
  product,
}: CategorySelectProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    product?.category ?? ""
  );

  const subCategories = useMemo(() => {
    if (!selectedCategory) return [];

    return (
      CATEGORY_OPTIONS[
        selectedCategory as keyof typeof CATEGORY_OPTIONS
      ] ?? []
    );
  }, [selectedCategory]);

  return (
    <>
      {/* Category */}
      <div className="space-y-2">
        <label className="mb-1 block text-sm font-semibold text-neutral-700">
          Category
        </label>

        <select
          name="category"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.name}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sub Category */}
      <div className="space-y-2">
        <label className="mb-1 block text-sm font-semibold text-neutral-700">
          Sub Category
        </label>

        <select
          name="subCategory"
          defaultValue={product?.subCategory ?? ""}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none"
        >
          <option value="">
            Select Sub Category
          </option>

          {subCategories.map((subCategory) => (
            <option
              key={subCategory}
              value={subCategory}
            >
              {subCategory}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}