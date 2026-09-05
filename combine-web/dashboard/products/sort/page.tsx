import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";

import ProductSorting from "./_components/ProductSorting";

export default async function ProductSortingPage() {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.STAFF,
  ]);

  const [products, brands, categories] =
    await Promise.all([
      prisma.product.findMany({
        orderBy: {
          displayOrder: "asc",
        },

        include: {
          // ===================================================
          // Product Images
          // ===================================================

          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },

          // ===================================================
          // Product Variants
          //
          // Included because ProductWithImages now contains
          // Variant data and Variant Color relation.
          // ===================================================

          variants: {
            include: {
              color: true,
            },
          },
        },
      }),

      prisma.brand.findMany({
        orderBy: {
          name: "asc",
        },
      }),

      prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  return (
    <ProductSorting
      products={products}
      brands={brands}
      categories={categories}
    />
  );
}