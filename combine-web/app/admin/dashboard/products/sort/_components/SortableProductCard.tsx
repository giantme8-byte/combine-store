"use client";

import type { CSSProperties } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type {
  ProductWithImages,
} from "@/types/product";

type SortableProductCardProps = {
  product: ProductWithImages;
};

export default function SortableProductCard({
  product,
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
        gap-5
        border-b
        border-neutral-100
        bg-white
        p-5
        transition-colors
        hover:bg-neutral-50
      "
    >

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="
          cursor-grab
          touch-none
          text-2xl
          text-neutral-400
          active:cursor-grabbing
        "
      >
        ☰
      </button>

      <img
        src={
          product.images[0]?.url ??
          "/placeholder.png"
        }
        alt={product.name}
        className="
          h-16
          w-16
          rounded-xl
          border
          border-neutral-200
          object-cover
        "
      />

      <div className="flex-1">

        <p className="font-medium">
          {product.name}
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          {product.brand}
        </p>

      </div>

      <div className="text-sm text-neutral-400">
        {product.category}
      </div>

    </div>
  );
}