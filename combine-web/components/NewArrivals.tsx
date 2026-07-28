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
      <div className="mx-auto mb-24 max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">
          NEW ARRIVALS
        </p>

        <h2 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-6xl">
          Latest Arrivals
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-500">
          Explore our newest arrivals, carefully selected for timeless
          craftsmanship and modern elegance.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-neutral-300 py-24 text-center">
          <h3 className="text-3xl font-extralight tracking-[-0.02em] text-neutral-900">
            New Arrivals Coming Soon
          </h3>

          <p className="mx-auto mt-6 max-w-lg leading-8 text-neutral-500">
            Our latest collection is currently being curated.
            Please check back soon for new arrivals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug ?? ""}
              brand={product.brand}
              name={product.name}
              model={product.model}
              image={product.images[0]?.url ?? "/placeholder.png"}
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