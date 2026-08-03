import Link from "next/link";
import Image from "next/image";

import { Availability } from "@prisma/client";

import type {
  ProductWithImages,
} from "@/types/product";

type ProductGridProps = {
  products: ProductWithImages[];
};

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {products.map((product) => (

        <Link
          key={product.id}
          href={`/admin/dashboard/products/${product.id}/edit`}
          className="
            group
            overflow-hidden
            rounded-2xl
            border
            border-neutral-200
            bg-white
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-neutral-300
            hover:shadow-xl
          "
        >

          <div className="relative aspect-square overflow-hidden bg-neutral-50">

            <Image
              src={
                product.images[0]?.url ??
                "/placeholder.png"
              }
              alt={product.name}
              fill
              className="
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />

            <div className="absolute left-3 top-3 flex flex-wrap gap-2">

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

          </div>

          <div className="space-y-3 p-5">

            <div>

              <h3 className="line-clamp-2 font-semibold text-neutral-900">
                {product.name}
              </h3>

              <p className="mt-1 text-sm text-neutral-500">
                {product.brand}
              </p>

            </div>

            <div className="flex items-center justify-between">

              <p className="text-lg font-bold">
                RM {product.price.toFixed(2)}
              </p>

              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-medium
                  ${
                    product.availability === Availability.IN_STOCK
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {product.availability === Availability.IN_STOCK
                  ? "In Stock"
                  : "Out of Stock"}
              </span>

            </div>

          </div>

        </Link>

      ))}

    </div>
  );
}