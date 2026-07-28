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

export default function InquiryButton({
  productId,
  variant = "button",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadInquiry() {
      try {
        const res = await fetch(
          `/api/inquiry?productId=${productId}`
        );

        if (!res.ok) return;

        const data = await res.json();

        setAdded(data.added);
      } catch (error) {
        console.error(error);
      }
    }

    loadInquiry();
  }, [productId]);

  async function handleInquiry(
    e: MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/inquiry", {
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
        setAdded(data.added);
      } else if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleInquiry}
        disabled={loading}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
      >
        {loading
          ? "..."
          : added
          ? "📋"
          : "➕"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleInquiry}
      disabled={loading}
      className={`inline-flex w-fit items-center justify-center rounded-full border px-8 py-4 transition-all duration-300 ${
        added
          ? "border-black bg-black text-white"
          : "border-black text-black hover:bg-black hover:text-white"
      }`}
    >
      {loading
        ? "Loading..."
        : added
        ? "✓ Added to Inquiry"
        : "📋 Add to Inquiry"}
    </button>
  );
}