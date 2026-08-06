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

  const [loading, setLoading] =
    useState(false);

  const added =
    isInInquiry(productId);

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
        group
        relative
        inline-flex
        w-full
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        px-8
        py-4
        text-sm
        font-semibold
        uppercase
        tracking-[0.28em]
        transition-all
        duration-500
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          added
            ? "border-green-600 bg-green-600 text-white shadow-lg"
            : "border-neutral-300 bg-white text-black hover:-translate-y-1 hover:border-black hover:shadow-xl"
        }
      `}
    >
      {!added && (
        <span
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-neutral-900
            via-neutral-700
            to-neutral-900
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
          "
        />
      )}

      <span
        className={`
          relative
          z-10
          transition-colors
          duration-300
          ${
            !added &&
            "group-hover:text-white"
          }
        `}
      >
        {loading
          ? "Adding..."
          : added
          ? "✓ Added"
          : "+ Add Inquiry"}
      </span>
    </button>
  );
}