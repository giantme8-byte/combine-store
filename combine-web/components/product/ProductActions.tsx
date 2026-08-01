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

  const [loading, setLoading] = useState(false);

  // Use selected option first.
  // If there is no selectable option,
  // fallback to the product default.
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

    const response = await fetch(
      "/api/settings"
    );

    const settings =
      await response.json();

    const whatsappNumber =
      settings.whatsappNumber.replace(
        /\D/g,
        ""
      );

    const url =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      url,
      "_blank"
    );

    setLoading(false);
  }

  return (
    <div className="mt-6">
      <div className="border-t border-neutral-200 pt-8">

        <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-neutral-400">
          Contact Us
        </p>


        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={loading}
          className="
            flex
            w-full
            items-center
            justify-center
            rounded-full
            bg-black
            px-8
            py-5
            text-sm
            font-medium
            uppercase
            tracking-[0.22em]
            text-white
            transition
            duration-300
            hover:bg-neutral-800
            disabled:opacity-50
          "
        >
          {loading
            ? "Opening..."
            : "WhatsApp Inquiry →"}
        </button>


        <div className="mt-5 grid grid-cols-2 gap-4">

<AddToInquiryButton
  productId={productId}
  color={selectedColor?.name}
  variant={selectedVariant?.size}
  dimensions={selectedVariant?.dimensions ?? undefined}
/>


          <WishlistButton
            productId={productId}
          />

        </div>

      </div>
    </div>
  );
}