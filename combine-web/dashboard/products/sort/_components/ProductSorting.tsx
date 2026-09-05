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

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [search, setSearch] = useState("");

  const [brand, setBrand] = useState("");

  const [category, setCategory] = useState("");

  // =========================================================
  // PRODUCT ORDER STATE
  // =========================================================

  const [
    sortedProducts,
    setSortedProducts,
  ] = useState<ProductWithImages[]>([
    ...products,
  ]);

  const [
    originalProducts,
    setOriginalProducts,
  ] = useState<ProductWithImages[]>([
    ...products,
  ]);

  // =========================================================
  // SAVE STATE
  // =========================================================

  const [
    hasChanges,
    setHasChanges,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  // =========================================================
  // SYNC PRODUCTS
  // =========================================================

  useEffect(() => {
    setSortedProducts([
      ...products,
    ]);

    setOriginalProducts([
      ...products,
    ]);

    setHasChanges(false);
  }, [products]);

  // =========================================================
  // BEFORE UNLOAD
  // =========================================================

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

  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts =
    sortedProducts.filter(
      (product) => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase();

        const matchSearch =
          product.name
            .toLowerCase()
            .includes(
              normalizedSearch
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
      }
    );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main
      className="
        min-w-0
        space-y-6

        sm:space-y-8
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex
          min-w-0
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        {/* ================================================= */}
        {/* TITLE / COUNT */}
        {/* ================================================= */}

        <div className="min-w-0">

          <h1
            className="
              text-2xl
              font-semibold
              tracking-tight
              text-neutral-900

              sm:text-3xl
            "
          >
            Product Sorting
          </h1>

          <p
            className="
              mt-1.5
              text-sm
              text-neutral-500

              sm:mt-2
            "
          >
            Showing{" "}

            <span
              className="
                font-semibold
                text-neutral-900
              "
            >
              {filteredProducts.length}
            </span>{" "}

            of{" "}

            <span
              className="
                font-semibold
                text-neutral-900
              "
            >
              {products.length}
            </span>{" "}

            products
          </p>

        </div>

        {/* ================================================= */}
        {/* DRAG STATUS */}
        {/* ================================================= */}

        <div
          className="
            self-start
            rounded-full
            border
            border-green-200
            bg-green-50
            px-3
            py-1.5
            text-xs
            font-medium
            text-green-700

            sm:self-auto
            sm:px-4
            sm:py-2
            sm:text-sm
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

      <div
        className={
          hasChanges
            ? "pb-24 sm:pb-0"
            : ""
        }
      >

        <SortList
          products={filteredProducts}
          allProducts={sortedProducts}
          onChange={(reorderedProducts) => {
            setSortedProducts(
              reorderedProducts
            );

            setHasChanges(true);
          }}
        />

      </div>

      {/* ================================================= */}
      {/* SAVE BAR */}
      {/* ================================================= */}

      {hasChanges && (
        <SaveBar
          saving={saving}

          onCancel={() => {
            setSortedProducts([
              ...originalProducts,
            ]);

            setHasChanges(false);
          }}

          onSave={async () => {
            if (saving) {
              return;
            }

            setSaving(true);

            try {
              /*
               * Send ONLY the complete global
               * product ID order.
               *
               * The server action is responsible
               * for assigning displayOrder.
               */

              const orderedIds =
                sortedProducts.map(
                  (product) =>
                    product.id
                );

              await updateProductDisplayOrder(
                orderedIds
              );

              setOriginalProducts([
                ...sortedProducts,
              ]);

              setHasChanges(false);

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