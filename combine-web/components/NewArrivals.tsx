import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";

export default async function NewArrivals() {
  const allNewArrivalProducts =
    await prisma.product.findMany({
      where: {
        newArrival: true,
      },

      select: {
        id: true,
        slug: true,
        brand: true,
        name: true,
        model: true,
        createdAt: true,

        featured: true,
        newArrival: true,
        bestSeller: true,
        limited: true,
        onSale: true,

        images: {
          select: {
            url: true,
          },

          orderBy: {
            sortOrder: "asc",
          },

          take: 2,
        },
      },
    });

  /*
   * =========================================================
   * RANDOMIZE NEW ARRIVALS
   * =========================================================
   *
   * Every time the homepage renders, New Arrival products
   * are shuffled and a random selection of 4 is displayed.
   *
   * Example:
   *
   * Refresh 1 → A B C D
   * Refresh 2 → G I A E
   * Refresh 3 → C F H B
   *
   * Only products with newArrival = true are included.
   *
   * No manual sorting is required.
   * =========================================================
   */

  const products = [
    ...allNewArrivalProducts,
  ]
    .sort(
      () =>
        Math.random() - 0.5
    )
    .slice(0, 4);

  return (
    <section
      className="
        mx-auto
        max-w-[1600px]
        px-4
        py-20
        sm:px-8
        sm:py-32
        lg:px-14
        lg:py-36
      "
    >
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div
        className="
          mx-auto
          mb-16
          max-w-5xl
          text-center
          sm:mb-24
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.55em]
            text-neutral-400
            sm:text-[11px]
          "
        >
          NEW ARRIVALS
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
          Latest Collection
        </h2>

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
            text-[15px]
            leading-7
            text-neutral-500
            sm:mt-10
            sm:text-lg
            sm:leading-9
          "
        >
          Discover the newest luxury arrivals carefully selected
          for exceptional craftsmanship, timeless elegance and
          modern sophistication.
        </p>
      </div>

      {products.length === 0 ? (
        /* ================================================= */
        /* Empty State */
        /* ================================================= */

        <div
          className="
            rounded-[28px]
            border
            border-dashed
            border-neutral-300
            bg-[#fafafa]
            py-20
            text-center
            sm:rounded-[36px]
            sm:py-28
          "
        >
          <h3
            className="
              text-3xl
              font-extralight
              tracking-[-0.04em]
              text-neutral-900
              sm:text-4xl
            "
          >
            New Arrivals Coming Soon
          </h3>

          <p
            className="
              mx-auto
              mt-6
              max-w-xl
              px-6
              text-[15px]
              leading-7
              text-neutral-500
              sm:mt-8
              sm:px-0
              sm:text-lg
              sm:leading-9
            "
          >
            Our latest collection is currently being curated.
            Stay tuned for exclusive new arrivals.
          </p>
        </div>
      ) : (
        <>
          {/* ================================================= */}
          {/* View All */}
          {/* ================================================= */}

          <div
            className="
              mb-12
              flex
              justify-center
              sm:mb-16
            "
          >
            <Link
              href="/shop?filter=new"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-neutral-300
                px-6
                py-3.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.25em]
                transition-all
                duration-500
                hover:border-[#C9A86A]
                hover:bg-[#C9A86A]
                hover:text-white
                sm:px-8
                sm:py-4
                sm:text-[11px]
                sm:tracking-[0.3em]
              "
            >
              View All New Arrivals

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-500
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>

          {/* ================================================= */}
          {/* Products */}
          {/* ================================================= */}

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:gap-8
              lg:grid-cols-4
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug ?? ""}
                brand={product.brand}
                name={product.name}
                model={product.model}
                image={
                  product.images[0]?.url ??
                  "/placeholder.png"
                }
                secondImage={
                  product.images[1]?.url
                }
                createdAt={product.createdAt}
                featured={product.featured}
                newArrival={product.newArrival}
                bestSeller={product.bestSeller}
                limited={product.limited}
                onSale={product.onSale}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}