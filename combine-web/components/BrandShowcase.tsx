import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";


// ============================================================
// COMPONENT
// ============================================================

export default async function BrandShowcase() {

  // ==========================================================
  // LOAD ACTIVE BRANDS
  // ==========================================================

  const brands =
    await prisma.brand.findMany({
      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },

      take: 12,
    });


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section
      className="
        border-y
        border-neutral-100
        bg-[#faf9f7]
        py-20

        sm:py-28

        md:py-36
      "
    >

      <div
        className="
          mx-auto
          max-w-[1600px]
          px-5

          sm:px-8

          lg:px-14
        "
      >

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div
          className="
            mx-auto
            mb-14
            max-w-4xl
            text-center

            sm:mb-20

            md:mb-24
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.4em]
              text-neutral-400

              sm:text-[11px]
              sm:tracking-[0.55em]
            "
          >
            WORLD&apos;S FINEST BRANDS
          </p>


          <h2
            className="
              mt-5
              text-4xl
              font-extralight
              tracking-[-0.05em]
              text-neutral-950

              sm:mt-7
              sm:text-5xl

              md:text-7xl
            "
          >
            Explore Luxury Houses
          </h2>


          {/* ================================================= */}
          {/* GOLD DIVIDER */}
          {/* ================================================= */}

          <div
            className="
              mx-auto
              mt-7
              h-px
              w-20
              bg-gradient-to-r
              from-transparent
              via-[#C9A86A]
              to-transparent

              sm:mt-10
              sm:w-28
            "
          />


          <p
            className="
              mx-auto
              mt-7
              max-w-3xl
              text-[14px]
              leading-7
              text-neutral-500

              sm:mt-10
              sm:text-lg
              sm:leading-9
            "
          >
            Discover iconic fashion houses and legendary Swiss
            watchmakers, curated for timeless elegance and modern
            luxury.
          </p>

        </div>


        {/* ================================================== */}
        {/* BRANDS */}
        {/* ================================================== */}

        {brands.length > 0 ? (

          <div
            className="
              grid
              grid-cols-2
              gap-3

              sm:gap-5

              md:grid-cols-4

              lg:grid-cols-6
            "
          >

            {brands.map((brand) => (

              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group"
              >

                <article
                  className="
                    flex
                    h-24
                    flex-col
                    items-center
                    justify-center
                    rounded-[20px]
                    border
                    border-neutral-200
                    bg-white
                    px-2
                    shadow-[0_8px_24px_rgba(0,0,0,0.035)]
                    transition-all
                    duration-500

                    hover:-translate-y-2
                    hover:border-[#C9A86A]
                    hover:shadow-[0_28px_60px_rgba(0,0,0,0.10)]

                    sm:h-28
                    sm:rounded-[24px]
                    sm:px-4

                    md:h-32
                    md:rounded-[28px]
                  "
                >

                  {/* ======================================= */}
                  {/* BRAND NAME */}
                  {/* ======================================= */}

                  <span
                    className="
                      px-1
                      text-center
                      text-[13px]
                      font-light
                      leading-tight
                      tracking-wide
                      text-neutral-900
                      transition-all
                      duration-500

                      group-hover:tracking-[0.05em]

                      sm:text-[16px]

                      md:text-[18px]
                      md:group-hover:tracking-[0.08em]
                    "
                  >
                    {brand.name}
                  </span>


                  {/* ======================================= */}
                  {/* EXPLORE */}
                  {/* ======================================= */}

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      gap-1.5
                      text-[8px]
                      uppercase
                      tracking-[0.2em]
                      text-neutral-400
                      transition-all
                      duration-500

                      group-hover:text-[#C9A86A]

                      sm:mt-4
                      sm:gap-2
                      sm:text-[9px]
                      sm:tracking-[0.25em]

                      md:mt-5
                      md:text-[10px]
                      md:tracking-[0.28em]
                    "
                  >
                    Explore

                    <ArrowRight
                      size={12}
                      className="
                        transition-transform
                        duration-500
                        group-hover:translate-x-1

                        sm:h-[14px]
                        sm:w-[14px]
                      "
                    />

                  </div>

                </article>

              </Link>

            ))}

          </div>

        ) : (

          <div
            className="
              rounded-3xl
              border
              border-neutral-200
              bg-white
              px-6
              py-12
              text-center
              text-sm
              text-neutral-500
            "
          >
            No brands available yet.
          </div>

        )}


        {/* ================================================== */}
        {/* VIEW ALL BRANDS */}
        {/* ================================================== */}

        <div
          className="
            mt-10
            flex
            justify-center

            sm:mt-14

            md:mt-16
          "
        >

          <Link
            href="/brands"
            className="
              group
              inline-flex
              items-center
              gap-3
              border-b
              border-neutral-300
              pb-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.25em]
              text-neutral-700
              transition-all
              duration-300

              hover:border-[#C9A86A]
              hover:text-[#C9A86A]

              sm:text-[11px]
              sm:tracking-[0.3em]
            "
          >
            View All Brands

            <ArrowRight
              size={14}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />

          </Link>

        </div>

      </div>

    </section>
  );
}