import Link from "next/link";

import { prisma } from "@/lib/prisma";

import {
  deleteCategory,
  deleteSubCategory,
} from "./_actions/category.actions";

export default async function CategoriesPage() {
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

  return (
    <main className="mx-auto max-w-6xl p-10">

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-light">
            Categories
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage categories and their sub-categories.
          </p>
        </div>

        <Link
          href="/admin/dashboard/categories/new"
          className="
            rounded-lg
            bg-black
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
          "
        >
          + Add Category
        </Link>

      </div>

      {/* ================================================= */}
      {/* Categories */}
      {/* ================================================= */}

      <div className="space-y-6">

        {categories.map((category) => (

          <div
            key={category.id}
            className="
              overflow-hidden
              rounded-2xl
              border
              border-neutral-200
              bg-white
            "
          >

            {/* ================================================= */}
            {/* Category Header */}
            {/* ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-neutral-200
                bg-neutral-50
                px-6
                py-5
              "
            >

              <div className="min-w-0">

                <div className="flex items-center gap-3">

                  <h2 className="text-xl font-semibold">
                    {category.name}
                  </h2>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
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

                <p className="mt-1 text-sm text-neutral-500">
                  /{category.slug}
                </p>

              </div>

              {/* Category Actions */}

              <div className="flex items-center gap-2">

                <Link
                  href={`/admin/dashboard/categories/${category.id}`}
                  className="
                    rounded-lg
                    border
                    border-neutral-200
                    bg-white
                    px-4
                    py-2
                    text-sm
                    transition
                    hover:bg-neutral-100
                  "
                >
                  Edit
                </Link>

                <form
                  action={deleteCategory.bind(
                    null,
                    category.id
                  )}
                >
                  <button
                    type="submit"
                    className="
                      rounded-lg
                      bg-red-600
                      px-4
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

            </div>

            {/* ================================================= */}
            {/* Sub-Categories */}
            {/* ================================================= */}

            <div className="p-6">

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Sub-Categories
                  </h3>

                  <p className="mt-1 text-sm text-neutral-400">
                    {category.subCategories.length}{" "}
                    {category.subCategories.length === 1
                      ? "sub-category"
                      : "sub-categories"}
                  </p>

                </div>

                <Link
                  href={`/admin/dashboard/categories/subcategories/new?categoryId=${category.id}`}
                  className="
                    rounded-lg
                    border
                    border-neutral-200
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition
                    hover:bg-neutral-100
                  "
                >
                  + Add Sub-Category
                </Link>

              </div>

              {category.subCategories.length > 0 ? (

                <div className="overflow-hidden rounded-xl border border-neutral-200">

                  <table className="w-full">

                    <thead className="bg-neutral-50">

                      <tr>

                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                          Name
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                          Slug
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                          Status
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {category.subCategories.map(
                        (subCategory) => (

                          <tr
                            key={subCategory.id}
                            className="
                              border-t
                              border-neutral-200
                            "
                          >

                            <td className="px-4 py-4">

                              <p className="font-medium text-neutral-900">
                                {subCategory.name}
                              </p>

                            </td>

                            <td className="px-4 py-4 text-sm text-neutral-500">
                              {subCategory.slug}
                            </td>

                            <td className="px-4 py-4">

                              <span
                                className={`
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
                                {subCategory.active
                                  ? "Active"
                                  : "Inactive"}
                              </span>

                            </td>

                            <td className="px-4 py-4">

                              <div className="flex justify-end gap-2">

                                <Link
                                  href={`/admin/dashboard/categories/subcategories/${subCategory.id}`}
                                  className="
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

              ) : (

                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-neutral-300
                    bg-neutral-50
                    px-6
                    py-10
                    text-center
                  "
                >

                  <p className="text-sm text-neutral-500">
                    No sub-categories yet.
                  </p>

                  <Link
                    href={`/admin/dashboard/categories/subcategories/new?categoryId=${category.id}`}
                    className="
                      mt-3
                      inline-block
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

        ))}

        {/* ================================================= */}
        {/* Empty State */}
        {/* ================================================= */}

        {categories.length === 0 && (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-neutral-300
              p-16
              text-center
            "
          >

            <h2 className="text-lg font-medium">
              No categories found.
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Create your first category to get started.
            </p>

            <Link
              href="/admin/dashboard/categories/new"
              className="
                mt-6
                inline-block
                rounded-lg
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