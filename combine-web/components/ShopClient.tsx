"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import SubCategoryFilter from "./SubCategoryFilter";
import SortDropdown from "./SortDropdown";
import ProductGrid from "./ProductGrid";
import SearchAutocomplete from "./SearchAutocomplete";

type Product = {
  id: number;
  slug: string;

  brand: string;
  name: string;
  model: string | null;
  sku: string | null;

  price: number;
  displayOrder: number;

  image: string;
  secondImage?: string;

  createdAt: Date;

  category: string;
  subCategory: string | null;
  mainColor: string | null;

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  limited: boolean;
  onSale: boolean;
};

type FilterOptions = {
  categories: string[];
  brands: string[];
  subCategories: string[];
};

type Props = {
  products: Product[];
  featuredProducts: Product[];

  total: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;

  filterOptions: FilterOptions;
};

const SHOP_SCROLL_KEY =
  "combine-shop-scroll-position";

export default function ShopClient({
  products,
  featuredProducts,
  total,
  pageSize,
  currentPage,
  totalPages,
  filterOptions,
}: Props) {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const productsRef =
    useRef<HTMLDivElement>(null);

  /*
   * =========================================================
   * URL State
   * =========================================================
   */

  const category =
    searchParams.get("category") ??
    "All";

  const urlBrand =
    searchParams.get("brand") ??
    "All";

  /*
   * =========================================================
   * Sub Category
   *
   * MULTI SELECT
   *
   * Example:
   *
   * /shop?subCategory=Shoulder%20Bags&subCategory=Crossbody%20Bags
   * =========================================================
   */

  const urlSubCategories =
    searchParams.getAll(
      "subCategory"
    );

  const urlSearch =
    searchParams.get("search") ??
    "";

  const urlSort =
    searchParams.get("sort") ??
    "Newest";

  /*
   * =========================================================
   * Local State
   * =========================================================
   */

  const [search, setSearch] =
    useState(urlSearch);

  const [brand, setBrand] =
    useState(urlBrand);

  const [
    subCategories,
    setSubCategories,
  ] = useState<string[]>(
    urlSubCategories
  );

  const [sort, setSort] =
    useState(urlSort);

  /*
   * =========================================================
   * Keep Local State In Sync
   * =========================================================
   */

  useEffect(() => {
    setSearch(urlSearch);

    setBrand(urlBrand);

    setSubCategories(
      urlSubCategories
    );

    setSort(urlSort);
  }, [
    urlSearch,
    urlBrand,
    urlSort,
    urlSubCategories.join("|"),
  ]);

  /*
   * =========================================================
   * Restore Previous Shop Scroll Position
   * =========================================================
   */

  useEffect(() => {
    const savedPosition =
      sessionStorage.getItem(
        SHOP_SCROLL_KEY
      );

    if (!savedPosition) {
      return;
    }

    const scrollY =
      Number(savedPosition);

    if (
      !Number.isFinite(scrollY) ||
      scrollY < 0
    ) {
      sessionStorage.removeItem(
        SHOP_SCROLL_KEY
      );

      return;
    }

    let frameId = 0;
    let attempts = 0;

    const restoreScroll = () => {
      attempts += 1;

      const documentHeight =
        document.documentElement
          .scrollHeight;

      if (
        documentHeight >=
          scrollY +
            window.innerHeight ||
        attempts >= 60
      ) {
        window.scrollTo({
          top: scrollY,
          behavior: "auto",
        });

        sessionStorage.removeItem(
          SHOP_SCROLL_KEY
        );

        return;
      }

      frameId =
        requestAnimationFrame(
          restoreScroll
        );
    };

    frameId =
      requestAnimationFrame(
        restoreScroll
      );

    return () => {
      cancelAnimationFrame(
        frameId
      );
    };
  }, []);

  /*
   * =========================================================
   * Scroll To Products After Pagination
   * =========================================================
   */

  const previousPageRef =
    useRef(currentPage);

  useEffect(() => {
    if (
      previousPageRef.current ===
      currentPage
    ) {
      return;
    }

    previousPageRef.current =
      currentPage;

    const frameId =
      requestAnimationFrame(() => {
        productsRef.current?.scrollIntoView(
          {
            behavior: "smooth",
            block: "start",
          }
        );
      });

    return () => {
      cancelAnimationFrame(
        frameId
      );
    };
  }, [currentPage]);

  /*
   * =========================================================
   * Save Shop Scroll Before Product Navigation
   * =========================================================
   */

  useEffect(() => {
    function handleProductNavigation(
      event: MouseEvent
    ) {
      const target =
        event.target as
          | HTMLElement
          | null;

      const link =
        target?.closest(
          "a[href]"
        ) as
          | HTMLAnchorElement
          | null;

      if (!link) {
        return;
      }

      const href =
        link.getAttribute(
          "href"
        );

      if (!href) {
        return;
      }

      /*
       * Ignore normal Shop links.
       */

      if (
        href === "/shop" ||
        href === "/shop/"
      ) {
        return;
      }

      /*
       * Only save position when
       * entering a product page.
       */

      if (
        !href.startsWith(
          "/shop/"
        )
      ) {
        return;
      }

      sessionStorage.setItem(
        SHOP_SCROLL_KEY,
        String(window.scrollY)
      );
    }

    document.addEventListener(
      "click",
      handleProductNavigation,
      true
    );

    return () => {
      document.removeEventListener(
        "click",
        handleProductNavigation,
        true
      );
    };
  }, []);

  /*
   * =========================================================
   * Update URL Parameters
   * =========================================================
   */

  function updateParams(
    changes: Record<
      string,
      string | null
    >
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    Object.entries(
      changes
    ).forEach(
      ([key, value]) => {
        if (
          !value ||
          value === "All"
        ) {
          params.delete(key);
        } else {
          params.set(
            key,
            value
          );
        }
      }
    );

    /*
     * Every filter/search/sort
     * change starts from Page 1.
     */

    params.delete("page");

    const query =
      params.toString();

    router.push(
      query
        ? `/shop?${query}`
        : "/shop"
    );
  }

  /*
   * =========================================================
   * Search
   * =========================================================
   */

  function handleSearch(
    value: string
  ) {
    setSearch(value);
  }

  function handleSearchKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key !== "Enter"
    ) {
      return;
    }

    event.preventDefault();

    updateParams({
      search:
        search.trim() || null,
    });
  }

  /*
   * =========================================================
   * Category
   * =========================================================
   */

  function handleCategoryChange(
    value: string
  ) {
    /*
     * When Category changes,
     * remove selected Sub Categories.
     *
     * This prevents a Sub Category
     * from another Category remaining
     * active.
     */

    setSubCategories([]);

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    /*
     * Category
     */

    if (
      value === "All"
    ) {
      params.delete(
        "category"
      );
    } else {
      params.set(
        "category",
        value
      );
    }

    /*
     * Remove all Sub Categories.
     */

    params.delete(
      "subCategory"
    );

    /*
     * Start from Page 1.
     */

    params.delete("page");

    const query =
      params.toString();

    router.push(
      query
        ? `/shop?${query}`
        : "/shop"
    );
  }

  /*
   * =========================================================
   * Brand
   * =========================================================
   */

  function handleBrandChange(
    value: string
  ) {
    setBrand(value);

    updateParams({
      brand:
        value === "All"
          ? null
          : value,
    });
  }

  /*
   * =========================================================
   * Sub Category
   *
   * MULTI SELECT
   * =========================================================
   */

  function handleSubCategoryChange(
    values: string[]
  ) {
    setSubCategories(values);

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    /*
     * Remove existing
     * subCategory parameters.
     */

    params.delete(
      "subCategory"
    );

    /*
     * Any filter change
     * starts from Page 1.
     */

    params.delete("page");

    /*
     * Add every selected
     * Sub Category.
     */

    values.forEach(
      (value) => {
        if (
          value !== "All"
        ) {
          params.append(
            "subCategory",
            value
          );
        }
      }
    );

    const query =
      params.toString();

    router.push(
      query
        ? `/shop?${query}`
        : "/shop"
    );
  }

  /*
   * =========================================================
   * Sort
   * =========================================================
   */

  function handleSortChange(
    value: string
  ) {
    setSort(value);

    updateParams({
      sort:
        value === "Newest"
          ? null
          : value,
    });
  }

  /*
   * =========================================================
   * Clear Filters
   * =========================================================
   */

  function clearFilters() {
    setSearch("");

    setBrand("All");

    setSubCategories([]);

    setSort("Newest");

    router.push("/shop");
  }

  /*
   * =========================================================
   * Pagination
   * =========================================================
   */

  function goToPage(
    page: number
  ) {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    /*
     * Page 1 does not need
     * ?page=1.
     */

    if (page === 1) {
      params.delete("page");
    } else {
      params.set(
        "page",
        String(page)
      );
    }

    /*
     * Pagination should not
     * restore previous product
     * position.
     */

    sessionStorage.removeItem(
      SHOP_SCROLL_KEY
    );

    const query =
      params.toString();

    router.push(
      query
        ? `/shop?${query}`
        : "/shop"
    );
  }

  /*
   * =========================================================
   * Pagination Items
   * =========================================================
   */

  function getPaginationItems() {
    if (
      totalPages <= 7
    ) {
      return Array.from(
        {
          length:
            totalPages,
        },
        (_, index) =>
          index + 1
      );
    }

    if (
      currentPage <= 4
    ) {
      return [
        1,
        2,
        3,
        4,
        5,
        "ellipsis-right",
        totalPages,
      ];
    }

    if (
      currentPage >=
      totalPages - 3
    ) {
      return [
        1,
        "ellipsis-left",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis-left",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis-right",
      totalPages,
    ];
  }

  const paginationItems =
    getPaginationItems();

  /*
   * =========================================================
   * Result Label
   * =========================================================
   */

  const startItem =
    total === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;

  const endItem =
    Math.min(
      currentPage *
        pageSize,
      total
    );

  const resultLabel =
    total === 0
      ? "0 Products"
      : `${startItem}–${endItem} of ${total} Products`;

  /*
   * =========================================================
   * Active Filters
   * =========================================================
   */

  const hasActiveFilters =
    Boolean(search) ||
    category !== "All" ||
    brand !== "All" ||
    subCategories.length > 0 ||
    sort !== "Newest";

  /*
   * =========================================================
   * Render
   * =========================================================
   */

  return (
    <div
      className="
        space-y-8
        sm:space-y-10
      "
    >
      {/* ================================================= */}
      {/* Search */}
      {/* ================================================= */}

      <div className="relative">
        <SearchBar
          value={search}
          onChange={
            handleSearch
          }
          onKeyDown={
            handleSearchKeyDown
          }
        />

        <SearchAutocomplete
          query={search}
        />
      </div>

      {/* ================================================= */}
      {/* Filters */}
      {/* ================================================= */}

      <section
        className="
          rounded-[22px]
          border
          border-neutral-200
          bg-white
          p-3
          shadow-sm
          sm:rounded-[30px]
          sm:p-7
        "
      >
        <div
          className="
            grid
            grid-cols-2
            gap-2.5
            sm:gap-4
            xl:grid-cols-5
            xl:gap-6
          "
        >
          {/* ================================================= */}
          {/* Category */}
          {/* ================================================= */}

          <CategoryFilter
            selected={category}
            onSelect={
              handleCategoryChange
            }
            categories={
              filterOptions.categories
            }
          />

          {/* ================================================= */}
          {/* Brand */}
          {/* ================================================= */}

          <BrandFilter
            selected={brand}
            onSelect={
              handleBrandChange
            }
            brands={
              filterOptions.brands
            }
          />

{/* ================================================= */}
{/* Sub Category
 *
 * Give Sub Category two
 * desktop grid columns.
 *
 * This is the important fix.
 * ================================================= */}

          <div
            className="
              min-w-0
              xl:col-span-2
            "
          >
            <SubCategoryFilter
              selected={
                subCategories
              }
              onSelect={
                handleSubCategoryChange
              }
              subCategories={
                filterOptions.subCategories
              }
            />
          </div>

          {/* ================================================= */}
          {/* Sort */}
          {/* ================================================= */}

          <SortDropdown
            value={sort}
            onChange={
              handleSortChange
            }
          />
        </div>
      </section>

      {/* ================================================= */}
      {/* Result Header */}
      {/* ================================================= */}

      <section
        className="
          flex
          flex-col
          gap-4
          border-b
          border-neutral-200
          pb-5
          md:flex-row
          md:items-end
          md:justify-between
          md:gap-5
          md:pb-6
        "
      >
        <div>
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-neutral-400
              sm:text-[11px]
              sm:tracking-[0.35em]
            "
          >
            COLLECTION
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-extralight
              tracking-[-0.03em]
              text-neutral-900
              sm:text-3xl
            "
          >
            {resultLabel}
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="
              self-start
              rounded-full
              border
              border-neutral-300
              px-5
              py-2.5
              text-[10px]
              uppercase
              tracking-[0.25em]
              transition-all
              duration-300
              hover:border-black
              hover:bg-black
              hover:text-white
              sm:px-6
              sm:py-3
              sm:text-[11px]
              sm:tracking-[0.3em]
              md:self-auto
            "
          >
            Clear Filters
          </button>
        )}
      </section>

      {/* ================================================= */}
      {/* Products */}
      {/* ================================================= */}

      <div
        ref={productsRef}
        className="
          scroll-mt-6
          sm:scroll-mt-8
        "
      >
        <ProductGrid
          products={
            products
          }
          featuredProducts={
            featuredProducts
          }
          searchKeyword={
            search
          }
          onClearFilters={
            clearFilters
          }
        />
      </div>

      {/* ================================================= */}
      {/* Pagination */}
      {/* ================================================= */}

      {totalPages > 1 &&
        products.length > 0 && (
          <nav
            aria-label="Product pagination"
            className="
              flex
              flex-col
              items-center
              gap-4
              overflow-hidden
              pt-6
              sm:gap-5
              sm:pt-10
            "
          >
            {/* Page Info */}

            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-neutral-400
                sm:text-[10px]
                sm:tracking-[0.3em]
              "
            >
              Page {currentPage} of{" "}
              {totalPages}
            </p>

            {/* Pagination Controls */}

            <div
              className="
                flex
                max-w-full
                items-center
                justify-center
                gap-1
                sm:gap-2
              "
            >
              {/* Previous */}

              <button
                type="button"
                aria-label="Previous page"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  goToPage(
                    currentPage -
                      1
                  )
                }
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-200
                  bg-white
                  text-neutral-500
                  transition-all
                  duration-300
                  hover:border-[#C8A96A]
                  hover:bg-[#C8A96A]
                  hover:text-white
                  disabled:pointer-events-none
                  disabled:opacity-30
                  sm:h-11
                  sm:w-11
                "
              >
                ←
              </button>

              {/* Page Numbers */}

              {paginationItems.map(
                (
                  item,
                  index
                ) => {
                  if (
                    typeof item !==
                    "number"
                  ) {
                    return (
                      <span
                        key={`${item}-${index}`}
                        className="
                          flex
                          h-9
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          text-[11px]
                          text-neutral-400
                          sm:h-11
                          sm:w-7
                          sm:text-xs
                        "
                      >
                        …
                      </span>
                    );
                  }

                  const active =
                    item ===
                    currentPage;

                  return (
                    <button
                      key={item}
                      type="button"
                      aria-label={`Go to page ${item}`}
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      onClick={() =>
                        goToPage(
                          item
                        )
                      }
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[11px]
                        transition-all
                        duration-300
                        sm:h-11
                        sm:w-11
                        sm:text-xs

                        ${
                          active
                            ? `
                              bg-black
                              text-white
                              shadow-[0_10px_30px_rgba(0,0,0,.16)]
                            `
                            : `
                              border
                              border-transparent
                              text-neutral-500
                              hover:border-[#C8A96A]
                              hover:bg-[#C8A96A]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {item}
                    </button>
                  );
                }
              )}

              {/* Next */}

              <button
                type="button"
                aria-label="Next page"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  goToPage(
                    currentPage +
                      1
                  )
                }
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-200
                  bg-white
                  text-neutral-500
                  transition-all
                  duration-300
                  hover:border-[#C8A96A]
                  hover:bg-[#C8A96A]
                  hover:text-white
                  disabled:pointer-events-none
                  disabled:opacity-30
                  sm:h-11
                  sm:w-11
                "
              >
                →
              </button>
            </div>
          </nav>
        )}
    </div>
  );
}