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
        items-center
        gap-6
        border-b
        border-neutral-100
        bg-white
        p-5
        transition-all
        hover:bg-neutral-50
      "
    >

      {/* Position */}
      <div className="w-14 text-center">
        <p className="text-xs uppercase tracking-wider text-neutral-400">
          #
        </p>

        <p className="text-lg font-bold">
          {index + 1}
        </p>
      </div>

      {/* Drag */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="
          cursor-grab
          rounded-lg
          p-2
          text-2xl
          text-neutral-400
          transition
          hover:bg-neutral-100
          active:cursor-grabbing
        "
      >
        ☰
      </button>

      {/* Image */}
      <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-neutral-200">

        <Image
          src={
            product.images[0]?.url ??
            "/placeholder.png"
          }
          alt={product.name}
          fill
          className="object-cover"
        />

      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">

        <h3 className="truncate text-base font-semibold">
          {product.name}
        </h3>

        <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">

          <span>{product.brand}</span>

          <span>•</span>

          <span>{product.category}</span>

        </div>

        <div className="mt-3 flex flex-wrap gap-2">

          {product.newArrival && (
            <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">
              NEW
            </span>
          )}

          {product.featured && (
            <span className="rounded-full bg-black px-2 py-1 text-[10px] font-semibold text-white">
              FEATURED
            </span>
          )}

          {product.bestSeller && (
            <span className="rounded-full bg-amber-500 px-2 py-1 text-[10px] font-semibold text-white">
              BEST
            </span>
          )}

          {product.limited && (
            <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] font-semibold text-white">
              LIMITED
            </span>
          )}

          {product.onSale && (
            <span className="rounded-full bg-green-600 px-2 py-1 text-[10px] font-semibold text-white">
              SALE
            </span>
          )}

        </div>

      </div>

      {/* Price */}
      <div className="text-right">

        <p className="text-xs uppercase tracking-wider text-neutral-400">
          Price
        </p>

        <p className="mt-1 text-lg font-bold">
          RM {product.price.toFixed(2)}
        </p>

      </div>

    </div>
  );
}