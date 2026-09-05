import Link from "next/link";

import { prisma } from "@/lib/prisma";

import {
  deleteCategory,
  deleteSubCategory,
} from "./_actions/category.actions";


// ============================================================
// PAGE
// ============================================================

export default async function CategoriesPage() {

  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  const categories =
    await prisma.category.findMany({

      orderBy: {
        createdAt: "desc",
      },

      include: {

        subCategories: {

          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              name: "asc",
            },
          ],

        },

      },

    });


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <main
      className="
        mx-auto
        w-full
        max-w-6xl
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
          flex
          flex-col
          gap-4

          sm:mb-8
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div
          className="
            min-w-0
          "
        >

          <h1
            className="
              text-3xl
              font-light
              tracking-tight
              text-neutral-900

              sm:text-4xl
            "
          >
            Categories
          </h1>


          <p
            className="
              mt-1.5
              text-sm
              text-neutral-500

              sm:mt-2
            "
          >
            Manage categories and their sub-categories.
          </p>

        </div>


        <Link
          href="/admin/dashboard/categories/new"
          className="
            inline-flex
            w-full
            items-center
            justify-center
            rounded-xl
            bg-black
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-neutral-800

            sm:w-auto
          "
        >
          + Add Category
        </Link>

      </div>


      {/* ================================================== */}
      {/* CATEGORIES */}
      {/* ================================================== */}

      <div
        className="
          space-y-4

          sm:space-y-6
        "
      >

        {categories.map(
          (category) => (

            <div
              key={
                category.id
              }
              className="
                overflow-hidden
                rounded-2xl
                border
                border-neutral-200
                bg-white
                shadow-sm
              "
            >

              {/* ============================================
                  CATEGORY HEADER
                  ============================================ */}

              <div
                className="
                  border-b
                  border-neutral-200
                  bg-neutral-50
                  p-4

                  sm:px-6
                  sm:py-5
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  {/* CATEGORY INFO */}

                  <div
                    className="
                      min-w-0
                    "
                  >

                    <div
                      className="
                        flex
                        min-w-0
                        items-start
                        gap-2

                        sm:items-center
                        sm:gap-3
                      "
                    >

                      <h2
                        className="
                          min-w-0
                          truncate
                          text-lg
                          font-semibold
                          text-neutral-900

                          sm:text-xl
                        "
                      >
                        {category.name}
                      </h2>


                      <span
                        className={`
                          shrink-0
                          rounded-full
                          px-2.5
                          py-1
                          text-[10px]
                          font-medium

                          sm:px-3
                          sm:text-xs

                          ${
                            category.active
                              ? "bg-green-100 text-green-700"
                              : "bg-neutral-200 text-neutral-500"
                          }
                        `}
                      >
                        {category.active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>


                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        text-neutral-500

                        sm:text-sm
                      "
                    >
                      /{category.slug}
                    </p>

                  </div>


                  {/* CATEGORY ACTIONS */}

                  <div
                    className="
                      flex
                      w-full
                      gap-2

                      sm:w-auto
                      sm:shrink-0
                    "
                  >

                    <Link
                      href={`/admin/dashboard/categories/${category.id}`}
                      className="
                        inline-flex
                        min-h-10
                        flex-1
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-neutral-200
                        bg-white
                        px-4
                        text-sm
                        transition
                        hover:bg-neutral-100

                        sm:flex-none
                      "
                    >
                      Edit
                    </Link>


                    <form
                      action={deleteCategory.bind(
                        null,
                        category.id
                      )}
                      className="
                        flex-1

                        sm:flex-none
                      "
                    >

                      <button
                        type="submit"
                        className="
                          inline-flex
                          min-h-10
                          w-full
                          items-center
                          justify-center
                          rounded-xl
                          bg-red-600
                          px-4
                          text-sm
                          font-medium
                          text-white
                          transition
                          hover:bg-red-700

                          sm:w-auto
                        "
                      >
                        Delete
                      </button>

                    </form>

                  </div>

                </div>

              </div>


              {/* ============================================
                  SUB-CATEGORIES
                  ============================================ */}

              <div
                className="
                  p-4

                  sm:p-6
                "
              >

                {/* SUB HEADER */}

                <div
                  className="
                    mb-4
                    flex
                    flex-col
                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div
                    className="
                      min-w-0
                    "
                  >

                    <h3
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-neutral-500
                      "
                    >
                      Sub-Categories
                    </h3>


                    <p
                      className="
                        mt-1
                        text-xs
                        text-neutral-400

                        sm:text-sm
                      "
                    >
                      {category.subCategories.length}{" "}
                      {
                        category.subCategories.length === 1
                          ? "sub-category"
                          : "sub-categories"
                      }
                    </p>

                  </div>


                  <Link
                    href={`/admin/dashboard/categories/subcategories/new?categoryId=${category.id}`}
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-neutral-200
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      transition
                      hover:bg-neutral-100

                      sm:w-auto
                    "
                  >
                    + Add Sub-Category
                  </Link>

                </div>


                {/* ==========================================
                    HAS SUB-CATEGORIES
                    ========================================== */}

                {category.subCategories.length > 0 ? (

                  <>

                    {/* ======================================
                        MOBILE SUB-CATEGORY LIST
                        ====================================== */}

                    <div
                      className="
                        space-y-3

                        sm:hidden
                      "
                    >

                      {category.subCategories.map(
                        (subCategory) => (

                          <div
                            key={
                              subCategory.id
                            }
                            className="
                              rounded-xl
                              border
                              border-neutral-200
                              bg-white
                              p-3
                            "
                          >

                            {/* INFO */}

                            <div
                              className="
                                flex
                                min-w-0
                                items-start
                                justify-between
                                gap-3
                              "
                            >

                              <div
                                className="
                                  min-w-0
                                  flex-1
                                "
                              >

                                <p
                                  className="
                                    truncate
                                    text-sm
                                    font-medium
                                    text-neutral-900
                                  "
                                >
                                  {
                                    subCategory.name
                                  }
                                </p>


                                <p
                                  className="
                                    mt-1
                                    truncate
                                    text-xs
                                    text-neutral-500
                                  "
                                >
                                  {
                                    subCategory.slug
                                  }
                                </p>

                              </div>


                              {/* STATUS */}

                              <span
                                className={`
                                  shrink-0
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[10px]
                                  font-medium

                                  ${
                                    subCategory.active
                                      ? "bg-green-100 text-green-700"
                                      : "bg-neutral-100 text-neutral-500"
                                  }
                                `}
                              >
                                {
                                  subCategory.active
                                    ? "Active"
                                    : "Inactive"
                                }
                              </span>

                            </div>


                            {/* ACTIONS */}

                            <div
                              className="
                                mt-3
                                flex
                                gap-2
                              "
                            >

                              <Link
                                href={`/admin/dashboard/categories/subcategories/${subCategory.id}`}
                                className="
                                  inline-flex
                                  min-h-10
                                  flex-1
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  border-neutral-200
                                  px-3
                                  text-sm
                                  transition
                                  hover:bg-neutral-100
                                "
                              >
                                Edit
                              </Link>


                              <form
                                action={deleteSubCategory.bind(
                                  null,
                                  subCategory.id
                                )}
                                className="
                                  flex-1
                                "
                              >

                                <button
                                  type="submit"
                                  className="
                                    inline-flex
                                    min-h-10
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-red-600
                                    px-3
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-red-700
                                  "
                                >
                                  Delete
                                </button>

                              </form>

                            </div>

                          </div>

                        )
                      )}

                    </div>


                    {/* ======================================
                        DESKTOP SUB-CATEGORY TABLE
                        ====================================== */}

                    <div
                      className="
                        hidden
                        overflow-hidden
                        rounded-xl
                        border
                        border-neutral-200

                        sm:block
                      "
                    >

                      <div
                        className="
                          overflow-x-auto
                        "
                      >

                        <table
                          className="
                            w-full
                            min-w-[700px]
                          "
                        >

                          <thead
                            className="
                              bg-neutral-50
                            "
                          >

                            <tr>

                              <th
                                className="
                                  px-4
                                  py-3
                                  text-left
                                  text-xs
                                  font-medium
                                  uppercase
                                  tracking-[0.12em]
                                  text-neutral-400
                                "
                              >
                                Name
                              </th>


                              <th
                                className="
                                  px-4
                                  py-3
                                  text-left
                                  text-xs
                                  font-medium
                                  uppercase
                                  tracking-[0.12em]
                                  text-neutral-400
                                "
                              >
                                Slug
                              </th>


                              <th
                                className="
                                  px-4
                                  py-3
                                  text-left
                                  text-xs
                                  font-medium
                                  uppercase
                                  tracking-[0.12em]
                                  text-neutral-400
                                "
                              >
                                Status
                              </th>


                              <th
                                className="
                                  px-4
                                  py-3
                                  text-right
                                  text-xs
                                  font-medium
                                  uppercase
                                  tracking-[0.12em]
                                  text-neutral-400
                                "
                              >
                                Actions
                              </th>

                            </tr>

                          </thead>


                          <tbody>

                            {category.subCategories.map(
                              (subCategory) => (

                                <tr
                                  key={
                                    subCategory.id
                                  }
                                  className="
                                    border-t
                                    border-neutral-200
                                    transition
                                    hover:bg-neutral-50
                                  "
                                >

                                  <td
                                    className="
                                      px-4
                                      py-4
                                    "
                                  >

                                    <p
                                      className="
                                        text-sm
                                        font-medium
                                        text-neutral-900
                                      "
                                    >
                                      {
                                        subCategory.name
                                      }
                                    </p>

                                  </td>


                                  <td
                                    className="
                                      px-4
                                      py-4
                                      text-sm
                                      text-neutral-500
                                    "
                                  >
                                    {
                                      subCategory.slug
                                    }
                                  </td>


                                  <td
                                    className="
                                      px-4
                                      py-4
                                    "
                                  >

                                    <span
                                      className={`
                                        inline-flex
                                        rounded-full
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium

                                        ${
                                          subCategory.active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-neutral-100 text-neutral-500"
                                        }
                                      `}
                                    >
                                      {
                                        subCategory.active
                                          ? "Active"
                                          : "Inactive"
                                      }
                                    </span>

                                  </td>


                                  <td
                                    className="
                                      px-4
                                      py-4
                                      text-right
                                    "
                                  >

                                    <div
                                      className="
                                        flex
                                        justify-end
                                        gap-2
                                      "
                                    >

                                      <Link
                                        href={`/admin/dashboard/categories/subcategories/${subCategory.id}`}
                                        className="
                                          inline-flex
                                          items-center
                                          rounded-lg
                                          border
                                          border-neutral-200
                                          px-3
                                          py-2
                                          text-sm
                                          transition
                                          hover:bg-neutral-100
                                        "
                                      >
                                        Edit
                                      </Link>


                                      <form
                                        action={deleteSubCategory.bind(
                                          null,
                                          subCategory.id
                                        )}
                                      >

                                        <button
                                          type="submit"
                                          className="
                                            inline-flex
                                            items-center
                                            rounded-lg
                                            bg-red-600
                                            px-3
                                            py-2
                                            text-sm
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-red-700
                                          "
                                        >
                                          Delete
                                        </button>

                                      </form>

                                    </div>

                                  </td>

                                </tr>

                              )
                            )}

                          </tbody>

                        </table>

                      </div>

                    </div>

                  </>

                ) : (

                  /* ========================================
                     EMPTY SUB-CATEGORY
                     ======================================== */

                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-neutral-300
                      bg-neutral-50
                      px-4
                      py-8
                      text-center

                      sm:px-6
                      sm:py-10
                    "
                  >

                    <p
                      className="
                        text-sm
                        text-neutral-500
                      "
                    >
                      No sub-categories yet.
                    </p>


                    <Link
                      href={`/admin/dashboard/categories/subcategories/new?categoryId=${category.id}`}
                      className="
                        mt-3
                        inline-flex
                        items-center
                        text-sm
                        font-medium
                        text-black
                        underline
                        underline-offset-4
                      "
                    >
                      Add your first sub-category
                    </Link>

                  </div>

                )}

              </div>

            </div>

          )
        )}


        {/* ==================================================
            EMPTY CATEGORIES
            ================================================== */}

        {categories.length === 0 && (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-neutral-300
              bg-white
              px-6
              py-12
              text-center

              sm:p-16
            "
          >

            <h2
              className="
                text-lg
                font-medium
                text-neutral-900
              "
            >
              No categories found.
            </h2>


            <p
              className="
                mt-2
                text-sm
                text-neutral-500
              "
            >
              Create your first category to get started.
            </p>


            <Link
              href="/admin/dashboard/categories/new"
              className="
                mt-6
                inline-flex
                items-center
                rounded-xl
                bg-black
                px-5
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-neutral-800
              "
            >
              + Add Category
            </Link>

          </div>

        )}

      </div>

    </main>

  );
}