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

      createdAt: true,

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
    <section className="mt-40">
      <div className="mb-12 text-center">
<p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
  DISCOVER MORE
</p>

<h2 className="mt-5 text-5xl font-extralight tracking-[-0.03em]">
  You May Also Like
</h2>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug ?? ""}
            brand={product.brand}
            name={product.name}
            model={product.model}
            image={product.images[0]?.url ?? "/placeholder.png"}
            createdAt={product.createdAt}
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