"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  QrCode,
  ShoppingBag,
} from "lucide-react";

import { useInquiry } from "@/components/providers/InquiryProvider";


// ============================================================
// INQUIRY PRODUCT
// ============================================================

type InquiryProduct = {
  id: number;

  sku: string;

  brand: string;

  name: string;

  slug: string | null;

  price: number;

  availability?: string;

  images: {
    url: string;
  }[];

  colors?: {
    id: number;
    name: string;
  }[];

  variants?: {
    id: number;
    colorId: number | null;
    size: string;
    price: number | null;
  }[];
};


// ============================================================
// INQUIRY OPTIONS
// ============================================================

type InquiryOptions = {
  color?: string;

  variant?: string;

  dimensions?: string;

  packaging?: string;
};


// ============================================================
// PAYMENT METHOD
// ============================================================

type PaymentMethod = {
  id: number;

  name: string;

  type:
    | "BANK_TRANSFER"
    | "QR";

  bankName: string | null;

  accountName: string | null;

  accountNumber: string | null;

  qrImageUrl: string | null;

  instructions: string | null;
};


// ============================================================
// INQUIRY KEY
// ============================================================

function getInquiryKey(
  productId: number,
  options?: InquiryOptions
) {
  return [
    productId,
    options?.color ?? "",
    options?.variant ?? "",
    options?.dimensions ?? "",
    options?.packaging ?? "",
  ].join("::");
}


// ============================================================
// FIND EXACT VARIANT
// ============================================================

function findProductVariant(
  product: InquiryProduct | undefined,
  options: InquiryOptions
) {
  if (!product) {
    return null;
  }

  const variants =
    product.variants ?? [];

  /*
   * No variants:
   *
   * This is a legacy / simple product.
   *
   * Use Product.price.
   */

  if (variants.length === 0) {
    return null;
  }

  /*
   * Find the selected Color ID.
   *
   * Inquiry stores the selected Color
   * as the Color name.
   *
   * Example:
   *
   * "Black"
   *
   * We convert it back to:
   *
   * colorId = 2
   */

  let selectedColorId:
    | number
    | null = null;

  if (options.color) {
    selectedColorId =
      product.colors?.find(
        (color) =>
          color.name ===
          options.color
      )?.id ?? null;
  }

  /*
   * Match exact Color + Size.
   */

  if (
    selectedColorId !== null &&
    options.variant
  ) {
    const exactVariant =
      variants.find(
        (variant) =>
          variant.colorId ===
            selectedColorId &&
          variant.size ===
            options.variant
      );

    if (exactVariant) {
      return exactVariant;
    }
  }

  /*
   * If there is no Color but there is
   * a selected Size, try Size only.
   */

  if (options.variant) {
    const sizeVariant =
      variants.find(
        (variant) =>
          variant.size ===
          options.variant &&
          (
            selectedColorId === null ||
            variant.colorId ===
              selectedColorId
          )
      );

    if (sizeVariant) {
      return sizeVariant;
    }
  }

  /*
   * If only Color was selected,
   * and there is exactly one Variant
   * for that Color, use it.
   */

  if (
    selectedColorId !== null
  ) {
    const colorVariants =
      variants.filter(
        (variant) =>
          variant.colorId ===
          selectedColorId
      );

    if (
      colorVariants.length === 1
    ) {
      return colorVariants[0];
    }
  }

  /*
   * If there is exactly one Variant
   * in the entire product, use it.
   */

  if (variants.length === 1) {
    return variants[0];
  }

  /*
   * Important:
   *
   * If a product has multiple variants
   * but we cannot determine the exact
   * selected Variant, return null.
   *
   * This prevents the customer from
   * accidentally using Product.price.
   */

  return null;
}


// ============================================================
// GET UNIT PRICE
// ============================================================

