import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBrand } from "./_actions/brand.actions";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-light">
          Brands
        </h1>

        <Link
          href="/admin/dashboard/brands/new"
          className="rounded bg-black px-5 py-3 text-white"
        >
          + Add Brand
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
            {brands.map((brand) => (
              <tr
                key={brand.id}
                className="border-t"
              >
                <td className="p-4">
                  {brand.name}
                </td>

                <td className="p-4">
                  {brand.slug}
                </td>

                <td className="p-4">
                  {brand.active
                    ? "Active"
                    : "Inactive"}
                </td>

                <td className="space-x-2 p-4 text-right">
                  <Link
                    href={`/admin/dashboard/brands/${brand.id}`}
                    className="rounded border px-3 py-2"
                  >
                    Edit
                  </Link>

                  <form
                    action={deleteBrand.bind(
                      null,
                      brand.id
                    )}
                    className="inline"
                  >
                    <button
                      className="rounded bg-red-600 px-3 py-2 text-white"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {brands.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-500"
                >
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}