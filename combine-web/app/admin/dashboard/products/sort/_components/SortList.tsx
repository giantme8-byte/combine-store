"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import type {
  ProductWithImages,
} from "@/types/product";

import SortableProductCard from "./SortableProductCard";

type SortListProps = {
  products: ProductWithImages[];

  allProducts: ProductWithImages[];

  onChange: (
    products: ProductWithImages[]
  ) => void;
};

export default function SortList({
  products,
  allProducts,
  onChange,
}: SortListProps) {

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragEnd(
    event: DragEndEvent
  ) {

    const {
      active,
      over,
    } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const visibleProducts = [...products];

    const oldIndex =
      visibleProducts.findIndex(
        (product) =>
          product.id === active.id
      );

    const newIndex =
      visibleProducts.findIndex(
        (product) =>
          product.id === over.id
      );

    const reorderedVisible =
      arrayMove(
        visibleProducts,
        oldIndex,
        newIndex
      );

    const reorderedAll =
      [...allProducts];

    reorderedVisible.forEach(
      (product) => {

        const index =
          reorderedAll.findIndex(
            (p) =>
              p.id === product.id
          );

        if (index !== -1) {
          reorderedAll[index] = product;
        }

      }
    );

    onChange(reorderedAll);

  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={products.map(
          (product) => product.id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">

          {products.map((product) => (

            <SortableProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </SortableContext>
    </DndContext>
  );
}