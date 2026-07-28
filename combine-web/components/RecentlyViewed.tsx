"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";
import { getRecentlyViewed } from "@/lib/recentlyViewed";

type Product = {
  id: number;
  sku: string | null;
  brand: string;
  name: string;
  slug: string | null;
  model: string | null;

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  limited: boolean;
  onSale: boolean;

  images: {
    url: string;
  }[];
};

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const slugs = getRecentlyViewed();

      if (slugs.length === 0) {
        return;
      }

      const response = await fetch(
        `/api/recently-viewed?slugs=${encodeURIComponent(
          slugs.join(",")
        )}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setProducts(data);
    }

    loadProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-40">
      <div className="mb-16 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
          RECENTLY VIEWED
        </p>

        <h2 className="mt-5 text-5xl font-extralight tracking-[-0.03em]">
          Recently Viewed
        </h2>
      </div>

<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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