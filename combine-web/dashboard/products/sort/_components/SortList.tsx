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

  // =========================================================
  // DRAG SENSOR
  // =========================================================

  const sensors =
    useSensors(
      useSensor(
        PointerSensor,
        {
          activationConstraint: {
            distance: 8,
          },
        }
      )
    );


  // =========================================================
  // DRAG END
  // =========================================================

  function handleDragEnd(
    event: DragEndEvent
  ) {

    const {
      active,
      over,
    } = event;


    // -------------------------------------------------------
    // Nothing to do
    // -------------------------------------------------------

    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }


    // =======================================================
    // CURRENT VISIBLE PRODUCTS
    // =======================================================

    const visibleProducts =
      [
        ...products,
      ];


    const oldIndex =
      visibleProducts.findIndex(
        (product) =>
          product.id ===
          active.id
      );


    const newIndex =
      visibleProducts.findIndex(
        (product) =>
          product.id ===
          over.id
      );


    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }


    // =======================================================
    // REORDER VISIBLE PRODUCTS
    // =======================================================

    const reorderedVisible =
      arrayMove(
        visibleProducts,
        oldIndex,
        newIndex
      );


    // =======================================================
    // MERGE BACK INTO GLOBAL ORDER
    // =======================================================
    //
    // IMPORTANT:
    //
    // We must NOT simply replace products by ID.
    //
    // Example:
    //
    // Global:
    //
    // A
    // B
    // C
    // D
    // E
    //
    // Filtered:
    //
    // A
    // C
    // E
    //
    // Reordered:
    //
    // E
    // A
    // C
    //
    // Correct global result:
    //
    // E
    // B
    // A
    // D
    // C
    //
    // The non-filtered products keep their positions.
    //
    // =======================================================

    const visibleIds =
      new Set(
        visibleProducts.map(
          (product) =>
            product.id
        )
      );


    const visiblePositions =
      allProducts
        .map(
          (product, index) => ({
            product,
            index,
          })
        )
        .filter(
          ({
            product,
          }) =>
            visibleIds.has(
              product.id
            )
        )
        .map(
          ({
            index,
          }) =>
            index
        );


    // -------------------------------------------------------
    // Safety check
    // -------------------------------------------------------

    if (
      visiblePositions.length !==
      reorderedVisible.length
    ) {
      return;
    }


    // -------------------------------------------------------
    // Create new global order.
    // -------------------------------------------------------

    const reorderedAll =
      [
        ...allProducts,
      ];


    // -------------------------------------------------------
    // Put the reordered visible products
    // back into the same global positions.
    // -------------------------------------------------------

    visiblePositions.forEach(
      (
        position,
        index
      ) => {

        reorderedAll[position] =
          reorderedVisible[index];

      }
    );


    // =======================================================
    // SEND GLOBAL ORDER BACK
    // =======================================================

    onChange(
      reorderedAll
    );

  }


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <DndContext
      sensors={
        sensors
      }

      collisionDetection={
        closestCenter
      }

      onDragEnd={
        handleDragEnd
      }
    >

      <SortableContext
        items={
          products.map(
            (product) =>
              product.id
          )
        }

        strategy={
          verticalListSortingStrategy
        }
      >

        <div
          className="
            w-full
            overflow-hidden
            rounded-2xl
            border
            border-neutral-200
            bg-white
          "
        >

          {products.map(
            (
              product,
              index
            ) => (

              <SortableProductCard
                key={
                  product.id
                }

                product={
                  product
                }

                index={
                  index
                }
              />

            )
          )}

        </div>

      </SortableContext>

    </DndContext>
  );
}