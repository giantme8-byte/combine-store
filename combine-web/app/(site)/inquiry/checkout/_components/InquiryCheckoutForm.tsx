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

export default function InquiryCheckoutForm() {
  const {
    items,
    totalItems,
    removeItem,
    clearInquiry,
  } = useInquiry();

  const [message, setMessage] =
    useState("");

  const [products, setProducts] =
    useState<InquiryProduct[]>([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (items.length === 0) {
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);

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
            `/api/inquiry/products?ids=${encodeURIComponent(
              ids
            )}`
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load products."
          );
        }

        const data =
          await response.json();

        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to load inquiry products:",
          error
        );

        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, [items]);

  const productMap = useMemo(() => {
    return new Map(
      products.map((product) => [
        product.id,
        product,
      ])
    );
  }, [products]);

  async function handleWhatsApp() {
    if (
      loadingProducts ||
      items.length === 0
    ) {
      return;
    }

    /*
     * The inquiry API is currently only
     * a placeholder and does not persist
     * submissions yet.
     *
     * We intentionally keep this call here
     * for future Checkout / Inquiry backend
     * integration.
     */
    try {
      await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: "WhatsApp Customer",
          whatsapp: "-",
          message,
          items,
        }),
      });
    } catch (error) {
      console.error(
        "Inquiry API request failed:",
        error
      );
    }

    const lines: string[] = [];

    lines.push(
      "Hi COMBINE 👋"
    );

    lines.push("");

    lines.push(
      "I'd like to enquire about the following products."
    );

    lines.push("");

    lines.push(
      "────────────────"
    );

    lines.push("");

    items.forEach(
      (item, index) => {
        const product =
          productMap.get(
            item.productId
          );

        lines.push(
          `${index + 1}.`
        );

        lines.push("");

        lines.push(
          `Brand: ${
            product?.brand ?? "-"
          }`
        );

        lines.push(
          `Product: ${
            product?.name ?? "-"
          }`
        );

        lines.push(
          `SKU: ${
            product?.sku ?? "-"
          }`
        );

        if (item.color) {
          lines.push(
            `Colour: ${item.color}`
          );
        }

        if (item.variant) {
          lines.push(
            `Size: ${item.variant}`
          );
        }

        if (item.dimensions) {
          lines.push(
            `Dimensions: ${item.dimensions}`
          );
        }

        if (item.packaging) {
          lines.push(
            `Packaging: ${item.packaging}`
          );
        }

        lines.push(
          `Quantity: ${item.quantity}`
        );

        if (product?.slug) {
          lines.push("");

          lines.push(
            "Product Link:"
          );

          lines.push(
            `${window.location.origin}/shop/${product.slug}`
          );
        }

        lines.push("");

        lines.push(
          "────────────────"
        );

        lines.push("");

        lines.push("");
      }
    );

    if (message.trim()) {
      lines.push(
        "Additional Notes:"
      );

      lines.push(
        message.trim()
      );

      lines.push("");

      lines.push(
        "────────────────"
      );

      lines.push("");
    }

    lines.push(
      "Please let me know the latest price, availability and colour options."
    );

    lines.push("");

    lines.push(
      "Thank you. I look forward to your reply."
    );

    try {
      const response =
        await fetch(
          "/api/settings"
        );

      if (!response.ok) {
        throw new Error(
          "Failed to load settings."
        );
      }

      const {
        whatsappNumber,
      } = await response.json();

      const cleanNumber =
        String(
          whatsappNumber ?? ""
        ).replace(/\D/g, "");

      if (!cleanNumber) {
        throw new Error(
          "WhatsApp number is not configured."
        );
      }

      const whatsappUrl =
        `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
          lines.join("\n")
        )}`;

      const newWindow =
        window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer"
        );

      if (newWindow) {
        clearInquiry();
      } else {
        window.location.href =
          whatsappUrl;

        clearInquiry();
      }
    } catch (error) {
      console.error(
        "Failed to open WhatsApp:",
        error
      );
    }
  }

  return (
    <div className="space-y-12">
      <div className="mx-auto mb-24 max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
          CHECKOUT
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
          Inquiry Checkout
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
          Review your selected luxury
          pieces before continuing to
          WhatsApp. We&apos;ll prepare
          pricing, availability and
          shipping information for you.
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
          {totalItems} Selected Item
          {totalItems === 1
            ? ""
            : "s"}
        </p>
      </div>

      <div className="space-y-10">
        <section
          className="
            rounded-[36px]
            border
            border-neutral-200
            bg-white
            p-10
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
          "
        >
          <h2
            className="
              text-3xl
              font-extralight
              tracking-[-0.03em]
              text-neutral-900
            "
          >
            Selected Products
          </h2>

          <div
            className="
              mx-auto
              mt-6
              h-px
              w-16
              bg-gradient-to-r
              from-[#C8A96A]
              to-transparent
            "
          />

          {loadingProducts ? (
            <div className="mt-6 text-neutral-500">
              Loading products...
            </div>
          ) : items.length === 0 ? (
            <div className="mt-6 text-neutral-500">
              Your inquiry list is empty.
            </div>
          ) : (
            <div className="mt-10 space-y-6">
              {items.map((item) => {
                const product =
                  productMap.get(
                    item.productId
                  );

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
                      items-center
                      gap-6
                      rounded-[28px]
                      border
                      border-neutral-200
                      bg-gradient-to-b
                      from-white
                      to-neutral-50
                      p-6
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-lg
                    "
                  >
                    <div
                      className="
                        h-36
                        w-36
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
                      {product?.images?.[0]
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
                          width={144}
                          height={144}
                          sizes="144px"
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

                      <h3
                        className="
                          mt-3
                          mb-4
                          text-2xl
                          font-extralight
                          tracking-[-0.03em]
                          text-neutral-900
                        "
                      >
                        {product?.name ??
                          `Product #${item.productId}`}
                      </h3>

                      <p className="text-sm leading-7 text-neutral-500">
                        SKU:{" "}
                        {product?.sku ??
                          "-"}
                      </p>

                      {item.color && (
                        <p className="text-sm leading-7 text-neutral-500">
                          Colour:{" "}
                          {item.color}
                        </p>
                      )}

                      {item.variant && (
                        <p className="text-sm leading-7 text-neutral-500">
                          Size:{" "}
                          {item.variant}
                        </p>
                      )}

                      {item.dimensions && (
                        <p className="text-sm leading-7 text-neutral-500">
                          Dimensions:{" "}
                          {
                            item.dimensions
                          }
                        </p>
                      )}

                      {item.packaging && (
                        <p className="text-sm leading-7 text-neutral-500">
                          Packaging:{" "}
                          {
                            item.packaging
                          }
                        </p>
                      )}

                      <p className="text-sm leading-7 text-neutral-500">
                        Quantity:{" "}
                        {item.quantity}
                      </p>
                    </div>

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
          )}
        </section>

        {items.length > 0 && (
          <>
            <section
              className="
                rounded-[36px]
                border
                border-neutral-200
                bg-white
                p-10
                shadow-[0_20px_60px_rgba(0,0,0,.04)]
              "
            >
              <h2
                className="
                  text-3xl
                  font-extralight
                  tracking-[-0.03em]
                  text-neutral-900
                "
              >
                Additional Notes
              </h2>

              <div
                className="
                  mt-6
                  h-px
                  w-16
                  bg-gradient-to-r
                  from-[#C8A96A]
                  to-transparent
                "
              />

              <p className="mt-2 text-sm text-neutral-500">
                Add any special requests,
                preferred colour, size,
                quantity or other details
                you&apos;d like us to know.
              </p>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                rows={6}
                maxLength={500}
                placeholder={`Example:
• Looking for black colour.
• Need 2 pieces.
• Please send more photos.`}
                className="
                  mt-8
                  w-full
                  rounded-[24px]
                  border
                  border-neutral-200
                  bg-neutral-50
                  px-6
                  py-5
                  text-[15px]
                  leading-8
                  text-neutral-700
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[#C8A96A]
                  focus:bg-white
                  focus:shadow-lg
                "
              />
            </section>

            <div
              className="
                mt-16
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
                border-t
                border-neutral-200
                pt-10
              "
            >
              <Link
                href="/inquiry"
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
                  hover:border-black
                  hover:bg-neutral-100
                  hover:shadow-lg
                "
              >
                ← Back
              </Link>

              <button
                type="button"
                onClick={
                  handleWhatsApp
                }
                disabled={
                  loadingProducts
                }
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
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loadingProducts
                  ? "Loading..."
                  : "Continue on WhatsApp →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}