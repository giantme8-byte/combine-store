import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ExternalLink,
  FileImage,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import PaymentReviewActions from "../_components/PaymentReviewActions";
import OrderFulfillmentActions from "../_components/OrderFulfillmentActions";
import ShippingInformationForm from "../_components/ShippingInformationForm";
import InternationalShippingQuoteForm from "../_components/InternationalShippingQuoteForm";


// ============================================================
// PROPS
// ============================================================

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};


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
// FORMAT DATE
// ============================================================

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-MY",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(
    new Date(date)
  );
}


// ============================================================
// ORDER STATUS LABEL
// ============================================================

function getOrderStatusLabel(
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


// ============================================================
// PAYMENT STATUS LABEL
// ============================================================

function getPaymentStatusLabel(
  status: string
) {

  switch (status) {

    case "PENDING":
      return "Pending";

    case "SUBMITTED":
      return "Submitted";

    case "VERIFIED":
      return "Verified";

    case "REJECTED":
      return "Rejected";

    default:
      return status;

  }

}


// ============================================================
// STATUS CLASS
// ============================================================

function getStatusClass(
  status: string
) {

  switch (status) {

    case "PAYMENT_REVIEW":
    case "SUBMITTED":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "PAID":
    case "VERIFIED":
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "PROCESSING":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "SHIPPED":
      return "border-violet-200 bg-violet-50 text-violet-700";

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
}: PageProps) {

  const { id } =
    await params;


  const orderId =
    Number(id);


  if (
    !Number.isInteger(orderId) ||
    orderId <= 0
  ) {

    notFound();

  }


  // ============================================================
  // LOAD ORDER
  // ============================================================

  const order =
    await prisma.order.findUnique({

      where: {
        id: orderId,
      },

      include: {

        items: {
          orderBy: {
            id: "asc",
          },

          include: {
            product: {
              include: {
                images: {
                  orderBy: {
                    sortOrder: "asc",
                  },
                },
              },
            },
          },
        },

        payment: true,

      },

    });


  if (!order) {

    notFound();

  }


// ============================================================
// ORDER PROFITABILITY
// ============================================================

/*
 * Order profitability
 *
 * Priority:
 * 1. Use stored totalCost when available.
 * 2. Otherwise calculate totalCost from unitCost × quantity.
 * 3. Use stored profit when available.
 * 4. Otherwise calculate profit from totalPrice - totalCost.
 */

const calculatedItemFinancials = order.items.map(
  (item) => {
    const calculatedTotalCost =
      item.totalCost !== null
        ? Number(item.totalCost)
        : item.unitCost !== null
          ? Number(item.unitCost) *
            Number(item.quantity)
          : null;

    const calculatedProfit =
      item.profit !== null
        ? Number(item.profit)
        : calculatedTotalCost !== null
          ? Number(item.totalPrice) -
            calculatedTotalCost
          : null;

    return {
      totalCost: calculatedTotalCost,
      profit: calculatedProfit,
    };
  }
);


const hasCompleteCostData =
  order.items.length > 0 &&
  calculatedItemFinancials.every(
    (item) =>
      item.totalCost !== null &&
      item.profit !== null
  );


const totalCost =
  hasCompleteCostData
    ? calculatedItemFinancials.reduce(
        (total, item) => {
          return (
            total +
            (item.totalCost ?? 0)
          );
        },
        0
      )
    : null;


const totalProfit =
  hasCompleteCostData
    ? calculatedItemFinancials.reduce(
        (total, item) => {
          return (
            total +
            (item.profit ?? 0)
          );
        },
        0
      )
    : null;


const margin =
  totalProfit !== null &&
  Number(order.finalAmount) > 0
    ? (
        totalProfit /
        Number(order.finalAmount)
      ) * 100
    : null;


  return (

    <main
      className="
        space-y-6
        sm:space-y-8
      "
    >


      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >

        <div>

          <Link
            href="/admin/dashboard/orders"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-neutral-500
              transition
              hover:text-black
            "
          >

            <ArrowLeft
              className="h-4 w-4"
            />

            Back to Orders

          </Link>


          <div
            className="
              mt-4
              sm:mt-5
            "
          >

            <p
              className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-neutral-400
              "
            >
              ORDER
            </p>


            <h1
              className="
                mt-2
                text-2xl
                font-semibold
                sm:text-3xl
                tracking-tight
                text-neutral-900
              "
            >
              {order.orderNumber ?? `#${order.id}`}
            </h1>


            <p
              className="
                mt-2
                text-sm
                text-neutral-500
              "
            >

              Created{" "}

              {formatDate(
                order.createdAt
              )}

            </p>

          </div>

        </div>


        <div
          className="
            flex
            flex-wrap
            gap-2
            sm:gap-3
          "
        >

          <span
            className={`
              inline-flex
              items-center
              rounded-full
              border
              px-3
              py-1.5
              text-[10px]
              font-medium
              sm:px-4
              sm:py-2
              sm:text-xs
              uppercase
              tracking-[0.12em]
              ${getStatusClass(
                order.status
              )}
            `}
          >

            {getOrderStatusLabel(
              order.status
            )}

          </span>


          {order.payment && (

            <span
              className={`
                inline-flex
                items-center
                rounded-full
                border
                px-3
                py-1.5
                text-[10px]
                font-medium
                sm:px-4
                sm:py-2
                sm:text-xs
                uppercase
                tracking-[0.12em]
                ${getStatusClass(
                  order.payment.status
                )}
              `}
            >

              Payment:{" "}

              {getPaymentStatusLabel(
                order.payment.status
              )}

            </span>

          )}


          {order.shippingType === "INTERNATIONAL" && (

            <span
              className={`
                inline-flex
                items-center
                rounded-full
                border
                px-3
                py-1.5
                text-[10px]
                font-medium
                sm:px-4
                sm:py-2
                sm:text-xs
                uppercase
                tracking-[0.12em]
                ${
                  order.shippingQuoteStatus === "QUOTED"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }
              `}
            >
              {order.shippingQuoteStatus === "QUOTED"
                ? "Shipping Fee Quoted"
                : "Shipping Fee Pending"}
            </span>

          )}

        </div>

      </div>


      {/* ====================================================== */}
      {/* CUSTOMER + ORDER SUMMARY */}
      {/* ====================================================== */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-2
        "
      >


        {/* ==================================================== */}
        {/* CUSTOMER */}
        {/* ==================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            sm:p-6
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Customer
          </p>


          <div
            className="
              mt-5
              space-y-4
              sm:mt-6
              sm:space-y-5
            "
          >

            <div>

              <p
                className="
                  text-xs
                  text-neutral-400
                "
              >
                Name
              </p>

              <p
                className="
                  mt-1
                  break-words
                  font-medium
                  text-neutral-900
                "
              >
                {order.customerName}
              </p>

            </div>


            <div>

              <p
                className="
                  text-xs
                  text-neutral-400
                "
              >
                Phone
              </p>

              <p
                className="
                  mt-1
                  break-words
                  font-medium
                  text-neutral-900
                "
              >
                {order.customerPhone}
              </p>

            </div>


            {order.customerEmail && (

              <div>

                <p
                  className="
                    text-xs
                    text-neutral-400
                  "
                >
                  Email
                </p>

                <p
                  className="
                    mt-1
                    break-all
                    font-medium
                    text-neutral-900
                  "
                >
                  {order.customerEmail}
                </p>

              </div>

            )}


            {order.address && (

              <div>

                <p
                  className="
                    text-xs
                    text-neutral-400
                  "
                >
                  Address
                </p>

                <p
                  className="
                    mt-1
                    whitespace-pre-line
                    break-words
                    text-sm
                    leading-6
                    text-neutral-700
                  "
                >
                  {order.address}
                </p>

              </div>

            )}


            {order.shippingType === "INTERNATIONAL" &&
            order.shippingCountry && (

              <div>
                <p
                  className="
                    text-xs
                    text-neutral-400
                  "
                >
                  Country
                </p>

                <p
                  className="
                    mt-1
                    font-medium
                    text-neutral-900
                  "
                >
                  {order.shippingCountry}
                </p>
              </div>

            )}

          </div>

        </section>


        {/* ==================================================== */}
        {/* SUMMARY */}
        {/* ==================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            sm:p-6
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Order Summary
          </p>


          <div
            className="
              mt-6
              space-y-4
            "
          >

            <div
              className="
                flex
                justify-between
                gap-5
              "
            >

              <span
                className="
                  text-sm
                  text-neutral-500
                "
              >
                Subtotal
              </span>

              <span
                className="
                  text-sm
                  text-neutral-900
                "
              >
                {formatAmount(
                  order.subtotal
                )}
              </span>

            </div>


            {order.voucherCode && (

              <div
                className="
                  flex
                  justify-between
                  gap-5
                "
              >

                <span
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  Voucher
                </span>

                <span
                  className="
                    text-sm
                    text-neutral-900
                  "
                >
                  {order.voucherCode}
                </span>

              </div>

            )}


            {order.voucherDiscount > 0 && (

              <div
                className="
                  flex
                  justify-between
                  gap-5
                "
              >

                <span
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  Voucher Discount
                </span>

                <span
                  className="
                    text-sm
                    text-neutral-900
                  "
                >

                  -

                  {formatAmount(
                    order.voucherDiscount
                  )}

                </span>

              </div>

            )}


            <div
              className="
                flex
                justify-between
                gap-5
              "
            >

              <span
                className="
                  text-sm
                  text-neutral-500
                "
              >
                Shipping Fee
              </span>

              <span
                className="
                  text-sm
                  text-neutral-900
                "
              >
                {order.shippingType === "INTERNATIONAL" &&
                order.shippingQuoteStatus === "PENDING"
                  ? "To be confirmed"
                  : formatAmount(
                      order.shippingFee
                    )}
              </span>

            </div>


            {order.payment?.paymentMethodType === "PAYPAL" && (

              <div
                className="
                  flex
                  justify-between
                  gap-5
                "
              >

                <span
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  PayPal Fee
                </span>

                <span
                  className="
                    text-sm
                    text-neutral-900
                  "
                >
                  {formatAmount(
                    order.paypalFee
                  )}
                </span>

              </div>

            )}


            <div
              className="
                border-t
                border-neutral-200
                pt-4
              "
            >

              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-5
                "
              >

                <span
                  className="
                    font-medium
                    text-neutral-700
                  "
                >
                  Total
                </span>

                <span
                  className="
                    text-2xl
                    font-semibold
                    text-neutral-900
                  "
                >
                  {formatAmount(
                    order.finalAmount
                  )}
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>


      {/* ====================================================== */}
      {/* ORDER ITEMS */}
      {/* ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
        "
      >

        <div
          className="
            border-b
            border-neutral-200
            p-4
            sm:p-6
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            Order Items
          </p>

        </div>


        <div
          className="
            divide-y
            divide-neutral-100
          "
        >

{order.items.map(
  (item) => {

    const productImage =
      item.product?.images?.[0]?.url ??
      null;


    return (

      <div
        key={item.id}
        className="
          flex
          flex-col
          gap-5
          p-4
          sm:p-6
          md:flex-row
          md:items-start
          md:justify-between
        "
      >
                  {/* ================================================= */}
                  {/* PRODUCT INFORMATION */}
                  {/* ================================================= */}

                  <div
                    className="
                      flex
                      min-w-0
                      flex-1
                      gap-4
                      sm:gap-5
                    "
                  >

                    {/* PRODUCT IMAGE */}

                    <div
                      className="
                        relative
                        h-24
                        w-24
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        border-neutral-200
                        bg-neutral-50
                        sm:h-28
                        sm:w-28
                      "
                    >

                      {productImage ? (

                        <Image
                          src={productImage}
                          alt={item.productName}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />

                      ) : (

                        <div
                          className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            text-neutral-300
                          "
                        >
                          <FileImage className="h-7 w-7" />
                        </div>

                      )}

                    </div>


                    {/* PRODUCT DETAILS */}

                    <div className="min-w-0 flex-1">

                      <p
                        className="
                          break-words
                          font-medium
                          text-neutral-900
                        "
                      >
                        {item.productName}
                      </p>


                      <p
                        className="
                          mt-1
                          break-words
                          text-sm
                          text-neutral-500
                        "
                      >
                        {item.brand}

                        {item.sku
                          ? ` · ${item.sku}`
                          : ""}
                      </p>


                      <div
                        className="
                          mt-4
                          space-y-1
                          text-sm
                          text-neutral-500
                        "
                      >

                        {item.color && (
                          <p>
                            Color: {item.color}
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


                        {item.packaging && (
                          <p>
                            Packaging: {item.packaging}
                          </p>
                        )}


                        <p>
                          Quantity: {item.quantity}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* ================================================= */}
                  {/* ITEM FINANCIALS */}
                  {/* ================================================= */}

                  <div
                    className="
                      w-full
                      shrink-0
                      rounded-xl
                      bg-neutral-50
                      p-4
                      md:w-[230px]
                      md:p-5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                    >

                      <span
                        className="
                          text-xs
                          uppercase
                          tracking-[0.12em]
                          text-neutral-400
                        "
                      >
                        Unit Price
                      </span>

                      <span
                        className="
                          text-sm
                          font-medium
                          text-neutral-900
                        "
                      >
                        {formatAmount(
                          item.unitPrice
                        )}
                      </span>

                    </div>


                    <div
                      className="
                        mt-4
                        space-y-3
                        border-t
                        border-neutral-200
                        pt-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >

                        <span
                          className="text-xs text-neutral-400"
                        >
                          Unit Cost
                        </span>

                        <span
                          className="text-sm text-neutral-700"
                        >
                          {item.unitCost !== null
                            ? formatAmount(
                                item.unitCost
                              )
                            : "—"}
                        </span>

                      </div>


                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >

                        <span
                          className="text-xs text-neutral-400"
                        >
                          Total Cost
                        </span>

                        <span
                          className="text-sm text-neutral-700"
                        >
                          {item.totalCost !== null
                            ? formatAmount(
                                item.totalCost
                              )
                            : "—"}
                        </span>

                      </div>


                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          border-t
                          border-neutral-200
                          pt-3
                        "
                      >

                        <span
                          className="text-xs text-neutral-400"
                        >
                          Profit
                        </span>

                        <span
                          className={`
                            text-sm
                            font-semibold
                            ${
                              item.profit !== null
                                ? item.profit >= 0
                                  ? "text-emerald-600"
                                  : "text-red-600"
                                : "text-neutral-400"
                            }
                          `}
                        >
                          {item.profit !== null
                            ? formatAmount(
                                item.profit
                              )
                            : "—"}
                        </span>

                      </div>

                    </div>


                    <div
                      className="
                        mt-4
                        border-t
                        border-neutral-200
                        pt-4
                      "
                    >

                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-[0.12em]
                          text-neutral-400
                        "
                      >
                        Total Sales
                      </p>

                      <p
                        className="
                          mt-1
                          text-lg
                          font-semibold
                          text-neutral-900
                        "
                      >
                        {formatAmount(
                          item.totalPrice
                        )}
                      </p>

                    </div>

                  </div>

                </div>

              );

            }
          )}

        </div>

      </section>


      {/* ====================================================== */}
      {/* ORDER PROFITABILITY */}
      {/* ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-2
            md:flex-row
            md:items-end
            md:justify-between
          "
        >

          <div>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-neutral-400
              "
            >
              Financials
            </p>


            <h2
              className="
                mt-2
                text-xl
                font-semibold
                text-neutral-900
              "
            >
              Order Profitability
            </h2>


            <p
              className="
                mt-2
                text-sm
                text-neutral-500
              "
            >
              Internal sales, cost and profit snapshot.
            </p>

          </div>

        </div>


        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
            sm:mt-8
            sm:gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >


          {/* ================================================== */}
          {/* SALES */}
          {/* ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-neutral-50
              p-4
              sm:p-5
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
              Total Sales
            </p>


            <p
              className="
                mt-2
                text-xl
                font-semibold
                sm:mt-3
                sm:text-2xl
                text-neutral-900
              "
            >
              {formatAmount(
                order.finalAmount
              )}
            </p>

          </div>


          {/* ================================================== */}
          {/* COST */}
          {/* ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-neutral-50
              p-4
              sm:p-5
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
              Total Cost
            </p>


            <p
              className="
                mt-2
                text-xl
                font-semibold
                sm:mt-3
                sm:text-2xl
                text-neutral-900
              "
            >
              {totalCost !== null
                ? formatAmount(
                    totalCost
                  )
                : "—"}
            </p>

          </div>


          {/* ================================================== */}
          {/* PROFIT */}
          {/* ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-neutral-50
              p-4
              sm:p-5
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
              Profit
            </p>


            <p
              className={`
                mt-2
                text-xl
                font-semibold
                sm:mt-3
                sm:text-2xl
                ${
                  totalProfit !== null
                    ? totalProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                    : "text-neutral-400"
                }
              `}
            >
              {totalProfit !== null
                ? formatAmount(
                    totalProfit
                  )
                : "—"}
            </p>

          </div>


          {/* ================================================== */}
          {/* MARGIN */}
          {/* ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-neutral-50
              p-4
              sm:p-5
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
              Margin
            </p>


            <p
              className="
                mt-2
                text-xl
                font-semibold
                sm:mt-3
                sm:text-2xl
                text-neutral-900
              "
            >
              {margin !== null
                ? `${margin.toFixed(1)}%`
                : "—"}
            </p>

          </div>

        </div>


        {!hasCompleteCostData && (

          <div
            className="
              mt-5
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              px-4
              py-3
              text-xs
              leading-5
              sm:px-5
              sm:py-4
              sm:text-sm
              text-amber-700
            "
          >
            Cost and profit data is unavailable for
            one or more items in this order.
          </div>

        )}

      </section>


      {/* ====================================================== */}
      {/* PAYMENT */}
      {/* ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-start
            md:justify-between
          "
        >

          <div>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-neutral-400
              "
            >
              Payment
            </p>


            <h2
              className="
                mt-2
                text-xl
                font-semibold
                text-neutral-900
              "
            >
              {order.payment
                ?.paymentMethodName ??
                "No Payment Method"}
            </h2>


            {order.payment && (

              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                "
              >
                {order.payment.paymentMethodType ===
                "BANK_TRANSFER"
                  ? "Bank Transfer"
                  : order.payment.paymentMethodType ===
                    "QR"
                    ? "QR Payment"
                    : order.payment.paymentMethodType ===
                      "PAYPAL"
                      ? "PayPal"
                      : order.payment.paymentMethodType ===
                        "WISE"
                        ? "Wise"
                        : order.payment.paymentMethodType}
              </p>

            )}

          </div>


          {order.payment && (

            <span
              className={`
                inline-flex
                w-fit
                rounded-full
                border
                px-3
                py-1.5
                text-[10px]
                font-medium
                sm:px-4
                sm:py-2
                sm:text-xs
                uppercase
                tracking-[0.12em]
                ${getStatusClass(
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


        {/* ==================================================== */}
        {/* PAYMENT METHOD DETAILS */}
        {/* ==================================================== */}

        {order.payment && (

          <div
            className="
              mt-8
              grid
              gap-4
              border-t
              border-neutral-200
              pt-8
              md:grid-cols-2
            "
          >

            {order.payment.bankName && (

              <div
                className="
                  rounded-xl
                  bg-neutral-50
                  p-4
                  sm:p-5
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
                  Bank
                </p>

                <p
                  className="
                    mt-2
                    break-words
                    font-medium
                    text-neutral-900
                  "
                >
                  {order.payment.bankName}
                </p>

              </div>

            )}


            {order.payment.accountName && (

              <div
                className="
                  rounded-xl
                  bg-neutral-50
                  p-4
                  sm:p-5
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
                  Account Name
                </p>

                <p
                  className="
                    mt-2
                    break-words
                    font-medium
                    text-neutral-900
                  "
                >
                  {order.payment.accountName}
                </p>

              </div>

            )}


            {order.payment.accountNumber && (

              <div
                className="
                  rounded-xl
                  bg-neutral-50
                  p-4
                  sm:p-5
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
                  Account Number
                </p>

                <p
                  className="
                    mt-2
                    font-mono
                    font-medium
                    text-neutral-900
                  "
                >
                  {order.payment.accountNumber}
                </p>

              </div>

            )}


            <div
              className="
                rounded-xl
                bg-neutral-50
                p-5
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
                Payment Amount
              </p>

              <p
                className="
                  mt-2
                  text-lg
                  font-semibold
                  text-neutral-900
                "
              >
                {formatAmount(
                  order.payment.amount
                )}
              </p>

              {order.payment.paymentMethodType === "PAYPAL" && (
                <p
                  className="
                    mt-1
                    text-xs
                    text-neutral-500
                  "
                >
                  Includes PayPal Fee of{" "}
                  {formatAmount(order.paypalFee)}
                </p>
              )}

            </div>

          </div>

        )}


        {/* ==================================================== */}
        {/* PAYMENT PROOF */}
        {/* ==================================================== */}

        <div
          className="
            mt-6
            border-t
            border-neutral-200
            pt-6
            sm:mt-8
            sm:pt-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <FileImage
              className="
                h-5
                w-5
                text-neutral-500
              "
            />

            <div>

              <p
                className="
                  font-medium
                  text-neutral-900
                "
              >
                Payment Proof
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-neutral-500
                "
              >
                Customer payment receipt.
              </p>

            </div>

          </div>


          {order.payment?.proofUrl ? (

            <div
              className="
                mt-5
                sm:mt-6
              "
            >

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-neutral-50
                "
              >

                <Image
                  src={
                    order.payment.proofUrl
                  }
                  alt={`Payment proof for order #${order.id}`}
                  width={1200}
                  height={1200}
                  className="
                    max-h-[420px]
                    w-full
                    object-contain
                    sm:max-h-[700px]
                  "
                />

              </div>


              <a
                href={
                  order.payment.proofUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-4
                  inline-flex
                  max-w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-neutral-300
                  px-3
                  py-2.5
                  text-xs
                  sm:px-4
                  sm:text-sm
                  transition
                  hover:bg-neutral-100
                "
              >

                <ExternalLink
                  className="h-4 w-4"
                />

                Open Full Image

              </a>

            </div>

          ) : (

            <div
              className="
                mt-6
                rounded-xl
                bg-neutral-50
                p-6
                text-center
                sm:p-8
              "
            >

              <FileImage
                className="
                  mx-auto
                  h-8
                  w-8
                  text-neutral-300
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                No Payment Proof
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-neutral-400
                "
              >
                The customer has not uploaded a
                payment receipt yet.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ====================================================== */}
      {/* PAYMENT REVIEW */}
      {/* ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-6
        "
      >

        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-neutral-400
          "
        >
          Payment Review
        </p>


        <h2
          className="
            mt-2
            text-xl
            font-semibold
            text-neutral-900
          "
        >
          Review Customer Payment
        </h2>


        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            leading-6
            text-neutral-500
          "
        >
          Review the payment proof submitted by
          the customer before confirming the payment.
        </p>


        <div
          className="
            mt-5
            sm:mt-6
          "
        >

          {order.payment ? (

            <PaymentReviewActions
              orderId={order.id}
              paymentStatus={
                order.payment.status
              }
              hasProof={
                Boolean(
                  order.payment.proofUrl
                )
              }
              adminNote={
                order.payment.adminNote
              }
            />

          ) : (

            <div
              className="
                rounded-xl
                bg-neutral-50
                p-5
                text-sm
                text-neutral-500
              "
            >
              No payment record is associated
              with this order.
            </div>

          )}

        </div>

      </section>


      {/* ====================================================== */}
      {/* ORDER FULFILLMENT */}
      {/* ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-6
        "
      >

        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-neutral-400
          "
        >
          Order Fulfillment
        </p>


        <h2
          className="
            mt-2
            text-xl
            font-semibold
            text-neutral-900
          "
        >
          Manage Order
        </h2>


        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            leading-6
            text-neutral-500
          "
        >
          Manage the order after payment has been verified.
        </p>


        <div
          className="
            mt-5
            sm:mt-6
          "
        >

          <OrderFulfillmentActions
            orderId={order.id}
            status={order.status}
            shippingCourier={
              order.shippingCourier
            }
            trackingNumber={
              order.trackingNumber
            }
          />

        </div>

      </section>


      {/* ====================================================== */}
      {/* SHIPPING INFORMATION */}
      {/* ====================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-6
        "
      >

        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-neutral-400
          "
        >
          Shipping
        </p>


        <h2
          className="
            mt-2
            text-xl
            font-semibold
            text-neutral-900
          "
        >
          Shipping Information
        </h2>


        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            leading-6
            text-neutral-500
          "
        >
          {order.shippingType === "INTERNATIONAL"
            ? "International shipping fee must be confirmed before the customer can complete payment."
            : "Add the ABX Express tracking number after the order enters processing."}
        </p>


        <div
          className="
            mt-5
            sm:mt-6
          "
        >

          {order.shippingType === "INTERNATIONAL" ? (

            <div
              className="
                rounded-xl
                border
                border-amber-200
                bg-amber-50
                p-5
              "
            >

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-amber-700
                "
              >
                International Shipping
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-amber-800
                "
              >
                {order.shippingQuoteStatus === "QUOTED"
                  ? "Shipping fee has been quoted. The customer can proceed with payment once the payment flow is available."
                  : "Shipping fee is pending. Please provide the international shipping quote before the customer proceeds with payment."}
              </p>

              {order.shippingCountry && (
                <p
                  className="
                    mt-3
                    text-sm
                    font-medium
                    text-amber-900
                  "
                >
                  Destination: {order.shippingCountry}
                </p>
              )}

              {order.shippingQuoteStatus === "QUOTED" && (
                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-amber-900
                  "
                >
                  Shipping Fee: {formatAmount(order.shippingFee)}
                </p>
              )}

              <InternationalShippingQuoteForm
                orderId={order.id}
                currentFee={Number(order.shippingFee)}
                quoteStatus={
                  order.shippingQuoteStatus === "QUOTED"
                    ? "QUOTED"
                    : "PENDING"
                }
              />

            </div>

          ) : order.status === "PROCESSING" ||
          order.status === "SHIPPED" ? (

            <ShippingInformationForm
              orderId={order.id}
              status={order.status}
              shippingCourier={
                order.shippingCourier
              }
              trackingNumber={
                order.trackingNumber
              }
              trackingUrl={
                order.trackingUrl
              }
            />

          ) : (

            <div
              className="
                rounded-xl
                bg-neutral-50
                p-5
              "
            >

              {order.shippingCourier &&
              order.trackingNumber ? (

                <div
                  className="
                    space-y-4
                  "
                >

                  <div className="min-w-0">

                    <p
                      className="
                        text-xs
                        text-neutral-400
                      "
                    >
                      Shipping Method
                    </p>

                    <p
                      className="
                        mt-1
                        font-medium
                        text-neutral-900
                      "
                    >
                      {order.shippingCourier}
                    </p>

                  </div>


                  <div className="min-w-0">

                    <p
                      className="
                        text-xs
                        text-neutral-400
                      "
                    >
                      Tracking Number
                    </p>

                    <p
                      className="
                        mt-1
                        font-mono
                        font-medium
                        text-neutral-900
                      "
                    >
                      {order.trackingNumber}
                    </p>

                  </div>


                  {order.trackingUrl && (

                    <div className="min-w-0">

                      <p
                        className="
                          text-xs
                          text-neutral-400
                        "
                      >
                        Tracking URL
                      </p>

                      <a
                        href={
                          order.trackingUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          mt-1
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-medium
                          text-neutral-900
                          underline
                          underline-offset-4
                          hover:text-neutral-500
                        "
                      >

                        Open Tracking Page

                        <ExternalLink
                          className="h-4 w-4"
                        />

                      </a>

                    </div>

                  )}

                </div>

              ) : (

                <p
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  Shipping information can be added
                  when the order is moved to Processing.
                </p>

              )}

            </div>

          )}

        </div>

      </section>


    </main>

  );

}