"use client";

import type {
  CSSProperties,
  MouseEvent,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
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
  type DragEndEvent,
  type DragStartEvent,
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


// ============================================================
// TYPES
// ============================================================

type ProductGridProps = {
  products: ProductWithImages[];

  page: number;

  pageSize: number;

  sort: string;

  /*
   * Current Products page state.
   *
   * Used to build the returnTo URL when opening Edit Product.
   */

  search: string;

  brand: string;

  category: string;

  availability: string;
};


type SortableProductCardProps = {
  product: ProductWithImages;

  dragActive: boolean;

  editUrl: string;
};


// ============================================================
// PRICE FORMATTER
// ============================================================

function formatPrice(
  price: number
) {
  return `RM ${price.toLocaleString(
    "en-MY",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}


// ============================================================
// PRODUCT PRICE DISPLAY
// ============================================================

function getProductPriceDisplay(
  product: ProductWithImages
) {

  const variantPrices =
    product.variants
      ?.map(
        (variant) =>
          variant.price
      )
      .filter(
        (
          price
        ): price is number =>
          typeof price ===
            "number" &&
          Number.isFinite(price)
      ) ?? [];


  const uniquePrices =
    Array.from(
      new Set(
        variantPrices
      )
    ).sort(
      (
        a,
        b
      ) =>
        a - b
    );


  /*
   * No Variant price.
   */

  if (
    uniquePrices.length === 0
  ) {

    return formatPrice(
      product.price
    );

  }


  /*
   * Only one unique price.
   */

  if (
    uniquePrices.length === 1
  ) {

    return formatPrice(
      uniquePrices[0]
    );

  }


  /*
   * Multiple different prices.
   */

  const minPrice =
    uniquePrices[0];


  const maxPrice =
    uniquePrices[
      uniquePrices.length - 1
    ];


  return `${formatPrice(
    minPrice
  )} – ${formatPrice(
    maxPrice
  )}`;
}


// ============================================================
// SORTABLE PRODUCT CARD
// ============================================================

function SortableProductCard({
  product,
  dragActive,
  editUrl,
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


  const priceDisplay =
    getProductPriceDisplay(
      product
    );


  /*
   * Prevent the product link from
   * opening immediately after drag.
   */

  const handleClickCapture = (
    event: MouseEvent
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
        min-w-0
        touch-none
        flex-col
        overflow-hidden
        rounded-xl
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

      {/* ================================================== */}
      {/* PRODUCT IMAGE */}
      {/* ================================================== */}

      <Link
        href={editUrl}
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
          sizes="
            (max-width: 639px) 100vw,
            (max-width: 1279px) 50vw,
            25vw
          "
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />


        {/* ================================================== */}
        {/* BADGES */}
        {/* ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-2.5
            top-2.5
            flex
            flex-wrap
            gap-1

            sm:left-3
            sm:top-3
            sm:gap-1.5
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

      </Link>


      {/* ================================================== */}
      {/* PRODUCT INFO */}
      {/* ================================================== */}

      <Link
        href={editUrl}
        draggable={false}
        className="
          flex
          min-w-0
          flex-1
          flex-col
          p-3

          sm:p-5
        "
      >

        {/* ================================================= */}
        {/* PRODUCT NAME + BRAND */}
        {/* ================================================= */}

        <div
          className="
            min-w-0
          "
        >

          {/* ================================================= */}
          {/* PRODUCT NAME */}
          {/* ================================================= */}

          <h3
            className="
              line-clamp-2
              min-h-[40px]
              text-sm
              font-semibold
              leading-5
              tracking-tight
              text-neutral-900

              sm:min-h-[48px]
              sm:text-lg
              sm:leading-6
            "
          >
            {product.name}
          </h3>


          {/* ================================================= */}
          {/* BRAND */}
          {/* ================================================= */}

          <p
            className="
              mt-1
              min-h-4
              truncate
              text-[11px]
              leading-4
              text-neutral-500

              sm:mt-1.5
              sm:min-h-5
              sm:text-sm
              sm:leading-5
            "
          >
            {product.brand}
          </p>

        </div>


        {/* ================================================= */}
        {/* PRICE + AVAILABILITY */}
        {/* ================================================= */}

        <div
          className="
            mt-auto
            min-w-0
            pt-3

            sm:pt-6
          "
        >

          {/* ================================================= */}
          {/* PRICE */}
          {/* ================================================= */}

          <p
            className="
              whitespace-nowrap
              text-sm
              font-bold
              leading-5
              tracking-tight
              text-neutral-900

              sm:text-base
              sm:leading-6

              lg:text-lg
            "
          >
            {priceDisplay}
          </p>


          {/* ================================================= */}
          {/* AVAILABILITY */}
          {/* ================================================= */}

          <div
            className="
              mt-2
              flex
              min-w-0
              items-center
            "
          >

            <span
              className={`
                shrink-0
                rounded-full
                px-2
                py-0.5
                text-[9px]
                font-medium

                sm:px-3
                sm:py-1
                sm:text-xs

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

        </div>

      </Link>

    </div>
  );
}


