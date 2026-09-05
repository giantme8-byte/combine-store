import Link from "next/link";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  updateSubCategory,
} from "../../_actions/category.actions";


// ============================================================
// TYPES
// ============================================================

type EditSubCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};


// ============================================================
// PAGE
// ============================================================

export default async function EditSubCategoryPage({
  params,
}: EditSubCategoryPageProps) {

  // ==========================================================
  // PARAMS
  // ==========================================================

  const {
    id,
  } = await params;


  const subCategoryId =
    Number(id);


  if (
    !Number.isInteger(
      subCategoryId
    )
  ) {

    notFound();

  }


  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const [
    subCategory,
    categories,
  ] = await Promise.all([

    prisma.subCategory.findUnique({

      where: {
        id:
          subCategoryId,
      },

    }),

    prisma.category.findMany({

      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },

    }),

  ]);


  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (
    !subCategory
  ) {

    notFound();

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main
      className="
        mx-auto
        w-full
        max-w-3xl
        p-4

        sm:p-6
        lg:p-10
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        className="
          mb-6

          sm:mb-10
        "
      >

        <Link
          href="/admin/dashboard/categories"
          className="
            inline-flex
            items-center
            text-sm
            text-neutral-500
            transition
            hover:text-black
          "
        >
          ← Back to Categories
        </Link>


        <h1
          className="
            mt-4
            text-3xl
            font-light
            tracking-tight
            text-neutral-900

            sm:mt-6
            sm:text-4xl
          "
        >
          Edit Sub-Category
        </h1>


        <p
          className="
            mt-2
            text-sm
            leading-6
            text-neutral-500
          "
        >
          Update the sub-category information
          and parent category.
        </p>

      </div>


      {/* ================================================== */}
      {/* FORM */}
      {/* ================================================== */}

      <form
        action={updateSubCategory.bind(
          null,
          subCategory.id
        )}
        className="
          space-y-5
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-4

          sm:space-y-6
          sm:p-8
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
              font-medium
              text-neutral-900
            "
          >
            Sub-Category Name
          </label>


          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={
              subCategory.name
            }
            className="
              h-11
              w-full
              min-w-0
              rounded-xl
              border
              border-neutral-200
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
              font-medium
              text-neutral-900
            "
          >
            Slug
          </label>


          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={
              subCategory.slug
            }
            className="
              h-11
              w-full
              min-w-0
              rounded-xl
              border
              border-neutral-200
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
              text-neutral-500
            "
          >
            Use lowercase letters and hyphens.
          </p>

        </div>


        {/* ================================================== */}
        {/* PARENT CATEGORY */}
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
              font-medium
              text-neutral-900
            "
          >
            Category
          </label>


          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={
              String(
                subCategory.categoryId
              )
            }
            className="
              h-11
              w-full
              min-w-0
              rounded-xl
              border
              border-neutral-200
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
          >

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
              font-medium
              text-neutral-900
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
            required
            defaultValue={
              subCategory.sortOrder
            }
            className="
              h-11
              w-full
              min-w-0
              rounded-xl
              border
              border-neutral-200
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
              text-neutral-500
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
              defaultChecked={
                subCategory.active
              }
              className="
                h-4
                w-4
                shrink-0
                rounded
                accent-black
              "
            />


            <span>
              Active
            </span>

          </label>

        </div>


        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            border-t
            border-neutral-200
            pt-5

            sm:justify-end
            sm:gap-3
            sm:pt-6
          "
        >

          <Link
            href="/admin/dashboard/categories"
            className="
              inline-flex
              min-h-11
              flex-1
              items-center
              justify-center
              rounded-xl
              border
              border-neutral-200
              px-4
              text-sm
              transition
              hover:bg-neutral-100

              sm:flex-none
              sm:px-5
            "
          >
            Cancel
          </Link>


          <button
            type="submit"
            className="
              inline-flex
              min-h-11
              flex-1
              items-center
              justify-center
              rounded-xl
              bg-black
              px-4
              text-sm
              font-medium
              text-white
              transition
              hover:bg-neutral-800

              sm:flex-none
              sm:px-5
            "
          >
            Save Changes
          </button>

        </div>

      </form>

    </main>

  );

}