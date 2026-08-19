import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


// ============================================================
// HELPERS
// ============================================================

function formatCurrency(
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


function formatDate(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "en-MY",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);

}


// ============================================================
// ORDER STATUS
// ============================================================

function getStatusLabel(
  status: string
) {

  switch (status) {

    case "PENDING_PAYMENT":
      return "Pending Payment";

    case "PAYMENT_REVIEW":
      return "Payment Review";

    case "PAID":
      return "Paid";

    case "PROCESSING":
      return "Processing";

    case "SHIPPED":
      return "Shipped";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;

  }

}


function getStatusClass(
  status: string
) {

  switch (status) {

    case "PAID":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "PROCESSING":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "SHIPPED":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-600";

    case "PAYMENT_REVIEW":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "PENDING_PAYMENT":
      return "border-orange-200 bg-orange-50 text-orange-700";

    default:
      return "border-neutral-200 bg-neutral-50 text-neutral-600";

  }

}


// ============================================================
// PAYMENT STATUS
// ============================================================

function getPaymentStatusLabel(
  status: string
) {

  switch (status) {

    case "PENDING":
      return "Payment Pending";

    case "SUBMITTED":
      return "Payment Submitted";

    case "VERIFIED":
      return "Payment Verified";

    case "REJECTED":
      return "Payment Rejected";

    default:
      return status;

  }

}


function getPaymentStatusClass(
  status: string
) {

  switch (status) {

    case "VERIFIED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "SUBMITTED":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "REJECTED":
      return "border-red-200 bg-red-50 text-red-700";

    case "PENDING":
      return "border-neutral-200 bg-neutral-50 text-neutral-600";

    default:
      return "border-neutral-200 bg-neutral-50 text-neutral-600";

  }

}


// ============================================================
// PAGE
// ============================================================

