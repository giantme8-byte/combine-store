import Link from "next/link";

import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";

export default async function BestSellers() {
  const products = await prisma.product.findMany({
    where: {
      bestSeller: true,
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
    <section
      className="
        mx-auto
        max-w-[1440px]
        px-4
        py-20
        sm:px-8
        sm:py-32
        lg:px-12
      "
    >
      {/* Header */}
      <div
        className="
          mx-auto
          mb-16
          max-w-4xl
          text-center
          sm:mb-24
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.45em]
            text-neutral-400
            sm:text-xs
            sm:tracking-[0.55em]
          "
        >
          BEST SELLERS
        </p>

        <h2
          className="
            mt-5
            text-3xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            sm:mt-6
            sm:text-5xl
            md:text-6xl
          "
        >
          Our Signature Pieces
        </h2>

        <div
          className="
            mx-auto
            mt-6
            h-px
            w-16
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
            sm:mt-8
            sm:w-20
          "
        />

        <p
          className="
            mx-auto
            mt-6
            max-w-3xl
            text-sm
            leading-7
            text-neutral-500
            sm:mt-8
            sm:text-lg
            sm:leading-8
          "
        >
          Explore our most sought-after luxury pieces, selected for
          timeless elegance, exceptional craftsmanship and enduring
          popularity among our clients worldwide.
        </p>

        <Link
          href="/shop"
          className="
            mt-8
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
          View Collection
        </Link>
      </div>

      {products.length === 0 ? (
        <div
          className="
            rounded-[28px]
            border
            border-dashed
            border-neutral-300
            px-6
            py-20
            text-center
            sm:rounded-[32px]
            sm:py-24
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
            Our Signature Collection Is Coming Soon
          </h3>

          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-sm
              leading-7
              text-neutral-500
              sm:mt-6
              sm:text-base
              sm:leading-8
            "
          >
            We are curating our most iconic luxury pieces. Please check
            back soon for our signature selection.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-6
            lg:grid-cols-4
            lg:gap-8
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