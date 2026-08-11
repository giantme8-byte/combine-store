"use client";

import { useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import WishlistButton from "@/components/WishlistButton";
import { useInquiry } from "@/components/providers/InquiryProvider";
import { useQuickView } from "@/components/providers/QuickViewProvider";

import type { ProductCardProps } from "@/types";

import { optimizeCloudinaryImage } from "@/lib/cloudinary-image";

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
  buttonSize = "default",
}: ProductCardProps) {
  const { addItem, openDrawer } =
    useInquiry();

  const { open } =
    useQuickView();

  const productHref = slug
    ? `/shop/${slug}`
    : "/shop";

  /*
   * =========================================================
   * NEW badge
   * =========================================================
   *
   * A product is considered "NEW" only when:
   *
   * 1. newArrival is enabled
   * 2. The product was created within the last 30 days
   */

  const isNewArrival =
    useMemo(() => {
      if (!newArrival) {
        return false;
      }

      const now = new Date();

      const created =
        new Date(createdAt);

      return (
        now.getTime() -
          created.getTime() <
        30 *
          24 *
          60 *
          60 *
          1000
      );
    }, [
      createdAt,
      newArrival,
    ]);

  /*
   * =========================================================
   * Inquiry
   * =========================================================
   */

  function handleInquiry(
    event: React.MouseEvent
  ) {
    event.preventDefault();
    event.stopPropagation();

    addItem(id);
    openDrawer();
  }

  /*
   * =========================================================
   * Quick View
   * =========================================================
   */

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

  /*
   * =========================================================
   * Cloudinary optimized URLs
   * =========================================================
   */

  const optimizedImage =
    optimizeCloudinaryImage(
      image,
      800
    );

  const optimizedSecondImage =
    secondImage
      ? optimizeCloudinaryImage(
          secondImage,
          800
        )
      : undefined;

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[18px]
        border
        border-neutral-100
        bg-white
        shadow-sm
        transition-all
        duration-700
        sm:rounded-[32px]
        sm:hover:-translate-y-3
        sm:hover:scale-[1.02]
        sm:hover:border-[#C8A96A]/60
        sm:hover:shadow-[0_45px_120px_rgba(0,0,0,.16)]
      "
    >
      {/* ================================================= */}
      {/* Product */}
      {/* ================================================= */}

      <Link
        href={productHref}
        prefetch
        className="
          flex
          flex-1
          flex-col
        "
      >
        {/* ================================================= */}
        {/* Image */}
        {/* ================================================= */}

        <div
          className="
            relative
            aspect-[4/5]
            overflow-hidden
            rounded-[15px]
            bg-gradient-to-b
            from-[#ffffff]
            via-[#fbfbfb]
            to-[#f4f4f4]
            sm:rounded-[24px]
          "
        >
          {/* ================================================= */}
          {/* Wishlist */}
          {/* ================================================= */}

          <div
            className="
              absolute
              right-2
              top-2
              z-30
              rounded-full
              bg-white/90
              p-1
              shadow-lg
              backdrop-blur-xl
              opacity-100
              translate-y-0
              transition-all
              duration-300
              sm:right-4
              sm:top-4
              sm:p-1.5
              sm:opacity-0
              sm:translate-y-2
              sm:group-hover:translate-y-0
              sm:group-hover:opacity-100
            "
          >
            <WishlistButton
              productId={id}
              variant="icon"
            />
          </div>

          {/* ================================================= */}
          {/* Labels */}
          {/* ================================================= */}

          <div
            className="
              absolute
              left-2
              top-2
              z-20
              flex
              flex-col
              gap-1.5
              sm:left-4
              sm:top-4
              sm:gap-2
            "
          >
            {/* NEW */}

            {isNewArrival && (
              <span
                className="
                  rounded-full
                  bg-black
                  px-2
                  py-0.5
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-white
                  transition-all
                  duration-300
                  sm:px-3
                  sm:py-1
                  sm:text-[10px]
                  sm:tracking-[0.2em]
                  sm:group-hover:-translate-y-1
                  sm:group-hover:scale-105
                "
              >
                NEW
              </span>
            )}

            {/* FEATURED */}

            {featured && (
              <span
                className="
                  rounded-full
                  bg-[#C8A96A]
                  px-2
                  py-0.5
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-white
                  transition-all
                  duration-300
                  sm:px-3
                  sm:py-1
                  sm:text-[10px]
                  sm:tracking-[0.2em]
                  sm:group-hover:-translate-y-1
                  sm:group-hover:scale-105
                "
              >
                FEATURED
              </span>
            )}

            {/* BEST SELLER */}

            {bestSeller && (
              <span
                className="
                  rounded-full
                  bg-neutral-800
                  px-2
                  py-0.5
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-white
                  transition-all
                  duration-300
                  sm:px-3
                  sm:py-1
                  sm:text-[10px]
                  sm:tracking-[0.15em]
                  sm:group-hover:-translate-y-1
                  sm:group-hover:scale-105
                "
              >
                BEST SELLER
              </span>
            )}

            {/* LIMITED */}

            {limited && (
              <span
                className="
                  rounded-full
                  border
                  border-black
                  bg-white
                  px-2
                  py-0.5
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  transition-all
                  duration-300
                  sm:px-3
                  sm:py-1
                  sm:text-[10px]
                  sm:tracking-[0.15em]
                  sm:group-hover:-translate-y-1
                  sm:group-hover:scale-105
                "
              >
                LIMITED
              </span>
            )}

            {/* SALE */}

            {onSale && (
              <span
                className="
                  rounded-full
                  bg-[#7A4E2C]
                  px-2
                  py-0.5
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-white
                  transition-all
                  duration-300
                  sm:px-2.5
                  sm:py-1
                  sm:text-[9px]
                  sm:tracking-[0.22em]
                  sm:group-hover:-translate-y-1
                  sm:group-hover:scale-105
                "
              >
                SALE
              </span>
            )}
          </div>

          {/* ================================================= */}
          {/* Product Images */}
          {/* ================================================= */}

          <div
            className="
              relative
              h-full
              w-full
            "
          >
            {/* Main Image */}

            <Image
              src={optimizedImage}
              alt={`${brand} ${name}`}
              fill
              quality={80}
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 1280px) 33vw,
                25vw
              "
              loading="lazy"
              className={`
                pointer-events-none
                object-contain
                p-3.5
                sm:p-8
                lg:p-8
                will-change-transform
                transition-all
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                ${
                  secondImage
                    ? "opacity-100 sm:group-hover:opacity-0 sm:group-hover:scale-105"
                    : "sm:group-hover:scale-105"
                }
              `}
            />

            {/* Hover Image */}

            {optimizedSecondImage && (
              <Image
                src={
                  optimizedSecondImage
                }
                alt={`${brand} ${name}`}
                fill
                quality={80}
                sizes="
                  (max-width: 640px) 50vw,
                  (max-width: 1280px) 33vw,
                  25vw
                "
                loading="lazy"
                className="
                  absolute
                  inset-0
                  pointer-events-none
                  object-contain
                  p-3.5
                  sm:p-8
                  lg:p-8
                  will-change-transform
                  opacity-0
                  scale-110
                  blur-sm
                  transition-all
                  duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  sm:group-hover:scale-100
                  sm:group-hover:opacity-100
                  sm:group-hover:blur-0
                "
              />
            )}
          </div>

          {/* ================================================= */}
          {/* Luxury Shine */}
          {/* ================================================= */}

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
              sm:group-hover:translate-x-[120%]
              sm:group-hover:opacity-100
            "
          />

          {/* ================================================= */}
          {/* Dark Overlay */}
          {/* ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-[15px]
              bg-gradient-to-t
              from-black/15
              via-black/5
              to-transparent
              opacity-0
              transition-opacity
              duration-500
              sm:group-hover:opacity-100
              sm:rounded-[24px]
            "
          />

          {/* ================================================= */}
          {/* Quick View */}
          {/* ================================================= */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              z-30
              hidden
              -translate-x-1/2
              -translate-y-1/2
              scale-90
              opacity-0
              transition-all
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]
              sm:block
              sm:group-hover:scale-100
              sm:group-hover:opacity-100
            "
          >
            <button
              type="button"
              onClick={
                handleQuickView
              }
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
                hover:border-[#C8A96A]
                hover:bg-[#C8A96A]
                hover:text-white
                hover:shadow-xl
              "
            >
              Quick View
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* Content */}
        {/* ================================================= */}

        <div
          className="
            flex
            flex-1
            flex-col
            px-3
            pb-3.5
            pt-3.5
            sm:px-6
            sm:pb-5
            sm:pt-7
            lg:px-6
            lg:pb-5
            lg:pt-7
          "
        >
          {/* Brand */}

          <p
            className="
              text-[7px]
              font-medium
              uppercase
              tracking-[0.26em]
              text-neutral-400
              sm:text-[11px]
              sm:tracking-[0.4em]
              lg:text-[10px]
              lg:tracking-[0.34em]
            "
          >
            {brand}
          </p>

          {/* ================================================= */}
          {/* Product Title */}
          {/* ================================================= */}

          <h3
            className="
              mt-1.5
              line-clamp-2
              overflow-hidden
              text-[13px]
              font-light
              leading-[1.4]
              tracking-[-0.02em]
              text-neutral-900
              sm:mt-3
              sm:min-h-[3.5rem]
              sm:max-h-[3.5rem]
              sm:text-xl
              sm:leading-7
              sm:tracking-[-0.02em]
              lg:mt-3
              lg:min-h-[3.5rem]
              lg:max-h-[3.5rem]
              lg:text-xl
              lg:leading-7
              lg:tracking-[-0.02em]
            "
          >
            {name}
          </h3>

          {/* ================================================= */}
          {/* Model */}
          {/* ================================================= */}

          <div
            className="
              mt-2.5
              min-h-[2.75rem]
              flex-1
              sm:mt-5
              sm:min-h-[56px]
              lg:mt-5
              lg:min-h-[56px]
            "
          >
            <p
              className="
                text-[7px]
                uppercase
                tracking-[0.2em]
                text-neutral-400
                sm:text-[11px]
                sm:tracking-[0.3em]
                lg:text-[11px]
                lg:tracking-[0.3em]
              "
            >
              Model
            </p>

            <p
              className="
                mt-1
                line-clamp-1
                text-[8px]
                text-neutral-600
                sm:text-sm
                lg:text-sm
              "
            >
              {model ?? "—"}
            </p>
          </div>
        </div>
      </Link>

      {/* ================================================= */}
      {/* Actions */}
      {/* ================================================= */}

      <div
        className="
          border-t
          border-neutral-100
          px-3
          py-3
          sm:px-7
          sm:py-6
          lg:px-7
          lg:py-6
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            sm:gap-3
          "
        >
          {/* ================================================= */}
          {/* Discover */}
          {/* ================================================= */}

          <Link
            href={productHref}
            prefetch
            className="
              inline-flex
              min-w-0
              flex-1
              items-center
              gap-1
              text-[7px]
              font-medium
              uppercase
              tracking-[0.1em]
              text-neutral-500
              transition-all
              duration-300
              hover:text-[#C8A96A]
              sm:gap-2
              sm:text-[11px]
              sm:tracking-[0.24em]
              lg:text-[11px]
              lg:tracking-[0.24em]
            "
          >
            <span>
              Discover
            </span>

            <span
              className="
                hidden
                transition-transform
                duration-300
                sm:inline
                sm:group-hover:translate-x-1.5
              "
            >
              →
            </span>
          </Link>

          {/* ================================================= */}
          {/* Request Price */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={
              handleInquiry
            }
            className={`
              inline-flex
              shrink-0
              items-center
              justify-center
              whitespace-nowrap
              rounded-full
              border
              border-black
              bg-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-[#C8A96A]
              hover:bg-[#C8A96A]
              hover:text-white
              hover:shadow-xl

              ${
                buttonSize ===
                "small"
                  ? `
                    h-8
                    min-w-0
                    px-2.5
                    text-[7px]
                    tracking-[0.04em]

                    sm:h-9
                    sm:min-w-[122px]
                    sm:px-4
                    sm:text-[10px]
                    sm:tracking-[0.14em]

                    lg:h-9
                    lg:min-w-[122px]
                    lg:px-4
                    lg:text-[10px]
                  `
                  : `
                    h-8
                    min-w-0
                    px-2.5
                    text-[7px]
                    tracking-[0.04em]

                    sm:h-10
                    sm:min-w-[138px]
                    sm:px-5
                    sm:text-[10px]
                    sm:tracking-[0.16em]

                    lg:h-10
                    lg:min-w-[138px]
                    lg:px-5
                    lg:text-[10px]
                    lg:tracking-[0.16em]
                  `
              }
            `}
          >
            Request Price
          </button>
        </div>
      </div>
    </article>
  );
}