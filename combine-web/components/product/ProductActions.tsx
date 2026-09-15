"use client";

import {
  useEffect,
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


function getAnalyticsVisitorId() {
  const storageKey =
    "combine_analytics_visitor_id";

  try {
    const existing =
      window.localStorage.getItem(
        storageKey
      );

    if (existing) {
      return existing;
    }

    const visitorId =
      crypto.randomUUID();

    window.localStorage.setItem(
      storageKey,
      visitorId
    );

    return visitorId;
  } catch {
    return crypto.randomUUID();
  }
}


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
  // NEW CUSTOMER PRICE
  // ==========================================================
  //
  // This is DISPLAY ONLY.
  //
  // IMPORTANT:
  //
  // Add to Cart and Buy Now continue to use
  // currentPrice.
  //
  // The real voucher discount is still calculated
  // server-side during Checkout.
  //

  const [
    newCustomerDiscount,
    setNewCustomerDiscount,
  ] = useState(0);


  const [
    newCustomerPrice,
    setNewCustomerPrice,
  ] = useState<number | null>(null);


  const [
    loadingNewCustomerPrice,
    setLoadingNewCustomerPrice,
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
  // NEW CUSTOMER PRICE
  // ==========================================================
  //
  // Ask the server whether the current customer and
  // current product / variant qualify for the New Customer
  // Voucher.
  //
  // The server uses the same existing calculateVoucher()
  // logic used by Checkout.
  //
  // ==========================================================

  useEffect(() => {

    let cancelled = false;


    async function loadNewCustomerPrice() {

      // --------------------------------------------------------
      // RESET WHEN THERE IS NO PRICE
      // --------------------------------------------------------

      if (
        currentPrice <= 0
      ) {

        setNewCustomerDiscount(0);
        setNewCustomerPrice(null);
        setLoadingNewCustomerPrice(false);

        return;

      }


      setLoadingNewCustomerPrice(true);


      try {

        const response =
          await fetch(
            "/api/product/new-customer-price",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                productId,

                variantId:
                  selectedVariant?.id ??
                  null,

              }),

            }
          );


        if (!response.ok) {

          if (!cancelled) {

            setNewCustomerDiscount(0);
            setNewCustomerPrice(null);

          }

          return;

        }


        const data =
          await response.json();


        if (cancelled) {
          return;
        }


        if (
          data.eligible === true &&
          Number(data.discount) > 0 &&
          Number(data.newCustomerPrice) >= 0
        ) {

          setNewCustomerDiscount(
            Number(data.discount)
          );

          setNewCustomerPrice(
            Number(data.newCustomerPrice)
          );

        } else {

          setNewCustomerDiscount(0);
          setNewCustomerPrice(null);

        }

      } catch {

        if (!cancelled) {

          setNewCustomerDiscount(0);
          setNewCustomerPrice(null);

        }

      } finally {

        if (!cancelled) {

          setLoadingNewCustomerPrice(
            false
          );

        }

      }

    }


    void loadNewCustomerPrice();


    return () => {

      cancelled = true;

    };

  }, [
    productId,
    selectedVariant?.id,
    currentPrice,
  ]);


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

    void fetch(
      "/api/analytics/track",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          visitorId:
            getAnalyticsVisitorId(),
          event:
            "ADD_TO_CART",
          path:
            window.location.pathname,
          productId,
          quantity,
        }),
      }
    ).catch(() => {});

    setAddedToCart(true);

    window.setTimeout(
      () => {
        setAddedToCart(false);
      },
      1800
    );
  }


  function handleBuyNow() {
    if (!hasPrice) {
      return;
    }

    addToCart(
      {
        productId,
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

    void fetch(
      "/api/analytics/track",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          visitorId:
            getAnalyticsVisitorId(),
          event:
            "ADD_TO_CART",
          path:
            window.location.pathname,
          productId,
          quantity,
        }),
      }
    ).catch(() => {});

    router.push(
      "/checkout"
    );
  }


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

            <div
              className="
                mt-2
              "
            >

              {newCustomerPrice !== null &&
              newCustomerDiscount > 0 ? (

                <>

                  {/* ==================================================
                      ORIGINAL PRICE
                      ================================================== */}

                  <p
                    className="
                      text-sm
                      font-light
                      text-neutral-400
                      line-through
                      sm:text-base
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


                  {/* ==================================================
                      NEW CUSTOMER PRICE
                      ================================================== */}

                  <p
                    className="
                      mt-1
                      text-2xl
                      font-light
                      tracking-[-0.02em]
                      text-neutral-900
                      sm:text-3xl
                    "
                  >
                    RM{" "}
                    {newCustomerPrice.toLocaleString(
                      "en-MY",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>


                  {/* ==================================================
                      VOUCHER LABEL
                      ================================================== */}

                  <p
                    className="
                      mt-2
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.22em]
                      text-[#A88755]
                      sm:text-[11px]
                      sm:tracking-[0.28em]
                    "
                  >
                    New Customer · RM
                    {newCustomerDiscount.toLocaleString(
                      "en-MY",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}{" "}
                    OFF
                  </p>

                </>

              ) : (

                <p
                  className="
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

              )}

            </div>

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