function getItemPricing(
  product: InquiryProduct | undefined,
  options: InquiryOptions
) {
  if (!product) {
    return {
      variant: null,
      price: 0,
      priceAvailable: false,
    };
  }

  const variants =
    product.variants ?? [];

  /*
   * Product without Variants.
   *
   * Legacy products continue using
   * Product.price.
   */

  if (variants.length === 0) {
    const price =
      Number(product.price);

    return {
      variant: null,

      price:
        Number.isFinite(price)
          ? price
          : 0,

      priceAvailable:
        Number.isFinite(price) &&
        price > 0,
    };
  }

  /*
   * Product with Variants.
   *
   * MUST use the exact Variant.
   */

  const variant =
    findProductVariant(
      product,
      options
    );

  if (!variant) {
    return {
      variant: null,
      price: 0,
      priceAvailable: false,
    };
  }

  const price =
    Number(variant.price);

  return {
    variant,

    price:
      Number.isFinite(price)
        ? price
        : 0,

    priceAvailable:
      Number.isFinite(price) &&
      price > 0,
  };
}


// ============================================================
// CHECKOUT FORM
// ============================================================

export default function InquiryCheckoutForm() {
  const router = useRouter();

  const {
    items,
    totalItems,
    removeItem,
    clearInquiry,
  } = useInquiry();


  // ==========================================================
  // PRODUCT STATE
  // ==========================================================

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    products,
    setProducts,
  ] = useState<InquiryProduct[]>([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);


  // ==========================================================
  // CUSTOMER INFORMATION
  // ==========================================================

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    customerPhone,
    setCustomerPhone,
  ] = useState("");

  const [
    customerEmail,
    setCustomerEmail,
  ] = useState("");

  const [
    address,
    setAddress,
  ] = useState("");


  // ==========================================================
  // PAYMENT
  // ==========================================================

  const [
    paymentMethods,
    setPaymentMethods,
  ] = useState<PaymentMethod[]>([]);

  const [
    loadingPaymentMethods,
    setLoadingPaymentMethods,
  ] = useState(true);

  const [
    paymentMethodId,
    setPaymentMethodId,
  ] = useState<number | null>(
    null
  );


  // ==========================================================
  // VOUCHER
  // ==========================================================

  const [
    voucherCode,
    setVoucherCode,
  ] = useState("");


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  useEffect(() => {
    async function loadProducts() {
      if (items.length === 0) {
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);

        const ids =
          Array.from(
            new Set(
              items.map(
                (item) =>
                  item.productId
              )
            )
          ).join(",");

        const response =
          await fetch(
            `/api/inquiry/products?ids=${encodeURIComponent(
              ids
            )}`,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load products."
          );
        }

        const data =
          await response.json();

        setProducts(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load inquiry products:",
          error
        );

        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, [items]);


  // ==========================================================
  // LOAD PAYMENT METHODS
  // ==========================================================

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        setLoadingPaymentMethods(
          true
        );

        const response =
          await fetch(
            "/api/payment-methods",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load payment methods."
          );
        }

        const data =
          await response.json();

        const methods =
          Array.isArray(data)
            ? data
            : [];

        setPaymentMethods(
          methods
        );

        if (
          methods.length > 0
        ) {
          setPaymentMethodId(
            methods[0].id
          );
        }
      } catch (error) {
        console.error(
          "Failed to load payment methods:",
          error
        );

        setPaymentMethods([]);
      } finally {
        setLoadingPaymentMethods(
          false
        );
      }
    }

    loadPaymentMethods();
  }, []);


  // ==========================================================
  // PRODUCT MAP
  // ==========================================================

  const productMap =
    useMemo(() => {
      return new Map(
        products.map(
          (product) => [
            product.id,
            product,
          ]
        )
      );
    }, [products]);


  // ==========================================================
  // ITEM PRICING
  // ==========================================================

  const itemPricingMap =
    useMemo(() => {
      return new Map(
        items.map((item) => {
          const product =
            productMap.get(
              item.productId
            );

          const options:
            InquiryOptions = {
            color:
              item.color,

            variant:
              item.variant,

            dimensions:
              item.dimensions,

            packaging:
              item.packaging,
          };

          const pricing =
            getItemPricing(
              product,
              options
            );

          return [
            getInquiryKey(
              item.productId,
              options
            ),
            pricing,
          ];
        })
      );
    }, [
      items,
      productMap,
    ]);


  // ==========================================================
  // CHECK IF ANY PRICE IS MISSING
  // ==========================================================

  const hasUnavailablePrice =
    useMemo(() => {
      return items.some(
        (item) => {
          const options:
            InquiryOptions = {
            color:
              item.color,

            variant:
              item.variant,

            dimensions:
              item.dimensions,

            packaging:
              item.packaging,
          };

          const key =
            getInquiryKey(
              item.productId,
              options
            );

          const pricing =
            itemPricingMap.get(
              key
            );

          return (
            !pricing ||
            !pricing.priceAvailable
          );
        }
      );
    }, [
      items,
      itemPricingMap,
    ]);


  // ==========================================================
  // ORDER TOTALS
  // ==========================================================

  const subtotal =
    useMemo(() => {
      return items.reduce(
        (
          total,
          item
        ) => {
          const product =
            productMap.get(
              item.productId
            );

          const options:
            InquiryOptions = {
            color:
              item.color,

            variant:
              item.variant,

            dimensions:
              item.dimensions,

            packaging:
              item.packaging,
          };

          const pricing =
            getItemPricing(
              product,
              options
            );

          const quantity =
            Math.max(
              1,
              Number(
                item.quantity
              ) || 1
            );

          /*
           * Missing price contributes
           * RM0 to the displayed subtotal.
           *
           * BUT hasUnavailablePrice
           * will disable checkout.
           */

          return (
            total +
            pricing.price *
              quantity
          );
        },
        0
      );
    }, [
      items,
      productMap,
    ]);


  // ==========================================================
  // VOUCHER
  // ==========================================================

  /*
   * Voucher system is not implemented yet.
   *
   * Keep the discount at zero for now.
   */

  const voucherDiscount = 0;

  const finalAmount =
    Math.max(
      0,
      subtotal -
        voucherDiscount
    );


  // ==========================================================
  // SELECTED PAYMENT METHOD
  // ==========================================================

  const selectedPaymentMethod =
    useMemo(() => {
      return (
        paymentMethods.find(
          (method) =>
            method.id ===
            paymentMethodId
        ) ?? null
      );
    }, [
      paymentMethods,
      paymentMethodId,
    ]);


  // ==========================================================
  // FORMAT MONEY
  // ==========================================================

  function formatAmount(
    amount: number
  ) {
    return new Intl.NumberFormat(
      "en-MY",
      {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2,
      }
    ).format(amount);
  }


  // ==========================================================
  // CREATE ORDER
  // ==========================================================

  async function handlePlaceOrder() {
    setError("");

    // --------------------------------------------------------
    // Basic validation
    // --------------------------------------------------------

    if (
      loadingProducts ||
      items.length === 0
    ) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * Never allow an order if ANY
     * selected item has no valid price.
     *
     * This prevents:
     *
     * Product A = RM899
     * Product B = RM0
     *
     * from being submitted together.
     */

    if (hasUnavailablePrice) {
      setError(
        "One or more selected products do not have a confirmed price. Please contact us on WhatsApp to confirm the price before checkout."
      );

      return;
    }

    if (
      !customerName.trim()
    ) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    if (
      !customerPhone.trim()
    ) {
      setError(
        "Please enter your WhatsApp or phone number."
      );

      return;
    }

    if (
      !address.trim()
    ) {
      setError(
        "Please enter your delivery address."
      );

      return;
    }

    if (
      !paymentMethodId
    ) {
      setError(
        "Please select a payment method."
      );

      return;
    }

    if (
      !selectedPaymentMethod
    ) {
      setError(
        "The selected payment method is no longer available."
      );

      return;
    }

    try {
      setSubmitting(true);

      /*
       * Build the final item list.
       *
       * IMPORTANT:
       *
       * variantId comes from the database,
       * not from localStorage.
       */

      const orderItems =
        items.map(
          (item) => {
            const product =
              productMap.get(
                item.productId
              );

            const options:
              InquiryOptions = {
              color:
                item.color,

              variant:
                item.variant,

              dimensions:
                item.dimensions,

              packaging:
                item.packaging,
            };

            const pricing =
              getItemPricing(
                product,
                options
              );

            return {
              productId:
                item.productId,

              variantId:
                pricing.variant?.id ??
                null,

              quantity:
                item.quantity,

              color:
                item.color,

              variant:
                item.variant,

              dimensions:
                item.dimensions,

              packaging:
                item.packaging,
            };
          }
        );


      // ------------------------------------------------------
      // CREATE ORDER
      // ------------------------------------------------------

      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                customerName:
                  customerName.trim(),

                customerPhone:
                  customerPhone.trim(),

                customerEmail:
                  customerEmail.trim() ||
                  undefined,

                address:
                  address.trim(),

                message:
                  message.trim() ||
                  undefined,

                voucherCode:
                  voucherCode.trim() ||
                  undefined,

                paymentMethodId,

                items:
                  orderItems,
              }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create your order."
        );
      }


      // ======================================================
      // ORDER CREATED
      // ======================================================

      const publicToken =
        data?.order?.publicToken;


      if (
        typeof publicToken !==
          "string" ||
        !publicToken.trim()
      ) {
        throw new Error(
          "Order was created, but the payment link could not be generated."
        );
      }


      // ======================================================
      // CLEAR INQUIRY
      // ======================================================

      clearInquiry();


      // ======================================================
      // REDIRECT
      // ======================================================

      router.push(
        `/order/payment/${encodeURIComponent(
          publicToken
        )}`
      );

    } catch (error) {
      console.error(
        "Failed to create order:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your order."
      );
    } finally {
      setSubmitting(false);
    }
  }


  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (
    !loadingProducts &&
    items.length === 0
  ) {
    return (
      <div className="mx-auto max-w-3xl">
        <section
          className="
            rounded-[36px]
            border
            border-neutral-200
            bg-white
            p-12
            text-center
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
          "
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <ShoppingBag className="h-7 w-7 text-neutral-500" />
          </div>

          <h1 className="mt-6 text-3xl font-extralight text-neutral-900">
            Your inquiry list is empty
          </h1>

          <p className="mt-4 text-sm leading-7 text-neutral-500">
            Please add products to your inquiry
            list before continuing to checkout.
          </p>

          <Link
            href="/shop"
            className="
              mt-8
              inline-flex
              items-center
              justify-center
              rounded-full
              bg-black
              px-8
              py-4
              text-[11px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-white
              transition
              hover:bg-[#C8A96A]
            "
          >
            Browse Products
          </Link>
        </section>
      </div>
    );
  }


  // ==========================================================
  // MAIN CHECKOUT
  // ==========================================================

  return (
    <div className="space-y-12">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="mx-auto mb-16 max-w-4xl text-center">

        <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
          CHECKOUT
        </p>

        <h1
          className="
            mt-6
            text-5xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            md:text-6xl
          "
        >
          Checkout
        </h1>

        <div
          className="
            mx-auto
            mt-8
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
          "
        />

        <p
          className="
            mx-auto
            mt-8
            max-w-3xl
            text-lg
            leading-8
            text-neutral-500
          "
        >
          Review your selected pieces,
          provide your delivery details,
          and choose your preferred payment
          method.
        </p>

        <p
          className="
            mt-10
            text-xs
            uppercase
            tracking-[0.35em]
            text-neutral-400
          "
        >
          {totalItems} Selected Item
          {totalItems === 1
            ? ""
            : "s"}
        </p>

      </div>


      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (
        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-6
            py-4
            text-sm
            leading-6
            text-red-700
          "
        >
          {error}
        </div>
      )}


      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

        {/* ====================================================
            LEFT
            ==================================================== */}

        <div className="space-y-10">

          {/* ==================================================
              CUSTOMER INFORMATION
              ================================================== */}

          <section
            className="
              rounded-[36px]
              border
              border-neutral-200
              bg-white
              p-8
              shadow-[0_20px_60px_rgba(0,0,0,.04)]
              md:p-10
            "
          >

            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              01
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-extralight
                tracking-[-0.03em]
                text-neutral-900
              "
            >
              Customer Information
            </h2>

            <div
              className="
                mt-6
                h-px
                w-16
                bg-gradient-to-r
                from-[#C8A96A]
                to-transparent
              "
            />

            <div className="mt-8 space-y-6">

              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Full Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  value={
                    customerName
                  }
                  onChange={(event) =>
                    setCustomerName(
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    px-5
                    py-4
                    text-sm
                    text-neutral-800
                    outline-none
                    transition
                    focus:border-[#C8A96A]
                    focus:bg-white
                  "
                />
              </div>


              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  WhatsApp / Phone
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  value={
                    customerPhone
                  }
                  onChange={(event) =>
                    setCustomerPhone(
                      event.target.value
                    )
                  }
                  placeholder="e.g. 60166620448"
                  inputMode="tel"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    px-5
                    py-4
                    text-sm
                    text-neutral-800
                    outline-none
                    transition
                    focus:border-[#C8A96A]
                    focus:bg-white
                  "
                />
              </div>


              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Email
                  <span className="ml-2 text-xs font-normal text-neutral-400">
                    Optional
                  </span>
                </label>

                <input
                  type="email"
                  value={
                    customerEmail
                  }
                  onChange={(event) =>
                    setCustomerEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    px-5
                    py-4
                    text-sm
                    text-neutral-800
                    outline-none
                    transition
                    focus:border-[#C8A96A]
                    focus:bg-white
                  "
                />
              </div>


              {/* Address */}

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Delivery Address
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  value={
                    address
                  }
                  onChange={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Full delivery address"
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    px-5
                    py-4
                    text-sm
                    leading-7
                    text-neutral-800
                    outline-none
                    transition
                    focus:border-[#C8A96A]
                    focus:bg-white
                  "
                />
              </div>

            </div>
          </section>


          {/* ==================================================
              PRODUCTS
              ================================================== */}

          <section
            className="
              rounded-[36px]
              border
              border-neutral-200
              bg-white
              p-8
              shadow-[0_20px_60px_rgba(0,0,0,.04)]
              md:p-10
            "
          >

            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              02
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-extralight
                tracking-[-0.03em]
                text-neutral-900
              "
            >
              Selected Products
            </h2>

            <div
              className="
                mt-6
                h-px
                w-16
                bg-gradient-to-r
                from-[#C8A96A]
                to-transparent
              "
            />

            {loadingProducts ? (
              <div className="mt-8 flex items-center gap-3 text-sm text-neutral-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading products...
              </div>
            ) : (
              <div className="mt-8 space-y-5">

                {items.map(
                  (item) => {

                    const product =
                      productMap.get(
                        item.productId
                      );

                    const options:
                      InquiryOptions = {
                      color:
                        item.color,

                      variant:
                        item.variant,

                      dimensions:
                        item.dimensions,

                      packaging:
                        item.packaging,
                    };

                    const inquiryKey =
                      getInquiryKey(
                        item.productId,
                        options
                      );

                    const pricing =
                      getItemPricing(
                        product,
                        options
                      );

                    const quantity =
                      Math.max(
                        1,
                        Number(
                          item.quantity
                        ) || 1
                      );


                    return (
                      <div
                        key={
                          inquiryKey
                        }
                        className="
                          flex
                          gap-5
                          rounded-[28px]
                          border
                          border-neutral-200
                          bg-gradient-to-b
                          from-white
                          to-neutral-50
                          p-5
                        "
                      >

                        {/* Image */}

                        <div
                          className="
                            h-28
                            w-28
                            shrink-0
                            overflow-hidden
                            rounded-[22px]
                            border
                            border-neutral-200
                            bg-white
                            p-3
                          "
                        >
                          {product
                            ?.images?.[0]
                            ?.url ? (
                            <Image
                              src={
                                product
                                  .images[0]
                                  .url
                              }
                              alt={
                                product.name
                              }
                              width={112}
                              height={112}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                              No Image
                            </div>
                          )}
                        </div>


                        {/* Details */}

                        <div className="min-w-0 flex-1">

                          <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                            {
                              product?.brand
                            }
                          </p>

                          <h3 className="mt-2 text-lg font-medium text-neutral-900">
                            {product?.name ??
                              `Product #${item.productId}`}
                          </h3>

                          <p className="mt-1 text-xs text-neutral-400">
                            SKU:{" "}
                            {product?.sku ??
                              "-"}
                          </p>


                          <div className="mt-3 space-y-1 text-xs leading-5 text-neutral-500">

                            {item.color && (
                              <p>
                                Colour:{" "}
                                {
                                  item.color
                                }
                              </p>
                            )}

                            {item.variant && (
                              <p>
                                Size:{" "}
                                {
                                  item.variant
                                }
                              </p>
                            )}

                            {item.dimensions && (
                              <p>
                                Dimensions:{" "}
                                {
                                  item.dimensions
                                }
                              </p>
                            )}

                            {item.packaging && (
                              <p>
                                Packaging:{" "}
                                {
                                  item.packaging
                                }
                              </p>
                            )}

                            <p>
                              Quantity:{" "}
                              {
                                quantity
                              }
                            </p>

                          </div>


                          <div className="mt-4 flex items-center justify-between gap-4">

                            {pricing.priceAvailable ? (
                              <p className="text-sm font-medium text-neutral-900">
                                {formatAmount(
                                  pricing.price *
                                    quantity
                                )}
                              </p>
                            ) : (
                              <div>
                                <p className="text-sm font-medium text-amber-700">
                                  Price on Request
                                </p>

                                <p className="mt-1 text-xs text-neutral-400">
                                  Please contact us
                                  to confirm the
                                  price.
                                </p>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  item.productId,
                                  options
                                )
                              }
                              className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-[0.2em]
                                text-neutral-400
                                transition
                                hover:text-red-600
                              "
                            >
                              Remove
                            </button>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>


          {/* ==================================================
              NOTES
              ================================================== */}

          <section
            className="
              rounded-[36px]
              border
              border-neutral-200
              bg-white
              p-8
              shadow-[0_20px_60px_rgba(0,0,0,.04)]
              md:p-10
            "
          >

            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              03
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-extralight
                tracking-[-0.03em]
                text-neutral-900
              "
            >
              Additional Notes
            </h2>

            <div
              className="
                mt-6
                h-px
                w-16
                bg-gradient-to-r
                from-[#C8A96A]
                to-transparent
              "
            />

            <p className="mt-5 text-sm leading-7 text-neutral-500">
              Add any special requests,
              preferred colour, size, quantity
              or other details.
            </p>

            <textarea
              value={
                message
              }
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              rows={5}
              maxLength={500}
              placeholder={`Example:
• Looking for black colour.
• Need 2 pieces.
• Please send more photos.`}
              className="
                mt-6
                w-full
                resize-none
                rounded-[24px]
                border
                border-neutral-200
                bg-neutral-50
                px-6
                py-5
                text-[15px]
                leading-8
                text-neutral-700
                outline-none
                transition
                focus:border-[#C8A96A]
                focus:bg-white
              "
            />

          </section>

        </div>


        {/* ======================================================
            RIGHT SUMMARY
            ====================================================== */}

        <aside className="lg:sticky lg:top-8 lg:self-start">

          <section
            className="
              rounded-[36px]
              border
              border-neutral-200
              bg-white
              p-8
              shadow-[0_20px_60px_rgba(0,0,0,.06)]
            "
          >

            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              ORDER SUMMARY
            </p>

            <h2 className="mt-3 text-3xl font-extralight tracking-[-0.03em] text-neutral-900">
              Your Order
            </h2>

            <div className="mt-6 h-px w-16 bg-gradient-to-r from-[#C8A96A] to-transparent" />


            {/* ==================================================
                PRICE WARNING
                ================================================== */}

            {hasUnavailablePrice && (
              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-amber-200
                  bg-amber-50
                  p-5
                "
              >

                <p className="text-sm font-medium text-amber-800">
                  Price Confirmation Required
                </p>

                <p className="mt-2 text-xs leading-6 text-amber-700">
                  One or more selected items
                  do not have a confirmed
                  price.
                  <br />
                  Please contact us on
                  WhatsApp before placing
                  your order.
                </p>

              </div>
            )}


            {/* ==================================================
                ITEMS
                ================================================== */}

            <div className="mt-8 space-y-4">

              {items.map(
                (item) => {

                  const product =
                    productMap.get(
                      item.productId
                    );

                  const options:
                    InquiryOptions = {
                    color:
                      item.color,

                    variant:
                      item.variant,

                    dimensions:
                      item.dimensions,

                    packaging:
                      item.packaging,
                  };

                  const pricing =
                    getItemPricing(
                      product,
                      options
                    );

                  const quantity =
                    Math.max(
                      1,
                      Number(
                        item.quantity
                      ) || 1
                    );


                  return (
                    <div
                      key={getInquiryKey(
                        item.productId,
                        options
                      )}
                      className="flex items-start justify-between gap-4 text-sm"
                    >

                      <div className="min-w-0">

                        <p className="font-medium text-neutral-800">
                          {product?.name ??
                            `Product #${item.productId}`}
                        </p>

                        {(item.color ||
                          item.variant) && (
                          <p className="mt-1 text-xs text-neutral-400">
                            {item.color ??
                              ""}
                            {item.color &&
                            item.variant
                              ? " / "
                              : ""}
                            {item.variant ??
                              ""}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-neutral-400">
                          ×{" "}
                          {
                            quantity
                          }
                        </p>

                      </div>


                      <p
                        className={`shrink-0 ${
                          pricing.priceAvailable
                            ? "text-neutral-700"
                            : "text-amber-700"
                        }`}
                      >
                        {pricing.priceAvailable
                          ? formatAmount(
                              pricing.price *
                                quantity
                            )
                          : "Price on Request"}
                      </p>

                    </div>
                  );
                }
              )}

            </div>


            {/* ==================================================
                VOUCHER
                ================================================== */}

            <div className="mt-8 border-t border-neutral-200 pt-6">

              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                Voucher
              </label>

              <div className="flex gap-2">

                <input
                  value={
                    voucherCode
                  }
                  onChange={(event) =>
                    setVoucherCode(
                      event.target.value
                    )
                  }
                  placeholder="Voucher code"
                  className="
                    min-w-0
                    flex-1
                    rounded-xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-[#C8A96A]
                  "
                />

                <button
                  type="button"
                  disabled
                  className="
                    rounded-xl
                    border
                    border-neutral-200
                    px-4
                    py-3
                    text-xs
                    font-medium
                    text-neutral-400
                  "
                >
                  Apply
                </button>

              </div>

              <p className="mt-2 text-xs text-neutral-400">
                Voucher system will be
                available soon.
              </p>

            </div>


            {/* ==================================================
                TOTAL
                ================================================== */}

            <div className="mt-8 space-y-3 border-t border-neutral-200 pt-6">

              <div className="flex items-center justify-between text-sm">

                <span className="text-neutral-500">
                  Subtotal
                </span>

                <span className="text-neutral-800">
                  {formatAmount(
                    subtotal
                  )}
                </span>

              </div>


              <div className="flex items-center justify-between text-sm">

                <span className="text-neutral-500">
                  Voucher Discount
                </span>

                <span className="text-neutral-800">
                  {voucherDiscount >
                  0
                    ? `-${formatAmount(
                        voucherDiscount
                      )}`
                    : formatAmount(
                        0
                      )}
                </span>

              </div>


              <div className="flex items-end justify-between gap-4 border-t border-neutral-200 pt-5">

                <span className="text-sm font-medium text-neutral-700">
                  Total
                </span>

                <span className="text-3xl font-medium tracking-tight text-neutral-900">
                  {formatAmount(
                    finalAmount
                  )}
                </span>

              </div>

            </div>


            {/* ==================================================
                PAYMENT METHOD
                ================================================== */}

            <div className="mt-10 border-t border-neutral-200 pt-8">

              <div className="flex items-center gap-3">

                <CreditCard className="h-5 w-5 text-neutral-700" />

                <div>

                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                    PAYMENT
                  </p>

                  <h3 className="mt-1 text-xl font-medium text-neutral-900">
                    Payment Method
                  </h3>

                </div>

              </div>


              {loadingPaymentMethods ? (

                <div className="mt-6 flex items-center gap-3 text-sm text-neutral-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading payment methods...
                </div>

              ) : paymentMethods.length ===
                0 ? (

                <div className="mt-6 rounded-2xl bg-neutral-50 p-5 text-sm leading-6 text-neutral-500">
                  No payment methods are
                  currently available. Please
                  contact us for payment
                  instructions.
                </div>

              ) : (

                <div className="mt-6 space-y-3">

                  {paymentMethods.map(
                    (method) => {

                      const selected =
                        paymentMethodId ===
                        method.id;

                      return (
                        <button
                          type="button"
                          key={
                            method.id
                          }
                          onClick={() =>
                            setPaymentMethodId(
                              method.id
                            )
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            gap-4
                            rounded-2xl
                            border
                            p-4
                            text-left
                            transition
                            ${
                              selected
                                ? "border-[#C8A96A] bg-[#C8A96A]/5"
                                : "border-neutral-200 bg-white hover:border-neutral-300"
                            }
                          `}
                        >

                          <div
                            className={`
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              ${
                                selected
                                  ? "bg-black text-white"
                                  : "bg-neutral-100 text-neutral-500"
                              }
                            `}
                          >
                            {method.type ===
                            "QR" ? (
                              <QrCode className="h-4 w-4" />
                            ) : (
                              <CreditCard className="h-4 w-4" />
                            )}
                          </div>


                          <div className="min-w-0 flex-1">

                            <p className="text-sm font-medium text-neutral-900">
                              {
                                method.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-neutral-400">
                              {method.type ===
                              "QR"
                                ? "QR Payment"
                                : "Bank Transfer"}
                            </p>

                          </div>


                          <div
                            className={`
                              flex
                              h-5
                              w-5
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              ${
                                selected
                                  ? "border-black bg-black text-white"
                                  : "border-neutral-300"
                              }
                            `}
                          >
                            {selected && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>

                        </button>
                      );
                    }
                  )}

                </div>
              )}


              {/* Selected Payment Preview */}

              {selectedPaymentMethod && (
                <div className="mt-5 rounded-2xl bg-neutral-50 p-5">

                  {selectedPaymentMethod.type ===
                    "BANK_TRANSFER" && (
                    <div className="space-y-4">

                      {selectedPaymentMethod
                        .bankName && (
                        <div>

                          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                            Bank
                          </p>

                          <p className="mt-1 text-sm font-medium text-neutral-900">
                            {
                              selectedPaymentMethod.bankName
                            }
                          </p>

                        </div>
                      )}


                      {selectedPaymentMethod
                        .accountName && (
                        <div>

                          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                            Account Name
                          </p>

                          <p className="mt-1 text-sm font-medium text-neutral-900">
                            {
                              selectedPaymentMethod.accountName
                            }
                          </p>

                        </div>
                      )}


                      {selectedPaymentMethod
                        .accountNumber && (
                        <div>

                          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                            Account Number
                          </p>

                          <p className="mt-1 font-mono text-sm font-medium text-neutral-900">
                            {
                              selectedPaymentMethod.accountNumber
                            }
                          </p>

                        </div>
                      )}

                    </div>
                  )}


                  {selectedPaymentMethod.type ===
                    "QR" &&
                    selectedPaymentMethod.qrImageUrl && (
                      <div className="text-center">

                        <p className="mb-4 text-xs text-neutral-500">
                          Scan the QR code to
                          complete payment.
                        </p>

                        <div className="mx-auto max-w-[220px] rounded-xl bg-white p-3">

                          <Image
                            src={
                              selectedPaymentMethod.qrImageUrl
                            }
                            alt={
                              selectedPaymentMethod.name
                            }
                            width={220}
                            height={220}
                            className="h-auto w-full rounded-lg object-contain"
                          />

                        </div>

                      </div>
                    )}


                  {selectedPaymentMethod
                    .instructions && (
                    <p className="mt-4 whitespace-pre-line text-xs leading-6 text-neutral-500">
                      {
                        selectedPaymentMethod.instructions
                      }
                    </p>
                  )}

                </div>
              )}

            </div>


            {/* ==================================================
                PLACE ORDER
                ================================================== */}

            <button
              type="button"
              onClick={() => {
                void handlePlaceOrder();
              }}
              disabled={
                submitting ||
                loadingProducts ||
                loadingPaymentMethods ||
                items.length === 0 ||
                paymentMethods.length ===
                  0 ||
                hasUnavailablePrice
              }
              className="
                mt-8
                inline-flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-full
                bg-black
                px-8
                py-5
                text-[11px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#C8A96A]
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Creating Order...
                </>
              ) : hasUnavailablePrice ? (
                <>
                  Price Confirmation Required
                </>
              ) : (
                <>
                  Place Order

                  <span>
                    →
                  </span>
                </>
              )}

            </button>


            {hasUnavailablePrice && (
              <a
                href="https://wa.me/60166620448"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-200
                  px-6
                  py-4
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-neutral-700
                  transition
                  hover:border-[#C8A96A]
                  hover:text-black
                "
              >
                Contact Us on WhatsApp
              </a>
            )}


            <p className="mt-4 text-center text-[11px] leading-5 text-neutral-400">
              By placing your order, you agree
              to provide accurate customer and
              delivery information.
            </p>

          </section>


          {/* Back */}

          <Link
            href="/inquiry"
            className="
              inline-flex
              items-center
              gap-2
              text-[11px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-neutral-500
              transition
              hover:text-black
            "
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Inquiry
          </Link>

        </aside>

      </div>

    </div>
  );
}