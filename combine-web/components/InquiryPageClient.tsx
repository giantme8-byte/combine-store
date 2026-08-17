"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  useInquiry,
} from "@/components/providers/InquiryProvider";

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

type InquiryOptions = {
  color?: string;
  variant?: string;
  dimensions?: string;
  packaging?: string;
};

function getInquiryKey(
  productId: number,
  options?: InquiryOptions
) {
  return [
    productId,
    options?.color ?? "",
    options?.variant ?? "",
    options?.dimensions ?? "",
    options?.packaging ?? "",
  ].join("::");
}

export default function InquiryPageClient() {
  const {
    items,
    totalItems,
    removeItem,
    updateQuantity,
    clearInquiry,
  } = useInquiry();

  const [
    products,
    setProducts,
  ] = useState<InquiryProduct[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (items.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const ids = Array.from(
          new Set(
            items.map(
              (item) =>
                item.productId
            )
          )
        ).join(",");

        const response =
          await fetch(
            `/api/inquiry/products?ids=${ids}`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load products."
          );
        }

        const data: InquiryProduct[] =
          await response.json();

        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to load inquiry products:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [items]);

  const inquiryProducts =
    useMemo(() => {
      return items.map((item) => ({
        ...item,

        product:
          products.find(
            (product) =>
              product.id ===
              item.productId
          ),
      }));
    }, [items, products]);

  return (
    <main
      className="
        mx-auto
        max-w-[1440px]
        px-5
        pb-32
        pt-28
        sm:px-8
        sm:pt-36
        lg:px-12
      "
    >
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div
        className="
          mx-auto
          mb-16
          max-w-4xl
          text-center
          sm:mb-24
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.45em]
            text-neutral-400
            sm:text-xs
            sm:tracking-[0.55em]
          "
        >
          INQUIRY LIST
        </p>

        <h1
          className="
            mt-5
            text-4xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            sm:mt-6
            sm:text-5xl
            md:text-6xl
          "
        >
          Your Inquiry
        </h1>

        <div
          className="
            mx-auto
            mt-7
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
            sm:mt-8
          "
        />

        <p
          className="
            mx-auto
            mt-7
            max-w-3xl
            text-base
            leading-7
            text-neutral-500
            sm:mt-8
            sm:text-lg
            sm:leading-8
          "
        >
          Save the luxury pieces you&apos;re
          interested in and send us an enquiry.
          Our team will prepare availability,
          pricing and shipping details for you.
        </p>

        <p
          className="
            mt-8
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-neutral-400
            sm:mt-10
            sm:text-xs
            sm:tracking-[0.35em]
          "
        >
          {totalItems} Selected Item
          {totalItems === 1 ? "" : "s"}
        </p>
      </div>

      {/* ================================================= */}
      {/* Loading */}
      {/* ================================================= */}

      {loading ? (
        <div
          className="
            py-24
            text-center
            text-sm
            text-neutral-500
          "
        >
          Loading...
        </div>
      ) : items.length === 0 ? (
        /* ================================================= */
        /* Empty State */
        /* ================================================= */

        <div
          className="
            mx-auto
            flex
            max-w-3xl
            flex-col
            items-center
            rounded-[32px]
            border
            border-neutral-200
            bg-gradient-to-b
            from-white
            to-neutral-50
            px-6
            py-16
            text-center
            shadow-[0_30px_80px_rgba(0,0,0,.05)]
            sm:rounded-[36px]
            sm:px-12
            sm:py-20
          "
        >
          <div
            className="
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              bg-neutral-100
              text-4xl
              sm:h-28
              sm:w-28
              sm:text-5xl
            "
          >
            👜
          </div>

          <h2
            className="
              mt-8
              text-4xl
              font-extralight
              tracking-[-0.04em]
              sm:mt-10
              sm:text-5xl
            "
          >
            Your Inquiry
            <br />
            is Empty
          </h2>

          <p
            className="
              mt-6
              max-w-xl
              text-base
              leading-8
              text-neutral-500
              sm:mt-8
              sm:text-lg
              sm:leading-9
            "
          >
            Add your favourite luxury pieces
            to your inquiry list. When you&apos;re
            ready, we&apos;ll prepare pricing,
            availability and shipping details
            for you.
          </p>

          <Link
            href="/shop"
            className="
              mt-10
              inline-flex
              rounded-full
              bg-black
              px-8
              py-4
              text-xs
              uppercase
              tracking-[0.3em]
              text-white
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#C8A96A]
              hover:shadow-xl
              sm:mt-12
              sm:px-10
              sm:text-sm
            "
          >
            Browse Collection
          </Link>
        </div>
      ) : (
        <>
          {/* ================================================= */}
          {/* Inquiry Items */}
          {/* ================================================= */}

          <div className="space-y-6">
            {inquiryProducts.map(
              (item) => {
                const product =
                  item.product;

                if (!product) {
                  return null;
                }

                const options: InquiryOptions =
                  {
                    color:
                      item.color,
                    variant:
                      item.variant,
                    dimensions:
                      item.dimensions,
                    packaging:
                      item.packaging,
                  };

                const inquiryKey =
                  getInquiryKey(
                    item.productId,
                    options
                  );

                return (
                  <div
                    key={inquiryKey}
                    className="
                      flex
                      flex-col
                      gap-6
                      rounded-[28px]
                      border
                      border-neutral-200
                      bg-white
                      p-5
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-[0_25px_70px_rgba(0,0,0,.06)]
                      sm:gap-8
                      sm:rounded-[32px]
                      sm:p-8
                      lg:flex-row
                      lg:items-center
                    "
                  >
                    {/* ================================================= */}
                    {/* Product */}
                    {/* ================================================= */}

                    <div
                      className="
                        flex
                        flex-1
                        items-start
                        gap-4
                        sm:gap-6
                      "
                    >
                      {/* Image */}

                      <div
                        className="
                          h-28
                          w-28
                          shrink-0
                          overflow-hidden
                          rounded-[20px]
                          border
                          border-neutral-200
                          bg-gradient-to-b
                          from-white
                          to-neutral-100
                          p-3
                          sm:h-40
                          sm:w-40
                          sm:rounded-[24px]
                          sm:p-4
                        "
                      >
                        {product.images?.[0]
                          ?.url ? (
                          <Image
                            src={
                              product
                                .images[0]
                                .url
                            }
                            alt={
                              product.name
                            }
                            width={160}
                            height={160}
                            sizes="
                              (max-width: 640px) 112px,
                              160px
                            "
                            className="
                              h-full
                              w-full
                              object-contain
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              items-center
                              justify-center
                              text-xs
                              text-neutral-400
                            "
                          >
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.35em]
                            text-neutral-400
                            sm:text-[11px]
                            sm:tracking-[0.4em]
                          "
                        >
                          {product.brand}
                        </p>

                        <h2
                          className="
                            mt-2
                            text-xl
                            font-extralight
                            tracking-[-0.03em]
                            text-neutral-900
                            sm:mt-3
                            sm:text-3xl
                          "
                        >
                          {product.name}
                        </h2>

                        {product.model && (
                          <p
                            className="
                              mt-1
                              text-xs
                              text-neutral-500
                              sm:text-sm
                            "
                          >
                            {product.model}
                          </p>
                        )}

                        <div
                          className="
                            mt-5
                            space-y-2
                            text-xs
                            leading-6
                            text-neutral-500
                            sm:mt-6
                            sm:text-sm
                            sm:leading-7
                          "
                        >
                          <p>
                            <span className="font-medium text-neutral-700">
                              SKU:
                            </span>{" "}
                            {product.sku ??
                              "-"}
                          </p>

                          <p>
                            <span className="font-medium text-neutral-700">
                              Status:
                            </span>{" "}
                            {
                              product.availability
                            }
                          </p>
                        </div>

                        {/* ================================================= */}
                        {/* Selected Options */}
                        {/* ================================================= */}

                        <div
                          className="
                            mt-5
                            border-t
                            border-neutral-100
                            pt-5
                            sm:mt-6
                            sm:pt-6
                          "
                        >
                          <p
                            className="
                              text-[10px]
                              uppercase
                              tracking-[0.3em]
                              text-neutral-400
                            "
                          >
                            Selected Options
                          </p>

                          <div
                            className="
                              mt-3
                              grid
                              grid-cols-1
                              gap-2
                              text-xs
                              text-neutral-500
                              sm:grid-cols-2
                              sm:gap-x-8
                              sm:text-sm
                            "
                          >
                            <p>
                              <span className="font-medium text-neutral-700">
                                Colour:
                              </span>{" "}
                              {item.color ??
                                "-"}
                            </p>

                            <p>
                              <span className="font-medium text-neutral-700">
                                Size:
                              </span>{" "}
                              {item.variant ??
                                "-"}
                            </p>

                            <p>
                              <span className="font-medium text-neutral-700">
                                Dimensions:
                              </span>{" "}
                              {item.dimensions ??
                                "-"}
                            </p>

                            {item.packaging && (
                              <p>
                                <span className="font-medium text-neutral-700">
                                  Packaging:
                                </span>{" "}
                                {
                                  item.packaging
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        {/* ================================================= */}
                        {/* Quantity */}
                        {/* ================================================= */}

                        <div className="mt-5 sm:mt-6">
                          <p
                            className="
                              text-[10px]
                              uppercase
                              tracking-[0.3em]
                              text-neutral-400
                            "
                          >
                            Quantity
                          </p>

                          <div
                            className="
                              mt-2
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity -
                                    1,
                                  options
                                )
                              }
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-neutral-300
                                transition
                                hover:border-black
                                hover:bg-neutral-50
                              "
                            >
                              −
                            </button>

                            <span
                              className="
                                w-8
                                text-center
                                text-sm
                                font-medium
                              "
                            >
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity +
                                    1,
                                  options
                                )
                              }
                              className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-neutral-300
                                transition
                                hover:border-black
                                hover:bg-neutral-50
                              "
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ================================================= */}
                    {/* Remove */}
                    {/* ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.productId,
                          options
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        self-stretch
                        rounded-full
                        border
                        border-neutral-300
                        px-6
                        py-3
                        text-[10px]
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
                        sm:self-center
                        sm:text-[11px]
                      "
                    >
                      Remove
                    </button>
                  </div>
                );
              }
            )}
          </div>

          {/* ================================================= */}
          {/* Footer */}
          {/* ================================================= */}

          <div
            className="
              mt-12
              flex
              flex-col
              items-stretch
              gap-3
              border-t
              border-neutral-200
              pt-8
              sm:mt-16
              sm:flex-row
              sm:items-center
              sm:justify-end
              sm:gap-4
              sm:pt-10
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
                text-[10px]
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
                sm:text-[11px]
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
                text-[10px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#C8A96A]
                hover:shadow-xl
                sm:text-[11px]
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