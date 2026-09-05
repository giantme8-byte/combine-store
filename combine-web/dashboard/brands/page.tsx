import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { deleteBrand } from "./_actions/brand.actions";


// ============================================================
// PAGE
// ============================================================

export default async function BrandsPage() {

  // ==========================================================
  // LOAD BRANDS
  // ==========================================================

  const brands =
    await prisma.brand.findMany({

      orderBy: {
        name: "asc",
      },

    });


  // ==========================================================
  // RENDER
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

        <div>

          <h1
            className="
              text-3xl
              font-light
              tracking-tight
              text-neutral-900
              sm:text-4xl
            "
          >
            Brands
          </h1>

          <p
            className="
              mt-1.5
              text-sm
              text-neutral-500
            "
          >
            Manage your product brands.
          </p>

        </div>


        <Link
          href="/admin/dashboard/brands/new"
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
          + Add Brand
        </Link>

      </div>


      {/* ================================================== */}
      {/* EMPTY */}
      {/* ================================================== */}

      {brands.length === 0 ? (

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
          "
        >

          <p
            className="
              text-sm
              text-neutral-500
            "
          >
            No brands found.
          </p>

          <Link
            href="/admin/dashboard/brands/new"
            className="
              mt-4
              inline-flex
              items-center
              rounded-xl
              bg-black
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-neutral-800
            "
          >
            Add Your First Brand
          </Link>

        </div>

      ) : (

        <>

          {/* ==================================================
              MOBILE
              ================================================== */}

          <div
            className="
              space-y-3
              sm:hidden
            "
          >

            {brands.map((brand) => (

              <div
                key={brand.id}
                className="
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-white
                  p-4
                  shadow-sm
                "
              >

                {/* ==========================================
                    BRAND INFO
                    ========================================== */}

                <div
                  className="
                    flex
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
                        text-base
                        font-medium
                        text-neutral-900
                      "
                    >
                      {brand.name}
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        text-neutral-400
                      "
                    >
                      {brand.slug}
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
                        brand.active
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }
                    `}
                  >
                    {brand.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>


                {/* ==========================================
                    ACTIONS
                    ========================================== */}

                <div
                  className="
                    mt-4
                    flex
                    gap-2
                  "
                >

                  <Link
                    href={`/admin/dashboard/brands/${brand.id}`}
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
                      font-medium
                      text-neutral-700
                      transition
                      hover:bg-neutral-50
                    "
                  >
                    Edit
                  </Link>


                  <form
                    action={deleteBrand.bind(
                      null,
                      brand.id
                    )}
                    className="flex-1"
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
                      "
                    >
                      Delete
                    </button>

                  </form>

                </div>

              </div>

            ))}

          </div>


          {/* ==================================================
              DESKTOP TABLE
              ================================================== */}

          <div
            className="
              hidden
              overflow-hidden
              rounded-2xl
              border
              border-neutral-200
              bg-white
              shadow-sm

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
                  min-w-[720px]
                "
              >

                <thead
                  className="
                    border-b
                    border-neutral-200
                    bg-neutral-50
                  "
                >

                  <tr>

                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        text-neutral-500
                      "
                    >
                      Name
                    </th>


                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        text-neutral-500
                      "
                    >
                      Slug
                    </th>


                    <th
                      className="
                        px-5
                        py-4
                        text-left
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        text-neutral-500
                      "
                    >
                      Status
                    </th>


                    <th
                      className="
                        px-5
                        py-4
                        text-right
                        text-xs
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        text-neutral-500
                      "
                    >
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {brands.map((brand) => (

                    <tr
                      key={brand.id}
                      className="
                        border-t
                        border-neutral-100
                        transition
                        hover:bg-neutral-50
                      "
                    >

                      {/* NAME */}

                      <td
                        className="
                          px-5
                          py-4
                        "
                      >

                        <span
                          className="
                            text-sm
                            font-medium
                            text-neutral-900
                          "
                        >
                          {brand.name}
                        </span>

                      </td>


                      {/* SLUG */}

                      <td
                        className="
                          px-5
                          py-4
                        "
                      >

                        <span
                          className="
                            text-sm
                            text-neutral-500
                          "
                        >
                          {brand.slug}
                        </span>

                      </td>


                      {/* STATUS */}

                      <td
                        className="
                          px-5
                          py-4
                        "
                      >

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-medium

                            ${
                              brand.active
                                ? "bg-green-50 text-green-700"
                                : "bg-neutral-100 text-neutral-500"
                            }
                          `}
                        >
                          {brand.active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td
                        className="
                          px-5
                          py-4
                          text-right
                        "
                      >

                        <div
                          className="
                            inline-flex
                            items-center
                            gap-2
                          "
                        >

                          <Link
                            href={`/admin/dashboard/brands/${brand.id}`}
                            className="
                              inline-flex
                              items-center
                              rounded-lg
                              border
                              border-neutral-200
                              px-3
                              py-2
                              text-xs
                              font-medium
                              text-neutral-700
                              transition
                              hover:bg-neutral-100
                            "
                          >
                            Edit
                          </Link>


                          <form
                            action={deleteBrand.bind(
                              null,
                              brand.id
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
                                text-xs
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

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </>

      )}

    </main>

  );
}