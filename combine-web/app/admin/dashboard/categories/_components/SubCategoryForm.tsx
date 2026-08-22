"use client";

import { useState } from "react";

import type {
  Category,
  SubCategory,
} from "@prisma/client";


// ============================================================
// PROPS
// ============================================================

type SubCategoryFormProps = {
  action: (
    formData: FormData
  ) => void | Promise<void>;

  categories: Category[];

  subCategory?: SubCategory;

  defaultCategoryId?: number;

  submitText: string;
};


// ============================================================
// COMPONENT
// ============================================================

export default function SubCategoryForm({
  action,
  categories,
  subCategory,
  defaultCategoryId,
  submitText,
}: SubCategoryFormProps) {

  const [
    name,
    setName,
  ] = useState(
    subCategory?.name ?? ""
  );


  const [
    slug,
    setSlug,
  ] = useState(
    subCategory?.slug ?? ""
  );


  const [
    categoryId,
    setCategoryId,
  ] = useState(

    subCategory?.categoryId
      ? String(
          subCategory.categoryId
        )
      : defaultCategoryId
      ? String(
          defaultCategoryId
        )
      : ""

  );


  const [
    sortOrder,
    setSortOrder,
  ] = useState(
    String(
      subCategory?.sortOrder ??
        9999
    )
  );


  const [
    active,
    setActive,
  ] = useState(
    subCategory?.active ??
      true
  );


  // ==========================================================
  // NAME CHANGE
  // ==========================================================

  function handleNameChange(
    value: string
  ) {

    setName(
      value
    );


    /*
     * Automatically generate slug
     * only when creating a new
     * Sub-category.
     *
     * Existing Sub-categories keep
     * their current slug.
     */

    if (
      !subCategory
    ) {

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


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <form
      action={action}
      className="
        space-y-6
        sm:space-y-8
      "
    >

      {/* ================================================== */}
      {/* NAME */}
      {/* ================================================== */}

      <div
        className="
          space-y-2
        "
      >

        <label
          htmlFor="name"
          className="
            block
            text-sm
            font-semibold
            text-neutral-700
          "
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
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-3
            text-sm
            text-neutral-900
            outline-none
            transition
            placeholder:text-neutral-400
            focus:border-black
            focus:ring-2
            focus:ring-black/5

            sm:px-4
          "
          required
        />

      </div>


      {/* ================================================== */}
      {/* SLUG */}
      {/* ================================================== */}

      <div
        className="
          space-y-2
        "
      >

        <label
          htmlFor="slug"
          className="
            block
            text-sm
            font-semibold
            text-neutral-700
          "
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
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-3
            text-sm
            text-neutral-900
            outline-none
            transition
            placeholder:text-neutral-400
            focus:border-black
            focus:ring-2
            focus:ring-black/5

            sm:px-4
          "
          required
        />


        <p
          className="
            text-xs
            leading-5
            text-neutral-400
          "
        >
          Used for URLs and internal
          references.
        </p>

      </div>


      {/* ================================================== */}
      {/* CATEGORY */}
      {/* ================================================== */}

      <div
        className="
          space-y-2
        "
      >

        <label
          htmlFor="categoryId"
          className="
            block
            text-sm
            font-semibold
            text-neutral-700
          "
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
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-3
            text-sm
            text-neutral-900
            outline-none
            transition
            focus:border-black
            focus:ring-2
            focus:ring-black/5

            sm:px-4
          "
          required
        >

          <option value="">
            Select Category
          </option>


          {categories.map(
            (category) => (

              <option
                key={
                  category.id
                }
                value={
                  category.id
                }
              >
                {
                  category.name
                }
              </option>

            )
          )}

        </select>

      </div>


      {/* ================================================== */}
      {/* SORT ORDER */}
      {/* ================================================== */}

      <div
        className="
          space-y-2
        "
      >

        <label
          htmlFor="sortOrder"
          className="
            block
            text-sm
            font-semibold
            text-neutral-700
          "
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
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-3
            text-sm
            text-neutral-900
            outline-none
            transition
            focus:border-black
            focus:ring-2
            focus:ring-black/5

            sm:px-4
          "
        />


        <p
          className="
            text-xs
            leading-5
            text-neutral-400
          "
        >
          Lower numbers appear first.
        </p>

      </div>


      {/* ================================================== */}
      {/* ACTIVE */}
      {/* ================================================== */}

      <div
        className="
          rounded-xl
          border
          border-neutral-200
          bg-neutral-50
          p-3

          sm:p-4
        "
      >

        <label
          htmlFor="active"
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            text-sm
            font-medium
            text-neutral-700
          "
        >

          <input
            id="active"
            name="active"
            type="checkbox"
            checked={
              active
            }
            onChange={(e) =>
              setActive(
                e.target.checked
              )
            }
            className="
              h-4
              w-4
              shrink-0
              rounded
              border-neutral-300
              text-black
              focus:ring-black
            "
          />


          <span>
            Active
          </span>

        </label>

      </div>


      {/* ================================================== */}
      {/* SUBMIT */}
      {/* ================================================== */}

      <div
        className="
          flex
          justify-end
          border-t
          border-neutral-200
          pt-5

          sm:pt-6
        "
      >

        <button
          type="submit"
          className="
            inline-flex
            min-h-11
            w-full
            items-center
            justify-center
            rounded-xl
            bg-black
            px-6
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-neutral-800

            sm:w-auto
          "
        >
          {submitText}
        </button>

      </div>

    </form>

  );

}