"use client";

import Link from "next/link";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import {
  useCart,
} from "../_components/CartProvider";


// ============================================================
// FORMAT AMOUNT
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
// CART PAGE
// ============================================================

export default function CartPage() {

  const {
    items,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();


  // ==========================================================
  // PRICE VALIDATION
  // ==========================================================

  const hasUnpricedItems =
    items.some(
      (item) =>
        !Number.isFinite(
          item.price
        ) ||
        item.price <= 0
    );


  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (
    items.length === 0
  ) {

    return (
      <main
        className="
          min-h-[70vh]
          px-6
          py-16
          sm:px-10
          lg:px-16
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-2xl
            flex-col
            items-center
            justify-center
            py-20
            text-center
          "
        >

          <div
            className="
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


          <h1
            className="
              mt-6
              text-3xl
              font-light
              tracking-tight
              text-neutral-900
            "
          >
            Your Cart is Empty
          </h1>


          <p
            className="
              mt-3
              max-w-md
              text-sm
              leading-6
              text-neutral-500
            "
          >
            Explore our collection and add
            your favorite pieces to your cart.
          </p>


          <Link
            href="/shop"
            className="
              mt-8
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-black
              px-7
              py-3.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-neutral-800
            "
          >
            Continue Shopping
          </Link>

        </div>

      </main>
    );
  }


  // ==========================================================
  // CART
  // ==========================================================

  return (
    <main
      className="
        min-h-[70vh]
        px-6
        py-12
        sm:px-10
        lg:px-16
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        {/* ====================================================
            HEADER
            ==================================================== */}

        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.25em]
              text-neutral-400
            "
          >
            Shopping Bag
          </p>


          <h1
            className="
              mt-3
              text-4xl
              font-light
              tracking-tight
              text-neutral-900
              sm:text-5xl
            "
          >
            Your Cart
          </h1>


          <p
            className="
              mt-3
              text-sm
              text-neutral-500
            "
          >
            {items.reduce(
              (
                total,
                item
              ) =>
                total +
                item.quantity,
              0
            )}{" "}
            item(s)
          </p>

        </div>


        {/* ====================================================
            CONTENT
            ==================================================== */}

        <div
          className="
            mt-10
            grid
            gap-10
            lg:grid-cols-[minmax(0,1fr)_360px]
            lg:items-start
          "
        >

          {/* ==================================================
              ITEMS
              ================================================== */}

          <div
            className="
              divide-y
              divide-neutral-200
              border-y
              border-neutral-200
            "
          >

            {items.map(
              (item) => (

                <div
                  key={
                    item.cartItemId
                  }
                  className="
                    flex
                    gap-5
                    py-6
                    sm:gap-7
                  "
                >

                  {/* ==================================================
                      IMAGE
                      ================================================== */}

                  <Link
                    href={
                      item.slug
                        ? `/shop/${item.slug}`
                        : "/shop"
                    }
                    className="
                      block
                      h-32
                      w-28
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      bg-neutral-100
                      sm:h-40
                      sm:w-32
                    "
                  >

                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.name
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />

                  </Link>


                  {/* ==================================================
                      INFORMATION
                      ================================================== */}

                  <div
                    className="
                      flex
                      min-w-0
                      flex-1
                      flex-col
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <div
                        className="
                          min-w-0
                        "
                      >

                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-[0.15em]
                            text-neutral-400
                          "
                        >
                          {item.brand}
                        </p>


                        {/* ==================================================
                            PRODUCT NAME
                            ================================================== */}

                        <Link
                          href={
                            item.slug
                              ? `/shop/${item.slug}`
                              : "/shop"
                          }
                          className="
                            mt-1
                            block
                            text-lg
                            font-medium
                            text-neutral-900
                            hover:underline
                            sm:text-xl
                          "
                        >
                          {item.name}
                        </Link>

                      </div>


                      {/* ==================================================
                          REMOVE
                          ================================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.cartItemId
                          )
                        }
                        className="
                          shrink-0
                          rounded-lg
                          p-2
                          text-neutral-400
                          transition
                          hover:bg-neutral-100
                          hover:text-red-600
                        "
                        aria-label={
                          `Remove ${item.name}`
                        }
                      >

                        <Trash2
                          className="h-4 w-4"
                        />

                      </button>

                    </div>


                    {/* ==================================================
                        PRODUCT DETAILS
                        ================================================== */}

                    <div
                      className="
                        mt-3
                        space-y-1
                      "
                    >

                      {item.sku && (

                        <p
                          className="
                            text-xs
                            text-neutral-400
                          "
                        >
                          SKU:{" "}
                          <span
                            className="
                              text-neutral-600
                            "
                          >
                            {item.sku}
                          </span>
                        </p>

                      )}


                      {item.model && (

                        <p
                          className="
                            text-xs
                            text-neutral-400
                          "
                        >
                          Model:{" "}
                          <span
                            className="
                              text-neutral-600
                            "
                          >
                            {item.model}
                          </span>
                        </p>

                      )}


                      {item.color && (

                        <p
                          className="
                            text-xs
                            text-neutral-400
                          "
                        >
                          Colour:{" "}
                          <span
                            className="
                              text-neutral-600
                            "
                          >
                            {item.color}
                          </span>
                        </p>

                      )}


                      {item.variant && (

                        <p
                          className="
                            text-xs
                            text-neutral-400
                          "
                        >
                          Size:{" "}
                          <span
                            className="
                              text-neutral-600
                            "
                          >
                            {item.variant}
                          </span>
                        </p>

                      )}


                      {item.dimensions && (

                        <p
                          className="
                            text-xs
                            text-neutral-400
                          "
                        >
                          Dimensions:{" "}
                          <span
                            className="
                              text-neutral-600
                            "
                          >
                            {item.dimensions}
                          </span>
                        </p>

                      )}

                    </div>


                    {/* ==================================================
                        PRICE
                        ================================================== */}

                    <p
                      className={`
                        mt-3
                        text-sm
                        font-medium
                        ${
                          item.price <= 0
                            ? "text-neutral-500"
                            : "text-neutral-900"
                        }
                      `}
                    >
                      {item.price <= 0
                        ? "Price on Request"
                        : formatAmount(
                            item.price
                          )}
                    </p>


                    {/* ==================================================
                        PRICE WARNING
                        ================================================== */}

                    {item.price <= 0 && (

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-5
                          text-amber-600
                        "
                      >
                        Price has not been confirmed.
                        Please contact us on WhatsApp.
                      </p>

                    )}


                    {/* ==================================================
                        QUANTITY + TOTAL
                        ================================================== */}

                    <div
                      className="
                        mt-auto
                        flex
                        items-end
                        justify-between
                        gap-4
                        pt-6
                      "
                    >

                      {/* ==================================================
                          QUANTITY
                          ================================================== */}

                      <div>

                        <p
                          className="
                            mb-2
                            text-[10px]
                            uppercase
                            tracking-[0.15em]
                            text-neutral-400
                          "
                        >
                          Quantity
                        </p>


                        <div
                          className="
                            inline-flex
                            items-center
                            rounded-lg
                            border
                            border-neutral-200
                            bg-white
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.cartItemId,
                                item.quantity -
                                  1
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              text-neutral-600
                              transition
                              hover:bg-neutral-100
                            "
                            aria-label="Decrease quantity"
                          >

                            <Minus
                              className="h-3.5 w-3.5"
                            />

                          </button>


                          <span
                            className="
                              flex
                              h-9
                              min-w-10
                              items-center
                              justify-center
                              border-x
                              border-neutral-200
                              px-3
                              text-sm
                              font-medium
                              text-neutral-900
                            "
                          >
                            {
                              item.quantity
                            }
                          </span>


                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.cartItemId,
                                item.quantity +
                                  1
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              text-neutral-600
                              transition
                              hover:bg-neutral-100
                            "
                            aria-label="Increase quantity"
                          >

                            <Plus
                              className="h-3.5 w-3.5"
                            />

                          </button>

                        </div>

                      </div>


                      {/* ==================================================
                          ITEM TOTAL
                          ================================================== */}

                      <div
                        className="
                          text-right
                        "
                      >

                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.15em]
                            text-neutral-400
                          "
                        >
                          Total
                        </p>


                        <p
                          className={`
                            mt-1
                            text-base
                            font-semibold
                            ${
                              item.price <= 0
                                ? "text-neutral-500"
                                : "text-neutral-900"
                            }
                          `}
                        >
                          {item.price <= 0
                            ? "Price on Request"
                            : formatAmount(
                                item.price *
                                  item.quantity
                              )}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          {/* ==================================================
              SUMMARY
              ================================================== */}

          <aside
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-neutral-50
              p-6
              lg:sticky
              lg:top-28
            "
          >

            <h2
              className="
                text-lg
                font-medium
                text-neutral-900
              "
            >
              Order Summary
            </h2>


            <div
              className="
                mt-6
                space-y-4
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
                  className="
                    text-neutral-500
                  "
                >
                  Subtotal
                </span>


                <span
                  className="
                    font-medium
                    text-neutral-900
                  "
                >
                  {formatAmount(
                    subtotal
                  )}
                </span>

              </div>


              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-sm
                "
              >

                <span
                  className="
                    text-neutral-500
                  "
                >
                  Shipping
                </span>


                <span
                  className="
                    text-neutral-500
                  "
                >
                  Calculated at checkout
                </span>

              </div>

            </div>


            {/* ==================================================
                ESTIMATED TOTAL
                ================================================== */}

            <div
              className="
                mt-6
                border-t
                border-neutral-200
                pt-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    text-base
                    font-medium
                    text-neutral-900
                  "
                >
                  Estimated Total
                </span>


                <span
                  className="
                    text-xl
                    font-semibold
                    text-neutral-900
                  "
                >
                  {formatAmount(
                    subtotal
                  )}
                </span>

              </div>

            </div>


            {/* ==================================================
                PRICE CONFIRMATION WARNING
                ================================================== */}

            {hasUnpricedItems && (

              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-amber-200
                  bg-amber-50
                  p-4
                "
              >

                <p
                  className="
                    text-sm
                    font-medium
                    text-amber-800
                  "
                >
                  Price Confirmation Required
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-amber-700
                  "
                >
                  One or more items in your cart
                  do not have a confirmed selling
                  price. Please contact us on
                  WhatsApp to confirm the price
                  before checkout.
                </p>

              </div>

            )}


            {/* ==================================================
                CHECKOUT
                ================================================== */}

            {hasUnpricedItems ? (

              <div
                className="
                  mt-6
                  flex
                  w-full
                  cursor-not-allowed
                  items-center
                  justify-center
                  rounded-xl
                  bg-neutral-200
                  px-5
                  py-3.5
                  text-sm
                  font-medium
                  text-neutral-500
                "
                aria-disabled="true"
              >
                Checkout Unavailable
              </div>

            ) : (

              <Link
                href="/checkout"
                className="
                  mt-6
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-black
                  px-5
                  py-3.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-neutral-800
                "
              >
                Proceed to Checkout
              </Link>

            )}


            {/* ==================================================
                CONTINUE SHOPPING
                ================================================== */}

            <Link
              href="/shop"
              className="
                mt-3
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-neutral-300
                bg-white
                px-5
                py-3.5
                text-sm
                font-medium
                text-neutral-700
                transition
                hover:bg-neutral-100
              "
            >
              Continue Shopping
            </Link>


            <p
              className="
                mt-5
                text-center
                text-xs
                leading-5
                text-neutral-400
              "
            >
              Voucher discounts and final
              shipping charges will be applied
              during checkout.
            </p>

          </aside>

        </div>

      </div>

    </main>
  );
}