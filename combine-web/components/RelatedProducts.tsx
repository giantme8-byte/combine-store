import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";

type Props = {
  currentId: number;
  category: string;
};

export default async function RelatedProducts({
  currentId,
  category,
}: Props) {
  const products = await prisma.product.findMany({
    where: {
      category,
      NOT: {
        id: currentId,
      },
    },
    select: {
      id: true,
      slug: true,
      brand: true,
      name: true,
      model: true,

      images: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          url: true,
        },
      },

      featured: true,
      newArrival: true,
      bestSeller: true,
      limited: true,
      onSale: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-32">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
          Luxury Collection
        </p>

        <h2 className="mt-3 text-4xl font-light">
          You May Also Like
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
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
    </section>
  );
}