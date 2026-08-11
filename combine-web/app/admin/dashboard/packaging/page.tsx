import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePackaging } from "./_actions/packaging.actions";

export default async function PackagingPage() {
  const packagingProfiles =
    await prisma.packagingProfile.findMany({
      orderBy: [
        {
          brand: "asc",
        },
        {
          name: "asc",
        },
      ],

      include: {
        brandRecord: {
          select: {
            name: true,
          },
        },

        images: {
          select: {
            id: true,
          },
        },

        items: {
          select: {
            id: true,
          },
        },

        _count: {
          select: {
            customProducts: true,
          },
        },
      },
    });

  const sortedPackaging =
    [...packagingProfiles].sort(
      (a, b) => {
        if (
          a.brand === null &&
          b.brand !== null
        ) {
          return -1;
        }

        if (
          a.brand !== null &&
          b.brand === null
        ) {
          return 1;
        }

        if (
          a.brand &&
          b.brand
        ) {
          return a.brand.localeCompare(
            b.brand
          );
        }

        return a.name.localeCompare(
          b.name
        );
      }
    );

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">
      {/* Header */}
      <div
        className="
          mb-8
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-light
              tracking-tight
              sm:text-4xl
            "
          >
            Packaging
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage default and brand packaging
            details.
          </p>
        </div>

        <Link
          href="/admin/dashboard/packaging/new"
          className="
            inline-flex
            w-fit
            items-center
            justify-center
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
          + Add Packaging
        </Link>
      </div>

      {/* Summary */}
      <div
        className="
          mb-8
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-4
          sm:gap-4
        "
      >
        <div
          className="
            rounded-xl
            border
            bg-white
            p-4
          "
        >
          <p className="text-xs text-gray-500">
            Total
          </p>

          <p className="mt-2 text-2xl font-light">
            {sortedPackaging.length}
          </p>
        </div>

        <div
          className="
            rounded-xl
            border
            bg-white
            p-4
          "
        >
          <p className="text-xs text-gray-500">
            Default
          </p>

          <p className="mt-2 text-2xl font-light">
            {
              sortedPackaging.filter(
                (packaging) =>
                  packaging.brand === null
              ).length
            }
          </p>
        </div>

        <div
          className="
            rounded-xl
            border
            bg-white
            p-4
          "
        >
          <p className="text-xs text-gray-500">
            Brand
          </p>

          <p className="mt-2 text-2xl font-light">
            {
              sortedPackaging.filter(
                (packaging) =>
                  packaging.brand !== null
              ).length
            }
          </p>
        </div>

        <div
          className="
            rounded-xl
            border
            bg-white
            p-4
          "
        >
          <p className="text-xs text-gray-500">
            Active
          </p>

          <p className="mt-2 text-2xl font-light">
            {
              sortedPackaging.filter(
                (packaging) =>
                  packaging.active
              ).length
            }
          </p>
        </div>
      </div>

      {/* Table */}
      <div
        className="
          overflow-x-auto
          rounded-xl
          border
          bg-white
        "
      >
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Brand
              </th>

              <th className="p-4 text-center">
                Images
              </th>

              <th className="p-4 text-center">
                Items
              </th>

              <th className="p-4 text-center">
                Products
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedPackaging.map(
              (packaging) => {
                const isDefault =
                  packaging.brand ===
                  null;

                return (
                  <tr
                    key={packaging.id}
                    className="
                      border-t
                      transition
                      hover:bg-gray-50
                    "
                  >
                    {/* Name */}
                    <td className="p-4">
                      <div className="font-medium">
                        {packaging.name}
                      </div>

                      {packaging.title && (
                        <div
                          className="
                            mt-1
                            max-w-[280px]
                            truncate
                            text-xs
                            text-gray-500
                          "
                        >
                          {packaging.title}
                        </div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="p-4">
                      {isDefault ? (
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-gray-100
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-gray-700
                          "
                        >
                          Default
                        </span>
                      ) : (
                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-blue-50
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-blue-700
                          "
                        >
                          Brand
                        </span>
                      )}
                    </td>

                    {/* Brand */}
                    <td className="p-4">
                      {packaging.brandRecord
                        ?.name ?? "—"}
                    </td>

                    {/* Images */}
                    <td className="p-4 text-center">
                      {packaging.images.length}
                    </td>

                    {/* Items */}
                    <td className="p-4 text-center">
                      {packaging.items.length}
                    </td>

                    {/* Products */}
                    <td className="p-4 text-center">
                      {packaging._count
                        .customProducts}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {packaging.active ? (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            text-green-600
                          "
                        >
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Active
                        </span>
                      ) : (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-400
                          "
                        >
                          <span className="h-2 w-2 rounded-full bg-gray-300" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/dashboard/packaging/${packaging.id}`}
                          className="
                            rounded-lg
                            border
                            px-3
                            py-2
                            text-sm
                            transition
                            hover:bg-gray-50
                          "
                        >
                          Edit
                        </Link>

                        <form
                          action={deletePackaging.bind(
                            null,
                            packaging.id
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
                );
              }
            )}

            {sortedPackaging.length ===
              0 && (
              <tr>
                <td
                  colSpan={8}
                  className="
                    p-12
                    text-center
                    text-gray-500
                  "
                >
                  <p className="text-base">
                    No packaging profiles found.
                  </p>

                  <p className="mt-1 text-sm">
                    Add your first packaging
                    profile to get started.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}