export default async function OrdersPage() {

  const user =
    await getCurrentUser();


  // ==========================================================
  // REQUIRE LOGIN
  // ==========================================================

  if (!user) {

    redirect("/login");

  }


  // ==========================================================
  // CUSTOMER ORDERS
  //
  // IMPORTANT:
  //
  // Only retrieve orders belonging to
  // the currently authenticated customer.
  // ==========================================================

  const orders =
    await prisma.order.findMany({

      where: {

        userId:
          user.id,

      },

      orderBy: {

        createdAt:
          "desc",

      },

      include: {

        // ======================================================
        // ORDER ITEMS
        // ======================================================

        items: {

          select: {

            id: true,

            productName: true,

            brand: true,

            quantity: true,

            unitPrice: true,

            totalPrice: true,

            color: true,

            variant: true,

            dimensions: true,

          },

          orderBy: {

            id:
              "asc",

          },

        },


        // ======================================================
        // PAYMENT
        // ======================================================

        payment: {

          select: {

            status: true,

            amount: true,

            paymentMethodName:
              true,

            proofUrl:
              true,

            verifiedAt:
              true,

            adminNote:
              true,

          },

        },

      },

    });


  return (

    <main
      className="
        mx-auto
        max-w-[1440px]
        px-8
        pb-32
        pt-36
        lg:px-12
      "
    >


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mx-auto
          mb-16
          max-w-4xl
          text-center
        "
      >

        <p
          className="
            text-xs
            uppercase
            tracking-[0.55em]
            text-neutral-400
          "
        >
          ACCOUNT
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
          My Orders
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
            max-w-2xl
            text-lg
            leading-8
            text-neutral-500
          "
        >
          View your order history, payment status
          and shipment information.
        </p>

      </div>


      {/* ======================================================
          BACK TO PROFILE
      ====================================================== */}

      <div
        className="
          mx-auto
          mb-10
          max-w-5xl
        "
      >

        <Link
          href="/profile"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-neutral-500
            transition
            hover:text-[#C8A96A]
          "
        >
          ← Back to Profile
        </Link>

      </div>


      {/* ======================================================
          NO ORDERS
      ====================================================== */}

      {orders.length === 0 ? (

        <section
          className="
            mx-auto
            max-w-5xl
            rounded-[36px]
            border
            border-neutral-200
            bg-white
            px-8
            py-20
            text-center
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
          "
        >

          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-neutral-100
              text-3xl
            "
          >
            📦
          </div>


          <h2
            className="
              mt-8
              text-3xl
              font-extralight
              tracking-[-0.03em]
            "
          >
            No Orders Yet
          </h2>


          <p
            className="
              mx-auto
              mt-4
              max-w-md
              leading-7
              text-neutral-500
            "
          >
            You haven&apos;t placed any orders yet.
            Explore our collection and discover
            something special.
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
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#C8A96A]
              hover:shadow-xl
            "
          >
            Explore Collection
          </Link>

        </section>

      ) : (

        /* ====================================================
           ORDERS
        ==================================================== */

        <div
          className="
            mx-auto
            max-w-5xl
            space-y-8
          "
        >

          {orders.map(
            (order) => (

              <section
                key={order.id}
                className="
                  overflow-hidden
                  rounded-[36px]
                  border
                  border-neutral-200
                  bg-white
                  shadow-[0_20px_60px_rgba(0,0,0,.04)]
                "
              >

                {/* ============================================
                    ORDER HEADER
                ============================================ */}

                <div
                  className="
                    border-b
                    border-neutral-200
                    px-8
                    py-7
                    md:px-10
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      md:flex-row
                      md:items-center
                      md:justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[11px]
                          uppercase
                          tracking-[0.3em]
                          text-neutral-400
                        "
                      >
                        Order
                      </p>


                      <h2
                        className="
                          mt-2
                          text-xl
                          font-medium
                          tracking-[-0.02em]
                          text-neutral-900
                        "
                      >
                        #{order.id}
                      </h2>


                      <p
                        className="
                          mt-2
                          text-sm
                          text-neutral-500
                        "
                      >
                        {formatDate(
                          order.createdAt
                        )}
                      </p>

                    </div>


                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >

                      {/* ORDER STATUS */}

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          border
                          px-4
                          py-2
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.2em]
                          ${getStatusClass(
                            order.status
                          )}
                        `}
                      >
                        {getStatusLabel(
                          order.status
                        )}
                      </span>


                      {/* PAYMENT STATUS */}

                      {order.payment && (

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            border
                            px-4
                            py-2
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.2em]
                            ${getPaymentStatusClass(
                              order.payment.status
                            )}
                          `}
                        >
                          {getPaymentStatusLabel(
                            order.payment.status
                          )}
                        </span>

                      )}

                    </div>

                  </div>

                </div>


                {/* ============================================
                    ORDER ITEMS
                ============================================ */}

                <div
                  className="
                    px-8
                    py-8
                    md:px-10
                  "
                >

                  <div
                    className="
                      space-y-5
                    "
                  >

                    {order.items.map(
                      (item) => (

                        <div
                          key={item.id}
                          className="
                            flex
                            items-start
                            justify-between
                            gap-6
                            border-b
                            border-neutral-100
                            pb-5
                            last:border-b-0
                            last:pb-0
                          "
                        >

                          <div
                            className="
                              min-w-0
                            "
                          >

                            <p
                              className="
                                text-sm
                                font-medium
                                text-neutral-900
                              "
                            >
                              {item.brand}
                            </p>


                            <p
                              className="
                                mt-1
                                text-base
                                text-neutral-700
                              "
                            >
                              {item.productName}
                            </p>


                            <div
                              className="
                                mt-2
                                flex
                                flex-wrap
                                gap-x-4
                                gap-y-1
                                text-xs
                                text-neutral-400
                              "
                            >

                              {item.variant && (

                                <span>
                                  {item.variant}
                                </span>

                              )}


                              {item.color && (

                                <span>
                                  {item.color}
                                </span>

                              )}


                              {item.dimensions && (

                                <span>
                                  {item.dimensions}
                                </span>

                              )}


                              <span>
                                Qty {item.quantity}
                              </span>

                            </div>

                          </div>


                          <p
                            className="
                              shrink-0
                              text-sm
                              font-medium
                              text-neutral-900
                            "
                          >
                            {formatCurrency(
                              item.totalPrice
                            )}
                          </p>

                        </div>

                      )
                    )}

                  </div>


                  {/* ==========================================
                      ORDER TOTAL
                  ========================================== */}

                  <div
                    className="
                      mt-8
                      flex
                      items-end
                      justify-between
                      border-t
                      border-neutral-200
                      pt-7
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[11px]
                          uppercase
                          tracking-[0.3em]
                          text-neutral-400
                        "
                      >
                        Total
                      </p>


                      {order.voucherCode && (

                        <p
                          className="
                            mt-2
                            text-xs
                            text-neutral-500
                          "
                        >
                          Voucher:{" "}
                          {order.voucherCode}
                        </p>

                      )}

                    </div>


                    <p
                      className="
                        text-2xl
                        font-light
                        tracking-[-0.03em]
                        text-neutral-900
                      "
                    >
                      {formatCurrency(
                        order.finalAmount
                      )}
                    </p>

                  </div>


                  {/* ==========================================
                      REJECTION REASON
                  ========================================== */}

                  {order.payment?.status ===
                    "REJECTED" &&
                    order.payment.adminNote && (

                      <div
                        className="
                          mt-8
                          rounded-[24px]
                          border
                          border-red-200
                          bg-red-50
                          p-6
                        "
                      >

                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.25em]
                            text-red-400
                          "
                        >
                          Payment Rejected
                        </p>


                        <p
                          className="
                            mt-3
                            text-[10px]
                            uppercase
                            tracking-[0.25em]
                            text-red-400
                          "
                        >
                          Reason
                        </p>


                        <p
                          className="
                            mt-2
                            whitespace-pre-line
                            text-sm
                            leading-6
                            text-red-700
                          "
                        >
                          {order.payment.adminNote}
                        </p>


                        <Link
                          href={`/order/payment/${order.publicToken}`}
                          className="
                            mt-5
                            inline-flex
                            items-center
                            text-sm
                            font-medium
                            text-red-700
                            transition
                            hover:text-[#C8A96A]
                          "
                        >
                          Review Order & Submit Again →
                        </Link>

                      </div>

                    )}


                  {/* ==========================================
                      SHIPPING
                  ========================================== */}

                  {order.status ===
                    "SHIPPED" ||
                  order.status ===
                    "COMPLETED" ? (

                    <div
                      className="
                        mt-8
                        rounded-[28px]
                        border
                        border-neutral-200
                        bg-neutral-50
                        p-6
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-5
                          md:flex-row
                          md:items-center
                          md:justify-between
                        "
                      >

                        <div>

                          <p
                            className="
                              text-[11px]
                              uppercase
                              tracking-[0.3em]
                              text-neutral-400
                            "
                          >
                            Shipment
                          </p>


                          <p
                            className="
                              mt-2
                              text-base
                              font-medium
                              text-neutral-900
                            "
                          >
                            🚚{" "}
                            {order.shippingCourier ||
                              "ABX Express"}
                          </p>


                          {order.trackingNumber && (

                            <p
                              className="
                                mt-2
                                text-sm
                                text-neutral-500
                              "
                            >
                              Tracking Number:{" "}
                              <span
                                className="
                                  font-medium
                                  text-neutral-800
                                "
                              >
                                {order.trackingNumber}
                              </span>
                            </p>

                          )}

                        </div>


                        {order.trackingNumber &&
                          order.trackingUrl && (

                            <a
                              href={
                                order.trackingUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-full
                                bg-black
                                px-6
                                py-3
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.25em]
                                text-white
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:bg-[#C8A96A]
                              "
                            >
                              Track Shipment →
                            </a>

                          )}

                      </div>

                    </div>

                  ) : null}


                  {/* ==========================================
                      VIEW ORDER
                  ========================================== */}

                  <div
                    className="
                      mt-8
                      flex
                      justify-end
                    "
                  >

                    <Link
                      href={`/order/payment/${order.publicToken}`}
                      className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-neutral-200
                        px-7
                        py-3
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.25em]
                        text-neutral-700
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[#C8A96A]
                        hover:text-[#C8A96A]
                      "
                    >
                      View Order →
                    </Link>

                  </div>

                </div>

              </section>

            )
          )}

        </div>

      )}

    </main>

  );

}