"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useInquiry } from "@/components/providers/InquiryProvider";

type InquiryProduct = {
  id: number;
  sku: string;
  brand: string;
  name: string;
  slug: string | null;
  images: {
    url: string;
  }[];
};

export default function InquiryCheckoutForm() {
  const { items, clearInquiry } = useInquiry();

  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<InquiryProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

useEffect(() => {
  async function loadProducts() {
    if (items.length === 0) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }

    try {
      const ids = items.map((item) => item.productId).join(",");

      const response = await fetch(
        `/api/inquiry/products?ids=${encodeURIComponent(ids)}`
      );

      if (!response.ok) {
        throw new Error("Failed to load products.");
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProducts(false);
    }
  }

  loadProducts();
}, [items]);

  const productMap = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  async function handleWhatsApp() {
    if (loadingProducts || items.length === 0) {
      return;
    }

  await fetch("/api/inquiry", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "WhatsApp Customer",
    whatsapp: "-",
    message,

    items,
  }),
});  

    const lines: string[] = [];

lines.push("Hi COMBINE 👋");
lines.push("");
lines.push("I&apos;d like to enquire about the following products.");
lines.push("");
lines.push("────────────────");
lines.push("");

    items.forEach((item, index) => {
      const product = productMap.get(item.productId);

lines.push(`${index + 1}.`);
lines.push("");
lines.push(`Brand: ${product?.brand ?? "-"}`);
lines.push(`Product: ${product?.name ?? "-"}`);
lines.push(`SKU: ${product?.sku ?? "-"}`);

if (item.color) {
  lines.push(`Colour: ${item.color}`);
}

if (item.variant) {
  lines.push(`Size: ${item.variant}`);
}

if (item.dimensions) {
  lines.push(`Dimensions: ${item.dimensions}`);
}

lines.push(`Quantity: ${item.quantity}`);

if (product?.slug) {
  lines.push("");
  lines.push("Product Link:");
  lines.push(`${window.location.origin}/shop/${product.slug}`);
}

lines.push("");

lines.push("────────────────");
lines.push("");
lines.push("");
    });

if (message.trim()) {
  lines.push("Additional Notes:");
  lines.push(message.trim());
  lines.push("");
  lines.push("────────────────");
  lines.push("");
}

lines.push(
  "Please let me know the latest price, availability and colour options."
);
    lines.push("");
    lines.push("Thank you. I look forward to your reply.");

const response = await fetch("/api/settings");

if (!response.ok) {
  throw new Error("Failed to load settings.");
}

const { whatsappNumber } = await response.json();

const whatsappUrl =
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    lines.join("\n")
  )}`;

    const newWindow = window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (newWindow) {
      clearInquiry();
    } else {
      window.location.href = whatsappUrl;
      clearInquiry();
    }
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-neutral-400">
          COMBINE
        </p>

        <h1 className="mt-4 text-5xl font-light">
          Inquiry Details
        </h1>

        <p className="mt-4 text-neutral-500">
          Review your selected products and continue your inquiry via WhatsApp.
        </p>
      </div>

      <div className="space-y-10">
        <section className="rounded-3xl border border-neutral-200 p-8">
          <h2 className="text-xl font-medium">
            Selected Products
          </h2>

          {loadingProducts ? (
            <div className="mt-6 text-neutral-500">
              Loading products...
            </div>
          ) : items.length === 0 ? (
            <div className="mt-6 text-neutral-500">
              Your inquiry list is empty.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item) => {
                const product = productMap.get(item.productId);

                return (
                  <div
                    key={item.productId}
                    className="flex items-center gap-5 rounded-xl border p-4"
                  >
                    <div className="h-28 w-28 overflow-hidden rounded-xl border bg-neutral-100">
                      {product?.images?.[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={112}
                          height={112}
                          sizes="112px"
                          className="h-28 w-28 object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                        {product?.brand}
                      </p>

                      <p className="mt-1 font-medium">
                        {product?.name ?? `Product #${item.productId}`}
                      </p>

<p className="mt-1 text-sm text-neutral-500">
  SKU: {product?.sku ?? "-"}
</p>

{item.color && (
  <p className="mt-1 text-sm text-neutral-500">
    Colour: {item.color}
  </p>
)}

{item.variant && (
  <p className="mt-1 text-sm text-neutral-500">
    Size: {item.variant}
  </p>
)}

{item.dimensions && (
  <p className="mt-1 text-sm text-neutral-500">
    Dimensions: {item.dimensions}
  </p>
)}

<p className="mt-1 text-sm text-neutral-500">
  Quantity: {item.quantity}
</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {items.length > 0 && (
          <>
            <section className="rounded-3xl border border-neutral-200 p-8">
<h2 className="text-xl font-medium">
  Additional Notes (Optional)
</h2>

<p className="mt-2 text-sm text-neutral-500">
  Add any special requests, preferred colour, size, quantity or other details
  you&apos;d like us to know.
</p>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={500}
                placeholder={`Example:
• Looking for black colour.
• Need 2 pieces.
• Please send more photos.`}
                className="mt-6 w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
              />
            </section>

            <div className="flex flex-wrap justify-between gap-4">
              <Link
                href="/inquiry"
                className="rounded-full border px-8 py-3 transition hover:bg-neutral-100"
              >
                Back
              </Link>

              <button
                type="button"
                onClick={handleWhatsApp}
                disabled={loadingProducts}
                className="rounded-full bg-black px-10 py-3 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingProducts
                  ? "Loading..."
                  : "Continue on WhatsApp"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}