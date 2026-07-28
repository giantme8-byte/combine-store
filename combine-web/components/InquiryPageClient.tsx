"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Image from "next/image";

import { useInquiry } from "@/components/providers/InquiryProvider";

type ProductImage = {
  id: number;
  url: string;
};

type InquiryProduct = {
  id: number;
  sku: string | null;
  brand: string;
  name: string;
  model: string | null;
  price: number;
  availability: string;
  images: ProductImage[];
};

export default function InquiryPageClient() {
const {
  items,
  removeItem,
  updateQuantity,
  clearInquiry,
} = useInquiry();

  const [products, setProducts] = useState<
    InquiryProduct[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (items.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const ids = items
          .map((item) => item.productId)
          .join(",");

        const response = await fetch(
          `/api/inquiry/products?ids=${ids}`
        );

        if (!response.ok) {
          throw new Error("Failed to load products.");
        }

        const data: InquiryProduct[] =
          await response.json();

        console.log(data);
console.log("Inquiry Products", data);
setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [items]);

  const inquiryProducts = useMemo<
  Array<{
    productId: number;
    quantity: number;
    product: InquiryProduct | undefined;
  }>
>(() => {
    return items.map((item) => ({
      ...item,
      product: products.find(
        (product) => product.id === item.productId
      ),
    }));
  }, [items, products]);

return (
  <main className="mx-auto max-w-7xl px-6 py-20">
    <div className="mb-16 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-neutral-400">
        COMBINE
      </p>

      <h1 className="mt-4 text-5xl font-light">
        Inquiry List
      </h1>

      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-neutral-400">
        {items.length} Item
        {items.length === 1 ? "" : "s"}
      </p>

      <p className="mt-6 text-neutral-500">
        Add your favourite products and submit an inquiry.
      </p>
    </div>

    {loading ? (
      <div className="py-24 text-center text-neutral-500">
        Loading...
      </div>
    ) : items.length === 0 ? (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-light">
          Your inquiry list is empty.
        </h2>

        <p className="mt-4 text-neutral-500">
          Browse our collection and add products you like.
        </p>

        <Link
          href="/shop"
          className="mt-10 inline-flex rounded-full border border-black px-8 py-3 transition hover:bg-black hover:text-white"
        >
          Browse Products
        </Link>
      </div>
    ) : (
      <>
        <div className="space-y-6">
          {inquiryProducts.map((item) => {
            const product = item.product;

            return (
              <div
                key={item.productId}
                className="flex items-center justify-between rounded-2xl border p-6"
              >
                <div className="flex flex-1 items-center gap-6">
                  <div className="h-28 w-28 overflow-hidden rounded-xl border bg-neutral-100">
                    {product?.images?.[0]?.url ? (
<Image
  src={product.images[0].url}
  alt={product.name}
  width={112}
  height={112}
  sizes="112px"
  className="h-full w-full object-cover"
/>
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                      {product?.brand}
                    </p>

                    <h2 className="mt-1 text-xl font-medium">
                      {product?.name}
                    </h2>

                    <div className="mt-3 space-y-1 text-sm text-neutral-500">
                      <p>SKU: {product?.sku ?? "-"}</p>

                      <p>Model: {product?.model ?? "-"}</p>

                      <p>Status: {product?.availability}</p>
                    </div>

                    <p className="mt-4 text-sm text-neutral-500">
                      Quantity
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border"
                      >
                        −
                      </button>

                      <span className="w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeItem(item.productId)
                  }
                  className="rounded-full border border-red-500 px-5 py-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
<button
  onClick={clearInquiry}
  className="rounded-full border border-neutral-300 px-8 py-3 transition hover:bg-neutral-100"
>
  Clear Inquiry
</button>

<Link
  href="/inquiry/checkout"
  className="rounded-full bg-black px-8 py-3 text-white transition hover:bg-neutral-800"
>
  Continue
</Link>
        </div>
      </>
    )}
  </main>
);
}