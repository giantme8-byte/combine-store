"use client";

import {
  MouseEvent,
  useEffect,
  useState,
} from "react";

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

  // 进入页面时读取收藏状态
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
        console.error("Failed to load wishlist:", error);
      }
    }

    loadWishlist();
  }, [productId]);

  async function handleWishlist(
    e: MouseEvent<HTMLButtonElement>
  ) {
    // 防止 ProductCard 的 Link 被触发
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSaved(data.saved);
      } else if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setLoading(false);
    }
  }

  // ==========================
  // Product Card (Icon)
  // ==========================
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleWishlist}
        disabled={loading}
        aria-label="Toggle Wishlist"
        aria-pressed={saved}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "..." : saved ? "❤️" : "🤍"}
      </button>
    );
  }

  // ==========================
  // Product Detail Button
  // ==========================
  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={loading}
      aria-pressed={saved}
      className={`inline-flex min-w-[240px] items-center justify-center rounded-full border px-8 py-4 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
        saved
          ? "border-red-500 bg-red-500 text-white"
          : "border-black hover:bg-black hover:text-white"
      }`}
    >
      {loading
        ? "Loading..."
        : saved
        ? "❤️ Saved to Wishlist"
        : "♡ Add to Wishlist"}
    </button>
  );
}