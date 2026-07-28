"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useInquiry } from "@/hooks/useInquiry";

export default function InquiryButton() {
  const { totalItems } = useInquiry();

  return (
    <Link
      href="/inquiry"
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all duration-300 hover:border-black hover:bg-neutral-50"
      aria-label="Inquiry"
    >
      <ShoppingBag className="h-5 w-5" />

      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[11px] font-medium text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}