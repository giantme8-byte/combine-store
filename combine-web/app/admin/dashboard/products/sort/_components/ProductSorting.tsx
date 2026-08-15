"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { ProductWithImages } from "@/types/product";

import SortToolbar from "./SortToolbar";
import SortList from "./SortList";
import SaveBar from "./SaveBar";

import {
  updateProductDisplayOrder,
} from "../../_actions/product.actions";

type ProductSortingProps = {
  products: ProductWithImages[];

  brands: {
    id: number;
    name: string;
  }[];

  categories: {
    id: number;
    name: string;
  }[];
};

export default function ProductSorting({
  products,
  brands,
  categories,
}: ProductSortingProps) {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [sortedProducts, setSortedProducts] =
    useState<ProductWithImages[]>([
      ...products,
    ]);

  const [originalProducts, setOriginalProducts] =
    useState<ProductWithImages[]>([
      ...products,
    ]);

  const [hasChanges, setHasChanges] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  /*
   * =========================================================
   * SYNC PRODUCTS
   * =========================================================
   */

  useEffect(() => {
    setSortedProducts([
      ...products,
    ]);

    setOriginalProducts([
      ...products,
    ]);

    setHasChanges(false);
  }, [products]);

  /*
   * =========================================================
   * BEFORE UNLOAD
   * =========================================================
   */

  useEffect(() => {
    const handleBeforeUnload = (
      event: BeforeUnloadEvent
    ) => {
      if (!hasChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [hasChanges]);

  /*
   * =========================================================
   * FILTER
   * =========================================================
   */

  const filteredProducts =
    sortedProducts.filter((product) => {
      const matchSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchBrand =
        !brand ||
        product.brand === brand;

      const matchCategory =
        !category ||
        product.category === category;

      return (
        matchSearch &&
        matchBrand &&
        matchCategory
      );
    });

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main className="space-y-8">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-semibold">
            Product Sorting
          </h1>

          <p className="mt-2 text-neutral-500">

            Showing{" "}

            <span className="font-semibold text-neutral-900">
              {filteredProducts.length}
            </span>{" "}

            of{" "}

            <span className="font-semibold text-neutral-900">
              {products.length}
            </span>{" "}

            products

          </p>

        </div>

        <div
          className="
            rounded-full
            border
            border-green-200
            bg-green-50
            px-4
            py-2
            text-sm
            font-medium
            text-green-700
          "
        >
          ✓ Drag &amp; Drop Enabled
        </div>

      </div>

      {/* ================================================= */}
      {/* TOOLBAR */}
      {/* ================================================= */}

      <SortToolbar
        search={search}
        brand={brand}
        category={category}
        brands={brands}
        categories={categories}
        onSearchChange={setSearch}
        onBrandChange={setBrand}
        onCategoryChange={setCategory}
      />

      {/* ================================================= */}
      {/* SORT LIST */}
      {/* ================================================= */}

      <SortList
        products={filteredProducts}
        allProducts={sortedProducts}
        onChange={(products) => {
          setSortedProducts(products);
          setHasChanges(true);
        }}
      />

      {/* ================================================= */}
      {/* SAVE BAR */}
      {/* ================================================= */}

      {hasChanges && (
        <SaveBar
          saving={saving}

          /*
           * -------------------------------------------------
           * CANCEL
           * -------------------------------------------------
           */

          onCancel={() => {
            setSortedProducts([
              ...originalProducts,
            ]);

            setHasChanges(false);
          }}

          /*
           * -------------------------------------------------
           * SAVE
           * -------------------------------------------------
           */

          onSave={async () => {
            setSaving(true);

            try {
              /*
               * Send ONLY product IDs.
               *
               * The server action is responsible for
               * calculating the final global displayOrder.
               *
               * This prevents the sorting logic from becoming
               * dependent on pagination / filtered indexes.
               */

              const orderedIds =
                sortedProducts.map(
                  (product) =>
                    product.id
                );

              await updateProductDisplayOrder(
                orderedIds
              );

              /*
               * Save successful.
               */

              setHasChanges(false);

              setOriginalProducts([
                ...sortedProducts,
              ]);

              toast.success(
                "Product order updated."
              );

              router.refresh();

            } catch (error) {
              console.error(
                "Failed to update product order:",
                error
              );

              toast.error(
                "Unable to save changes."
              );

            } finally {
              setSaving(false);
            }
          }}
        />
      )}

    </main>
  );
}