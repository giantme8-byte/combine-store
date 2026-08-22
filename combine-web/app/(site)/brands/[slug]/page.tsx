import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import ShopProducts from "@/components/ShopProducts";


// ============================================================
// PROPS
// ============================================================

type BrandPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


// ============================================================
// PAGE
// ============================================================

export default async function BrandPage({
  params,
}: BrandPageProps) {

  const {
    slug,
  } = await params;


  // ==========================================================
  // FIND BRAND
  // ==========================================================

  const brand =
    await prisma.brand.findUnique({
      where: {
        slug,
      },
    });


  // ==========================================================
  // BRAND NOT FOUND / INACTIVE
  // ==========================================================

  if (
    !brand ||
    !brand.active
  ) {
    notFound();
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-b
        from-white
        via-[#fafafa]
        to-white
      "
    >

      <div
        className="
          mx-auto
          max-w-[1440px]
          px-4
          pb-20
          pt-24

          sm:px-6
          sm:pb-32
          sm:pt-28

          lg:px-12
          lg:pt-32

          xl:px-14
        "
      >

        {/* ================================================== */}
        {/* BRAND HEADER */}
        {/* ================================================== */}

        <section
          className="
            mb-10
            text-center

            sm:mb-16
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
            LUXURY HOUSE
          </p>


          <h1
            className="
              mt-5
              text-4xl
              font-extralight
              tracking-[-0.05em]
              text-neutral-950

              sm:mt-7
              sm:text-5xl

              md:text-6xl
            "
          >
            {brand.name}
          </h1>


          <div
            className="
              mx-auto
              mt-6
              h-px
              w-20
              bg-gradient-to-r
              from-transparent
              via-[#C9A86A]
              to-transparent

              sm:mt-8
              sm:w-28
            "
          />


          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-sm
              leading-7
              text-neutral-500

              sm:mt-8
              sm:text-base
              sm:leading-8
            "
          >
            Explore our curated collection of
            {` ${brand.name}`} pieces, selected for
            timeless elegance and modern luxury.
          </p>

        </section>


        {/* ================================================== */}
        {/* PRODUCTS */}
        {/* ================================================== */}

        <ShopProducts
          brand={brand.name}
        />

      </div>

    </main>
  );
}