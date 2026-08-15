"use client";

import { useState } from "react";

import type {
  Category,
  SubCategory,
} from "@prisma/client";

type SubCategoryFormProps = {
  action: (
    formData: FormData
  ) => void | Promise<void>;

  categories: Category[];

  subCategory?: SubCategory;

  defaultCategoryId?: number;

  submitText: string;
};

export default function SubCategoryForm({
  action,
  categories,
  subCategory,
  defaultCategoryId,
  submitText,
}: SubCategoryFormProps) {
  const [name, setName] = useState(
    subCategory?.name ?? ""
  );

  const [slug, setSlug] = useState(
    subCategory?.slug ?? ""
  );

  const [categoryId, setCategoryId] =
    useState(
      subCategory?.categoryId
        ? String(
            subCategory.categoryId
          )
        : defaultCategoryId
        ? String(defaultCategoryId)
        : ""
    );

  const [sortOrder, setSortOrder] =
    useState(
      String(
        subCategory?.sortOrder ?? 9999
      )
    );

  const [active, setActive] =
    useState(
      subCategory?.active ?? true
    );

  function handleNameChange(
    value: string
  ) {
    setName(value);

    /*
     * Automatically generate slug
     * only when creating a new
     * Sub-category.
     *
     * Existing Sub-categories keep
     * their current slug.
     */
    if (!subCategory) {
      const generatedSlug =
        value
          .toLowerCase()
          .trim()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          );

      setSlug(
        generatedSlug
      );
    }
  }

  return (
    <form
      action={action}
      className="space-y-8"
    >
      {/* ===================================================== */}
      {/* NAME */}
      {/* ===================================================== */}

      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-neutral-700"
        >
          Sub-Category Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) =>
            handleNameChange(
              e.target.value
            )
          }
          placeholder="e.g. Shoulder Bags"
          className="
            w-full
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-4
            py-3
            transition
            focus:border-black
            focus:ring-2
            focus:ring-black/5
            focus:outline-none
          "
          required
        />
      </div>

      {/* ===================================================== */}
      {/* SLUG */}
      {/* ===================================================== */}

      <div className="space-y-2">
        <label
          htmlFor="slug"
          className="block text-sm font-semibold text-neutral-700"
        >
          Slug
        </label>

        <input
          id="slug"
          name="slug"
          type="text"
          value={slug}
          onChange={(e) =>
            setSlug(
              e.target.value
                .toLowerCase()
                .trim()
                .replace(
                  /\s+/g,
                  "-"
                )
            )
          }
          placeholder="e.g. shoulder-bags"
          className="
            w-full
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-4
            py-3
            transition
            focus:border-black
            focus:ring-2
            focus:ring-black/5
            focus:outline-none
          "
          required
        />

        <p className="text-xs text-neutral-400">
          Used for URLs and internal
          references.
        </p>
      </div>

      {/* ===================================================== */}
      {/* CATEGORY */}
      {/* ===================================================== */}

      <div className="space-y-2">
        <label
          htmlFor="categoryId"
          className="block text-sm font-semibold text-neutral-700"
        >
          Category
        </label>

        <select
          id="categoryId"
          name="categoryId"
          value={categoryId}
          onChange={(e) =>
            setCategoryId(
              e.target.value
            )
          }
          className="
            w-full
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-4
            py-3
            transition
            focus:border-black
            focus:ring-2
            focus:ring-black/5
            focus:outline-none
          "
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
      {/* SORT ORDER */}
      {/* ===================================================== */}

      <div className="space-y-2">
        <label
          htmlFor="sortOrder"
          className="block text-sm font-semibold text-neutral-700"
        >
          Sort Order
        </label>

        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min="0"
          step="1"
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(
              e.target.value
            )
          }
          className="
            w-full
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-4
            py-3
            transition
            focus:border-black
            focus:ring-2
            focus:ring-black/5
            focus:outline-none
          "
        />

        <p className="text-xs text-neutral-400">
          Lower numbers appear first.
        </p>
      </div>

      {/* ===================================================== */}
      {/* ACTIVE */}
      {/* ===================================================== */}

      <div className="flex items-center gap-3">
        <input
          id="active"
          name="active"
          type="checkbox"
          checked={active}
          onChange={(e) =>
            setActive(
              e.target.checked
            )
          }
          className="
            h-4
            w-4
            rounded
            border-neutral-300
            text-black
            focus:ring-black
          "
        />

        <label
          htmlFor="active"
          className="text-sm font-medium text-neutral-700"
        >
          Active
        </label>
      </div>

      {/* ===================================================== */}
      {/* SUBMIT */}
      {/* ===================================================== */}

      <div className="flex justify-end border-t border-neutral-200 pt-6">
        <button
          type="submit"
          className="
            rounded-xl
            bg-black
            px-6
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-neutral-800
          "
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}