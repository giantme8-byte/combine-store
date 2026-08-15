"use client";

import {
  DndContext,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { X } from "lucide-react";

import type { ProductImageItem } from "@/types/product-image";

type Props = {
  images: ProductImageItem[];

  sensors: ReturnType<
    typeof import("@dnd-kit/core").useSensors
  >;

  onDragEnd: (
    event: DragEndEvent
  ) => void;

  onDelete: (
    id: string
  ) => void;
};

/* =========================================================
 * Sortable Product Image
 * ======================================================= */

function SortableImage({
  image,
  index,
  onDelete,
}: {
  image: ProductImageItem;

  index: number;

  onDelete: (
    id: string
  ) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
  });

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),
    transition:
      transition ??
      "transform 180ms cubic-bezier(0.2, 0, 0, 1)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        bg-white
        transition-shadow
        duration-200
        ${
          isDragging
            ? `
              z-50
              border-black
              shadow-2xl
              ring-2
              ring-black/10
            `
            : `
              border-neutral-200
              shadow-sm
              hover:shadow-md
            `
        }
      `}
    >
      {/* =====================================================
       * IMAGE AREA
       *
       * The entire image itself is the drag area.
       * =================================================== */}

      <div
        {...attributes}
        {...listeners}
        className={`
          relative
          aspect-square
          overflow-hidden
          bg-neutral-50
          select-none
          ${
            isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
          }
        `}
      >
        <img
          src={image.url}
          alt={`Product image ${index + 1}`}
          draggable={false}
          className={`
            pointer-events-none
            h-full
            w-full
            select-none
            object-contain
            ${
              isDragging
                ? ""
                : "transition-transform duration-200 ease-out group-hover:scale-[1.01]"
            }
          `}
        />

        {/* =================================================
         * IMAGE NUMBER
         * ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            left-3
            top-3
            rounded-lg
            bg-black/80
            px-2.5
            py-1.5
            text-xs
            font-semibold
            tracking-wide
            text-white
            shadow-sm
            backdrop-blur-sm
          "
        >
          {String(
            index + 1
          ).padStart(2, "0")}
        </div>

        {/* =================================================
         * DELETE X
         *
         * Does NOT participate in dragging.
         * ================================================= */}

        <button
          type="button"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(image.id);
          }}
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-neutral-700
            opacity-0
            shadow-md
            backdrop-blur-sm
            transition-all
            duration-150
            hover:bg-white
            hover:text-red-600
            group-hover:opacity-100
          "
          aria-label="Remove image"
          title="Remove image"
        >
          <X
            size={18}
            strokeWidth={2}
          />
        </button>

        {/* =================================================
         * UPLOADING
         * ================================================= */}

        {image.status ===
          "uploading" && (
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              bg-black/75
              px-3
              py-2.5
              text-xs
              font-medium
              text-white
              backdrop-blur-sm
            "
          >
            Uploading{" "}
            {image.progress ?? 0}%
          </div>
        )}

        {/* =================================================
         * FAILED
         * ================================================= */}

        {image.status ===
          "failed" && (
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              bg-red-600/90
              px-3
              py-2.5
              text-xs
              font-medium
              text-white
            "
          >
            Upload failed
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
 * Sortable Image Grid
 * ======================================================= */

export default function SortableImageGrid({
  images,
  sensors,
  onDragEnd,
  onDelete,
}: Props) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={
        closestCenter
      }
      onDragEnd={
        onDragEnd
      }
    >
      <SortableContext
        items={images.map(
          (image) =>
            image.id
        )}
        strategy={
          rectSortingStrategy
        }
      >
        <div
          className="
            grid
            grid-cols-2
            gap-6
          "
        >
          {images.map(
            (
              image,
              index
            ) => (
              <SortableImage
                key={
                  image.id
                }
                image={
                  image
                }
                index={
                  index
                }
                onDelete={
                  onDelete
                }
              />
            )
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}