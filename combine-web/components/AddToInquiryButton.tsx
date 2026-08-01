"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useInquiry } from "@/components/providers/InquiryProvider";

type Props = {
  productId: number;

  color?: string;
  variant?: string;
  dimensions?: string;
  packaging?: string;
};

export default function AddToInquiryButton({
  productId,
  color,
  variant,
  dimensions,
  packaging,
}: Props) {
  const {
    addItem,
    isInInquiry,
    openDrawer,
  } = useInquiry();

  const [loading, setLoading] = useState(false);

  const added = isInInquiry(productId);

  function handleAdd() {
    if (loading) return;

    setLoading(true);

    try {
      addItem(productId, {
  color,
  variant,
  dimensions,
  packaging,
});

      openDrawer();

      toast.success(
        "Added to inquiry."
      );

    } catch (error) {
      console.error(
        "Failed to add inquiry:",
        error
      );

      toast.error(
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={loading}
      className={`
        inline-flex
        w-full
        items-center
        justify-center
        rounded-full
        border
        px-8
        py-4
        text-sm
        font-medium
        uppercase
        tracking-[0.25em]
        transition-all
        duration-300
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          added
            ? "border-green-600 bg-green-600 text-white"
            : "border-black text-black hover:bg-black hover:text-white"
        }
      `}
    >
      {loading
        ? "Adding..."
        : added
        ? "✓ Added"
        : "Add to Inquiry"}
    </button>
  );
}