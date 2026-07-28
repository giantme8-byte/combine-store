import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "./_actions/category.actions";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-light">
          Categories
        </h1>

        <Link
          href="/admin/dashboard/categories/new"
          className="rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800"
        >
          + Add Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Slug</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-t"
              >
                <td className="p-4">
                  {category.name}
                </td>

                <td className="p-4 text-gray-500">
                  {category.slug}
                </td>

                <td className="p-4">
                  {category.active
                    ? "Active"
                    : "Inactive"}
                </td>

                <td className="space-x-2 p-4 text-right">
                  <Link
                    href={`/admin/dashboard/categories/${category.id}`}
                    className="rounded border px-3 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </Link>

                  <form
                    action={deleteCategory.bind(
                      null,
                      category.id
                    )}
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-gray-500"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}