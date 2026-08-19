"use client";

import {
  useState,
} from "react";

import {
  Check,
  ShoppingBag,
} from "lucide-react";

import WishlistButton from "@/components/WishlistButton";
import AddToInquiryButton from "@/components/AddToInquiryButton";

import {
  useCart,
} from "@/app/(site)/_components/CartProvider";

import {
  useProduct,
} from "./ProductContext";


type ProductActionsProps = {
  productId: number;

  brand: string;

  name: string;

  sku: string | null;

  model: string | null;

  mainColor: string | null;

  dimensions: string | null;

  price: number;

  image: string;
};


export default function ProductActions({
  productId,
  brand,
  name,
  sku,
  model,
  mainColor,
  dimensions,
  price,
  image,
}: ProductActionsProps) {

  const {
    selectedColor,
    selectedVariant,
    quantity,
  } = useProduct();


  const {
    addToCart,
  } = useCart();


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

  const currentPrice =
    selectedVariant?.price ??
    price;


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
  // This ensures the cart uses the most specific
  // uploaded image available for the selected option.
  //

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

    addToCart(
      {
        productId,

        name,

        brand,

        /*
         * Exact ProductVariant ID.
         *
         * This identifies the selected
         * Color × Size combination in Cart.
         *
         * Example:
         *
         * Black / Large
         * -> selectedVariant.id
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

        model,

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
${model ?? "-"}

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
        </div>


        {/* ====================================================
            ADD TO CART
            ==================================================== */}

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


        {/* ====================================================
            REQUEST PRICE
            ==================================================== */}

        <button
          type="button"
          onClick={
            handleWhatsApp
          }
          disabled={
            loading
          }
          className="
            mt-3
            flex
            h-14
            w-full
            items-center
            justify-center
            rounded-full
            border
            border-neutral-300
            bg-white
            px-6
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.22em]
            text-neutral-900
            transition-all
            duration-300
            hover:bg-neutral-100
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


        {/* ====================================================
            SECONDARY ACTIONS
            ==================================================== */}

        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-2.5
            sm:mt-6
            sm:gap-4
          "
        >

          <AddToInquiryButton
            productId={
              productId
            }

            color={
              selectedColor?.name
            }

            variant={
              selectedVariant?.size
            }

            dimensions={
              selectedVariant?.dimensions ??
              dimensions ??
              undefined
            }

            quantity={
              quantity
            }
          />


          <WishlistButton
            productId={
              productId
            }
          />

        </div>

      </div>

    </div>
  );
}