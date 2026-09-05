"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type {
  ProductWithImages,
} from "@/types/product";

type SortableProductCardProps = {
  product: ProductWithImages;
  index: number;
};

export default function SortableProductCard({
  product,
  index,
}: SortableProductCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: product.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        flex
        min-w-0
        flex-col
        gap-4
        border-b
        border-neutral-100
        bg-white
        p-4
        transition-all
        hover:bg-neutral-50

        sm:flex-row
        sm:items-center
        sm:gap-6
        sm:p-5
      "
    >
      {/* ====================================================== */}
      {/* TOP / MAIN ROW */}
      {/* ====================================================== */}

      <div
        className="
          flex
          min-w-0
          items-center
          gap-3

          sm:contents
        "
      >
        {/* ==================================================== */}
        {/* POSITION */}
        {/* ==================================================== */}

        <div
          className="
            flex
            w-10
            shrink-0
            flex-col
            items-center
            justify-center
            sm:w-14
          "
        >
          <p
            className="
              text-[9px]
              uppercase
              tracking-wider
              text-neutral-400

              sm:text-xs
            "
          >
            #
          </p>

          <p
            className="
              text-base
              font-bold
              text-neutral-900

              sm:text-lg
            "
          >
            {index + 1}
          </p>
        </div>

        {/* ==================================================== */}
        {/* DRAG HANDLE */}
        {/* ==================================================== */}

        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Drag ${product.name}`}
          className="
            flex
            h-11
            w-11
            shrink-0
            cursor-grab
            touch-none
            items-center
            justify-center
            rounded-xl
            border
            border-neutral-200
            bg-neutral-50
            text-xl
            text-neutral-400
            transition
            hover:bg-neutral-100
            hover:text-neutral-700
            active:cursor-grabbing
            active:bg-neutral-200

            sm:h-auto
            sm:w-auto
            sm:border-0
            sm:bg-transparent
            sm:p-2
            sm:text-2xl
          "
        >
          ☰
        </button>

        {/* ==================================================== */}
        {/* IMAGE */}
        {/* ==================================================== */}

        <div
          className="
            relative
            h-20
            w-20
            shrink-0
            overflow-hidden
            rounded-xl
            border
            border-neutral-200

            sm:h-20
            sm:w-20
          "
        >
          <Image
            src={
              product.images[0]?.url ??
              "/placeholder.png"
            }
            alt={product.name}
            fill
            sizes="
              (max-width: 639px) 80px,
              80px
            "
            className="object-cover"
          />
        </div>

        {/* ==================================================== */}
        {/* INFO */}
        {/* ==================================================== */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <h3
            className="
              line-clamp-2
              text-sm
              font-semibold
              leading-5
              text-neutral-900

              sm:truncate
              sm:text-base
            "
          >
            {product.name}
          </h3>

          <div
            className="
              mt-1
              flex
              min-w-0
              items-center
              gap-2
              text-[11px]
              text-neutral-500

              sm:gap-3
              sm:text-sm
            "
          >
            <span className="truncate">
              {product.brand}
            </span>

            <span className="shrink-0">
              •
            </span>

            <span className="truncate">
              {product.category}
            </span>
          </div>

          {/* ================================================== */}
          {/* BADGES */}
          {/* ================================================== */}

          <div
            className="
              mt-2
              flex
              min-w-0
              flex-wrap
              gap-1.5

              sm:mt-3
              sm:gap-2
            "
          >
            {product.newArrival && (
              <span
                className="
                  rounded-full
                  bg-blue-600
                  px-2
                  py-1
                  text-[9px]
                  font-semibold
                  text-white

                  sm:text-[10px]
                "
              >
                NEW
              </span>
            )}

            {product.featured && (
              <span
                className="
                  rounded-full
                  bg-black
                  px-2
                  py-1
                  text-[9px]
                  font-semibold
                  text-white

                  sm:text-[10px]
                "
              >
                FEATURED
              </span>
            )}

            {product.bestSeller && (
              <span
                className="
                  rounded-full
                  bg-amber-500
                  px-2
                  py-1
                  text-[9px]
                  font-semibold
                  text-white

                  sm:text-[10px]
                "
              >
                BEST
              </span>
            )}

            {product.limited && (
              <span
                className="
                  rounded-full
                  bg-red-600
                  px-2
                  py-1
                  text-[9px]
                  font-semibold
                  text-white

                  sm:text-[10px]
                "
              >
                LIMITED
              </span>
            )}

            {product.onSale && (
              <span
                className="
                  rounded-full
                  bg-green-600
                  px-2
                  py-1
                  text-[9px]
                  font-semibold
                  text-white

                  sm:text-[10px]
                "
              >
                SALE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* PRICE */}
      {/* ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-neutral-100
          pt-3

          sm:block
          sm:border-t-0
          sm:pt-0
          sm:text-right
        "
      >
        <p
          className="
            text-[9px]
            uppercase
            tracking-wider
            text-neutral-400

            sm:text-xs
          "
        >
          Price
        </p>

        <p
          className="
            text-base
            font-bold
            text-neutral-900

            sm:mt-1
            sm:text-lg
          "
        >
          RM {product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}