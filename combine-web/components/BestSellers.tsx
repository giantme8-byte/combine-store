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
    <section className="mx-auto max-w-7xl px-6 py-40 lg:px-8">
      <div className="mb-20 flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">
            EDITOR&apos;S PICKS
          </p>

          <h2 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-6xl">
            Curated Selection
          </h2>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-500">
            Discover a refined selection of exceptional pieces, chosen for their
            craftsmanship, timeless elegance and enduring style.
          </p>
        </div>

        <Link
          href="/shop"
          className="rounded-full border border-black px-8 py-4 text-sm uppercase tracking-[0.3em] transition-all duration-300 hover:bg-black hover:text-white"
        >
          View Collection
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-neutral-300 py-24 text-center">
          <h3 className="text-3xl font-extralight">
            Curated Collection Coming Soon
          </h3>

          <p className="mx-auto mt-6 max-w-xl text-neutral-500">
            Our curated selection is currently being updated. Please check back
            soon to discover more exceptional pieces.
          </p>
        </div>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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