"use client";

import { useState } from "react";

import WishlistButton from "@/components/WishlistButton";
import AddToInquiryButton from "@/components/AddToInquiryButton";

import { useProduct } from "./ProductContext";

type ProductActionsProps = {
  productId: number;

  brand: string;
  name: string;
  sku: string | null;
  model: string | null;

  mainColor: string | null;
  dimensions: string | null;
};

export default function ProductActions({
  productId,
  brand,
  name,
  sku,
  model,
  mainColor,
  dimensions,
}: ProductActionsProps) {
  const {
    selectedColor,
    selectedVariant,
    quantity,
  } = useProduct();

  const [loading, setLoading] =
    useState(false);

  const colour =
    selectedColor?.name ??
    mainColor ??
    "-";

  const size =
    selectedVariant?.size ??
    "-";

  const itemDimensions =
    selectedVariant?.dimensions ??
    dimensions ??
    "-";

  async function handleWhatsApp() {
    setLoading(true);

    const message = `Hi COMBINE 👋

I'm interested in this item.

━━━━━━━━━━━━━━

Brand
${brand}

Product
${name}

Reference
${sku ?? "-"}

Model
${model ?? "-"}

━━━━━━━━━━━━━━

Colour
${colour}

Size
${size}

Dimensions
${itemDimensions}

Quantity
${quantity}

━━━━━━━━━━━━━━

Item ID
#${productId}

Please provide the latest price and availability.

Thank you 😊`;

    const response =
      await fetch("/api/settings");

    const settings =
      await response.json();

    const whatsappNumber =
      settings.whatsappNumber.replace(
        /\D/g,
        ""
      );

    const url =
      `https://wa.me/${whatsappNumber}` +
      `?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      "_blank"
    );

    setLoading(false);
  }

  return (
    <div
      className="
        mt-6
        sm:mt-8
      "
    >
      <div
        className="
          border-t
          border-neutral-200
          pt-6
          sm:pt-8
        "
      >
        {/* ================================================= */}
        {/* Section Title */}
        {/* ================================================= */}

        <p
          className="
            mb-4
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-neutral-400
            sm:mb-6
            sm:text-[11px]
            sm:tracking-[0.35em]
          "
        >
          Luxury Concierge
        </p>

        {/* ================================================= */}
        {/* Request Price */}
        {/* ================================================= */}

        <button
          type="button"
          onClick={
            handleWhatsApp
          }
          disabled={loading}
          className="
            group
            relative
            flex
            h-14
            w-full
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-black
            px-6
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.22em]
            text-white
            shadow-xl
            transition-all
            duration-500
            hover:-translate-y-1
            hover:shadow-2xl
            active:translate-y-0
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:h-auto
            sm:px-8
            sm:py-5
            sm:text-sm
            sm:tracking-[0.28em]
          "
        >
          {/* Luxury Hover */}

          <span
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#A88755]
              via-[#D5B47F]
              to-[#A88755]
              opacity-0
              transition-opacity
              duration-500
              group-hover:opacity-100
            "
          />

          <span
            className="
              relative
              z-10
            "
          >
            {loading
              ? "Opening..."
              : "Request Price"}
          </span>
        </button>

        {/* ================================================= */}
        {/* Secondary Actions */}
        {/* ================================================= */}

        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-2.5
            sm:mt-6
            sm:gap-4
          "
        >
          <AddToInquiryButton
            productId={
              productId
            }
            color={
              selectedColor?.name
            }
            variant={
              selectedVariant?.size
            }
            dimensions={
              selectedVariant?.dimensions ??
              undefined
            }
          />

          <WishlistButton
            productId={
              productId
            }
          />
        </div>
      </div>
    </div>
  );
}