// ============================================================
// PRODUCT GRID
// ============================================================

export default function ProductGrid({
  products,
  page,
  pageSize,
  sort,
  search,
  brand,
  category,
  availability,
}: ProductGridProps) {

  const router =
    useRouter();


  // ==========================================================
  // DISPLAY PRODUCTS
  // ==========================================================

  const [
    displayProducts,
    setDisplayProducts,
  ] = useState<ProductWithImages[]>(
    products
  );


  // ==========================================================
  // SAVING STATE
  // ==========================================================

  const [
    isSavingOrder,
    setIsSavingOrder,
  ] = useState(false);


  // ==========================================================
  // DRAG STATE
  // ==========================================================

  const [
    dragActive,
    setDragActive,
  ] = useState(false);


  // ==========================================================
  // MANUAL ORDER
  // ==========================================================

  const isManualOrder =
    sort === "manual" ||
    sort === "featured";


  // ==========================================================
  // RETURN URL
  // ==========================================================

  /*
   * Build the exact Products URL that the admin is currently
   * viewing.
   *
   * Example:
   *
   * /admin/dashboard/products?page=3&search=LV&brand=Louis+Vuitton&sort=manual
   */

  const returnTo = (() => {

    const params =
      new URLSearchParams();


    /*
     * Always preserve page.
     */

    params.set(
      "page",
      String(page)
    );


    /*
     * Preserve search.
     */

    if (search) {

      params.set(
        "search",
        search
      );

    }


    /*
     * Preserve brand.
     */

    if (brand) {

      params.set(
        "brand",
        brand
      );

    }


    /*
     * Preserve category.
     */

    if (category) {

      params.set(
        "category",
        category
      );

    }


    /*
     * Preserve availability.
     */

    if (availability) {

      params.set(
        "availability",
        availability
      );

    }


    /*
     * Preserve sort.
     */

    if (sort) {

      params.set(
        "sort",
        sort
      );

    }


    return `/admin/dashboard/products?${params.toString()}`;

  })();


  // ==========================================================
  // EDIT URL
  // ==========================================================

  function getEditUrl(
    productId: number
  ) {

    const params =
      new URLSearchParams();


    params.set(
      "returnTo",
      returnTo
    );


    return `/admin/dashboard/products/${productId}/edit?${params.toString()}`;

  }


  // ==========================================================
  // DRAG SENSOR
  // ==========================================================

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


  // ==========================================================
  // SYNC SERVER DATA
  // ==========================================================

  useEffect(() => {

    setDisplayProducts(
      products
    );

  }, [
    products,
  ]);


  // ==========================================================
  // DRAG START
  // ==========================================================

  function handleDragStart(
    _event: DragStartEvent
  ) {

    setDragActive(
      true
    );

  }


  // ==========================================================
  // DRAG END
  // ==========================================================

  async function handleDragEnd(
    event: DragEndEvent
  ) {

    if (isSavingOrder) {

      setDragActive(
        false
      );

      return;

    }


    // ========================================================
    // MANUAL ORDER CHECK
    // ========================================================

    if (!isManualOrder) {

      setDragActive(
        false
      );

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

      setDragActive(
        false
      );

      return;

    }


    if (
      active.id ===
      over.id
    ) {

      setDragActive(
        false
      );

      return;

    }


    // ========================================================
    // FIND INDEXES
    // ========================================================

    const oldIndex =
      displayProducts.findIndex(
        (product) =>
          product.id ===
          Number(
            active.id
          )
      );


    const newIndex =
      displayProducts.findIndex(
        (product) =>
          product.id ===
          Number(
            over.id
          )
      );


    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {

      setDragActive(
        false
      );

      return;

    }


    // ========================================================
    // PREVIOUS STATE
    // ========================================================

    const previousProducts =
      [
        ...displayProducts,
      ];


    // ========================================================
    // OPTIMISTIC REORDER
    // ========================================================

    const reordered =
      arrayMove(
        displayProducts,
        oldIndex,
        newIndex
      );


    setDisplayProducts(
      reordered
    );


    // ========================================================
    // ORDERED IDS
    // ========================================================

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


      router.refresh();

    } catch (error) {

      console.error(
        "Failed to save product order:",
        error
      );


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


      window.setTimeout(
        () => {

          setDragActive(
            false
          );

        },
        100
      );

    }

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        space-y-4
      "
    >

      {/* ================================================== */}
      {/* MANUAL ORDER NOTICE */}
      {/* ================================================== */}

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


      {/* ================================================== */}
      {/* SAVING NOTICE */}
      {/* ================================================== */}

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


      {/* ================================================== */}
      {/* DRAG & DROP */}
      {/* ================================================== */}

      <DndContext
        sensors={
          sensors
        }
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
              grid-cols-1
              gap-4

              sm:grid-cols-2
              sm:gap-5

              xl:grid-cols-4
              xl:gap-6
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
                  editUrl={
                    getEditUrl(
                      product.id
                    )
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