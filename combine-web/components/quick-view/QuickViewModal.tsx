"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useQuickView } from "@/components/providers/QuickViewProvider";
import { useInquiry } from "@/components/providers/InquiryProvider";

export default function QuickViewModal() {
const { product, close } = useQuickView();

const {
  addItem,
  openDrawer,
} = useInquiry();

const images = useMemo<string[]>(() => {
  if (!product) return [];

  return [
    product.image,
    product.secondImage,
  ].filter(Boolean) as string[];
}, [product]);

const [selectedImage, setSelectedImage] = useState(0);

const [zoomStyle, setZoomStyle] = useState<
  React.CSSProperties
>({
  transform: "scale(1)",
  transformOrigin: "center",
});

const handleClose = useCallback(() => {
  close();
}, [close]);

const previousImage = useCallback(() => {
  setSelectedImage((current) =>
    current === 0 ? images.length - 1 : current - 1
  );
}, [images.length]);

const nextImage = useCallback(() => {
  setSelectedImage((current) =>
    current === images.length - 1 ? 0 : current + 1
  );
}, [images.length]);

// 每次打开新的商品，都回到第一张图
useEffect(() => {
  setSelectedImage(0);

  setZoomStyle({
    transform: "scale(1)",
    transformOrigin: "center",
  });
}, [product]);

useEffect(() => {
  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Escape":
        handleClose();
        break;

case "ArrowLeft":
  if (images.length > 1) {
    previousImage();
  }
  break;

case "ArrowRight":
  if (images.length > 1) {
    nextImage();
  }
  break;
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [handleClose, previousImage, nextImage]);

useEffect(() => {
  if (product) {
    document.body.classList.add("quick-view-open");
  } else {
    document.body.classList.remove("quick-view-open");
  }

  return () => {
    document.body.classList.remove("quick-view-open");
  };
}, [product]);

function handleMouseMove(
  event: React.MouseEvent<HTMLDivElement>
) {
  const rect = event.currentTarget.getBoundingClientRect();

  const x =
    ((event.clientX - rect.left) / rect.width) * 100;

  const y =
    ((event.clientY - rect.top) / rect.height) * 100;

  setZoomStyle({
    transform: "scale(2)",
    transformOrigin: `${x}% ${y}%`,
  });
}

function handleMouseLeave() {
  setZoomStyle({
    transform: "scale(1)",
    transformOrigin: "center",
  });
}

function handleInquiry() {
  if (!product) return;

  addItem(product.id);

  close();

  openDrawer();
}

if (!product) return null;

const hasPrice =
  typeof product.price === "number" &&
  Number.isFinite(product.price) &&
  product.price > 0;

const displayPrice =
  typeof product.price === "number" &&
  Number.isFinite(product.price) &&
  product.price > 0
    ? `RM ${product.price.toLocaleString("en-MY", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : null;

const productHref = product.slug
  ? `/shop/${product.slug}`
  : "/shop";

return (
<div
  className="
    fixed
    inset-0
    z-[100]
    flex
    items-center
    justify-center
    overflow-y-auto
    p-6
    bg-black/60
    backdrop-blur-md
    animate-in
    fade-in
    duration-300
  "
    onClick={close}
  >
<div
  onClick={(e) => e.stopPropagation()}
  className="
    relative
    w-full
    max-w-6xl
    max-h-[90vh]
    overflow-y-auto
    rounded-[36px]
        bg-white
        shadow-[0_50px_120px_rgba(0,0,0,.25)]
        animate-in
        zoom-in-95
        fade-in
        duration-500
      "
    >
      {/* Close */}
      <button
        onClick={close}
        className="
          absolute
          right-6
          top-6
          z-50
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-neutral-200
          bg-white/90
          backdrop-blur
          transition-all
          duration-300
          hover:rotate-90
          hover:bg-black
          hover:text-white
        "
      >
        ✕
      </button>

      <div className="grid lg:grid-cols-2">

{/* Left */}
<div
  className="
    bg-gradient-to-br
    from-white
    via-neutral-50
    to-neutral-100
    p-14
  "
>
  <div className="space-y-8">

    <div
  className="relative aspect-square group overflow-hidden"
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
<Image
  src={images[selectedImage]}
  alt={product.name}
  fill
  priority
  className="
    object-contain
    transition-transform
    duration-500
    hover:scale-105
  "
/>

      {images.length > 1 && (
  <>
    {/* Previous */}
<button
  type="button"
  onClick={previousImage}
  className="
    absolute
    left-4
    top-1/2
    z-20
    -translate-y-1/2
    flex
    h-11
    w-11
    items-center
    justify-center
    rounded-full
    bg-white/90
    shadow-lg
    opacity-0
    transition-all
    duration-300
    group-hover:opacity-100
    hover:scale-110
  "
>
  <ChevronLeft size={18} />
</button>

    {/* Next */}
    <button
      type="button"
      onClick={nextImage}
      className="
        absolute
        right-4
        top-1/2
        z-20
        -translate-y-1/2
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        bg-white/90
        shadow-lg
        opacity-0
        transition-all
        duration-300
        group-hover:opacity-100
        hover:scale-110
      "
    >
      <ChevronRight size={18} />
    </button>
  </>
)}
    </div>

    {images.length > 1 && (
      <div className="flex justify-center gap-4">

        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedImage(index)}
            className={`
              relative
              h-20
              w-20
              overflow-hidden
              rounded-xl
              border
              transition-all
              ${
                selectedImage === index
                  ? "scale-105 border-black"
                  : "border-neutral-200 hover:border-neutral-500"
              }
            `}
          >
            <Image
              src={image}
              alt=""
              fill
              className="object-contain p-2"
            />
          </button>
        ))}

      </div>
    )}

  </div>
</div>

        {/* Right */}
        <div className="flex flex-col justify-center p-14">

          <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
            {product.brand}
          </p>

          <h2
            className="
              mt-5
              text-5xl
              font-light
              leading-tight
              tracking-[-0.03em]
            "
          >
            {product.name}
          </h2>

          {product.model && (
            <p className="mt-5 text-base text-neutral-500">
              Model: {product.model}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-2">

            {product.newArrival && (
              <span className="rounded-full bg-black px-4 py-1 text-xs uppercase tracking-[0.2em] text-white">
                NEW
              </span>
            )}

            {product.featured && (
              <span className="rounded-full bg-[#C8A96A] px-4 py-1 text-xs uppercase tracking-[0.2em] text-white">
                FEATURED
              </span>
            )}

            {product.bestSeller && (
              <span className="rounded-full bg-neutral-800 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white">
                BEST SELLER
              </span>
            )}

            {product.limited && (
              <span className="rounded-full border px-4 py-1 text-xs uppercase tracking-[0.2em]">
                LIMITED
              </span>
            )}

            {product.onSale && (
              <span className="rounded-full bg-[#7A4E2C] px-4 py-1 text-xs uppercase tracking-[0.2em] text-white">
                SALE
              </span>
            )}

          </div>

<div className="mt-10 h-px bg-neutral-200" />

<p className="mt-10 text-base leading-8 text-neutral-600">
  Crafted with exceptional attention to detail, featuring premium
  materials and timeless elegance. Designed for those who appreciate
  luxury craftsmanship and refined style.
</p>

<div className="mt-10">
  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
    Price
  </p>

  {hasPrice ? (
    <p className="mt-2 text-2xl font-light tracking-[-0.02em] text-neutral-900">
      {displayPrice}
    </p>
  ) : (
    <p className="mt-2 text-xl font-light tracking-[-0.02em] text-neutral-900">
      Price Upon Request
    </p>
  )}
</div>

<div className="mt-12 flex flex-wrap gap-4">

  {!hasPrice && (
    <button
      type="button"
      onClick={handleInquiry}
      className="
        rounded-full
        border
        border-black
        px-9
        py-3.5
        text-sm
        font-medium
        uppercase
        tracking-[0.25em]
        transition-all
        duration-300
        hover:scale-105
        hover:border-[#C8A96A]
        hover:bg-[#C8A96A]
        hover:text-white
      "
    >
      Request Price
    </button>
  )}

  <Link
    href={productHref}
    onClick={close}
    className="
      inline-flex
      items-center
      text-sm
      font-medium
      uppercase
      tracking-[0.25em]
      transition-all
      duration-300
      hover:text-[#C8A96A]
    "
  >
    View Details →
  </Link>

</div>

        </div>

      </div>
    </div>
  </div>
);
}