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
    <section className="mx-auto max-w-7xl px-8 py-24">
      <div className="mb-14 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
          Editor&apos;s Picks
        </p>

        <h2 className="mt-4 text-5xl font-light">
          Featured Collection
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-gray-500">
          Explore our handpicked selection of standout pieces,
          chosen for their timeless design and refined elegance.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 py-20 text-center">
          <h3 className="text-2xl font-light">
            No Featured Collection
          </h3>

          <p className="mt-4 text-gray-500">
            Go to the Admin Dashboard and mark a product as
            <strong> Featured</strong>.
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