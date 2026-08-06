"use client";

import {
  MouseEvent,
  useEffect,
  useState,
} from "react";

import { Heart } from "lucide-react";
import { toast } from "sonner";

type Props = {
  productId: number;
  variant?: "button" | "icon";
};

export default function WishlistButton({
  productId,
  variant = "button",
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const res = await fetch(
          `/api/wishlist?productId=${productId}`
        );

        if (!res.ok) return;

        const data =
          await res.json();

        setSaved(data.saved);
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error
        );
      }
    }

    loadWishlist();
  }, [productId]);

  async function handleWishlist(
    e: MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        "/api/wishlist",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        }
      );

      const data =
        await res.json();

      if (data.success) {
        setSaved(data.saved);

        toast.success(
          data.saved
            ? "Added to wishlist."
            : "Removed from wishlist."
        );
      } else if (data.message) {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(
        "Failed to update wishlist:",
        error
      );

      toast.error(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleWishlist}
        disabled={loading}
        aria-label="Toggle Wishlist"
        aria-pressed={saved}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/30
          bg-white/80
          shadow-lg
          backdrop-blur-md
          transition-all
          duration-300
          hover:scale-110
          hover:shadow-xl
          disabled:opacity-50
        "
      >
        <Heart
          size={20}
          className={`transition-all duration-300 ${
            saved
              ? "fill-red-500 text-red-500 scale-110"
              : "text-neutral-700"
          }`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={loading}
      aria-pressed={saved}
      className={`
        group
        relative
        inline-flex
        w-full
        items-center
        justify-center
        gap-3
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
        disabled:opacity-50
        ${
          saved
            ? "border-red-500 bg-red-500 text-white shadow-lg"
            : "border-neutral-300 bg-white text-black hover:-translate-y-1 hover:border-black hover:shadow-xl"
        }
      `}
    >
      {!saved && (
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

      <Heart
        size={18}
        className={`relative z-10 transition-all duration-300 ${
          saved
            ? "fill-white text-white"
            : "group-hover:fill-white group-hover:text-white"
        }`}
      />

      <span
        className={`relative z-10 transition-colors duration-300 ${
          !saved &&
          "group-hover:text-white"
        }`}
      >
        {loading
          ? "Loading..."
          : saved
          ? "Saved"
          : "Save"}
      </span>
    </button>
  );
}