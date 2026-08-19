"use client";

import type { CSSProperties } from "react";

import Image from "next/image";

import { GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import type { ProductWithImages } from "@/types/product";

import { calculateProductProfit } from "@/lib/product";

import Badge from "../../_components/Badge";
import ProductActions from "./ProductActions";

import EditableField from "./EditableField";

import {
  quickUpdateProductPrice,
  quickUpdateProductVariantPrice,
} from "../_actions/product.actions";

import { toast } from "sonner";

type ProductRowProps = {
  product: ProductWithImages;

  exchangeRate: number;

  selected: boolean;

  onToggle: () => void;

  canDelete: boolean;
};

export default function ProductRow({
  product,
  exchangeRate,
  selected,
  onToggle,
  canDelete,
}: ProductRowProps) {
  // =========================================================
  // PRODUCT-LEVEL PROFIT
  // =========================================================
  //
  // Used only when this Product has no Variants.
  //
  // =========================================================

  const productResult =
    calculateProductProfit(
      product,
      exchangeRate
    );

  // =========================================================
  // SORTABLE
  // =========================================================

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

  // =========================================================
  // VARIANT PROFIT CALCULATION
  // =========================================================
  //
  // Every Variant represents ONE calculation unit.
  //
  // Cost:
  //
  // Variant Cost CNY
  // × Variant Exchange Rate
  //
  // If Variant Exchange Rate is empty:
  // use Product / Dashboard exchange rate.
  //
  // Selling:
  //
  // Variant Price
  // ↓
  // Product Price fallback
  //
  // =========================================================

  function calculateVariantProfit(
    variant: ProductWithImages["variants"][number]
  ) {
    const effectiveExchangeRate =
      variant.exchangeRate ??
      exchangeRate;

    const costPriceCny =
      variant.costPriceCny ??
      product.costPriceCny ??
      0;

    const costMyr =
      costPriceCny *
      effectiveExchangeRate;

    const sellingPrice =
      variant.price ??
      product.price;

    const profit =
      sellingPrice -
      costMyr;

    const margin =
      sellingPrice <= 0
        ? 0
        : (profit /
            sellingPrice) *
          100;

    return {
      costPriceCny,
      effectiveExchangeRate,
      costMyr,
      sellingPrice,
      profit,
      margin,
    };
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`
        border-b
        border-neutral-200
        transition-[box-shadow,opacity,background-color]
        duration-200
        hover:bg-neutral-50
        hover:shadow-sm
        ${
          isDragging
            ? "relative z-20 bg-white opacity-70 shadow-xl"
            : ""
        }
      `}
    >
      {/* ================================================= */}
      {/* Selection */}
      {/* ================================================= */}

      <td className="w-16 px-4 py-6 align-top">
        <div className="flex flex-col items-center gap-3">

          <GripVertical
            {...attributes}
            {...listeners}
            size={18}
            className="
              cursor-grab
              text-neutral-400
              transition
              hover:text-neutral-700
              active:cursor-grabbing
            "
          />

          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="
              h-4
              w-4
              rounded
              border-neutral-300
              accent-black
            "
          />

        </div>
      </td>

      {/* ================================================= */}
      {/* Product */}
      {/* ================================================= */}

      <td className="px-6 py-6 align-top">
        <div className="flex gap-5">

          {product.images.length > 0 ? (
            <div className="overflow-hidden rounded-2xl">

              <Image
                src={product.images[0].url}
                alt={product.name}
                width={96}
                height={96}
                sizes="100px"
                className="
                  h-24
                  w-24
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-white
                  object-contain
                  p-2
                  transition-transform
                  duration-300
                  hover:scale-105
                "
              />

            </div>
          ) : (
            <div
              className="
                flex
                h-[100px]
                w-[100px]
                items-center
                justify-center
                rounded-2xl
                border
                border-neutral-200
                bg-neutral-100
                text-sm
                text-neutral-500
              "
            >
              No Image
            </div>
          )}

          <div className="min-w-0 flex-1">

            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-neutral-400
              "
            >
              {product.brand}
            </p>

            <h3
              className="
                mt-2
                text-lg
                font-semibold
                leading-tight
                text-neutral-900
                transition-colors
                duration-200
                hover:text-black
              "
            >
              {product.name}
            </h3>

            <p className="mt-2 text-sm text-neutral-500">
              Reference · {product.sku ?? "-"}
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              {product.category}

              {product.subCategory
                ? ` • ${product.subCategory}`
                : ""}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">

              {product.newArrival && (
                <Badge>
                  NEW
                </Badge>
              )}

              {product.featured && (
                <Badge>
                  FEATURED
                </Badge>
              )}

              {product.bestSeller && (
                <Badge>
                  BEST SELLER
                </Badge>
              )}

              {product.limited && (
                <Badge variant="warning">
                  LIMITED
                </Badge>
              )}

              {product.onSale && (
                <Badge variant="success">
                  SALE
                </Badge>
              )}

            </div>
          </div>
        </div>
      </td>

      {/* ================================================= */}
      {/* Pricing */}
      {/* ================================================= */}

      <td className="px-6 py-6 align-top">

        {/*
         * ====================================================
         * PRODUCT WITH VARIANTS
         * ====================================================
         */}

        {product.variants.length > 0 ? (

          <div className="space-y-6">

            {product.variants.map(
              (variant) => {

                const result =
                  calculateVariantProfit(
                    variant
                  );

                /*
                 * Color name comes from the
                 * Prisma Color relation.
                 *
                 * If no Color relation exists,
                 * fall back to Color ID.
                 */

                const colorName =
                  variant.color?.name ??
                  (
                    variant.colorId !== null
                      ? `Color #${variant.colorId}`
                      : null
                  );

                return (
                  <div
                    key={variant.id}
                    className="
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-white
                      p-4
                    "
                  >

                    {/* ====================================== */}
                    {/* Variant Name */}
                    {/* ====================================== */}

                    <div className="mb-4">

                      <p
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.2em]
                          text-neutral-400
                        "
                      >
                        Variant
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          font-semibold
                          text-neutral-900
                        "
                      >
                        {colorName
                          ? `${colorName} / ${variant.size}`
                          : variant.size}
                      </p>

                    </div>

                    {/* ====================================== */}
                    {/* Cost */}
                    {/* ====================================== */}

                    <div>

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-[0.16em]
                          text-neutral-400
                        "
                      >
                        Cost
                      </p>

                      <div
                        className="
                          mt-2
                          space-y-1
                          font-medium
                          tabular-nums
                        "
                      >

                        <p>
                          {variant.costPriceCny != null
                            ? `¥ ${variant.costPriceCny.toFixed(2)}`
                            : product.costPriceCny != null
                              ? `¥ ${product.costPriceCny.toFixed(2)}`
                              : "-"}
                        </p>

                        <p className="text-neutral-500">
                          RM{" "}
                          {result.costMyr.toFixed(
                            2
                          )}
                        </p>

                      </div>

                    </div>

                    {/* ====================================== */}
                    {/* Selling */}
                    {/* ====================================== */}

                    <div
                      className="
                        mt-4
                        border-t
                        border-neutral-200
                        pt-4
                      "
                    >

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-[0.16em]
                          text-neutral-400
                        "
                      >
                        Selling
                      </p>

                      {/* ================================================= */}
                      {/* DIRECT VARIANT PRICE EDIT */}
                      {/* ================================================= */}

                      <EditableField
                        value={result.sellingPrice.toFixed(2)}
                        className="
                          mt-2
                          font-semibold
                          tabular-nums
                        "
                        onSave={async (
                          value
                        ) => {

                          const price =
                            Number(value);

                          if (
                            !Number.isFinite(
                              price
                            ) ||
                            price < 0
                          ) {
                            toast.error(
                              "Invalid selling price"
                            );

                            return;
                          }

                          try {

                            await quickUpdateProductVariantPrice(
                              variant.id,
                              price
                            );

                            toast.success(
                              "Variant price updated"
                            );

                          } catch (error) {

                            console.error(
                              error
                            );

                            toast.error(
                              "Failed to update variant price"
                            );

                          }

                        }}
                      />

                    </div>

                    {/* ====================================== */}
                    {/* Profit */}
                    {/* ====================================== */}

                    <div
                      className="
                        mt-4
                        border-t
                        border-neutral-200
                        pt-4
                      "
                    >

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-[0.16em]
                          text-neutral-400
                        "
                      >
                        Profit
                      </p>

                      <p
                        className={`
                          mt-2
                          font-semibold
                          tabular-nums
                          ${
                            result.profit >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        `}
                      >
                        RM{" "}
                        {result.profit.toFixed(
                          2
                        )}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-neutral-500
                          tabular-nums
                        "
                      >
                        {result.margin.toFixed(
                          1
                        )}
                        %
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        ) : (

          /*
           * ==================================================
           * PRODUCT WITHOUT VARIANTS
           * ==================================================
           */

          <div className="space-y-5">

            {/* ============================================== */}
            {/* Cost */}
            {/* ============================================== */}

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.16em]
                  text-neutral-400
                "
              >
                Cost
              </p>

              <div
                className="
                  mt-2
                  space-y-1
                  font-medium
                  tabular-nums
                "
              >

                <p>
                  {product.costPriceCny != null
                    ? `¥ ${product.costPriceCny.toFixed(2)}`
                    : "-"}
                </p>

                <p className="text-neutral-500">
                  RM{" "}
                  {productResult.costMyr.toFixed(
                    2
                  )}
                </p>

              </div>

            </div>

            {/* ============================================== */}
            {/* Selling */}
            {/* ============================================== */}

            <div
              className="
                border-t
                border-neutral-200
                pt-4
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.16em]
                  text-neutral-400
                "
              >
                Selling
              </p>

              <EditableField
                value={product.price.toFixed(
                  2
                )}
                className="
                  mt-2
                  font-semibold
                  tabular-nums
                "
                onSave={async (
                  value
                ) => {

                  const price =
                    Number(value);

                  if (
                    Number.isNaN(
                      price
                    )
                  ) {

                    toast.error(
                      "Invalid price"
                    );

                    return;
                  }

                  await quickUpdateProductPrice(
                    product.id,
                    price
                  );

                  toast.success(
                    "Price updated"
                  );
                }}
              />

            </div>

            {/* ============================================== */}
            {/* Profit */}
            {/* ============================================== */}

            <div
              className="
                border-t
                border-neutral-200
                pt-4
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.16em]
                  text-neutral-400
                "
              >
                Profit
              </p>

              <p
                className={`
                  mt-2
                  font-semibold
                  tabular-nums
                  ${
                    productResult.profit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                `}
              >
                RM{" "}
                {productResult.profit.toFixed(
                  2
                )}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                  tabular-nums
                "
              >
                {productResult.margin.toFixed(
                  1
                )}
                %
              </p>

            </div>

          </div>

        )}

      </td>

      {/* ================================================= */}
      {/* Availability */}
      {/* ================================================= */}

      <td className="px-6 py-6 align-top">

        <div className="space-y-4">

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-[0.16em]
                text-neutral-400
              "
            >
              Status
            </p>

            <div className="mt-2">

              {product.availability ===
              "IN_STOCK" ? (

                <Badge>
                  🟢 In Stock
                </Badge>

              ) : product.availability ===
                "PRE_ORDER" ? (

                <Badge>
                  🟡 Pre Order
                </Badge>

              ) : product.availability ===
                "LIMITED" ? (

                <Badge variant="warning">
                  🟠 Limited
                </Badge>

              ) : (

                <Badge variant="danger">
                  🔴 Sold Out
                </Badge>

              )}

            </div>

          </div>

          <div
            className="
              border-t
              border-neutral-200
              pt-4
            "
          >

            <p
              className="
                text-xs
                uppercase
                tracking-[0.16em]
                text-neutral-400
              "
            >
              Inventory
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Unlimited
            </p>

          </div>

        </div>

      </td>

      {/* ================================================= */}
      {/* Actions */}
      {/* ================================================= */}

      <td className="px-6 py-6 align-top">

        <div className="flex justify-end">

          <ProductActions
            productId={product.id}
            productName={product.name}
            canDelete={canDelete}
          />

        </div>

      </td>

    </tr>
  );
}