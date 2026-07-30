"use client";

import Image from "next/image";
import Link from "next/link";

import WishlistButton from "@/components/WishlistButton";
import { useInquiry } from "@/components/providers/InquiryProvider";

import type { ProductCardProps } from "@/types";

export default function ProductCard({
  id,
  slug,
  brand,
  name,
  model,
  image,
  featured,
  newArrival,
  bestSeller,
  limited,
  onSale,
}: ProductCardProps) {
  const { addItem, openDrawer } = useInquiry();

  const productHref = slug ? `/shop/${slug}` : "/shop";

  function handleInquiry(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    addItem(id);
    openDrawer();
  }

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[32px]
        border
        border-neutral-200
        bg-white
        shadow-sm
        transition-all
        duration-700
        hover:-translate-y-2
        hover:border-[#C8A96A]/40
        hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)]
      "
    >
      <Link
        href={productHref}
        className="flex flex-1 flex-col"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
          {/* Wishlist */}
          <div
            className="
              absolute
              right-4
              top-4
              z-20
              rounded-full
              bg-white/90
              p-1.5
              shadow-md
              backdrop-blur-md
              opacity-0
              transition-all
              duration-500
              group-hover:opacity-100
            "
          >
            <WishlistButton
              productId={id}
              variant="icon"
            />
          </div>

          {/* Labels */}
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
            {newArrival && (
              <span className="rounded-full bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                NEW
              </span>
            )}

            {featured && (
              <span className="rounded-full bg-[#C8A96A] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                FEATURED
              </span>
            )}

            {bestSeller && (
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                BEST SELLER
              </span>
            )}

            {limited && (
              <span className="rounded-full border border-black bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]">
                LIMITED
              </span>
            )}

            {onSale && (
              <span className="rounded-full bg-[#7A4E2C] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
                SALE
              </span>
            )}
          </div>

          <Image
            src={image}
            alt={`${brand} ${name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="
              object-contain
              p-8
              transition-transform
              duration-1000
              ease-out
              group-hover:scale-[1.08]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/5
              to-transparent
              opacity-0
              transition-opacity
              duration-500
              group-hover:opacity-100
            "
          />
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-5 pt-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-neutral-500">
            {brand}
          </p>

          <h3
            className="
              mt-3
              min-h-[3.5rem]
              line-clamp-2
              text-xl
              font-light
              leading-7
              tracking-[-0.02em]
              text-neutral-900
            "
          >
            {name}
          </h3>

          <div className="mt-5 min-h-[3.5rem]">
            <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">
              Model
            </p>

            <p className="mt-1 text-sm text-neutral-600">
              {model ?? "—"}
            </p>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-5">
        <Link
          href={productHref}
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            uppercase
            tracking-[0.35em]
            text-neutral-500
            transition-all
            duration-300
            hover:text-[#C8A96A]
          "
        >
          <span>Discover</span>

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>

        <button
          type="button"
          onClick={handleInquiry}
          className="
            rounded-full
            border
            border-black
            px-5
            py-2
            text-[11px]
            font-medium
            uppercase
            tracking-[0.25em]
            transition-all
            duration-300
            hover:border-[#C8A96A]
            hover:bg-[#C8A96A]
            hover:text-white
          "
        >
          Request Price
        </button>
      </div>
    </article>
  );
}