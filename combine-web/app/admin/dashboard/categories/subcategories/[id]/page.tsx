import Link from "next/link";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  updateSubCategory,
} from "../../_actions/category.actions";

type EditSubCategoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSubCategoryPage({
  params,
}: EditSubCategoryPageProps) {
  const { id } = await params;

  const subCategoryId =
    Number(id);

  if (
    !Number.isInteger(subCategoryId)
  ) {
    notFound();
  }

  const [
    subCategory,
    categories,
  ] = await Promise.all([
    prisma.subCategory.findUnique({
      where: {
        id: subCategoryId,
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

  if (!subCategory) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-10">

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="mb-10">

        <Link
          href="/admin/dashboard/categories"
          className="
            text-sm
            text-neutral-500
            transition
            hover:text-black
          "
        >
          ← Back to Categories
        </Link>

        <h1 className="mt-6 text-4xl font-light">
          Edit Sub-Category
        </h1>

        <p className="mt-2 text-neutral-500">
          Update the sub-category information
          and parent category.
        </p>

      </div>

      {/* ================================================= */}
      {/* Form */}
      {/* ================================================= */}

      <form
        action={updateSubCategory.bind(
          null,
          subCategory.id
        )}
        className="
          space-y-6
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-8
        "
      >

        {/* ================================================= */}
        {/* Name */}
        {/* ================================================= */}

        <div>

          <label
            htmlFor="name"
            className="
              mb-2
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
              w-full
              rounded-xl
              border
              border-neutral-200
              px-4
              py-3
              outline-none
              transition
              focus:border-black
            "
          />

        </div>

        {/* ================================================= */}
        {/* Slug */}
        {/* ================================================= */}

        <div>

          <label
            htmlFor="slug"
            className="
              mb-2
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
              w-full
              rounded-xl
              border
              border-neutral-200
              px-4
              py-3
              outline-none
              transition
              focus:border-black
            "
          />

          <p className="mt-2 text-xs text-neutral-500">
            Use lowercase letters and hyphens.
          </p>

        </div>

        {/* ================================================= */}
        {/* Parent Category */}
        {/* ================================================= */}

        <div>

          <label
            htmlFor="categoryId"
            className="
              mb-2
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
            defaultValue={String(
              subCategory.categoryId
            )}
            className="
              w-full
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-4
              py-3
              outline-none
              transition
              focus:border-black
            "
          >

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

        {/* ================================================= */}
        {/* Sort Order */}
        {/* ================================================= */}

        <div>

          <label
            htmlFor="sortOrder"
            className="
              mb-2
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
              w-full
              rounded-xl
              border
              border-neutral-200
              px-4
              py-3
              outline-none
              transition
              focus:border-black
            "
          />

          <p className="mt-2 text-xs text-neutral-500">
            Lower numbers appear first.
          </p>

        </div>

        {/* ================================================= */}
        {/* Active */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-neutral-200
            p-4
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
              rounded
              accent-black
            "
          />

          <label
            htmlFor="active"
            className="text-sm"
          >
            Active
          </label>

        </div>

        {/* ================================================= */}
        {/* Actions */}
        {/* ================================================= */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-3
            border-t
            border-neutral-200
            pt-6
          "
        >

          <Link
            href="/admin/dashboard/categories"
            className="
              rounded-xl
              border
              border-neutral-200
              px-5
              py-3
              text-sm
              transition
              hover:bg-neutral-100
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="
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
            Save Changes
          </button>

        </div>

      </form>

    </main>
  );
}