"use client";

import Link from "next/link";

import {
  ExternalLink,
  Truck,
  X,
  Check,
  Eye,
  Loader2,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";


// ============================================================
// ORDER TYPE
// ============================================================

type Order = {
  id: number;

  customerName: string;

  customerPhone: string;

  customerEmail: string | null;

  finalAmount: number;

  status: string;

  createdAt: Date;

  shippingCourier: string | null;

  trackingNumber: string | null;

  trackingUrl: string | null;

  items: {
    id: number;

    productName: string;

    quantity: number;

    totalPrice: number;
    unitPrice: number;
    unitCost: number | null;
    totalCost: number | null;
    profit: number | null;
  }[];

  payment: {
    id: number;

    paymentMethodName: string;

    paymentMethodType:
      | "BANK_TRANSFER"
      | "QR";

    amount: number;

    status:
      | "PENDING"
      | "SUBMITTED"
      | "VERIFIED"
      | "REJECTED";

    proofUrl: string | null;

    proofPublicId: string | null;

    verifiedAt: Date | null;

    verifiedBy: number | null;

    adminNote: string | null;

  } | null;
};


// ============================================================
// PROPS
// ============================================================

type OrderGridProps = {
  orders: Order[];
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
    }
  ).format(
    new Date(date)
  );

}


// ============================================================
// ORDER STATUS
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
// PAYMENT STATUS
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

      return `
        border-amber-200
        bg-amber-50
        text-amber-700
      `;


    case "PAID":
    case "VERIFIED":
    case "COMPLETED":

      return `
        border-emerald-200
        bg-emerald-50
        text-emerald-700
      `;


    case "PROCESSING":

      return `
        border-blue-200
        bg-blue-50
        text-blue-700
      `;


    case "SHIPPED":

      return `
        border-violet-200
        bg-violet-50
        text-violet-700
      `;


    case "CANCELLED":
    case "REJECTED":

      return `
        border-red-200
        bg-red-50
        text-red-700
      `;


    default:

      return `
        border-neutral-200
        bg-neutral-50
        text-neutral-600
      `;

  }

}


// ============================================================
// ORDER FINANCIALS
// ============================================================

function getOrderCost(order: Order) {

  if (order.items.some((item) => item.totalCost === null)) {
    return null;
  }

  return order.items.reduce(
    (total, item) => total + (item.totalCost ?? 0),
    0
  );
}

function getOrderProfit(order: Order) {

  const cost = getOrderCost(order);

  if (cost === null) {
    return null;
  }

  return order.finalAmount - cost;
}

function getOrderMargin(order: Order) {

  const profit = getOrderProfit(order);

  if (profit === null || order.finalAmount <= 0) {
    return null;
  }

  return (profit / order.finalAmount) * 100;
}


// ============================================================
// COMPONENT
// ============================================================

