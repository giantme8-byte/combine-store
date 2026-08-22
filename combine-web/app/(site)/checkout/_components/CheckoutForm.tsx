"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  QrCode,
  ShoppingBag,
} from "lucide-react";

import {
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  useCart,
} from "@/app/(site)/_components/CartProvider";


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
// FORMAT MONEY
// ============================================================

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


// ============================================================
// CHECKOUT FORM
// ============================================================

type CheckoutFormProps = {
  isLoggedIn: boolean;
};

export default function CheckoutForm({
  isLoggedIn,
}: CheckoutFormProps) {

  const router =
    useRouter();

  const {
    items,
    subtotal,
    removeFromCart,
  } = useCart();


  // ==========================================================
  // CUSTOMER
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
  // SHIPPING STATE
  // ==========================================================

  const [
    state,
    setState,
  ] = useState("");


  // ==========================================================
  // PAYMENT
  // ==========================================================

  const [
    paymentMethods,
    setPaymentMethods,
  ] = useState<
    PaymentMethod[]
  >([]);

  const [
    loadingPaymentMethods,
    setLoadingPaymentMethods,
  ] = useState(true);

  const [
    paymentMethodId,
    setPaymentMethodId,
  ] = useState<
    number | null
  >(null);


  // ==========================================================
  // VOUCHER
  // ==========================================================

  const [
    voucherCode,
    setVoucherCode,
  ] = useState("");

  const [
    voucherDiscount,
    setVoucherDiscount,
  ] = useState(0);

  const [
    shippingFee,
    setShippingFee,
  ] = useState(0);

  const [
    shippingIsFree,
    setShippingIsFree,
  ] = useState(false);

  const [
    voucherError,
    setVoucherError,
  ] = useState("");

  const [
    voucherApplied,
    setVoucherApplied,
  ] = useState(false);

  const [
    calculatingCheckout,
    setCalculatingCheckout,
  ] = useState(false);


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
  // GUEST CHECKOUT
  // ==========================================================

  const [
    guestCheckout,
    setGuestCheckout,
  ] = useState(false);


  // ==========================================================
  // EMPTY CART
  // ==========================================================

  const isEmpty =
    items.length === 0;


  // ==========================================================
  // AUTHENTICATION GATE
  // ==========================================================

  if (!isLoggedIn && !guestCheckout && !isEmpty) {
    return (
      <div className="mx-auto max-w-3xl">
        <section
          className="
            rounded-[36px]
            border
            border-neutral-200
            bg-white
            p-8
            text-center
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
            md:p-12
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-neutral-100
              text-neutral-700
            "
          >
            <ShoppingBag className="h-7 w-7" />
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.35em] text-neutral-400">
            CHECKOUT
          </p>

          <h2
            className="
              mt-4
              text-3xl
              font-extralight
              tracking-[-0.03em]
              text-neutral-900
              md:text-4xl
            "
          >
            Choose How to Continue
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-500">
            Sign in to your COMBINE account for a faster checkout,
            create an account, or continue as a guest.
          </p>

          <div className="mx-auto mt-10 max-w-md space-y-3">
            <Link
              href="/login"
              className="
                inline-flex
                w-full
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
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#C8A96A]
              "
            >
              Login
            </Link>

            <Link
              href="/register"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                rounded-full
                border
                border-neutral-300
                bg-white
                px-8
                py-4
                text-[11px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-neutral-800
                transition-all
                duration-300
                hover:border-[#C8A96A]
                hover:bg-neutral-50
              "
            >
              Create an Account
            </Link>

            <div className="flex items-center gap-4 py-3">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                OR
              </span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <button
              type="button"
              onClick={() => setGuestCheckout(true)}
              className="
                inline-flex
                w-full
                items-center
                justify-center
                rounded-full
                border
                border-neutral-200
                bg-neutral-50
                px-8
                py-4
                text-[11px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-neutral-600
                transition-all
                duration-300
                hover:border-neutral-300
                hover:bg-white
                hover:text-black
              "
            >
              Continue as Guest
            </button>
          </div>

          <Link
            href="/cart"
            className="
              mt-8
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
            Back to Cart
          </Link>
        </section>
      </div>
    );
  }

  // ==========================================================
  // CHECKOUT CALCULATION
  // ==========================================================

  const calculateOrderTotal = useCallback(
    async (code?: string) => {

      if (items.length === 0 || !state) {
        setShippingFee(0);
        setShippingIsFree(false);
        setVoucherDiscount(0);
        return;
      }

      try {
        setCalculatingCheckout(true);
        setVoucherError("");

        const response = await fetch(
          "/api/checkout/calculate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              state,
              voucherCode: code ?? voucherCode,
              items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                variantId: item.variantId ?? null,
              })),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
            "Unable to calculate checkout."
          );
        }

        setShippingFee(
          Number(data.shipping?.fee ?? 0)
        );

        setShippingIsFree(
          Boolean(data.shipping?.isFree)
        );

        setVoucherDiscount(
          Number(data.voucherDiscount ?? 0)
        );

        const returnedVoucherError =
          typeof data.voucherError === "string"
            ? data.voucherError
            : "";

        setVoucherError(
          returnedVoucherError
        );

        if (
          code?.trim() &&
          !returnedVoucherError
        ) {
          setVoucherApplied(true);
        } else if (!code?.trim()) {
          setVoucherApplied(false);
        }

      } catch (error) {
        console.error(
          "Checkout calculation failed:",
          error
        );

        setShippingFee(0);
        setShippingIsFree(false);
        setVoucherDiscount(0);

        if (code?.trim()) {
          setVoucherError(
            error instanceof Error
              ? error.message
              : "Unable to apply voucher."
          );
          setVoucherApplied(false);
        }

      } finally {
        setCalculatingCheckout(false);
      }
    },
    [items, state, voucherCode]
  );


  // ==========================================================
  // RECALCULATE CHECKOUT WHEN STATE / CART CHANGES
  // ==========================================================

  useEffect(() => {
    if (items.length === 0 || !state) {
      setShippingFee(0);
      setShippingIsFree(false);
      return;
    }

    void calculateOrderTotal(
      voucherApplied ? voucherCode : ""
    );
  }, [
    items,
    state,
    voucherApplied,
    voucherCode,
    calculateOrderTotal,
  ]);


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


        // ------------------------------------------------------
        // AUTO SELECT FIRST METHOD
        // ------------------------------------------------------

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
  // PLACE ORDER
  // ==========================================================

  async function handlePlaceOrder() {

    setError("");


    // --------------------------------------------------------
    // EMPTY CART
    // --------------------------------------------------------

    if (
      items.length === 0
    ) {

      setError(
        "Your cart is empty."
      );

      return;

    }


    // --------------------------------------------------------
    // CUSTOMER NAME
    // --------------------------------------------------------

    if (
      !customerName.trim()
    ) {

      setError(
        "Please enter your full name."
      );

      return;

    }


    // --------------------------------------------------------
    // PHONE
    // --------------------------------------------------------

    if (
      !customerPhone.trim()
    ) {

      setError(
        "Please enter your WhatsApp or phone number."
      );

      return;

    }


    // --------------------------------------------------------
    // ADDRESS
    // --------------------------------------------------------

    if (
      !address.trim()
    ) {

      setError(
        "Please enter your delivery address."
      );

      return;

    }


    // --------------------------------------------------------
    // STATE
    // --------------------------------------------------------

    if (!state.trim()) {
      setError(
        "Please select your state."
      );
      return;
    }


    // --------------------------------------------------------
    // PAYMENT METHOD
    // --------------------------------------------------------

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


      // ======================================================
      // CREATE ORDER
      // ======================================================

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

                state:
                  state.trim(),

                voucherCode:
                  voucherCode.trim() ||
                  undefined,

                paymentMethodId,

                items:
                  items.map(
                    (item) => ({

                      productId:
                        item.productId,

                      quantity:
                        item.quantity,

                      /*
                       * Exact ProductVariant ID.
                       *
                       * The Cart already stores
                       * the selected Variant ID.
                       */

                      variantId:
                        item.variantId ??
                        null,

                      color:
                        item.color ??
                        undefined,

                      variant:
                        item.variant ??
                        undefined,

                      dimensions:
                        item.dimensions ??
                        undefined,

                    })
                  ),

              }),
          }
        );


      const data =
        await response.json();


      // ======================================================
      // ERROR
      // ======================================================

      if (
        !response.ok
      ) {

        throw new Error(
          data?.error ||
          "Unable to create your order."
        );

      }


      // ======================================================
      // PUBLIC TOKEN
      // ======================================================

      const publicToken =
        data?.order?.publicToken;


      if (
        typeof publicToken !==
          "string" ||
        !publicToken.trim()
      ) {

        throw new Error(
          "Order was created, but the payment page could not be generated."
        );

      }


      // ======================================================
      // CLEAR CART
      // ======================================================

      /*
       * Only clear the Cart AFTER
       * the Order has been successfully
       * created in the database.
       */

      items.forEach(
        (item) => {

          removeFromCart(
            item.cartItemId
          );

        }
      );


      // ======================================================
      // REDIRECT TO PAYMENT
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
  // EMPTY CART UI
  // ==========================================================

  if (isEmpty) {

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

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-neutral-100
              text-neutral-500
            "
          >
            <ShoppingBag
              className="h-7 w-7"
            />
          </div>


          <h2
            className="
              mt-6
              text-3xl
              font-extralight
              text-neutral-900
            "
          >
            Your Cart is Empty
          </h2>


          <p
            className="
              mt-4
              text-sm
              leading-7
              text-neutral-500
            "
          >
            Please add products to your
            cart before continuing to checkout.
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

    <div
      className="
        grid
        gap-6
        sm:gap-8
        lg:gap-10
        lg:grid-cols-[minmax(0,1fr)_380px]
      "
    >

      {/* ======================================================
          LEFT
          ====================================================== */}

      <div
        className="space-y-6 sm:space-y-10"
      >

        {/* ====================================================
            CUSTOMER INFORMATION
            ==================================================== */}

        <section
          className="
            rounded-[24px]
            border
            border-neutral-200
            bg-white
            p-5
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
            sm:rounded-[30px]
            sm:p-7
            md:rounded-[36px]
            md:p-10
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
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


          <div
            className="
              mt-8
              space-y-6
            "
          >

            {/* NAME */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                Full Name

                <span
                  className="ml-1 text-red-500"
                >
                  *
                </span>
              </label>


              <input
                value={customerName}
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


            {/* PHONE */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                WhatsApp / Phone

                <span
                  className="ml-1 text-red-500"
                >
                  *
                </span>
              </label>


              <input
                value={customerPhone}
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


            {/* EMAIL */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                Email

                <span
                  className="
                    ml-2
                    text-xs
                    font-normal
                    text-neutral-400
                  "
                >
                  Optional
                </span>
              </label>


              <input
                type="email"
                value={customerEmail}
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


            {/* ADDRESS */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                Delivery Address

                <span
                  className="ml-1 text-red-500"
                >
                  *
                </span>
              </label>


              <textarea
                value={address}
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


            {/* STATE */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                State

                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                value={state}
                onChange={(event) =>
                  setState(event.target.value)
                }
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
              >
                <option value="">
                  Select your state
                </option>
                <option value="Johor">Johor</option>
                <option value="Kedah">Kedah</option>
                <option value="Kelantan">Kelantan</option>
                <option value="Melaka">Melaka</option>
                <option value="Negeri Sembilan">
                  Negeri Sembilan
                </option>
                <option value="Pahang">Pahang</option>
                <option value="Penang">Penang</option>
                <option value="Perak">Perak</option>
                <option value="Perlis">Perlis</option>
                <option value="Sabah">Sabah</option>
                <option value="Sarawak">Sarawak</option>
                <option value="Selangor">Selangor</option>
                <option value="Terengganu">Terengganu</option>
                <option value="Kuala Lumpur">
                  Kuala Lumpur
                </option>
                <option value="Putrajaya">Putrajaya</option>
                <option value="Labuan">Labuan</option>
              </select>

            </div>

          </div>

        </section>


        {/* ====================================================
            PRODUCTS
            ==================================================== */}

        <section
          className="
            rounded-[24px]
            border
            border-neutral-200
            bg-white
            p-5
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
            sm:rounded-[30px]
            sm:p-7
            md:rounded-[36px]
            md:p-10
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
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
            Your Products
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


          <div
            className="
              mt-8
              space-y-5
            "
          >

            {items.map(
              (item) => (

                <div
                  key={item.cartItemId}
                  className="
                    flex
                    gap-3
                    rounded-[20px]
                    border
                    border-neutral-200
                    bg-gradient-to-b
                    from-white
                    to-neutral-50
                    p-3
                    sm:gap-5
                    sm:rounded-[28px]
                    sm:p-5
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      h-20
                      w-20
                      shrink-0
                      overflow-hidden
                      rounded-[16px]
                      border
                      border-neutral-200
                      bg-white
                      p-2
                      sm:h-28
                      sm:w-28
                      sm:rounded-[22px]
                      sm:p-3
                    "
                  >

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          h-full
                          w-full
                          object-contain
                        "
                      />

                    ) : (

                      <div
                        className="
                          flex
                          h-full
                          items-center
                          justify-center
                          text-xs
                          text-neutral-400
                        "
                      >
                        No Image
                      </div>

                    )}

                  </div>


                  {/* DETAILS */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.35em]
                        text-neutral-400
                      "
                    >
                      {item.brand}
                    </p>


                    <h3
                      className="
                        mt-1.5
                        text-sm
                        font-medium
                        leading-5
                        sm:mt-2
                        sm:text-lg
                        text-neutral-900
                      "
                    >
                      {item.name}
                    </h3>


                    {item.sku && (

                      <p
                        className="
                          mt-1
                          text-xs
                          text-neutral-400
                        "
                      >
                        SKU: {item.sku}
                      </p>

                    )}


                    <div
                      className="
                        mt-2
                        space-y-1
                        sm:mt-3
                        text-xs
                        leading-5
                        text-neutral-500
                      "
                    >

                      {item.color && (
                        <p>
                          Colour: {item.color}
                        </p>
                      )}


                      {item.variant && (
                        <p>
                          Size: {item.variant}
                        </p>
                      )}


                      {item.dimensions && (
                        <p>
                          Dimensions: {item.dimensions}
                        </p>
                      )}


                      <p>
                        Quantity: {item.quantity}
                      </p>

                    </div>


                    <div
                      className="
                        mt-3
                        flex
                        sm:mt-4
                        items-center
                        justify-between
                        gap-4
                      "
                    >

                      <p
                        className="
                          text-sm
                          font-medium
                          text-neutral-900
                        "
                      >
                        {formatAmount(
                          item.price *
                          item.quantity
                        )}
                      </p>


                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.cartItemId
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

              )
            )}

          </div>

        </section>

      </div>


      {/* ======================================================
          RIGHT SUMMARY
          ====================================================== */}

      <aside
        className="
          lg:sticky
          lg:top-28
          lg:self-start
        "
      >

        <section
          className="
            rounded-[24px]
            border
            border-neutral-200
            bg-white
            p-5
            shadow-[0_20px_60px_rgba(0,0,0,.06)]
            sm:rounded-[30px]
            sm:p-7
            md:rounded-[36px]
            md:p-8
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
            ORDER SUMMARY
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
            Your Order
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


{/* ==========================================================
    ITEMS
    ========================================================== */}

<div
  className="
    mt-8
    space-y-5
  "
>

  {items.map(
    (item) => (

      <div
        key={item.cartItemId}
        className="
          flex
          items-start
          justify-between
          gap-5
        "
      >

        {/* ==================================================
            PRODUCT INFORMATION
            ================================================== */}

        <div
          className="
            min-w-0
            flex-1
          "
        >

          {/* BRAND */}

          {item.brand && (
            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-neutral-400
              "
            >
              {item.brand}
            </p>
          )}


          {/* PRODUCT NAME */}

          <p
            className="
              mt-1
              text-sm
              font-medium
              leading-5
              text-neutral-800
            "
          >
            {item.name}
          </p>


          {/* QUANTITY */}

          <p
            className="
              mt-1.5
              text-xs
              leading-4
              text-neutral-400
            "
          >
            × {item.quantity}
          </p>

        </div>


        {/* ==================================================
            PRICE
            ================================================== */}

        <div
          className="
            shrink-0
            pt-5
            text-right
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-neutral-700
            "
          >
            {formatAmount(
              item.price *
              item.quantity
            )}
          </p>

        </div>

      </div>

    )
  )}

</div>


          {/* VOUCHER */}

          <div
            className="
              mt-8
              border-t
              border-neutral-200
              pt-6
            "
          >

            <label
              className="
                mb-2
                block
                text-xs
                font-medium
                uppercase
                tracking-[0.2em]
                text-neutral-400
              "
            >
              Voucher
            </label>


            <div
              className="
                flex
                gap-2
              "
            >

              <input
                value={voucherCode}
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
                disabled={
                  calculatingCheckout ||
                  !voucherCode.trim() ||
                  !state
                }
                onClick={() => {
                  void calculateOrderTotal(
                    voucherCode.trim()
                  );
                }}
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
                {calculatingCheckout
                  ? "Checking..."
                  : "Apply"}
              </button>

            </div>

            {voucherError ? (
              <p
                className="
                  mt-2
                  text-xs
                  text-red-600
                "
              >
                {voucherError}
              </p>
            ) : voucherApplied ? (
              <p
                className="
                  mt-2
                  text-xs
                  text-green-600
                "
              >
                Voucher applied successfully.
              </p>
            ) : (
              <p
                className="
                  mt-2
                  text-xs
                  text-neutral-400
                "
              >
                Enter your voucher code and click Apply.
              </p>
            )}

          </div>


          {/* TOTAL */}

          <div
            className="
              mt-8
              space-y-3
              border-t
              border-neutral-200
              pt-6
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                text-sm
              "
            >

              <span
                className="text-neutral-500"
              >
                Subtotal
              </span>


              <span
                className="text-neutral-800"
              >
                {formatAmount(
                  subtotal
                )}
              </span>

            </div>


            {voucherDiscount > 0 && (

              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-sm
                "
              >

                <span
                  className="text-neutral-500"
                >
                  Voucher
                </span>

                <span
                  className="text-green-600"
                >
                  -{formatAmount(voucherDiscount)}
                </span>

              </div>

            )}


            <div
              className="
                flex
                items-center
                justify-between
                text-sm
              "
            >

              <span
                className="text-neutral-500"
              >
                Shipping
              </span>


              <span
                className="text-right text-neutral-800"
              >
                {!state ? (
                  "Select state"
                ) : shippingIsFree ? (
                  "FREE"
                ) : (
                  formatAmount(shippingFee)
                )}
              </span>

            </div>


            <div
              className="
                flex
                items-end
                justify-between
                gap-4
                border-t
                border-neutral-200
                pt-5
              "
            >

              <span
                className="
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                Total
              </span>


              <span
                className="
                  text-3xl
                  font-medium
                  tracking-tight
                  text-neutral-900
                "
              >
                {formatAmount(
                  Math.max(
                    subtotal -
                      voucherDiscount +
                      shippingFee,
                    0
                  )
                )}
              </span>

            </div>

          </div>


          {/* ==================================================
              PAYMENT
              ================================================== */}

          <div
            className="
              mt-8
              border-t
              sm:mt-10
              border-neutral-200
              pt-8
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <CreditCard
                className="
                  h-5
                  w-5
                  text-neutral-700
                "
              />

              <div>

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.25em]
                    text-neutral-400
                  "
                >
                  PAYMENT
                </p>


                <h3
                  className="
                    mt-1
                    text-xl
                    font-medium
                    text-neutral-900
                  "
                >
                  Payment Method
                </h3>

              </div>

            </div>


            {loadingPaymentMethods ? (

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-neutral-500
                "
              >

                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Loading payment methods...

              </div>

            ) : paymentMethods.length === 0 ? (

              <div
                className="
                  mt-6
                  rounded-2xl
                  bg-neutral-50
                  p-5
                  text-sm
                  leading-6
                  text-neutral-500
                "
              >
                No payment methods are
                currently available.
              </div>

            ) : (

              <div
                className="
                  mt-6
                  space-y-3
                "
              >

                {paymentMethods.map(
                  (method) => {

                    const selected =
                      paymentMethodId ===
                      method.id;


                    return (

                      <button
                        type="button"
                        key={method.id}
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

                            <QrCode
                              className="
                                h-4
                                w-4
                              "
                            />

                          ) : (

                            <CreditCard
                              className="
                                h-4
                                w-4
                              "
                            />

                          )}

                        </div>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              text-sm
                              font-medium
                              text-neutral-900
                            "
                          >
                            {method.name}
                          </p>


                          <p
                            className="
                              mt-1
                              text-xs
                              text-neutral-400
                            "
                          >
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
                            <Check
                              className="
                                h-3
                                w-3
                              "
                            />
                          )}

                        </div>

                      </button>

                    );

                  }
                )}

              </div>

            )}


            {/* PAYMENT PREVIEW */}

            {selectedPaymentMethod && (

              <div
                className="
                  mt-5
                  rounded-2xl
                  bg-neutral-50
                  p-5
                "
              >

                {selectedPaymentMethod.type ===
                  "BANK_TRANSFER" && (

                  <div
                    className="space-y-4"
                  >

                    {selectedPaymentMethod.bankName && (

                      <div>

                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.2em]
                            text-neutral-400
                          "
                        >
                          Bank
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-medium
                            text-neutral-900
                          "
                        >
                          {
                            selectedPaymentMethod.bankName
                          }
                        </p>

                      </div>

                    )}


                    {selectedPaymentMethod.accountName && (

                      <div>

                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.2em]
                            text-neutral-400
                          "
                        >
                          Account Name
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-medium
                            text-neutral-900
                          "
                        >
                          {
                            selectedPaymentMethod.accountName
                          }
                        </p>

                      </div>

                    )}


                    {selectedPaymentMethod.accountNumber && (

                      <div>

                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.2em]
                            text-neutral-400
                          "
                        >
                          Account Number
                        </p>

                        <p
                          className="
                            mt-1
                            font-mono
                            text-sm
                            font-medium
                            text-neutral-900
                          "
                        >
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

                  <div
                    className="text-center"
                  >

                    <p
                      className="
                        mb-4
                        text-xs
                        text-neutral-500
                      "
                    >
                      Scan the QR code to
                      complete payment.
                    </p>


                    <div
                      className="
                        mx-auto
                        w-full
                        max-w-[200px]
                        rounded-xl
                        bg-white
                        p-2
                        sm:max-w-[240px]
                        sm:p-3
                      "
                    >

                      <Image
                        src={
                          selectedPaymentMethod.qrImageUrl
                        }
                        alt={
                          selectedPaymentMethod.name
                        }
                        width={240}
                        height={240}
                        className="
                          h-auto
                          w-full
                          rounded-lg
                          object-contain
                        "
                      />

                    </div>

                  </div>

                )}


                {selectedPaymentMethod.instructions && (

                  <p
                    className="
                      mt-4
                      whitespace-pre-line
                      text-xs
                      leading-6
                      text-neutral-500
                    "
                  >
                    {
                      selectedPaymentMethod.instructions
                    }
                  </p>

                )}

              </div>

            )}

          </div>


          {/* ERROR */}

          {error && (

            <div
              className="
                mt-8
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-5
                py-4
                text-sm
                leading-6
                text-red-700
              "
            >
              {error}
            </div>

          )}


          {/* PLACE ORDER */}

          <button
            type="button"
            onClick={() => {
              void handlePlaceOrder();
            }}
            disabled={
              submitting ||
              loadingPaymentMethods ||
              items.length === 0 ||
              paymentMethods.length === 0
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
              px-5
              py-4
              text-[10px]
              sm:px-8
              sm:py-5
              sm:text-[11px]
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

                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Creating Order...

              </>

            ) : (

              <>

                Place Order & Continue to Payment

                <span>→</span>

              </>

            )}

          </button>


          <p
            className="
              mt-4
              text-center
              text-[11px]
              leading-5
              text-neutral-400
            "
          >
            Your order will be created first.
            You will then be taken to the
            secure payment page to complete
            your payment.
          </p>


          {/* BACK */}

          <Link
            href="/cart"
            className="
              mt-6
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

            <ArrowLeft
              className="h-4 w-4"
            />

            Back to Cart

          </Link>

        </section>

      </aside>

    </div>

  );

}