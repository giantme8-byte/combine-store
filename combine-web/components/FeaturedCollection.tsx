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
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  return (
    <section className="mx-auto max-w-[1440px] px-8 py-32 lg:px-12">
      {/* Header */}
      <div className="mx-auto mb-24 max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
          FEATURED COLLECTION
        </p>

        <h2
          className="
            mt-6
            text-5xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            md:text-6xl
          "
        >
          Editor's Selection
        </h2>

        <div
          className="
            mx-auto
            mt-8
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
          "
        />

        <p
          className="
            mx-auto
            mt-8
            max-w-3xl
            text-lg
            leading-8
            text-neutral-500
          "
        >
          Discover our carefully curated collection of exceptional
          luxury pieces, selected for their timeless aesthetics,
          superior craftsmanship and iconic appeal.
        </p>

        <Link
          href="/shop"
          className="
            mt-12
            inline-flex
            items-center
            rounded-full
            border
            border-black
            px-8
            py-4
            text-[11px]
            font-medium
            uppercase
            tracking-[0.3em]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-[#C8A96A]
            hover:bg-[#C8A96A]
            hover:text-white
            hover:shadow-lg
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
    rounded-[36px]
    border
    border-neutral-200
    bg-gradient-to-b
    from-white
    to-neutral-50
    px-12
    py-20
    text-center
    shadow-[0_30px_80px_rgba(0,0,0,.05)]
  "
>
          <h3 className="text-3xl font-extralight tracking-[-0.02em] text-neutral-900">
            Featured Collection Coming Soon
          </h3>

          <p className="mx-auto mt-6 max-w-xl leading-8 text-neutral-500">
            We are preparing our featured collection. Please check
            back soon to discover our editor's finest selections.
          </p>
        </div>
      ) : (
        <div
  className="
    grid
    grid-cols-1
    gap-x-10
    gap-y-16
    sm:grid-cols-2
    xl:grid-cols-3
    2xl:grid-cols-4
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
              image={product.images[0]?.url ?? "/placeholder.png"}
              secondImage={product.images[1]?.url}
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