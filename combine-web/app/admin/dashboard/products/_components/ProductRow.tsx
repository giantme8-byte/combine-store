"use client";

import Image from "next/image";
import { Prisma } from "@prisma/client";

import Badge from "../../_components/Badge";
import ProductActions from "./ProductActions";
import { calculateProductProfit } from "@/lib/product";

type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    images: true;
  };
}>;

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
  const result = calculateProductProfit(product, exchangeRate);

  return (
    <tr className="border-b border-neutral-200 transition-all duration-200 hover:bg-neutral-50 hover:shadow-sm">
      <td className="w-12 px-4 py-6 align-top">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="mt-2 h-4 w-4 rounded border-neutral-300"
        />
      </td>

      {/* Product */}
      <td className="px-6 py-6 align-top">
        <div className="flex gap-5">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              width={100}
              height={100}
              sizes="100px"
              className="h-[100px] w-[100px] rounded-2xl border border-neutral-200 bg-white object-contain p-2"
            />
          ) : (
            <div className="flex h-[100px] w-[100px] items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 text-sm text-neutral-500">
              No Image
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
              {product.brand}
            </p>

            <h3 className="mt-2 text-lg font-semibold leading-tight text-neutral-900">
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
                <Badge>NEW</Badge>
              )}

              {product.featured && (
                <Badge>FEATURED</Badge>
              )}

              {product.bestSeller && (
                <Badge>BEST SELLER</Badge>
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

      {/* Pricing */}
      <td className="px-6 py-6 align-top">
        <div className="space-y-5">

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">
              Cost
            </p>

            <div className="mt-2 space-y-1 font-medium tabular-nums">
              <p>
                {product.costPriceCny != null
                  ? `¥ ${product.costPriceCny.toFixed(2)}`
                  : "-"}
              </p>

              <p className="text-neutral-500">
                RM {result.costMyr.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">
              Selling
            </p>

            <p className="mt-2 font-semibold tabular-nums">
              RM {product.price.toFixed(2)}
            </p>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">
              Profit
            </p>

            <p
              className={`mt-2 font-semibold tabular-nums ${
                result.profit >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              RM {result.profit.toFixed(2)}
            </p>

            <p className="mt-1 text-sm text-neutral-500 tabular-nums">
              {result.margin.toFixed(1)}%
            </p>
          </div>
        </div>
      </td>

      {/* Availability */}
      <td className="px-6 py-6 align-top">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">
              Status
            </p>

            <div className="mt-2">
              {product.availability === "IN_STOCK" ? (
                <Badge>In Stock</Badge>
              ) : product.availability === "PRE_ORDER" ? (
                <Badge>Pre Order</Badge>
              ) : product.availability === "LIMITED" ? (
                <Badge variant="warning">Limited</Badge>
              ) : (
                <Badge variant="danger">Sold Out</Badge>
              )}
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-400">
              Inventory
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Unlimited
            </p>
          </div>
        </div>
      </td>

      {/* Actions */}
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