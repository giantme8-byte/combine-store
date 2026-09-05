"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  useEffect,
  useRef,
  useState,
} from "react";


// ============================================================
// TYPES
// ============================================================

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


// ============================================================
// PRODUCT FILTERS
// ============================================================

export default function ProductFilters({
  brands,
  categories,
}: ProductFiltersProps) {

  const router =
    useRouter();


  const searchParams =
    useSearchParams();


  // =========================================================
  // SEARCH
  // =========================================================

  const [
    search,
    setSearch,
  ] = useState(
    searchParams.get(
      "search"
    ) ?? ""
  );


  // =========================================================
  // BRAND
  // =========================================================

  const [
    brand,
    setBrand,
  ] = useState(
    searchParams.get(
      "brand"
    ) ?? ""
  );


  // =========================================================
  // CATEGORY
  // =========================================================

  const [
    category,
    setCategory,
  ] = useState(
    searchParams.get(
      "category"
    ) ?? ""
  );


  // =========================================================
  // AVAILABILITY
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
  // SORT
  // =========================================================

  /*
   * "manual" = Product.displayOrder
   *
   * This is the sorting mode used by Drag & Drop.
   *
   * "latest" is now the default sorting mode
   * for the Admin Products page.
   */

  const [
    sort,
    setSort,
  ] = useState(
    searchParams.get(
      "sort"
    ) ?? "latest"
  );


  // =========================================================
  // SEARCH DEBOUNCE MOUNT GUARD
  // =========================================================

  /*
   * IMPORTANT:
   *
   * Do NOT run the search debounce on the first mount.
   *
   * Otherwise, when returning from Edit Product:
   *
   * /products?page=2&sort=latest
   *
   * the initial search value "" would trigger
   * updateFilters(), which deletes the page parameter.
   */

  const searchMounted =
    useRef(false);


  // =========================================================
  // SYNC STATE WITH URL
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
      ) ?? "latest"
    );

  }, [
    searchParams,
  ]);


  // =========================================================
  // SEARCH DEBOUNCE
  // =========================================================

  useEffect(() => {

    /*
     * Skip the first render.
     */

    if (!searchMounted.current) {

      searchMounted.current =
        true;

      return;

    }


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

  }, [
    search,
  ]);


  // =========================================================
  // UPDATE FILTERS
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
     * This is intentional when the user actually changes
     * a filter or search.
     *
     * It must NOT happen on the initial mount.
     */

    params.delete(
      "page"
    );


    // =======================================================
    // SEARCH
    // =======================================================

    if (
      values.search !==
      undefined
    ) {

      if (
        values.search
      ) {

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


    // =======================================================
    // BRAND
    // =======================================================

    if (
      values.brand !==
      undefined
    ) {

      if (
        values.brand
      ) {

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


    // =======================================================
    // CATEGORY
    // =======================================================

    if (
      values.category !==
      undefined
    ) {

      if (
        values.category
      ) {

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


    // =======================================================
    // AVAILABILITY
    // =======================================================

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


    // =======================================================
    // SORT
    // =======================================================

    if (
      values.sort !==
      undefined
    ) {

      if (
        values.sort
      ) {

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
  // APPLY FILTERS
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
     * Latest First is now the default.
     *
     * Keep the current sorting mode in the URL
     * so the selected sorting remains explicit.
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
  // RESET
  // =========================================================

  function resetFilters() {

    setSearch("");

    setBrand("");

    setCategory("");

    setAvailability("");


    /*
     * Reset returns to Latest First.
     */

    setSort(
      "latest"
    );


    router.push(
      "/admin/dashboard/products?sort=latest"
    );

  }


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

      <div className="grid gap-4 md:grid-cols-5">


        {/* =================================================
            SEARCH
            ================================================= */}

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


        {/* =================================================
            BRAND
            ================================================= */}

        <select
          value={brand}
          onChange={(e) => {

            const value =
              e.target.value;


            setBrand(
              value
            );


            updateFilters({
              brand:
                value,
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
                key={
                  brand.id
                }
                value={
                  brand.name
                }
              >
                {brand.name}
              </option>

            )
          )}

        </select>


        {/* =================================================
            CATEGORY
            ================================================= */}

        <select
          value={category}
          onChange={(e) => {

            const value =
              e.target.value;


            setCategory(
              value
            );


            updateFilters({
              category:
                value,
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


        {/* =================================================
            AVAILABILITY
            ================================================= */}

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


        {/* =================================================
            SORT
            ================================================= */}

        <select
          value={
            sort
          }
          onChange={(e) => {

            const value =
              e.target.value;


            setSort(
              value
            );


            updateFilters({
              sort:
                value,
            });

          }}
          className="rounded-lg border border-neutral-300 px-4 py-3"
        >

          {/* ===============================================
              Manual Order
              =============================================== */}

          <option value="manual">
            Manual Order
          </option>


          {/* ===============================================
              Date
              =============================================== */}

          <option value="latest">
            Latest First
          </option>


          <option value="oldest">
            Oldest First
          </option>


          {/* ===============================================
              Name
              =============================================== */}

          <option value="name_az">
            Name A-Z
          </option>


          <option value="name_za">
            Name Z-A
          </option>


          {/* ===============================================
              Brand
              =============================================== */}

          <option value="brand_az">
            Brand A-Z
          </option>


          <option value="brand_za">
            Brand Z-A
          </option>


          {/* ===============================================
              Price
              =============================================== */}

          <option value="price_low">
            Price Low - High
          </option>


          <option value="price_high">
            Price High - Low
          </option>

        </select>

      </div>


      {/* =====================================================
          ACTIONS
          ===================================================== */}

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