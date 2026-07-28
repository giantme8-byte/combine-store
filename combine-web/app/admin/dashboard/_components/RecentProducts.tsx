import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";

function getRelativeDate(date: Date) {
  const now = new Date();

  const diff = now.getTime() - date.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString();
}

export default async function RecentProducts() {
  const products = await prisma.product.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">
            Products
          </p>

          <h2 className="mt-2 text-2xl font-light">
            Recently Added
          </h2>
        </div>

        <Link
          href="/admin/dashboard/products"
          className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2 text-sm transition hover:bg-neutral-100"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-neutral-500">
            No products found.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/dashboard/products/${product.id}`}
              className="flex items-center gap-5 rounded-2xl border border-neutral-200 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-sm"
            >
              {/* Image */}
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0]!.url}
                  alt={product.name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-xl border border-neutral-200 object-cover"
                />
              ) : (
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-xs text-neutral-500">
                  No Image
                </div>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">
                  {product.brand}
                </p>

                <h3 className="mt-1 truncate text-lg font-medium">
                  {product.name}
                </h3>

                {/* Status */}
                <div className="mt-3 flex flex-wrap gap-2">
{product.featured && (
  <Badge variant="default">
    Featured
  </Badge>
)}

{product.newArrival && (
  <Badge variant="info">
    New
  </Badge>
)}

{product.bestSeller && (
  <Badge variant="success">
    Best Seller
  </Badge>
)}

{product.onSale && (
  <Badge variant="danger">
    Sale
  </Badge>
)}

{product.limited && (
  <Badge variant="warning">
    Limited
  </Badge>
)}
                </div>

                <p className="mt-3 text-sm text-neutral-500">
                  Added {getRelativeDate(product.createdAt)}
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-2xl font-medium">
                  RM {product.price.toFixed(2)}
                </p>

<div className="mt-3">
  <Badge
    variant={
      product.availability === "IN_STOCK"
        ? "success"
        : product.availability === "PRE_ORDER"
        ? "warning"
        : product.availability === "LIMITED"
        ? "info"
        : "danger"
    }
  >
    {product.availability === "IN_STOCK"
      ? "In Stock"
      : product.availability === "PRE_ORDER"
      ? "Pre-order"
      : product.availability === "LIMITED"
      ? "Limited"
      : "Sold Out"}
  </Badge>
</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}