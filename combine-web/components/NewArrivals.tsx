import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";

export default async function NewArrivals() {
  const products = await prisma.product.findMany({
    where: {
      newArrival: true,
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
    <section className="mx-auto max-w-[1600px] px-6 py-36 lg:px-14">

      {/* Header */}
      <div className="mx-auto mb-24 max-w-5xl text-center">

        <p
          className="
            text-[11px]
            uppercase
            tracking-[0.55em]
            text-neutral-400
          "
        >
          NEW ARRIVALS
        </p>

        <h2
          className="
            mt-7
            text-5xl
            font-extralight
            tracking-[-0.05em]
            text-neutral-950
            md:text-7xl
          "
        >
          Latest Collection
        </h2>

        <div
          className="
            mx-auto
            mt-10
            h-px
            w-28
            bg-gradient-to-r
            from-transparent
            via-[#C9A86A]
            to-transparent
          "
        />

        <p
          className="
            mx-auto
            mt-10
            max-w-3xl
            text-lg
            leading-9
            text-neutral-500
          "
        >
          Discover the newest luxury arrivals carefully selected
          for exceptional craftsmanship, timeless elegance and
          modern sophistication.
        </p>

      </div>

      {products.length === 0 ? (
        <div
          className="
            rounded-[36px]
            border
            border-dashed
            border-neutral-300
            bg-[#fafafa]
            py-28
            text-center
          "
        >
          <h3
            className="
              text-4xl
              font-extralight
              tracking-[-0.04em]
              text-neutral-900
            "
          >
            New Arrivals Coming Soon
          </h3>

          <p
            className="
              mx-auto
              mt-8
              max-w-xl
              text-lg
              leading-9
              text-neutral-500
            "
          >
            Our latest collection is currently being curated.
            Stay tuned for exclusive new arrivals.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* View All */}
          <div className="mt-20 flex justify-center">

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
                px-8
                py-4
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.3em]
                transition-all
                duration-500
                hover:border-[#C9A86A]
                hover:bg-[#C9A86A]
                hover:text-white
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
        </>
      )}

    </section>
  );
}