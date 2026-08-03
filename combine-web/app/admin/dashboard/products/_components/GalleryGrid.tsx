"use client";

import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import SortableImage from "@/components/SortableImage";
import type { ProductImageItem } from "@/types/product-image";


type GalleryGridProps = {
  images: ProductImageItem[];

  sensors: ReturnType<typeof useSensors>;

  onDragEnd: (
    event: DragEndEvent
  ) => void;

  onDelete: (
    id: string
  ) => void;
};


export default function GalleryGrid({
  images,
  sensors,
  onDragEnd,
  onDelete,
}: GalleryGridProps) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={images.map(
          (image) => image.id
        )}
        strategy={rectSortingStrategy}
      >
        <div
          className="
            grid
            grid-cols-2
            gap-4
          "
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative"
            >

              {index === 0 && (
                <div
                  className="
                    absolute
                    left-2
                    top-2
                    z-10
                    rounded-full
                    bg-black
                    px-3
                    py-1
                    text-xs
                    uppercase
                    tracking-wider
                    text-white
                  "
                >
                  Cover
                </div>
              )}

              <SortableImage
                image={image}
                index={index}
                onDelete={() =>
                  onDelete(image.id)
                }
              />

            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}