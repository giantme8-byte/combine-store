"use client";

import {
  useState,
} from "react";

import {
  Check,
  ShoppingBag,
  Zap,
} from "lucide-react";

import WishlistButton from "@/components/WishlistButton";

import {
  useCart,
} from "@/app/(site)/_components/CartProvider";

import {
  useProduct,
} from "./ProductContext";

import { useRouter } from "next/navigation";


// ============================================================
// TYPES
// ============================================================

type ProductActionsProps = {
  productId: number;

  slug: string;

  brand: string;

  name: string;

  sku: string | null;

  /*
   * Product-level Model No.
   *
   * Used as the final fallback when:
   *
   * Variant Model is empty
   * AND
   * Color Model is empty.
   */
  model: string | null;

  mainColor: string | null;

  dimensions: string | null;

  price: number;

  image: string;
};


// ============================================================
// COMPONENT
// ============================================================

export default function ProductActions({
  productId,
  slug,
  brand,
  name,
  sku,
  model,
  mainColor,
  dimensions,
  price,
  image,
}: ProductActionsProps) {

  // ==========================================================
  // PRODUCT CONTEXT
  // ==========================================================

  const {
    selectedColor,
    selectedVariant,
    quantity,
  } = useProduct();


  // ==========================================================
  // CART
  // ==========================================================

  const {
    addToCart,
  } = useCart();


  // ==========================================================
  // ROUTER
  // ==========================================================

  const router =
    useRouter();


  // ==========================================================
  // STATES
  // ==========================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    addedToCart,
    setAddedToCart,
  ] = useState(false);


  // ==========================================================
  // SELECTED PRODUCT OPTIONS
  // ==========================================================

  const colour =
    selectedColor?.name ??
    mainColor ??
    null;


  const variant =
    selectedVariant?.size ??
    null;


  const itemDimensions =
    selectedVariant?.dimensions ??
    dimensions ??
    null;


  // ==========================================================
  // CURRENT MODEL
  // ==========================================================
  //
  // Priority:
  //
  // 1. Selected Variant Model
  // 2. Selected Color Model
  // 3. Product Model
  //
  // Example:
  //
  // Product Model = M10000
  //
  // Black Color Model = M12345
  // White Color Model = M67890
  //
  // Black:
  // → M12345
  //
  // White:
  // → M67890
  //
  //
  // If Variant Model exists:
  //
  // Black / Small = M11111
  //
  // → M11111
  //
  // ==========================================================

  const currentModel =
    selectedVariant?.model?.trim() ||
    selectedColor?.model?.trim() ||
    model?.trim() ||
    null;


  // ==========================================================
  // CURRENT PRICE
  // ==========================================================
  //
  // Priority:
  //
  // 1. Selected Variant Price
  // 2. Product Main Price
  //
  // Example:
  //
  // Product Price = RM 1,299
  //
  // Small  = null
  // Medium = RM 1,499
  // Large  = RM 1,699
  //
  // Small:
  // → RM 1,299
  //
  // Medium:
  // → RM 1,499
  //
  // Large:
  // → RM 1,699
  //
  // ==========================================================

  const currentPrice =
    selectedVariant?.price ??
    price;


  // ==========================================================
  // PRICE AVAILABILITY
  // ==========================================================

  const hasPrice =
    currentPrice > 0;


  // ==========================================================
  // SELECTED VARIANT IMAGE
  // ==========================================================
  //
  // Priority:
  //
  // 1. Selected Variant Gallery
  // 2. Selected Colour Gallery
  // 3. Selected Variant Cover
  // 4. Selected Colour Cover
  // 5. Product Main Image
  //
  // ==========================================================

  const variantGalleryImage =
    selectedVariant?.images?.[0]?.url ??
    null;


  const colorGalleryImage =
    selectedColor?.images?.[0]?.url ??
    null;


  const variantCoverImage =
    selectedVariant?.imageUrl ??
    null;


  const colorCoverImage =
    selectedColor?.imageUrl ??
    null;


  const cartImage =
    variantGalleryImage ??
    colorGalleryImage ??
    variantCoverImage ??
    colorCoverImage ??
    image;


  // ==========================================================
  // ADD TO CART
  // ==========================================================

  function handleAddToCart() {

    if (!hasPrice) {
      return;
    }


    addToCart(
      {
        productId,

        /*
         * Product slug.
         *
         * This is stored in Cart so the customer
         * can click the product name in Cart and
         * return to the correct Product Detail page.
         */

        slug,

        name,

        brand,

        /*
         * Exact ProductVariant ID.
         *
         * This identifies the selected
         * Color × Size combination in Cart.
         */

        variantId:
          selectedVariant?.id ??
          null,

        /*
         * Use the selected Variant price.
         *
         * If Variant has no custom price,
         * Product price is used as fallback.
         */

        price:
          currentPrice,

        image:
          cartImage,

        sku,

        /*
         * IMPORTANT:
         *
         * Save the Model that belongs to
         * the exact selected configuration.
         */

        model:
          currentModel,

        color:
          colour,

        variant,

        dimensions:
          itemDimensions,
      },

      quantity
    );


    setAddedToCart(true);


    window.setTimeout(
      () => {
        setAddedToCart(false);
      },
      1800
    );
  }


  // ==========================================================
  // BUY NOW
  // ==========================================================

  function handleBuyNow() {

    if (!hasPrice) {
      return;
    }


    addToCart(
      {
        productId,

        /*
         * Product slug.
         *
         * Keep the same slug in Cart so
         * Buy Now items also link back to
         * the correct Product Detail page.
         */

        slug,

        name,

        brand,

        variantId:
          selectedVariant?.id ??
          null,

        price:
          currentPrice,

        image:
          cartImage,

        sku,

        /*
         * Use the exact Model for the
         * selected Color × Size.
         */

        model:
          currentModel,

        color:
          colour,

        variant,

        dimensions:
          itemDimensions,
      },

      quantity
    );


    router.push(
      "/checkout"
    );
  }


  // ==========================================================
  // WHATSAPP
  // ==========================================================

  async function handleWhatsApp() {

    setLoading(true);


    const message =
      `Hi COMBINE 👋

I'm interested in this item.

━━━━━━━━━━━━━━

Brand
${brand}

Product
${name}

Reference
${sku ?? "-"}

Model
${currentModel ?? "-"}

━━━━━━━━━━━━━━

Colour
${colour ?? "-"}

Size
${variant ?? "-"}

Dimensions
${itemDimensions ?? "-"}

Quantity
${quantity}

━━━━━━━━━━━━━━

Item ID
#${productId}

Please provide the latest price and availability.

Thank you 😊`;


    try {

      const response =
        await fetch(
          "/api/settings"
        );


      const settings =
        await response.json();


      const whatsappNumber =
        settings.whatsappNumber.replace(
          /\D/g,
          ""
        );


      const url =
        `https://wa.me/${whatsappNumber}` +
        `?text=${encodeURIComponent(
          message
        )}`;


      window.open(
        url,
        "_blank"
      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        mt-6
        sm:mt-8
      "
    >

      <div
        className="
          border-t
          border-neutral-200
          pt-6
          sm:pt-8
        "
      >

        {/* ====================================================
            TITLE
            ==================================================== */}

        <p
          className="
            mb-4
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-neutral-400
            sm:mb-6
            sm:text-[11px]
            sm:tracking-[0.35em]
          "
        >
          Luxury Concierge
        </p>


        {/* ====================================================
            CURRENT PRICE
            ==================================================== */}

        <div
          className="
            mb-5
            sm:mb-6
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]
              text-neutral-400
              sm:text-[11px]
              sm:tracking-[0.35em]
            "
          >
            Price
          </p>


          {hasPrice ? (

            <p
              className="
                mt-2
                text-2xl
                font-light
                tracking-[-0.02em]
                text-neutral-900
                sm:text-3xl
              "
            >
              RM{" "}
              {currentPrice.toLocaleString(
                "en-MY",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

          ) : (

            <p
              className="
                mt-2
                text-xl
                font-light
                tracking-[-0.02em]
                text-neutral-900
                sm:text-2xl
              "
            >
              Price Upon Request
            </p>

          )}

        </div>


        {/* ====================================================
            ACTIONS
            ==================================================== */}

        {hasPrice ? (

          <>

            {/* ============================================== */}
            {/* ADD TO CART */}
            {/* ============================================== */}

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              className="
                group
                relative
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                overflow-hidden
                rounded-full
                bg-black
                px-6
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-white
                shadow-xl
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-2xl
                active:translate-y-0
                sm:h-auto
                sm:px-8
                sm:py-5
                sm:text-sm
                sm:tracking-[0.28em]
              "
            >

              <span
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#A88755]
                  via-[#D5B47F]
                  to-[#A88755]
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              />


              <span
                className="
                  relative
                  z-10
                  flex
                  items-center
                  gap-3
                "
              >

                {addedToCart ? (

                  <>

                    <Check
                      className="h-4 w-4"
                    />

                    Added to Cart

                  </>

                ) : (

                  <>

                    <ShoppingBag
                      className="h-4 w-4"
                    />

                    Add to Cart

                  </>

                )}

              </span>

            </button>


            {/* ============================================== */}
            {/* BUY NOW */}
            {/* ============================================== */}

            <button
              type="button"
              onClick={
                handleBuyNow
              }
              className="
                mt-3
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-full
                border
                border-neutral-900
                bg-white
                px-6
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-neutral-900
                transition-all
                duration-300
                hover:bg-neutral-900
                hover:text-white
                sm:h-auto
                sm:px-8
                sm:py-5
                sm:text-sm
                sm:tracking-[0.28em]
              "
            >

              <Zap
                className="h-4 w-4"
              />

              Buy Now

            </button>


            {/* ============================================== */}
            {/* SAVE */}
            {/* ============================================== */}

            <div
              className="
                mt-3
                w-full
              "
            >

              <WishlistButton
                productId={
                  productId
                }
              />

            </div>

          </>

        ) : (

          <>

            {/* ============================================== */}
            {/* REQUEST PRICE */}
            {/* ============================================== */}

            <button
              type="button"
              onClick={
                handleWhatsApp
              }
              disabled={
                loading
              }
              className="
                flex
                h-14
                w-full
                items-center
                justify-center
                rounded-full
                bg-black
                px-6
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-white
                transition-all
                duration-300
                hover:bg-neutral-800
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:h-auto
                sm:px-8
                sm:py-5
                sm:text-sm
                sm:tracking-[0.28em]
              "
            >

              {loading
                ? "Opening..."
                : "Request Price"}

            </button>


            {/* ============================================== */}
            {/* SAVE */}
            {/* ============================================== */}

            <div
              className="
                mt-3
                w-full
              "
            >

              <WishlistButton
                productId={
                  productId
                }
              />

            </div>

          </>

        )}

      </div>

    </div>
  );
}