"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

type ProductFiltersProps = {
  brands: {
    id: number;
    name: string;
  }[];

  categories: {
    id: number;
    name: string;
  }[];
};

export default function ProductFilters({
  brands,
  categories,
}: ProductFiltersProps) {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  // =========================================================
  // Search
  // =========================================================

  const [search, setSearch] =
    useState(
      searchParams.get(
        "search"
      ) ?? ""
    );

  // =========================================================
  // Brand
  // =========================================================

  const [brand, setBrand] =
    useState(
      searchParams.get(
        "brand"
      ) ?? ""
    );

  // =========================================================
  // Category
  // =========================================================

  const [category, setCategory] =
    useState(
      searchParams.get(
        "category"
      ) ?? ""
    );

  // =========================================================
  // Availability
  // =========================================================

  const [
    availability,
    setAvailability,
  ] = useState(
    searchParams.get(
      "availability"
    ) ?? ""
  );

  // =========================================================
  // Sort
  // =========================================================
  //
  // IMPORTANT:
  //
  // "manual" = Product.displayOrder
  //
  // This is the sorting mode used by Drag & Drop.
  //

  const [sort, setSort] =
    useState(
      searchParams.get(
        "sort"
      ) ?? "manual"
    );

  // =========================================================
  // Sync State With URL
  // =========================================================

  useEffect(() => {
    setSearch(
      searchParams.get(
        "search"
      ) ?? ""
    );

    setBrand(
      searchParams.get(
        "brand"
      ) ?? ""
    );

    setCategory(
      searchParams.get(
        "category"
      ) ?? ""
    );

    setAvailability(
      searchParams.get(
        "availability"
      ) ?? ""
    );

    setSort(
      searchParams.get(
        "sort"
      ) ?? "manual"
    );
  }, [searchParams]);

  // =========================================================
  // Search Debounce
  // =========================================================

  useEffect(() => {
    const timeout =
      setTimeout(() => {
        updateFilters({
          search,
        });
      }, 500);

    return () =>
      clearTimeout(
        timeout
      );
  }, [search]);

  // =========================================================
  // Update Filters
  // =========================================================

  function updateFilters(
    values: {
      search?: string;
      brand?: string;
      category?: string;
      availability?: string;
      sort?: string;
    }
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    /*
     * Whenever filters change, always return to page 1.
     *
     * Otherwise:
     *
     * Page 4 + new filter
     *
     * could result in an empty page.
     */
    params.delete("page");

    // ---------------------------------------------------------
    // Search
    // ---------------------------------------------------------

    if (
      values.search !==
      undefined
    ) {
      if (values.search) {
        params.set(
          "search",
          values.search
        );
      } else {
        params.delete(
          "search"
        );
      }
    }

    // ---------------------------------------------------------
    // Brand
    // ---------------------------------------------------------

    if (
      values.brand !==
      undefined
    ) {
      if (values.brand) {
        params.set(
          "brand",
          values.brand
        );
      } else {
        params.delete(
          "brand"
        );
      }
    }

    // ---------------------------------------------------------
    // Category
    // ---------------------------------------------------------

    if (
      values.category !==
      undefined
    ) {
      if (values.category) {
        params.set(
          "category",
          values.category
        );
      } else {
        params.delete(
          "category"
        );
      }
    }

    // ---------------------------------------------------------
    // Availability
    // ---------------------------------------------------------

    if (
      values.availability !==
      undefined
    ) {
      if (
        values.availability
      ) {
        params.set(
          "availability",
          values.availability
        );
      } else {
        params.delete(
          "availability"
        );
      }
    }

    // ---------------------------------------------------------
    // Sort
    // ---------------------------------------------------------

    if (
      values.sort !==
      undefined
    ) {
      if (values.sort) {
        params.set(
          "sort",
          values.sort
        );
      } else {
        params.delete(
          "sort"
        );
      }
    }

    const query =
      params.toString();

    router.push(
      query
        ? `/admin/dashboard/products?${query}`
        : "/admin/dashboard/products"
    );
  }

  // =========================================================
  // Apply Filters
  // =========================================================

  function applyFilters() {
    const params =
      new URLSearchParams();

    /*
     * Always start from page 1
     * when manually applying filters.
     */

    if (search) {
      params.set(
        "search",
        search
      );
    }

    if (brand) {
      params.set(
        "brand",
        brand
      );
    }

    if (category) {
      params.set(
        "category",
        category
      );
    }

    if (availability) {
      params.set(
        "availability",
        availability
      );
    }

    /*
     * Manual Order is the default.
     *
     * Keep it in the URL so the current sorting mode
     * remains explicit.
     */

    if (sort) {
      params.set(
        "sort",
        sort
      );
    }

    const query =
      params.toString();

    router.push(
      query
        ? `/admin/dashboard/products?${query}`
        : "/admin/dashboard/products"
    );
  }

  // =========================================================
  // Reset
  // =========================================================

  function resetFilters() {
    setSearch("");
    setBrand("");
    setCategory("");
    setAvailability("");

    /*
     * IMPORTANT:
     *
     * Reset returns to Manual Order,
     * not Featured Order.
     */

    setSort("manual");

    router.push(
      "/admin/dashboard/products?sort=manual"
    );
  }

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

      <div className="grid gap-4 md:grid-cols-5">

        {/* ================================================= */}
        {/* Search */}
        {/* ================================================= */}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key ===
              "Enter"
            ) {
              applyFilters();
            }
          }}
          className="rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
        />

        {/* ================================================= */}
        {/* Brand */}
        {/* ================================================= */}

        <select
          value={brand}
          onChange={(e) => {
            const value =
              e.target.value;

            setBrand(value);

            updateFilters({
              brand: value,
            });
          }}
          className="rounded-lg border border-neutral-300 px-4 py-3"
        >
          <option value="">
            All Brands
          </option>

          {brands.map(
            (brand) => (
              <option
                key={brand.id}
                value={
                  brand.name
                }
              >
                {brand.name}
              </option>
            )
          )}
        </select>

        {/* ================================================= */}
        {/* Category */}
        {/* ================================================= */}

        <select
          value={category}
          onChange={(e) => {
            const value =
              e.target.value;

            setCategory(value);

            updateFilters({
              category: value,
            });
          }}
          className="rounded-lg border border-neutral-300 px-4 py-3"
        >
          <option value="">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={
                  category.id
                }
                value={
                  category.name
                }
              >
                {category.name}
              </option>
            )
          )}
        </select>

        {/* ================================================= */}
        {/* Availability */}
        {/* ================================================= */}

        <select
          value={
            availability
          }
          onChange={(e) => {
            const value =
              e.target.value;

            setAvailability(
              value
            );

            updateFilters({
              availability:
                value,
            });
          }}
          className="rounded-lg border border-neutral-300 px-4 py-3"
        >
          <option value="">
            All Availability
          </option>

          <option value="IN_STOCK">
            In Stock
          </option>

          <option value="PRE_ORDER">
            Pre Order
          </option>

          <option value="LIMITED">
            Limited
          </option>

          <option value="SOLD_OUT">
            Sold Out
          </option>
        </select>

        {/* ================================================= */}
        {/* Sort */}
        {/* ================================================= */}

        <select
          value={sort}
          onChange={(e) => {
            const value =
              e.target.value;

            setSort(value);

            updateFilters({
              sort: value,
            });
          }}
          className="rounded-lg border border-neutral-300 px-4 py-3"
        >

          {/* ================================================= */}
          {/* Manual Order */}
          {/* ================================================= */}

          <option value="manual">
            Manual Order
          </option>

          {/* ================================================= */}
          {/* Date */}
          {/* ================================================= */}

          <option value="latest">
            Latest First
          </option>

          <option value="oldest">
            Oldest First
          </option>

          {/* ================================================= */}
          {/* Name */}
          {/* ================================================= */}

          <option value="name_az">
            Name A-Z
          </option>

          <option value="name_za">
            Name Z-A
          </option>

          {/* ================================================= */}
          {/* Brand */}
          {/* ================================================= */}

          <option value="brand_az">
            Brand A-Z
          </option>

          <option value="brand_za">
            Brand Z-A
          </option>

          {/* ================================================= */}
          {/* Price */}
          {/* ================================================= */}

          <option value="price_low">
            Price Low - High
          </option>

          <option value="price_high">
            Price High - Low
          </option>

        </select>

      </div>

      {/* ================================================= */}
      {/* Actions */}
      {/* ================================================= */}

      <div className="mt-5 flex justify-end gap-3">

        <button
          type="button"
          onClick={
            resetFilters
          }
          className="rounded-lg border border-neutral-300 px-5 py-3 transition hover:bg-neutral-100"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={
            applyFilters
          }
          className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-neutral-800"
        >
          Apply Filters
        </button>

      </div>

    </div>
  );
}