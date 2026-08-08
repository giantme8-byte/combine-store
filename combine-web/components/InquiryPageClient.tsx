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
    <main className="mx-auto max-w-[1440px] px-8 pb-32 pt-36 lg:px-12">
      <div className="mx-auto mb-24 max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
          INQUIRY LIST
        </p>

        <h1
          className="
            mt-6
            text-5xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            md:text-6xl
          "
        >
          Your Inquiry
        </h1>

        <div
          className="
            mx-auto
            mt-8
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
          "
        />

        <p
          className="
            mx-auto
            mt-8
            max-w-3xl
            text-lg
            leading-8
            text-neutral-500
          "
        >
          Save the luxury pieces you&apos;re interested in and send us
          an enquiry. Our team will prepare availability, pricing
          and shipping details for you.
        </p>

        <p
          className="
            mt-10
            text-xs
            uppercase
            tracking-[0.35em]
            text-neutral-400
          "
        >
          {items.length} Selected Item
          {items.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-neutral-500">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div
          className="
            mx-auto
            flex
            max-w-3xl
            flex-col
            items-center
            rounded-[36px]
            border
            border-neutral-200
            bg-gradient-to-b
            from-white
            to-neutral-50
            px-12
            py-20
            text-center
            shadow-[0_30px_80px_rgba(0,0,0,.05)]
          "
        >
          <div
            className="
              flex
              h-28
              w-28
              items-center
              justify-center
              rounded-full
              bg-neutral-100
              text-5xl
            "
          >
            👜
          </div>

          <h2
            className="
              mt-10
              text-5xl
              font-extralight
              tracking-[-0.04em]
            "
          >
            Your Inquiry
            <br />
            is Empty
          </h2>

          <p
            className="
              mt-8
              max-w-xl
              text-lg
              leading-9
              text-neutral-500
            "
          >
            Add your favourite luxury pieces to your inquiry list.
            When you&apos;re ready, we&apos;ll prepare pricing, availability
            and shipping details for you.
          </p>

          <Link
            href="/shop"
            className="
              mt-12
              inline-flex
              rounded-full
              bg-black
              px-10
              py-4
              text-sm
              uppercase
              tracking-[0.3em]
              text-white
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#C8A96A]
              hover:shadow-xl
            "
          >
            Browse Collection
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
                  className="
                    flex
                    flex-col
                    gap-8
                    rounded-[32px]
                    border
                    border-neutral-200
                    bg-white
                    p-8
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_25px_70px_rgba(0,0,0,.06)]
                    lg:flex-row
                    lg:items-center
                  "
                >
                  <div className="flex flex-1 items-center gap-6">
                    <div
                      className="
                        h-40
                        w-40
                        shrink-0
                        overflow-hidden
                        rounded-[24px]
                        border
                        border-neutral-200
                        bg-gradient-to-b
                        from-white
                        to-neutral-100
                        p-4
                      "
                    >
                      {product?.images?.[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={160}
                          height={160}
                          sizes="160px"
                          className="
                            h-full
                            w-full
                            object-contain
                          "
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p
                        className="
                          text-[11px]
                          uppercase
                          tracking-[0.4em]
                          text-neutral-400
                        "
                      >
                        {product?.brand}
                      </p>

                      <h2
                        className="
                          mt-3
                          mb-4
                          text-3xl
                          font-extralight
                          tracking-[-0.03em]
                          text-neutral-900
                        "
                      >
                        {product?.name}
                      </h2>

                      <div
                        className="
                          mt-6
                          space-y-2
                          text-sm
                          leading-7
                          text-neutral-500
                        "
                      >
                        <p>SKU: {product?.sku ?? "-"}</p>

                        <p>Model: {product?.model ?? "-"}</p>

                        <p>Status: {product?.availability}</p>
                      </div>

                      <p
                        className="
                          mt-8
                          text-[11px]
                          uppercase
                          tracking-[0.3em]
                          text-neutral-400
                        "
                      >
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
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      self-center
                      rounded-full
                      border
                      border-neutral-300
                      px-6
                      py-3
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.25em]
                      text-neutral-600
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-red-500
                      hover:bg-red-500
                      hover:text-white
                      hover:shadow-lg
                    "
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div
            className="
              mt-16
              flex
              flex-wrap
              items-center
              justify-end
              gap-4
              border-t
              border-neutral-200
              pt-10
            "
          >
            <button
              type="button"
              onClick={clearInquiry}
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                border
                border-neutral-300
                px-8
                py-4
                text-[11px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-neutral-700
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-red-500
                hover:bg-red-500
                hover:text-white
                hover:shadow-lg
              "
            >
              Clear Inquiry
            </button>

            <Link
              href="/inquiry/checkout"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                bg-black
                px-10
                py-4
                text-[11px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#C8A96A]
                hover:shadow-xl
              "
            >
              Continue →
            </Link>
          </div>
        </>
      )}
    </main>
  );
}