export default function OrderGrid({
  orders,
}: OrderGridProps) {

  const router =
    useRouter();


  const [
    selectedPayment,
    setSelectedPayment,
  ] = useState<{
    orderId: number;

    customerName: string;

    payment: NonNullable<
      Order["payment"]
    >;
  } | null>(null);


  const [
    adminNote,
    setAdminNote,
  ] = useState("");


  const [
    actionLoading,
    setActionLoading,
  ] = useState<
    "VERIFY" | "REJECT" | null
  >(null);


  const [
    actionError,
    setActionError,
  ] = useState<
    string | null
  >(null);


  // ==========================================================
  // OPEN PAYMENT REVIEW
  // ==========================================================

  function openPaymentReview(
    order: Order
  ) {

    if (!order.payment) {
      return;
    }


    setSelectedPayment({

      orderId:
        order.id,

      customerName:
        order.customerName,

      payment:
        order.payment,

    });


    setAdminNote(
      order.payment.adminNote ??
        ""
    );


    setActionError(
      null
    );

  }


  // ==========================================================
  // CLOSE PAYMENT REVIEW
  // ==========================================================

  function closePaymentReview() {

    if (
      actionLoading
    ) {
      return;
    }


    setSelectedPayment(
      null
    );


    setAdminNote(
      ""
    );


    setActionError(
      null
    );

  }


  // ==========================================================
  // REVIEW PAYMENT
  // ==========================================================

  async function reviewPayment(
    action:
      | "VERIFY"
      | "REJECT"
  ) {

    if (
      !selectedPayment
    ) {
      return;
    }


    // --------------------------------------------------------
    // REJECT NOTE REQUIRED
    // --------------------------------------------------------

    if (
      action === "REJECT" &&
      !adminNote.trim()
    ) {

      setActionError(
        "Please provide a reason for rejecting this payment."
      );

      return;

    }


    setActionLoading(
      action
    );


    setActionError(
      null
    );


    try {

      const response =
        await fetch(
          `/api/admin/payments/${selectedPayment.payment.id}/review`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              action,

              adminNote:
                adminNote.trim(),

            }),

          }
        );


      const data =
        await response.json();


      if (
        !response.ok
      ) {

        throw new Error(
          data?.error ??
            "Unable to review payment."
        );

      }


      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      setSelectedPayment(
        null
      );


      setAdminNote(
        ""
      );


      setActionError(
        null
      );


      router.refresh();


    } catch (
      error
    ) {

      console.error(
        "Payment review error:",
        error
      );


      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to review payment."
      );


    } finally {

      setActionLoading(
        null
      );

    }

  }


  // ==========================================================
  // NO ORDERS
  // ==========================================================

  if (
    orders.length === 0
  ) {

    return (
      <div className="py-20 text-center">

        <p
          className="
            text-sm
            font-medium
            text-neutral-700
          "
        >
          No orders found.
        </p>


        <p
          className="
            mt-2
            text-sm
            text-neutral-400
          "
        >
          Orders will appear here once customers
          place them.
        </p>

      </div>
    );

  }


  // ==========================================================
  // GRID
  // ==========================================================

  return (
    <>
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:gap-5
          md:grid-cols-2
          md:gap-6
          xl:grid-cols-3
        "
      >

        {orders.map(
          (order) => (

            <div
              key={order.id}
              className="
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-neutral-200
                bg-white
                p-4
                transition
                sm:p-5
                lg:p-6
                hover:border-neutral-300
                hover:shadow-sm
              "
            >

              {/* ==============================================
                  HEADER
                  ============================================== */}

              <div
                className="
                  flex
                  min-w-0
                  items-start
                  justify-between
                  gap-3
                  sm:gap-4
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-[0.2em]
                      text-neutral-400
                    "
                  >
                    Order
                  </p>


                  <Link
                    href={`/admin/dashboard/orders/${order.id}`}
                    className="
                      mt-1
                      block
                      truncate
                      text-lg
                      font-semibold
                      sm:text-xl
                      text-neutral-900
                      hover:underline
                    "
                  >
                    #{order.id}
                  </Link>

                </div>


                <span
                  className={`
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    ${getStatusClass(
                      order.status
                    )}
                  `}
                >

                  {getOrderStatusLabel(
                    order.status
                  )}

                </span>

              </div>


              {/* ==============================================
                  CUSTOMER
                  ============================================== */}

              <div className="mt-5 sm:mt-6">

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.15em]
                    text-neutral-400
                  "
                >
                  Customer
                </p>


                <p
                  className="
                    mt-1.5
                    truncate
                    font-medium
                    text-neutral-900
                    sm:mt-2
                  "
                >
                  {order.customerName}
                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    text-neutral-500
                  "
                >
                  {order.customerPhone}
                </p>

              </div>


              {/* ==============================================
                  PAYMENT
                  ============================================== */}

              <div
                className="
                  mt-5
                  border-t
                  border-neutral-100
                  pt-4
                  sm:mt-6
                  sm:pt-5
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
                  Payment
                </p>


                {order.payment ? (

                  <div className="mt-2">

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <div>

                        <p
                          className="
                            text-sm
                            font-medium
                            text-neutral-900
                          "
                        >
                          {
                            order.payment
                              .paymentMethodName
                          }
                        </p>


                        <p
                          className="
                            mt-1
                            text-xs
                            text-neutral-400
                          "
                        >
                          Amount ·{" "}
                          {formatAmount(
                            order.payment.amount
                          )}
                        </p>

                      </div>


                      <span
                        className={`
                          inline-flex
                          shrink-0
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-[10px]
                          font-medium
                          uppercase
                          tracking-[0.1em]
                          ${getStatusClass(
                            order.payment.status
                          )}
                        `}
                      >

                        {
                          getPaymentStatusLabel(
                            order.payment.status
                          )
                        }

                      </span>

                    </div>


                    {/* ========================================
                        PAYMENT RECEIPT
                        ======================================== */}

                    {order.payment.proofUrl && (

                      <button
                        type="button"
                        onClick={() =>
                          openPaymentReview(
                            order
                          )
                        }
                        className="
                          mt-3
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          font-medium
                          text-neutral-700
                          hover:text-black
                          hover:underline
                        "
                      >

                        <Eye
                          className="
                            h-3.5
                            w-3.5
                          "
                        />

                        View Receipt

                      </button>

                    )}


                    {/* ========================================
                        REVIEW PAYMENT
                        ======================================== */}

                    {order.payment.status ===
                      "SUBMITTED" && (

                      <button
                        type="button"
                        onClick={() =>
                          openPaymentReview(
                            order
                          )
                        }
                        className="
                          mt-3
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-black
                          px-4
                          py-3
                          text-xs
                          font-medium
                          text-white
                          transition
                          hover:bg-neutral-800
                        "
                      >

                        <Eye
                          className="
                            h-3.5
                            w-3.5
                          "
                        />

                        Review Payment

                      </button>

                    )}

                  </div>

                ) : (

                  <p
                    className="
                      mt-2
                      text-sm
                      text-neutral-400
                    "
                  >
                    No payment information
                  </p>

                )}

              </div>


              {/* ==============================================
                  ITEMS + TOTAL
                  ============================================== */}

              <div
                className="
                  mt-5
                  border-t
                  border-neutral-100
                  pt-4
                  sm:mt-6
                  sm:pt-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-[0.15em]
                        text-neutral-400
                      "
                    >
                      Items
                    </p>


                    <p
                      className="
                        mt-2
                        text-sm
                        text-neutral-700
                      "
                    >

                      {order.items.reduce(
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


                  <div className="text-right">

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-[0.15em]
                        text-neutral-400
                      "
                    >
                      Total
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
                        order.finalAmount
                      )}
                    </p>

                  </div>

                </div>

              </div>


              {/* ==============================================
                  PROFITABILITY
                  ============================================== */}

              <div
                className="
                  mt-5
                  border-t
                  border-neutral-100
                  pt-4
                  sm:mt-6
                  sm:pt-5
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
                  Profitability
                </p>


                <div
                  className="
                    mt-3
                    grid
                    grid-cols-3
                    gap-3
                  "
                >

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-400">
                      Cost
                    </p>
                    <p className="mt-1 truncate text-xs font-medium text-neutral-900 sm:text-sm">
                      {getOrderCost(order) === null
                        ? "—"
                        : formatAmount(getOrderCost(order) ?? 0)}
                    </p>
                  </div>


                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-400">
                      Profit
                    </p>
                    <p className="mt-1 truncate text-xs font-medium text-emerald-700 sm:text-sm">
                      {getOrderProfit(order) === null
                        ? "—"
                        : formatAmount(getOrderProfit(order) ?? 0)}
                    </p>
                  </div>


                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-400">
                      Margin
                    </p>
                    <p className="mt-1 truncate text-xs font-medium text-neutral-900 sm:text-sm">
                      {getOrderMargin(order) === null
                        ? "—"
                        : `${getOrderMargin(order)?.toFixed(1)}%`}
                    </p>
                  </div>

                </div>

              </div>


              {/* ==============================================
                  SHIPPING
                  ============================================== */}

              <div
                className="
                  mt-5
                  border-t
                  border-neutral-100
                  pt-4
                  sm:mt-6
                  sm:pt-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Truck
                    className="
                      h-4
                      w-4
                      text-neutral-400
                    "
                  />


                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-[0.15em]
                      text-neutral-400
                    "
                  >
                    Shipping
                  </p>

                </div>


                {order.shippingCourier &&
                order.trackingNumber ? (

                  <div className="mt-3">

                    <p
                      className="
                        text-sm
                        font-medium
                        text-neutral-900
                      "
                    >
                      {order.shippingCourier}
                    </p>


                    <p
                      className="
                        mt-1
                        font-mono
                        text-xs
                        text-neutral-500
                      "
                    >
                      {order.trackingNumber}
                    </p>


                    {order.trackingUrl && (

                      <a
                        href={
                          order.trackingUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          mt-3
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          font-medium
                          text-neutral-700
                          hover:text-black
                          hover:underline
                        "
                      >

                        Track Shipment

                        <ExternalLink
                          className="
                            h-3.5
                            w-3.5
                          "
                        />

                      </a>

                    )}

                  </div>

                ) : (

                  <p
                    className="
                      mt-3
                      text-sm
                      text-neutral-400
                    "
                  >

                    {order.status ===
                    "PROCESSING"

                      ? "Shipping information pending"

                      : order.status ===
                        "SHIPPED"

                        ? "Shipping information incomplete"

                        : "Not shipped"}

                  </p>

                )}

              </div>


              {/* ==============================================
                  FOOTER
                  ============================================== */}

              <div
                className="
                  mt-5
                  flex
                  min-w-0
                  items-center
                  justify-between
                  gap-3
                  border-t
                  border-neutral-100
                  pt-4
                  sm:mt-6
                  sm:pt-5
                "
              >

                <p
                  className="
                    text-xs
                    text-neutral-400
                  "
                >
                  {formatDate(
                    order.createdAt
                  )}
                </p>


                <Link
                  href={`/admin/dashboard/orders/${order.id}`}
                  className="
                    rounded-lg
                    border
                    border-neutral-300
                    shrink-0
                    px-3
                    py-2
                    text-xs
                    transition
                    hover:bg-neutral-100
                    sm:px-4
                    sm:text-sm
                  "
                >
                  View Order
                </Link>

              </div>

            </div>

          )
        )}

      </div>


      {/* ======================================================
          PAYMENT REVIEW MODAL
          ====================================================== */}

      {selectedPayment && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closePaymentReview();

            }

          }}
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-3xl
              bg-white
              shadow-2xl
            "
          >

            {/* ================================================
                HEADER
                ================================================ */}

            <div
              className="
                flex
                items-start
                justify-between
                border-b
                border-neutral-200
                px-6
                py-5
                sm:px-8
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.3em]
                    text-neutral-400
                  "
                >
                  PAYMENT REVIEW
                </p>


                <h2
                  className="
                    mt-2
                    text-2xl
                    font-light
                    text-neutral-900
                  "
                >
                  Order #{selectedPayment.orderId}
                </h2>


                <p
                  className="
                    mt-1
                    text-sm
                    text-neutral-500
                  "
                >
                  {
                    selectedPayment.customerName
                  }
                </p>

              </div>


              <button
                type="button"
                onClick={
                  closePaymentReview
                }
                disabled={
                  actionLoading !== null
                }
                className="
                  rounded-full
                  p-2
                  text-neutral-400
                  transition
                  hover:bg-neutral-100
                  hover:text-neutral-900
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <X
                  className="
                    h-5
                    w-5
                  "
                />

              </button>

            </div>


            {/* ================================================
                CONTENT
                ================================================ */}

            <div
              className="
                space-y-6
                px-6
                py-6
                sm:px-8
              "
            >

              {/* ==============================================
                  PAYMENT INFO
                  ============================================== */}

              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                "
              >

                <div
                  className="
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    p-4
                  "
                >

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      text-neutral-400
                    "
                  >
                    Payment Method
                  </p>


                  <p
                    className="
                      mt-2
                      text-sm
                      font-medium
                      text-neutral-900
                    "
                  >
                    {
                      selectedPayment
                        .payment
                        .paymentMethodName
                    }
                  </p>

                </div>


                <div
                  className="
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    p-4
                  "
                >

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      text-neutral-400
                    "
                  >
                    Amount
                  </p>


                  <p
                    className="
                      mt-2
                      text-sm
                      font-semibold
                      tabular-nums
                      text-neutral-900
                    "
                  >
                    {formatAmount(
                      selectedPayment
                        .payment
                        .amount
                    )}
                  </p>

                </div>

              </div>


              {/* ==============================================
                  STATUS
                  ============================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  border-neutral-200
                  p-4
                "
              >

                <div>

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      text-neutral-400
                    "
                  >
                    Current Status
                  </p>


                  <p
                    className="
                      mt-2
                      text-sm
                      font-medium
                      text-neutral-900
                    "
                  >
                    {
                      getPaymentStatusLabel(
                        selectedPayment
                          .payment
                          .status
                      )
                    }
                  </p>

                </div>


                <span
                  className={`
                    inline-flex
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    ${getStatusClass(
                      selectedPayment
                        .payment
                        .status
                    )}
                  `}
                >
                  {
                    getPaymentStatusLabel(
                      selectedPayment
                        .payment
                        .status
                    )
                  }
                </span>

              </div>


              {/* ==============================================
                  RECEIPT
                  ============================================== */}

              {selectedPayment.payment.proofUrl ? (

                <div>

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.3em]
                      text-neutral-400
                    "
                  >
                    Payment Receipt
                  </p>


                  <div
                    className="
                      mt-4
                      overflow-hidden
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-neutral-50
                    "
                  >

                    <img
                      src={
                        selectedPayment
                          .payment
                          .proofUrl
                      }
                      alt="Payment receipt"
                      className="
                        max-h-[520px]
                        w-full
                        object-contain
                      "
                    />

                  </div>


                  <a
                    href={
                      selectedPayment
                        .payment
                        .proofUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-2
                      text-xs
                      font-medium
                      text-neutral-600
                      hover:text-black
                      hover:underline
                    "
                  >

                    Open Full Receipt

                    <ExternalLink
                      className="
                        h-3.5
                        w-3.5
                      "
                    />

                  </a>

                </div>

              ) : (

                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-neutral-300
                    bg-neutral-50
                    px-6
                    py-12
                    text-center
                  "
                >

                  <p
                    className="
                      text-sm
                      font-medium
                      text-neutral-700
                    "
                  >
                    No payment receipt uploaded.
                  </p>


                  <p
                    className="
                      mt-2
                      text-xs
                      text-neutral-400
                    "
                  >
                    The customer has not submitted
                    a payment proof.
                  </p>

                </div>

              )}


              {/* ==============================================
                  ADMIN NOTE
                  ============================================== */}

              <div>

                <label
                  htmlFor="grid-payment-admin-note"
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.3em]
                    text-neutral-400
                  "
                >
                  Admin Note
                </label>


                <textarea
                  id="grid-payment-admin-note"
                  value={
                    adminNote
                  }
                  onChange={(event) =>
                    setAdminNote(
                      event.target.value
                    )
                  }
                  disabled={
                    actionLoading !== null
                  }
                  rows={4}
                  placeholder="Add a note or rejection reason..."
                  className="
                    mt-3
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-neutral-900
                    outline-none
                    transition
                    placeholder:text-neutral-300
                    focus:border-neutral-400
                    disabled:cursor-not-allowed
                    disabled:bg-neutral-50
                  "
                />

              </div>


              {/* ==============================================
                  ERROR
                  ============================================== */}

              {actionError && (

                <div
                  className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    leading-6
                    text-red-700
                  "
                >
                  {
                    actionError
                  }
                </div>

              )}

            </div>


            {/* ================================================
                FOOTER
                ================================================ */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-neutral-200
                px-6
                py-5
                sm:flex-row
                sm:justify-end
                sm:px-8
              "
            >

              <button
                type="button"
                onClick={
                  closePaymentReview
                }
                disabled={
                  actionLoading !== null
                }
                className="
                  rounded-full
                  border
                  border-neutral-300
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-neutral-700
                  transition
                  hover:bg-neutral-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>


              {/* ============================================
                  REJECT
                  ============================================ */}

              <button
                type="button"
                onClick={() =>
                  reviewPayment(
                    "REJECT"
                  )
                }
                disabled={
                  actionLoading !== null ||
                  selectedPayment
                    .payment
                    .status !==
                    "SUBMITTED"
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-red-200
                  bg-red-50
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-red-700
                  transition
                  hover:bg-red-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {actionLoading ===
                "REJECT" ? (

                  <>
                    <Loader2
                      className="
                        h-4
                        w-4
                        animate-spin
                      "
                    />

                    Rejecting...

                  </>

                ) : (

                  <>
                    <X
                      className="
                        h-4
                        w-4
                      "
                    />

                    Reject Payment

                  </>

                )}

              </button>


              {/* ============================================
                  VERIFY
                  ============================================ */}

              <button
                type="button"
                onClick={() =>
                  reviewPayment(
                    "VERIFY"
                  )
                }
                disabled={
                  actionLoading !== null ||
                  selectedPayment
                    .payment
                    .status !==
                    "SUBMITTED"
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-black
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-neutral-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {actionLoading ===
                "VERIFY" ? (

                  <>
                    <Loader2
                      className="
                        h-4
                        w-4
                        animate-spin
                      "
                    />

                    Verifying...

                  </>

                ) : (

                  <>
                    <Check
                      className="
                        h-4
                        w-4
                      "
                    />

                    Verify Payment

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}