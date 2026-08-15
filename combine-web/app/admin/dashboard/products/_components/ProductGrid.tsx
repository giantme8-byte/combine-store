"use client";

import type { CSSProperties } from "react";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { Availability } from "@prisma/client";

import type {
  ProductWithImages,
} from "@/types/product";

import {
  updateProductDisplayOrder,
} from "../_actions/product.actions";

type ProductGridProps = {
  products: ProductWithImages[];

  page: number;

  pageSize: number;

  sort: string;
};

/*
 * =========================================================
 * SORTABLE PRODUCT CARD
 * =========================================================
 */

type SortableProductCardProps = {
  product: ProductWithImages;
  dragActive: boolean;
};

function SortableProductCard({
  product,
  dragActive,
}: SortableProductCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
  });

  const style: CSSProperties = {
    transform:
      CSS.Transform.toString(
        transform
      ),
    transition,
  };

  /*
   * =========================================================
   * PREVENT CLICK AFTER DRAG
   * =========================================================
   *
   * When the user drags a card, the browser may still fire
   * a click event after the pointer is released.
   *
   * We prevent that click only when a drag was active.
   */

  const handleClickCapture = (
    event: React.MouseEvent
  ) => {
    if (dragActive) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClickCapture={
        handleClickCapture
      }
      className={`
        group
        relative
        flex
        h-full
        touch-none
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-neutral-200
        bg-white
        transition-[box-shadow,opacity,border-color]
        duration-200
        ${
          isDragging
            ? `
              z-30
              cursor-grabbing
              border-neutral-400
              opacity-80
              shadow-2xl
            `
            : `
              cursor-grab
              hover:border-neutral-300
              hover:shadow-xl
            `
        }
      `}
    >

      {/* ================================================= */}
      {/* Product Image */}
      {/* ================================================= */}

      <Link
        href={`/admin/dashboard/products/${product.id}/edit`}
        draggable={false}
        className="
          relative
          block
          aspect-square
          shrink-0
          overflow-hidden
          bg-neutral-50
        "
      >

        <Image
          src={
            product.images[0]?.url ??
            "/placeholder.png"
          }
          alt={product.name}
          fill
          draggable={false}
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* ================================================= */}
        {/* Badges */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            left-3
            top-3
            flex
            flex-wrap
            gap-2
          "
        >

          {product.newArrival && (
            <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">
              NEW
            </span>
          )}

          {product.bestSeller && (
            <span className="rounded-full bg-amber-500 px-2 py-1 text-[10px] font-semibold text-white">
              BEST
            </span>
          )}

          {product.featured && (
            <span className="rounded-full bg-black px-2 py-1 text-[10px] font-semibold text-white">
              FEATURED
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

      </Link>

      {/* ================================================= */}
      {/* Product Info */}
      {/* ================================================= */}

      <Link
        href={`/admin/dashboard/products/${product.id}/edit`}
        draggable={false}
        className="
          flex
          flex-1
          flex-col
          p-5
        "
      >

        <div>

          <h3 className="font-semibold leading-6 text-neutral-900">
            {product.name}
          </h3>

          <p className="mt-1 text-sm text-neutral-500">
            {product.brand}
          </p>

        </div>

        {/* ================================================= */}
        {/* Price + Availability */}
        {/* ================================================= */}

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">

          <p className="shrink-0 text-lg font-bold text-neutral-900">
            RM{" "}
            {product.price.toFixed(2)}
          </p>

          <span
            className={`
              shrink-0
              rounded-full
              px-3
              py-1
              text-xs
              font-medium
              ${
                product.availability ===
                Availability.IN_STOCK
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {product.availability ===
            Availability.IN_STOCK
              ? "In Stock"
              : "Out of Stock"}
          </span>

        </div>

      </Link>

    </div>
  );
}

/*
 * =========================================================
 * PRODUCT GRID
 * =========================================================
 */

export default function ProductGrid({
  products,
  page,
  pageSize,
  sort,
}: ProductGridProps) {
  const router =
    useRouter();

  /*
   * =========================================================
   * DISPLAY PRODUCTS
   * =========================================================
   */

  const [
    displayProducts,
    setDisplayProducts,
  ] = useState<ProductWithImages[]>(
    products
  );

  /*
   * =========================================================
   * SAVING STATE
   * =========================================================
   */

  const [
    isSavingOrder,
    setIsSavingOrder,
  ] = useState(false);

  /*
   * =========================================================
   * DRAG STATE
   * =========================================================
   */

  const [
    dragActive,
    setDragActive,
  ] = useState(false);

  /*
   * =========================================================
   * MANUAL ORDER
   * =========================================================
   */

  const isManualOrder =
    sort === "manual" ||
    sort === "featured";

  /*
   * =========================================================
   * DRAG SENSOR
   * =========================================================
   */

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

  /*
   * =========================================================
   * SYNC SERVER DATA
   * =========================================================
   */

  useEffect(() => {
    setDisplayProducts(
      products
    );
  }, [products]);

  /*
   * =========================================================
   * DRAG START
   * =========================================================
   */

  function handleDragStart(
    _event: DragStartEvent
  ) {
    setDragActive(true);
  }

  /*
   * =========================================================
   * DRAG END
   * =========================================================
   */

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    /*
     * Keep dragActive true until after the click event
     * generated by the browser has been blocked.
     */

    if (isSavingOrder) {
      setDragActive(false);
      return;
    }

    if (!isManualOrder) {
      setDragActive(false);

      toast.error(
        "Switch to Manual Order before dragging products."
      );

      return;
    }

    const {
      active,
      over,
    } = event;

    if (!over) {
      setDragActive(false);
      return;
    }

    if (
      active.id ===
      over.id
    ) {
      setDragActive(false);
      return;
    }

    const oldIndex =
      displayProducts.findIndex(
        (product) =>
          product.id ===
          Number(active.id)
      );

    const newIndex =
      displayProducts.findIndex(
        (product) =>
          product.id ===
          Number(over.id)
      );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      setDragActive(false);
      return;
    }

    /*
     * -------------------------------------------------------
     * Save previous state.
     * -------------------------------------------------------
     */

    const previousProducts =
      [...displayProducts];

    /*
     * -------------------------------------------------------
     * Optimistic reorder.
     * -------------------------------------------------------
     */

    const reordered =
      arrayMove(
        displayProducts,
        oldIndex,
        newIndex
      );

    setDisplayProducts(
      reordered
    );

    /*
     * -------------------------------------------------------
     * Send ONLY IDs.
     *
     * Server calculates the real global displayOrder.
     * -------------------------------------------------------
     */

    const orderedIds =
      reordered.map(
        (product) =>
          product.id
      );

    setIsSavingOrder(
      true
    );

    try {
      await updateProductDisplayOrder(
        orderedIds
      );

      toast.success(
        "Product order updated."
      );

      /*
       * Refresh server data.
       */

      router.refresh();

    } catch (error) {
      console.error(
        "Failed to save product order:",
        error
      );

      /*
       * Restore previous order.
       */

      setDisplayProducts(
        previousProducts
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to save product order.";

      toast.error(
        message
      );

    } finally {
      setIsSavingOrder(
        false
      );

      /*
       * Delay clearing drag state slightly so the browser's
       * post-drag click can still be blocked.
       */

      window.setTimeout(
        () => {
          setDragActive(false);
        },
        100
      );
    }
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="space-y-4">

      {/* ================================================= */}
      {/* Manual Order Notice */}
      {/* ================================================= */}

      {!isManualOrder && (
        <div
          className="
            rounded-xl
            border
            border-amber-200
            bg-amber-50
            px-4
            py-3
            text-sm
            text-amber-800
          "
        >

          <span className="font-medium">
            Manual Order
          </span>{" "}

          is required to drag and reorder
          products.

        </div>
      )}

      {/* ================================================= */}
      {/* Saving Notice */}
      {/* ================================================= */}

      {isSavingOrder && (
        <div
          className="
            rounded-xl
            border
            border-neutral-200
            bg-neutral-50
            px-4
            py-3
            text-sm
            text-neutral-600
          "
        >
          Saving product order...
        </div>
      )}

      {/* ================================================= */}
      {/* Drag & Drop */}
      {/* ================================================= */}

      <DndContext
        sensors={sensors}
        collisionDetection={
          closestCenter
        }
        onDragStart={
          handleDragStart
        }
        onDragEnd={
          handleDragEnd
        }
      >

        <SortableContext
          items={
            displayProducts.map(
              (product) =>
                product.id
            )
          }
          strategy={
            rectSortingStrategy
          }
        >

          <div
            className="
              grid
              gap-6
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            {displayProducts.map(
              (product) => (
                <SortableProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                  dragActive={
                    dragActive
                  }
                />
              )
            )}

          </div>

        </SortableContext>

      </DndContext>

    </div>
  );
}