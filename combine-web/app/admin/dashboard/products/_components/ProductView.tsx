"use client";

import { useEffect, useState } from "react";

import { LayoutGrid, Table } from "lucide-react";

import type {
  ProductWithImages,
} from "@/types/product";

import ProductTable from "./ProductTable";
import ProductGrid from "./ProductGrid";

type ProductViewProps = {
  products: ProductWithImages[];

  exchangeRate: number;

  brands: {
    id: number;
    name: string;
  }[];

  categories: {
    id: number;
    name: string;
  }[];

  canDelete: boolean;

  page: number;

  pageSize: number;
};

export default function ProductView({
  products,
  exchangeRate,
  brands,
  categories,
  canDelete,
  page,
  pageSize,
}: ProductViewProps) {
  /*
   * IMPORTANT
   *
   * Always render the same view on the server
   * and during the first client render.
   *
   * We load the saved view from localStorage
   * only after hydration.
   */

  const [view, setView] =
    useState<"table" | "grid">("table");

  const [mounted, setMounted] =
    useState(false);

  const [selectedCount] =
    useState(0);

  useEffect(() => {
    setMounted(true);

    const savedView =
      localStorage.getItem(
        "product-view"
      );

    if (
      savedView === "table" ||
      savedView === "grid"
    ) {
      setView(savedView);
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    localStorage.setItem(
      "product-view",
      view
    );
  }, [view, mounted]);

  /*
   * Until hydration is complete, keep rendering
   * the server-safe Table view.
   *
   * This prevents:
   *
   * Server = Table
   * Client = Grid
   *
   * hydration mismatch.
   */

  const activeView =
    mounted ? view : "table";

  return (
    <div className="space-y-4">

      {/* ================================================= */}
      {/* Toolbar */}
      {/* ================================================= */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <span className="text-sm text-neutral-500">
            {selectedCount} selected
          </span>

          <button
            type="button"
            className="
              rounded-lg
              border
              border-neutral-200
              px-4
              py-2
              text-sm
              transition
              hover:bg-neutral-100
            "
          >
            Bulk Actions
          </button>

        </div>

        {/* ================================================= */}
        {/* View Switcher */}
        {/* ================================================= */}

        <div className="flex rounded-xl border border-neutral-200 bg-white p-1">

          <button
            type="button"
            onClick={() => setView("table")}
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              transition
              ${
                activeView === "table"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >
            <Table size={18} />

            Table
          </button>

          <button
            type="button"
            onClick={() => setView("grid")}
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              transition
              ${
                activeView === "grid"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >
            <LayoutGrid size={18} />

            Grid
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* Product View */}
      {/* ================================================= */}

      {activeView === "table" ? (

        <ProductTable
          products={products}
          exchangeRate={exchangeRate}
          brands={brands}
          categories={categories}
          canDelete={canDelete}
          page={page}
          pageSize={pageSize}
        />

      ) : (

        <ProductGrid
          products={products}
        />

      )}

    </div>
  );
}