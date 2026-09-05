"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  LayoutGrid,
  Table,
} from "lucide-react";

import type {
  ProductWithImages,
} from "@/types/product";

import dynamic from "next/dynamic";
import ProductGrid from "./ProductGrid";

const ProductTable = dynamic(
  () => import("./ProductTable"),
  {
    ssr: false,
  }
);


// ============================================================
// TYPES
// ============================================================

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

  sort: string;

  /*
   * =========================================================
   * CURRENT PRODUCTS PAGE STATE
   * =========================================================
   *
   * These values represent the actual filters currently
   * applied on the Products page.
   *
   * They are passed to both ProductGrid and ProductTable
   * so Edit Product can return to the exact same list state.
   */

  search: string;

  brand: string;

  category: string;

  availability: string;
};


// ============================================================
// STORAGE KEYS
// ============================================================

const PRODUCTS_SCROLL_KEY =
  "combine-admin-products-scroll";


// ============================================================
// PRODUCT VIEW
// ============================================================

export default function ProductView({
  products,
  exchangeRate,
  brands,
  categories,
  canDelete,
  page,
  pageSize,
  sort,
  search,
  brand,
  category,
  availability,
}: ProductViewProps) {

  // =========================================================
  // VIEW STATE
  // =========================================================

  const [
    view,
    setView,
  ] = useState<
    "table" | "grid"
  >("table");


  const [
    mounted,
    setMounted,
  ] = useState(false);


  // =========================================================
  // HYDRATION
  // =========================================================

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

      setView(
        savedView
      );

    }

  }, []);


  // =========================================================
  // SAVE VIEW PREFERENCE
  // =========================================================

  useEffect(() => {

    if (!mounted) {
      return;
    }


    localStorage.setItem(
      "product-view",
      view
    );

  }, [
    view,
    mounted,
  ]);


  // =========================================================
  // RESTORE PRODUCTS SCROLL POSITION
  // =========================================================
  //
  // ProductActions saves the exact scroll position
  // immediately before navigating to Edit Product.
  //
  // When the Products page comes back, restore that
  // position after the DOM has had enough time to render.
  //

  useEffect(() => {

    const savedScroll =
      sessionStorage.getItem(
        PRODUCTS_SCROLL_KEY
      );


    if (!savedScroll) {
      return;
    }


    const scrollY =
      Number(
        savedScroll
      );


    if (
      !Number.isFinite(
        scrollY
      ) ||
      scrollY < 0
    ) {

      sessionStorage.removeItem(
        PRODUCTS_SCROLL_KEY
      );

      return;
    }


    let attempts = 0;

    const maxAttempts = 10;


    function restoreScroll() {

      attempts += 1;


      /*
       * Only restore if the document is tall enough
       * to contain the requested scroll position.
       */

      const maxScroll =
        Math.max(
          0,
          document.documentElement
            .scrollHeight -
            window.innerHeight
        );


      const targetScroll =
        Math.min(
          scrollY,
          maxScroll
        );


      window.scrollTo({
        top: targetScroll,
        behavior: "auto",
      });


      /*
       * If the page is still rendering and the browser
       * could not reach the original position, try again.
       */

      if (
        attempts < maxAttempts &&
        Math.abs(
          window.scrollY -
            targetScroll
        ) > 2
      ) {

        requestAnimationFrame(
          restoreScroll
        );

        return;
      }


      /*
       * Give the browser one final frame before
       * removing the saved position.
       */

      if (
        attempts < maxAttempts
      ) {

        requestAnimationFrame(
          restoreScroll
        );

        return;
      }


      sessionStorage.removeItem(
        PRODUCTS_SCROLL_KEY
      );

    }


    requestAnimationFrame(
      restoreScroll
    );


    return () => {

      /*
       * No persistent event listeners are used.
       *
       * This keeps the component simple and avoids
       * hydration-related browser/server differences.
       */

    };

  }, []);


  // =========================================================
  // DESKTOP VIEW
  //
  // Mobile is always Grid.
  // Desktop remembers selected view.
  // =========================================================

  const desktopView =
    mounted
      ? view
      : "table";


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-4">

      {/* =====================================================
          TOOLBAR
          ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >

        {/* ===================================================
            LEFT
            =================================================== */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
            sm:gap-3
          "
        >

          <span
            className="
              text-xs
              text-neutral-500
              sm:text-sm
            "
          >
            0 selected
          </span>


          <button
            type="button"
            className="
              rounded-lg
              border
              border-neutral-200
              px-3
              py-2
              text-xs
              transition
              hover:bg-neutral-100
              sm:px-4
              sm:text-sm
            "
          >

            <span className="sm:hidden">
              Bulk
            </span>

            <span className="hidden sm:inline">
              Bulk Actions
            </span>

          </button>

        </div>


        {/* ===================================================
            VIEW SWITCHER
            =================================================== */}

        <div
          className="
            flex
            shrink-0
            rounded-xl
            border
            border-neutral-200
            bg-white
            p-1
          "
        >

          {/* =================================================
              TABLE
              ================================================= */}

          <button
            type="button"
            onClick={() =>
              setView("table")
            }
            className={`
              hidden
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-sm
              transition
              sm:flex
              sm:px-4

              ${
                desktopView === "table"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >

            <Table
              size={17}
            />

            Table

          </button>


          {/* =================================================
              GRID
              ================================================= */}

          <button
            type="button"
            onClick={() =>
              setView("grid")
            }
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-sm
              transition
              sm:px-4

              ${
                desktopView === "grid"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >

            <LayoutGrid
              size={17}
            />

            <span className="hidden sm:inline">
              Grid
            </span>

          </button>

        </div>

      </div>


      {/* =====================================================
          MOBILE
          ===================================================== */}

      <div className="block sm:hidden">

        <ProductGrid
          products={
            products
          }

          page={
            page
          }

          pageSize={
            pageSize
          }

          sort={
            sort
          }

          search={
            search
          }

          brand={
            brand
          }

          category={
            category
          }

          availability={
            availability
          }
        />

      </div>


      {/* =====================================================
          DESKTOP
          ===================================================== */}

      <div className="hidden sm:block">

        {desktopView === "table" ? (

          <ProductTable
            products={
              products
            }

            exchangeRate={
              exchangeRate
            }

            brands={
              brands
            }

            categories={
              categories
            }

            canDelete={
              canDelete
            }

            page={
              page
            }

            pageSize={
              pageSize
            }

            sort={
              sort
            }

            search={
              search
            }

            brand={
              brand
            }

            category={
              category
            }

            availability={
              availability
            }
          />

        ) : (

          <ProductGrid
            products={
              products
            }

            page={
              page
            }

            pageSize={
              pageSize
            }

            sort={
              sort
            }

            search={
              search
            }

            brand={
              brand
            }

            category={
              category
            }

            availability={
              availability
            }
          />

        )}

      </div>

    </div>
  );
}