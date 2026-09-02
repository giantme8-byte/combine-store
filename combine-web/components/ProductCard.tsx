"use client";

import {
  useMemo,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import WishlistButton from "@/components/WishlistButton";
import {
  useInquiry,
} from "@/components/providers/InquiryProvider";
import {
  useQuickView,
} from "@/components/providers/QuickViewProvider";

import type {
  ProductCardProps,
} from "@/types";

import {
  optimizeCloudinaryImage,
} from "@/lib/cloudinary-image";


export default function ProductCard({
  id,
  slug,
  brand,
  name,
  model,
  price,
  variants,
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

  const {
    addItem,
    openDrawer,
  } = useInquiry();


  const {
    open,
  } = useQuickView();


  const productHref =
    slug
      ? `/shop/${slug}`
      : "/shop";


  // ============================================================
  // NEW BADGE
  // ============================================================

  const isNewArrival =
    useMemo(() => {

      if (!newArrival) {
        return false;
      }


      const now =
        new Date();


      const created =
        new Date(
          createdAt
        );


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


  // ============================================================
  // INQUIRY
  // ============================================================

  function handleInquiry(
    event: React.MouseEvent
  ) {

    event.preventDefault();

    event.stopPropagation();


    addItem(id);

    openDrawer();

  }


  // ============================================================
  // QUICK VIEW
  // ============================================================

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

      price,

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


  // ============================================================
  // CLOUDINARY OPTIMIZED IMAGES
  // ============================================================

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

  // ============================================================
  // SMART IMAGE FILL
  // ============================================================

  const [imageScale, setImageScale] =
    useState(1);


  // ============================================================
  // DISPLAY PRICE
  // ============================================================

  const productPrice =
    typeof price === "number" &&
    Number.isFinite(price) &&
    price > 0
      ? price
      : null;

  const variantPrices =
    (variants ?? [])
      .map((variant) =>
        typeof variant.price === "number" &&
        Number.isFinite(variant.price) &&
        variant.price > 0
          ? variant.price
          : null
      )
      .filter(
        (value): value is number =>
          value !== null
      );

  const uniqueVariantPrices = [
    ...new Set(variantPrices),
  ].sort(
    (a, b) => a - b
  );

  const displayPrice =
    uniqueVariantPrices.length === 1
      ? `RM ${uniqueVariantPrices[0].toLocaleString(
          "en-MY",
          {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }
        )}`
      : uniqueVariantPrices.length > 1
        ? `RM ${uniqueVariantPrices[0].toLocaleString(
            "en-MY",
            {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }
          )} – RM ${uniqueVariantPrices[
            uniqueVariantPrices.length - 1
          ].toLocaleString(
            "en-MY",
            {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }
          )}`
        : productPrice !== null
          ? `RM ${productPrice.toLocaleString(
              "en-MY",
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }
            )}`
          : null;

  const hasPrice =
    displayPrice !== null;


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
transition-[transform,box-shadow]
duration-300
ease-out

sm:rounded-[32px]
sm:hover:-translate-y-3
sm:hover:scale-[1.02]
sm:hover:border-[#C8A96A]/60
sm:hover:shadow-[0_45px_120px_rgba(0,0,0,.16)]
      "
    >

      {/* ====================================================== */}
      {/* PRODUCT */}
      {/* ====================================================== */}

      <Link
        href={productHref}
        prefetch
        className="
          flex
          flex-1
          flex-col
        "
      >

        {/* ==================================================== */}
        {/* IMAGE */}
        {/* ==================================================== */}

        <div
          className="
            relative
            aspect-square
            w-full
            overflow-hidden
            rounded-[15px]
            bg-white

            sm:rounded-[24px]
          "
        >

          {/* ================================================== */}
          {/* WISHLIST */}
          {/* ================================================== */}

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


          {/* ================================================== */}
          {/* LABELS */}
          {/* ================================================== */}

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


          {/* ================================================== */}
          {/* PRODUCT IMAGES */}
          {/* ================================================== */}

          <div
            className="
              absolute
              inset-0
            "
          >

            {/* ================================================= */}
            {/* MAIN IMAGE */}
            {/* ================================================= */}

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
              onLoad={(event) => {
                const img = event.currentTarget;
                const ratio =
                  img.naturalWidth /
                  img.naturalHeight;

                if (ratio >= 1.15 || ratio <= 0.88) {
                  setImageScale(1.05);
                } else {
                  setImageScale(1);
                }
              }}
              style={{
                transform: `scale(${imageScale})`,
              }}
              className={`
                pointer-events-none
                object-contain
                object-center
                p-0
                transition-[opacity,transform]
                duration-300
                ease-out

                ${
                  secondImage
                    ? "opacity-100 sm:group-hover:opacity-0"
                    : ""
                }
              `}
            />


            {/* ================================================= */}
            {/* HOVER IMAGE */}
            {/* ================================================= */}

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
                style={{
                  transform: `scale(${imageScale})`,
                }}
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  object-contain
                  object-center
                  p-0
                  opacity-0
                  transition-[opacity,transform]
                  duration-300
                  ease-out
                  sm:group-hover:opacity-100
                "
              />
            )}

          </div>


          {/* ================================================== */}
          {/* LUXURY SHINE */}
          {/* ================================================== */}


          {/* ================================================== */}
          {/* DARK OVERLAY */}
          {/* ================================================== */}

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


          {/* ================================================== */}
          {/* QUICK VIEW */}
          {/* ================================================== */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              z-30
              hidden
              -translate-x-1/2
              -translate-y-1/2
scale-95
opacity-0
transition-all
duration-300
ease-out

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


        {/* ==================================================== */}
        {/* CONTENT */}
        {/* ==================================================== */}

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

          {/* ================================================== */}
          {/* BRAND */}
          {/* ================================================== */}

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


          {/* ================================================== */}
          {/* PRODUCT TITLE */}
          {/* ================================================== */}

          <h3
            className="
              mt-1.5
              line-clamp-3
              h-[4.2rem]
              overflow-hidden
              text-[13px]
              font-light
              leading-[1.4]
              tracking-[-0.02em]
              text-neutral-900

              sm:mt-3
              sm:h-[3.5rem]
              sm:line-clamp-2
              sm:text-xl
              sm:leading-7
              sm:tracking-[-0.02em]

              lg:mt-3
              lg:h-[3.5rem]
              lg:line-clamp-2
              lg:text-xl
              lg:leading-7
              lg:tracking-[-0.02em]
            "
          >
            {name}
          </h3>


          {/* ================================================== */}
          {/* MODEL */}
          {/* ================================================== */}

          <div
            className="
              mt-4
              shrink-0

              sm:mt-5
              lg:mt-5
            "
          >
            <p
              className="
                text-[7px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-neutral-400

                sm:text-[10px]
                sm:tracking-[0.3em]
              "
            >
              Model
            </p>

            <p
              className="
                mt-1
                line-clamp-2
                min-h-[1rem]
                overflow-hidden
                text-[8px]
                leading-4
                text-neutral-600

                sm:text-sm
                sm:leading-5
              "
            >
              {model ?? "—"}
            </p>
          </div>


          {/* ================================================== */}
          {/* PRICE */}
          {/* ================================================== */}

          <div
            className="
              mt-4
              border-t
              border-neutral-100
              pt-3
              sm:mt-5
              sm:pt-4
            "
          >
            {displayPrice ? (
              <p
                className="
                  text-[13px]
                  font-medium
                  tracking-[-0.015em]
                  text-neutral-950

                  sm:text-[16px]
                  lg:text-[17px]
                "
              >
                {displayPrice}
              </p>
            ) : (
              <p
                className="
                  text-[8px]
                  font-light
                  uppercase
                  tracking-[0.18em]
                  text-neutral-400

                  sm:text-[10px]
                  sm:tracking-[0.24em]
                "
              >
                Price Upon Request
              </p>
            )}
          </div>

        </div>
      </Link>

      {/* ====================================================== */}
      {/* SINGLE ACTION */}
      {/* ====================================================== */}

      <div
        className="
          mt-4
          border-t
          border-neutral-100
          px-3
          pb-3.5
          pt-3

          sm:mt-5
          sm:px-6
          sm:pb-5
          sm:pt-4

          lg:px-6
        "
      >
        {hasPrice ? (
          <Link
            href={productHref}
            prefetch
            className="
              inline-flex
              items-center
              gap-1.5
              text-[7px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-neutral-500
              transition-colors
              duration-300
              hover:text-[#C8A96A]

              sm:gap-2
              sm:text-[10px]
              sm:tracking-[0.24em]
            "
          >
            <span>
              View Details
            </span>

            <span
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1.5
              "
            >
              →
            </span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleInquiry}
            className="
              inline-flex
              items-center
              gap-1.5
              text-[7px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-neutral-500
              transition-colors
              duration-300
              hover:text-[#C8A96A]

              sm:gap-2
              sm:text-[10px]
              sm:tracking-[0.24em]
            "
          >
            <span>
              Request Price
            </span>

            <span
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1.5
              "
            >
              →
            </span>
          </button>
        )}
      </div>

    </article>
  );
}