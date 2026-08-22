import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: {
      active: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  return (
    <main
      className="
        mx-auto
        max-w-7xl
        px-4
        py-16

        sm:px-6
        sm:py-20

        lg:px-8
      "
    >
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        className="
          mb-12
          text-center

          sm:mb-16
        "
      >
        <p
          className="
            mb-3
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-neutral-400

            sm:text-sm
            sm:text-neutral-500
          "
        >
          COMBINE
        </p>

        <h1
          className="
            text-4xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-950

            sm:text-5xl
          "
        >
          Luxury Brands
        </h1>

        <p
          className="
            mx-auto
            mt-5
            max-w-2xl
            text-sm
            leading-7
            text-neutral-500

            sm:mt-6
            sm:text-base
            sm:leading-8
          "
        >
          Discover our curated collection of the world&apos;s most
          iconic luxury fashion houses and watchmakers.
        </p>
      </div>


      {/* ================================================== */}
      {/* BRANDS */}
      {/* ================================================== */}

      <div
        className="
          grid
          grid-cols-2
          items-stretch
          gap-3

          sm:gap-5

          lg:grid-cols-4
        "
      >
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="
              group
              block
              h-full
            "
          >
            <article
              className="
                flex
                h-[160px]
                w-full
                flex-col
                justify-between
                rounded-2xl
                border
                border-neutral-200
                bg-white
                p-4
                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-black
                hover:shadow-xl

                sm:h-[190px]
                sm:rounded-3xl
                sm:p-7
              "
            >
              {/* ======================================== */}
              {/* BRAND */}
              {/* ======================================== */}

              <div
                className="
                  flex
                  min-h-0
                  flex-1
                  items-start
                "
              >
                <h2
                  className="
                    line-clamp-3
                    w-full
                    text-lg
                    font-light
                    leading-tight
                    tracking-[-0.02em]
                    text-neutral-900
                    transition-colors
                    duration-300

                    group-hover:text-black

                    sm:text-2xl
                    sm:leading-tight
                  "
                >
                  {brand.name}
                </h2>
              </div>


              {/* ======================================== */}
              {/* EXPLORE */}
              {/* ======================================== */}

              <div
                className="
                  mt-5
                  flex
                  shrink-0
                  items-center
                  justify-between
                  border-t
                  border-neutral-100
                  pt-4
                  text-[9px]
                  uppercase
                  tracking-[0.16em]
                  text-neutral-400
                  transition-colors
                  duration-300

                  group-hover:border-neutral-200
                  group-hover:text-neutral-900

                  sm:mt-8
                  sm:pt-5
                  sm:text-[10px]
                  sm:tracking-[0.2em]
                "
              >
                <span>
                  Explore Collection
                </span>

                <span
                  className="
                    text-base
                    transition-transform
                    duration-300
                    group-hover:translate-x-1

                    sm:text-lg
                  "
                >
                  →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>


      {/* ================================================== */}
      {/* EMPTY STATE */}
      {/* ================================================== */}

      {brands.length === 0 && (
        <div
          className="
            rounded-3xl
            border
            border-neutral-200
            bg-white
            px-6
            py-16
            text-center
          "
        >
          <p
            className="
              text-sm
              text-neutral-500
            "
          >
            No brands available at the moment.
          </p>
        </div>
      )}
    </main>
  );
}