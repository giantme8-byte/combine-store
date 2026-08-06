"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import WishlistButton from "@/components/WishlistButton";
import { useInquiry } from "@/components/providers/InquiryProvider";

import type { ProductCardProps } from "@/types";

import { useQuickView } from "@/components/providers/QuickViewProvider";

export default function ProductCard({
  id,
  slug,
  brand,
  name,
  model,
image,
secondImage,
createdAt,
  featured,
  newArrival,
  bestSeller,
  limited,
  onSale,
}: ProductCardProps) {
  const { addItem, openDrawer } = useInquiry();
  const { open } = useQuickView();

  const productHref = slug ? `/shop/${slug}` : "/shop";

const isNewArrival = useMemo(() => {
  if (!newArrival) {
    return false;
  }

  const now = new Date();
  const created = new Date(createdAt);

  return (
    now.getTime() - created.getTime() <
    30 * 24 * 60 * 60 * 1000
  );
}, [createdAt, newArrival]);

  function handleInquiry(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    addItem(id);
    openDrawer();
  }

  function handleQuickView(
  event: React.MouseEvent
) {
  event.preventDefault();
  event.stopPropagation();

  open({
    id,
    slug,
    brand,
    name,
    model,
    image,
    secondImage,
    createdAt,
    featured,
    newArrival,
    bestSeller,
    limited,
    onSale,
  });
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
    border-neutral-100
    bg-white
    shadow-sm
    transition-all
    duration-700
hover:-translate-y-3
hover:scale-[1.02]
hover:border-[#C8A96A]/60
hover:shadow-[0_45px_120px_rgba(0,0,0,.16)]
  "
>
<Link
  href={productHref}
  prefetch={false}
  className="flex flex-1 flex-col"
>
{/* Image */}
<div
  className="
    relative
    aspect-[4/5]
    overflow-hidden
    rounded-[24px]
    bg-gradient-to-b
from-[#ffffff]
via-[#fbfbfb]
to-[#f4f4f4]
  "
>

  {/* Wishlist */}
<div
  className="
    absolute
    right-4
    top-4
    z-30
    rounded-full
    bg-white/90
    p-1.5
    shadow-lg
    backdrop-blur-xl
    opacity-0
translate-y-2
    transition-all
    duration-300
group-hover:translate-y-0
group-hover:opacity-100
  "
>
    <WishlistButton
      productId={id}
      variant="icon"
    />
  </div>

  {/* Labels */}
  <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
    {isNewArrival && (
      <span
  className="
    rounded-full
    bg-black
    px-3
    py-1
    text-[10px]
    font-medium
    uppercase
    tracking-[0.2em]
    text-white
    transition-all
    duration-300
    group-hover:-translate-y-1
    group-hover:scale-105
  "
>
        NEW
      </span>
    )}

    {featured && (
      <span
  className="
    rounded-full
    bg-[#C8A96A]
    px-3
    py-1
    text-[10px]
    font-medium
    uppercase
    tracking-[0.2em]
    text-white
    transition-all
    duration-300
    group-hover:-translate-y-1
    group-hover:scale-105
  "
>
        FEATURED
      </span>
    )}

    {bestSeller && (
      <span
  className="
    rounded-full
    bg-neutral-800
    px-3
    py-1
    text-[10px]
    font-medium
    uppercase
    tracking-[0.2em]
    text-white
    transition-all
    duration-300
    group-hover:-translate-y-1
    group-hover:scale-105
  "
>
        BEST SELLER
      </span>
    )}

    {limited && (
      <span
  className="
    rounded-full
    border
    border-black
    bg-white
    px-3
    py-1
    text-[10px]
    font-medium
    uppercase
    tracking-[0.2em]
    transition-all
    duration-300
    group-hover:-translate-y-1
    group-hover:scale-105
  "
>
        LIMITED
      </span>
    )}

    {onSale && (
      <span
  className="
    rounded-full
    bg-[#7A4E2C]
    px-3
    py-1
    text-[10px]
    font-medium
    uppercase
    tracking-[0.2em]
    text-white
    transition-all
    duration-300
    group-hover:-translate-y-1
    group-hover:scale-105
  "
>
        SALE
      </span>
    )}
  </div>

{/* Main Image */}
<Image
  src={image}
  alt={`${brand} ${name}`}
  fill
  quality={88}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
  loading="lazy"
className={`
  pointer-events-none
  object-contain
  p-8
  will-change-transform
  transition-all
  duration-700
    ease-[cubic-bezier(0.22,1,0.36,1)]
    ${
      secondImage
        ? "opacity-100 group-hover:opacity-0 group-hover:scale-105"
        : "group-hover:scale-105"
    }
  `}
/>

{/* Hover Image */}
{secondImage && (
  <Image
    src={secondImage}
    alt={`${brand} ${name}`}
    fill
    quality={88}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
    loading="lazy"
    className="
      absolute
      inset-0
pointer-events-none
object-contain
p-8
will-change-transform
opacity-0
scale-110
blur-sm
      transition-all
      duration-700
      ease-[cubic-bezier(0.22,1,0.36,1)]
      group-hover:scale-100
      group-hover:opacity-100
      group-hover:blur-0
    "
  />
)}

{/* Luxury Shine */}
<div
  className="
    pointer-events-none
    absolute
    inset-0
    translate-x-[-120%]
    bg-[linear-gradient(120deg,transparent_25%,rgba(255,255,255,.12)_50%,transparent_75%)]
    opacity-0
    transition-all
    duration-1000
    group-hover:translate-x-[120%]
    group-hover:opacity-100
  "
/>

{/* Dark Overlay */}
<div
  className="
    pointer-events-none
    absolute
    inset-0
    rounded-[24px]
    bg-gradient-to-t
    from-black/15
    via-black/5
    to-transparent
    opacity-0
    transition-opacity
    duration-500
    group-hover:opacity-100
  "
/>

{/* Quick View */}
<div
  className="
    absolute
    left-1/2
    top-1/2
    z-30
    -translate-x-1/2
    -translate-y-1/2
    translate-y-5
    scale-90
    opacity-0
    transition-all
    duration-700
    ease-[cubic-bezier(0.22,1,0.36,1)]
    group-hover:translate-y-0
    group-hover:scale-100
    group-hover:opacity-100
  "
>
  <button
    type="button"
    onClick={handleQuickView}
    className="
      rounded-full
      border
      border-white/40
      bg-white/90
      px-7
      py-3
      text-xs
      font-medium
      uppercase
      tracking-[0.3em]
      shadow-2xl
      backdrop-blur-xl
      transition-all
      duration-300
hover:-translate-y-0.5
hover:scale-105
hover:bg-[#C8A96A]
hover:border-[#C8A96A]
hover:text-white
hover:shadow-xl
    "
  >
    Quick View
  </button>
</div>

</div> {/* End Image Container */}

{/* Content */}
<div
  className="
    flex
    flex-1
    flex-col
    px-6
    pb-5
    pt-7
  "
>
<p
  className="
    text-[11px]
    font-medium
    uppercase
    tracking-[0.4em]
    text-neutral-400
  "
>
  {brand}
</p>

          <h3
  className="
    mt-3
    min-h-[3.8rem]
    line-clamp-2
    text-[22px]
    font-light
    leading-[1.35]
    tracking-[-0.03em]
    text-neutral-900
  "
>
            {name}
          </h3>

<div
  className="
    mt-5
    flex-1
    min-h-[56px]
  "
>
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
<div
  className="
    border-t
    border-neutral-100
    px-6
    py-5
  "
>
  <div
    className="
      flex
      items-center
      justify-between
      gap-4
    "
  >
    <Link
      href={productHref}
      prefetch={false}
      className="
        inline-flex
        items-center
        gap-2
        text-[11px]
        font-medium
        uppercase
        tracking-[0.35em]
        text-neutral-500
        transition-all
        duration-300
        hover:text-[#C8A96A]
      "
    >
      <span>Discover</span>

<span
  className="
    transition-all
    duration-300
    group-hover:translate-x-2
  "
>
  →
</span>
    </Link>

    <button
      type="button"
      onClick={handleInquiry}
className="
  shrink-0
  inline-flex
  items-center
  justify-center
  rounded-full
  border
  border-black
  px-4
  py-2
  text-[10px]
  font-medium
  uppercase
  tracking-[0.18em]
  whitespace-nowrap
transition-all
duration-300
hover:-translate-y-0.5
hover:border-[#C8A96A]
hover:bg-[#C8A96A]
hover:text-white
hover:shadow-lg
"
    >
      Request Price
    </button>
  </div>
</div>

</article>
);
}