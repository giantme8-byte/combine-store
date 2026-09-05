"use client";

import Link from "next/link";

import Button from "../../_components/Button";
import DeleteProductButton from "./DeleteProductButton";
import DuplicateProductButton from "./DuplicateProductButton";


// ============================================================
// TYPES
// ============================================================

type ProductActionsProps = {
  productId: number;
  productName: string;
  canDelete: boolean;

  /*
   * Current Products page state.
   *
   * Used by Edit Product so that after saving,
   * the admin can return to the exact same list state.
   */

  page: number;
  search: string;
  brand: string;
  category: string;
  availability: string;
  sort: string;
};


// ============================================================
// SCROLL STORAGE
// ============================================================

const PRODUCTS_SCROLL_KEY =
  "combine-admin-products-scroll";


// ============================================================
// COMPONENT
// ============================================================

export default function ProductActions({
  productId,
  productName,
  canDelete,

  page,
  search,
  brand,
  category,
  availability,
  sort,
}: ProductActionsProps) {

  // ==========================================================
  // RETURN URL
  // ==========================================================

  const returnTo = (() => {

    const params =
      new URLSearchParams();


    params.set(
      "page",
      String(page)
    );


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


    if (sort) {

      params.set(
        "sort",
        sort
      );

    }


    return (
      `/admin/dashboard/products?${params.toString()}`
    );

  })();


  // ==========================================================
  // EDIT URL
  // ==========================================================

  const editParams =
    new URLSearchParams();


  editParams.set(
    "returnTo",
    returnTo
  );


  const editUrl =
    `/admin/dashboard/products/${productId}/edit?${editParams.toString()}`;


  // ==========================================================
  // HANDLE EDIT
  // ==========================================================

  function handleEditClick() {

    /*
     * Save the exact scroll position immediately
     * before navigating to the Edit Product page.
     *
     * This is more reliable than listening for
     * beforeunload / visibilitychange because
     * Next.js client-side navigation does not
     * necessarily unload the page.
     */

    sessionStorage.setItem(
      PRODUCTS_SCROLL_KEY,
      String(
        window.scrollY
      )
    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        flex
        justify-end
        gap-2
      "
    >

      {/* ======================================================
          VIEW
          ====================================================== */}

      <Link
        href={
          `/admin/dashboard/products/${productId}`
        }
      >

        <Button
          variant="secondary"
        >
          View
        </Button>

      </Link>


      {/* ======================================================
          EDIT
          ====================================================== */}

      <Link
        href={editUrl}
        onClick={
          handleEditClick
        }
      >

        <Button
          variant="secondary"
        >
          Edit
        </Button>

      </Link>


      {/* ======================================================
          DUPLICATE
          ====================================================== */}

      <DuplicateProductButton
        productId={
          productId
        }
      />


      {/* ======================================================
          DELETE
          ====================================================== */}

      {canDelete && (

        <DeleteProductButton
          productId={
            productId
          }

          productName={
            productName
          }
        />

      )}

    </div>

  );

}