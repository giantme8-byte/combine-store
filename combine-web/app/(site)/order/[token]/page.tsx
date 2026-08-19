import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type OrderPageProps = {
  params: Promise<{
    token: string;
  }>;
};


// ============================================================
// HELPERS
// ============================================================

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
}


function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}


function getOrderStatusLabel(status: string) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Pending Payment";

    case "PAYMENT_REVIEW":
      return "Payment Under Review";

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


function getPaymentStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "SUBMITTED":
      return "Payment Submitted";

    case "VERIFIED":
      return "Verified";

    case "REJECTED":
      return "Rejected";

    default:
      return status;
  }
}


function getStatusClass(status: string) {
  switch (status) {
    case "PAID":
    case "VERIFIED":
    case "COMPLETED":
      return "border-green-200 bg-green-50 text-green-700";

    case "SHIPPED":
    case "PROCESSING":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "PAYMENT_REVIEW":
    case "SUBMITTED":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "CANCELLED":
    case "REJECTED":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-neutral-200 bg-neutral-50 text-neutral-600";
  }
}


// ============================================================
// PAGE
// ============================================================

export default async function OrderDetailPage({
  params,
}: OrderPageProps) {

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }


  const { token } = await params;

  const cleanToken = token?.trim();

  if (!cleanToken) {
    notFound();
  }


  /*
   * IMPORTANT
   *
   * We check BOTH:
   *
   * 1. publicToken
   * 2. userId
   *
   * This prevents another customer from viewing
   * an order by guessing or obtaining the token.
   */

  const order = await prisma.order.findFirst({

    where: {
      publicToken: cleanToken,
      userId: user.id,
    },

    include: {

      items: {
        orderBy: {
          id: "asc",
        },
      },

      payment: true,

    },

  });


  if (!order) {
    notFound();
  }


  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-32 pt-32 sm:px-8 lg:px-12">


      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="mx-auto max-w-4xl text-center">

        <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
          ORDER
        </p>

        <h1
          className="
            mt-6
            text-4xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            sm:text-5xl
            md:text-6xl
          "
        >
          Order Details
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

        <p className="mt-8 text-sm text-neutral-500">
          Order placed on {formatDate(order.createdAt)}
        </p>

      </div>


      {/* ============================================================
          ORDER STATUS
      ============================================================ */}

      <section
        className="
          mx-auto
          mt-16
          max-w-5xl
          rounded-[32px]
          border
          border-neutral-200
          bg-white
          p-8
          shadow-[0_20px_60px_rgba(0,0,0,.04)]
          sm:p-10
        "
      >

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
              Order Status
            </p>

            <h2 className="mt-3 text-2xl font-extralight tracking-[-0.03em] text-neutral-900">
              {getOrderStatusLabel(order.status)}
            </h2>

          </div>

          <span
            className={`
              inline-flex
              w-fit
              rounded-full
              border
              px-5
              py-2
              text-[11px]
              font-medium
              uppercase
              tracking-[0.18em]
              ${getStatusClass(order.status)}
            `}
          >
            {getOrderStatusLabel(order.status)}
          </span>

        </div>

      </section>


      {/* ============================================================
          ITEMS
      ============================================================ */}

      <section
        className="
          mx-auto
          mt-10
          max-w-5xl
          rounded-[32px]
          border
          border-neutral-200
          bg-white
          p-8
          shadow-[0_20px_60px_rgba(0,0,0,.04)]
          sm:p-10
        "
      >

        <div>

          <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
            Order Items
          </p>

          <h2 className="mt-3 text-3xl font-extralight tracking-[-0.03em] text-neutral-900">
            Your Selection
          </h2>

        </div>


        <div className="mt-10 divide-y divide-neutral-200">

          {order.items.map((item) => (

            <div
              key={item.id}
              className="py-7 first:pt-0 last:pb-0"
            >

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0 flex-1">

                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                    {item.brand}
                  </p>

                  <h3 className="mt-2 text-xl font-light text-neutral-900">
                    {item.productName}
                  </h3>

                  {item.sku && (
                    <p className="mt-2 text-sm text-neutral-400">
                      SKU: {item.sku}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-500">

                    {item.color && (
                      <span>
                        Color: {item.color}
                      </span>
                    )}

                    {item.variant && (
                      <span>
                        Variant: {item.variant}
                      </span>
                    )}

                    {item.dimensions && (
                      <span>
                        Dimensions: {item.dimensions}
                      </span>
                    )}

                    {item.packaging && (
                      <span>
                        Packaging: {item.packaging}
                      </span>
                    )}

                  </div>

                  <p className="mt-4 text-sm text-neutral-500">
                    Quantity: {item.quantity}
                  </p>

                </div>


                <div className="shrink-0 text-left sm:text-right">

                  <p className="text-lg font-light text-neutral-900">
                    {formatCurrency(item.totalPrice)}
                  </p>

                  <p className="mt-2 text-sm text-neutral-400">
                    {formatCurrency(item.unitPrice)} × {item.quantity}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ============================================================
          PAYMENT SUMMARY
      ============================================================ */}

      <section
        className="
          mx-auto
          mt-10
          max-w-5xl
          rounded-[32px]
          border
          border-neutral-200
          bg-white
          p-8
          shadow-[0_20px_60px_rgba(0,0,0,.04)]
          sm:p-10
        "
      >

        <div>

          <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
            Payment
          </p>

          <h2 className="mt-3 text-3xl font-extralight tracking-[-0.03em] text-neutral-900">
            Payment Summary
          </h2>

        </div>


        <div className="mt-10 space-y-5">

          <div className="flex items-center justify-between gap-6 text-sm">

            <span className="text-neutral-500">
              Subtotal
            </span>

            <span className="text-neutral-900">
              {formatCurrency(order.subtotal)}
            </span>

          </div>


          {order.voucherDiscount > 0 && (

            <div className="flex items-center justify-between gap-6 text-sm">

              <span className="text-neutral-500">

                Voucher Discount

                {order.voucherCode && (
                  <span className="ml-2 text-xs text-[#C8A96A]">
                    ({order.voucherCode})
                  </span>
                )}

              </span>

              <span className="text-green-600">
                -{formatCurrency(order.voucherDiscount)}
              </span>

            </div>

          )}


          <div className="h-px bg-neutral-200" />


          <div className="flex items-end justify-between gap-6">

            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">
              Total
            </span>

            <span className="text-3xl font-extralight tracking-[-0.03em] text-neutral-900">
              {formatCurrency(order.finalAmount)}
            </span>

          </div>

        </div>


        {/* ==========================================================
            PAYMENT STATUS
        ========================================================== */}

        {order.payment && (

          <div className="mt-10 rounded-[24px] border border-neutral-200 bg-neutral-50 p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">
                  Payment Status
                </p>

                <p className="mt-2 text-lg font-light text-neutral-900">
                  {getPaymentStatusLabel(
                    order.payment.status
                  )}
                </p>

              </div>

              <span
                className={`
                  inline-flex
                  w-fit
                  rounded-full
                  border
                  px-4
                  py-2
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  ${getStatusClass(
                    order.payment.status
                  )}
                `}
              >
                {getPaymentStatusLabel(
                  order.payment.status
                )}
              </span>

            </div>


            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  Payment Method
                </p>

                <p className="mt-2 text-sm text-neutral-700">
                  {order.payment.paymentMethodName}
                </p>

              </div>


              <div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  Amount
                </p>

                <p className="mt-2 text-sm text-neutral-700">
                  {formatCurrency(
                    order.payment.amount
                  )}
                </p>

              </div>

            </div>


            {/* ======================================================
                VERIFIED AT
            ====================================================== */}

            {order.payment.verifiedAt && (

              <div className="mt-5">

                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  Verified At
                </p>

                <p className="mt-2 text-sm text-neutral-700">
                  {formatDate(
                    order.payment.verifiedAt
                  )}
                </p>

              </div>

            )}


            {/* ======================================================
                REJECTION REASON
            ====================================================== */}

            {order.payment.status === "REJECTED" &&
              order.payment.adminNote && (

                <div
                  className="
                    mt-6
                    rounded-[20px]
                    border
                    border-red-200
                    bg-red-50
                    p-5
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
                    Reason for Rejection
                  </p>

                  <p
                    className="
                      mt-3
                      whitespace-pre-line
                      text-sm
                      leading-6
                      text-red-700
                    "
                  >
                    {order.payment.adminNote}
                  </p>

                </div>

              )}

          </div>

        )}


        {/* ==========================================================
            PAYMENT ACTION
        ========================================================== */}

        {(order.status === "PENDING_PAYMENT" ||
          order.payment?.status === "REJECTED") && (

          <div className="mt-8">

            <Link
              href={`/order/payment/${encodeURIComponent(
                order.publicToken
              )}`}
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
                hover:-translate-y-1
                hover:bg-[#C8A96A]
                hover:shadow-xl
              "
            >
              {order.payment?.status === "REJECTED"
                ? "Submit Payment Again"
                : "Make Payment"}
            </Link>

          </div>

        )}

      </section>


      {/* ============================================================
          SHIPPING
      ============================================================ */}

      {(order.shippingCourier ||
        order.trackingNumber ||
        order.trackingUrl) && (

        <section
          className="
            mx-auto
            mt-10
            max-w-5xl
            rounded-[32px]
            border
            border-neutral-200
            bg-white
            p-8
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
            sm:p-10
          "
        >

          <div>

            <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
              Shipping
            </p>

            <h2 className="mt-3 text-3xl font-extralight tracking-[-0.03em] text-neutral-900">
              Delivery Information
            </h2>

          </div>


          <div className="mt-10 grid gap-6 sm:grid-cols-2">

            {order.shippingCourier && (

              <div
                className="
                  rounded-[24px]
                  border
                  border-neutral-200
                  bg-neutral-50
                  p-6
                "
              >

                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  Courier
                </p>

                <p className="mt-3 text-lg font-light text-neutral-900">
                  {order.shippingCourier}
                </p>

              </div>

            )}


            {order.trackingNumber && (

              <div
                className="
                  rounded-[24px]
                  border
                  border-neutral-200
                  bg-neutral-50
                  p-6
                "
              >

                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  Tracking Number
                </p>

                <p className="mt-3 break-all text-lg font-light text-neutral-900">
                  {order.trackingNumber}
                </p>

              </div>

            )}

          </div>


          {order.trackingUrl && (

            <div className="mt-8">

              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-300
                  px-8
                  py-4
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-neutral-900
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A96A]
                  hover:text-[#C8A96A]
                  hover:shadow-lg
                  sm:w-auto
                "
              >
                Track Shipment →
              </a>

            </div>

          )}

        </section>

      )}


      {/* ============================================================
          CUSTOMER INFORMATION
      ============================================================ */}

      <section
        className="
          mx-auto
          mt-10
          max-w-5xl
          rounded-[32px]
          border
          border-neutral-200
          bg-white
          p-8
          shadow-[0_20px_60px_rgba(0,0,0,.04)]
          sm:p-10
        "
      >

        <div>

          <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
            Customer
          </p>

          <h2 className="mt-3 text-3xl font-extralight tracking-[-0.03em] text-neutral-900">
            Customer Information
          </h2>

        </div>


        <div className="mt-10 grid gap-6 sm:grid-cols-2">

          <div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              Name
            </p>

            <p className="mt-2 text-neutral-700">
              {order.customerName}
            </p>

          </div>


          <div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              Phone
            </p>

            <p className="mt-2 text-neutral-700">
              {order.customerPhone}
            </p>

          </div>


          {order.customerEmail && (

            <div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                Email
              </p>

              <p className="mt-2 break-all text-neutral-700">
                {order.customerEmail}
              </p>

            </div>

          )}


          {order.address && (

            <div className="sm:col-span-2">

              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                Address
              </p>

              <p className="mt-2 whitespace-pre-line text-neutral-700">
                {order.address}
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ============================================================
          ACTIONS
      ============================================================ */}

      <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-4 sm:flex-row">

        <Link
          href="/profile/orders"
          className="
            inline-flex
            flex-1
            items-center
            justify-center
            rounded-full
            border
            border-neutral-300
            px-8
            py-4
            text-[11px]
            font-medium
            uppercase
            tracking-[0.3em]
            text-neutral-900
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-[#C8A96A]
            hover:text-[#C8A96A]
            hover:shadow-lg
          "
        >
          ← Order History
        </Link>


        <Link
          href="/profile"
          className="
            inline-flex
            flex-1
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
          My Account
        </Link>

      </div>

    </main>
  );
}