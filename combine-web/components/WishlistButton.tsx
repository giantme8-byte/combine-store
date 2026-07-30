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
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const res = await fetch(
          `/api/wishlist?productId=${productId}`
        );

        if (!res.ok) return;

        const data = await res.json();

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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        }
      );

      const data = await res.json();

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
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-white/90
          shadow-lg
          backdrop-blur
          transition-all
          duration-300
          hover:scale-110
          disabled:opacity-50
        "
      >
        <Heart
          size={20}
          className={
            saved
              ? "fill-red-500 text-red-500"
              : "text-neutral-700"
          }
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
        inline-flex
        w-full
        items-center
        justify-center
        gap-2
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
        disabled:opacity-50
        ${
          saved
            ? "border-red-500 bg-red-500 text-white"
            : "border-black hover:bg-black hover:text-white"
        }
      `}
    >
      <Heart
        size={18}
        className={
          saved
            ? "fill-white"
            : ""
        }
      />

      {loading
        ? "Loading..."
        : saved
        ? "Saved"
        : "Add to Wishlist"}
    </button>
  );
}