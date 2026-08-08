import Link from "next/link";

import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";

export default async function FeaturedCollection() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,

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
        take: 2,
        select: {
          url: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 sm:py-32 lg:px-12">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-4xl text-center sm:mb-24">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.55em]
            text-neutral-400
            sm:text-xs
          "
        >
          FEATURED COLLECTION
        </p>

        <h2
          className="
            mt-5
            text-4xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            sm:mt-6
            sm:text-5xl
            md:text-6xl
          "
        >
          Editor's Selection
        </h2>

        <div
          className="
            mx-auto
            mt-7
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
            sm:mt-8
          "
        />

        <p
          className="
            mx-auto
            mt-7
            max-w-3xl
            px-2
            text-[15px]
            leading-7
            text-neutral-500
            sm:mt-8
            sm:px-0
            sm:text-lg
            sm:leading-8
          "
        >
          Discover our carefully curated collection of exceptional
          luxury pieces, selected for their timeless aesthetics,
          superior craftsmanship and iconic appeal.
        </p>

        <Link
          href="/shop"
          className="
            mt-9
            inline-flex
            items-center
            rounded-full
            border
            border-black
            px-6
            py-3.5
            text-[10px]
            font-medium
            uppercase
            tracking-[0.25em]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-[#C8A96A]
            hover:bg-[#C8A96A]
            hover:text-white
            hover:shadow-lg
            sm:mt-12
            sm:px-8
            sm:py-4
            sm:text-[11px]
            sm:tracking-[0.3em]
          "
        >
          Explore Collection
        </Link>
      </div>

      {products.length === 0 ? (
        <div
          className="
            mx-auto
            flex
            max-w-3xl
            flex-col
            items-center
            rounded-[28px]
            border
            border-neutral-200
            bg-gradient-to-b
            from-white
            to-neutral-50
            px-6
            py-16
            text-center
            shadow-[0_30px_80px_rgba(0,0,0,.05)]
            sm:rounded-[36px]
            sm:px-12
            sm:py-20
          "
        >
          <h3
            className="
              text-2xl
              font-extralight
              tracking-[-0.02em]
              text-neutral-900
              sm:text-3xl
            "
          >
            Featured Collection Coming Soon
          </h3>

          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-[15px]
              leading-7
              text-neutral-500
              sm:mt-6
              sm:leading-8
            "
          >
            We are preparing our featured collection. Please check
            back soon to discover our editor's finest selections.
          </p>
        </div>
      ) : (
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
      )}
    </section>
  );
}