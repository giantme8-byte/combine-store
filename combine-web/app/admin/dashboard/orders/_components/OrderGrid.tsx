import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Loader2,
  Trash2,
} from "lucide-react";


// ============================================================
// TYPES
// ============================================================

type Order = {

  id: number;

  orderNumber: string | null;

  customerName: string;

  customerPhone: string;

  customerEmail: string | null;

  finalAmount: number;

  paypalFee: number;

  status: string;

  createdAt: Date;

  payment: {

    id: number;

    paymentMethodName: string;

paymentMethodType:
  | "BANK_TRANSFER"
  | "QR"
  | "PAYPAL"
  | "WISE";

    amount: number;

    status:
      | "PENDING"
      | "SUBMITTED"
      | "VERIFIED"
      | "REJECTED";

    bankName: string | null;

    accountName: string | null;

    accountNumber: string | null;

    qrImageUrl: string | null;

    proofUrl: string | null;

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
// HELPERS
// ============================================================

function formatAmount(
  amount: number
) {

  return `RM ${amount.toLocaleString(
    "en-MY",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

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
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);

}


function getStatusClass(
  status: string
) {

  switch (
    status
  ) {

    case "PAID":
    case "COMPLETED":
    case "VERIFIED":

      return `
        bg-green-50
        text-green-700
      `;

    case "PENDING":
    case "PROCESSING":
    case "SUBMITTED":

      return `
        bg-amber-50
        text-amber-700
      `;

    case "CANCELLED":
    case "REJECTED":

      return `
        bg-red-50
        text-red-700
      `;

    default:

      return `
        bg-neutral-100
        text-neutral-700
      `;

  }

}


function getPaymentStatusLabel(
  status:
    | "PENDING"
    | "SUBMITTED"
    | "VERIFIED"
    | "REJECTED"
) {

  switch (
    status
  ) {

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

    orderNumber: string | null;

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
    "VERIFY"
    | "REJECT"
    | null
  >(null);


  const [
    actionError,
    setActionError,
  ] = useState<
    string | null
  >(null);


  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState<number | null>(null);


  const [
    deleteError,
    setDeleteError,
  ] = useState<string | null>(null);


  // ==========================================================
  // DELETE ORDER
  // ==========================================================

  async function deleteOrder(
    order: Order
  ) {

    const orderLabel =
      order.orderNumber ??
      `#${order.id}`;


    const confirmed =
      window.confirm(
        `Delete order ${orderLabel}?\\n\\nThis action cannot be undone.`
      );


    if (!confirmed) {
      return;
    }


    setDeleteLoading(
      order.id
    );

    setDeleteError(
      null
    );


    try {

      const response =
        await fetch(
          `/api/admin/orders/${order.id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.error ??
            "Unable to delete order."
        );

      }


      router.refresh();


    } catch (error) {

      console.error(
        "Delete order error:",
        error
      );

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete order."
      );


    } finally {

      setDeleteLoading(
        null
      );

    }

  }


  // ==========================================================
  // OPEN PAYMENT REVIEW
  // ==========================================================

  function openPaymentReview(
    order: Order
  ) {

    if (
      !order.payment
    ) {

      return;

    }


    setSelectedPayment({

      orderId:
        order.id,

      orderNumber:
        order.orderNumber,

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


    setActionLoading(
      null
    );

  }


  // ==========================================================
  // CLOSE PAYMENT REVIEW
  // ==========================================================

  function closePaymentReview() {

    if (
      actionLoading !== null
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
        "Please enter an admin note before rejecting the payment."
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

            body:
              JSON.stringify({

                action,

                adminNote:
                  adminNote.trim() ||
                  null,

              }),

          }
        );


      const data =
        await response.json();


      if (
        !response.ok
      ) {

        throw new Error(
          data?.error ||
            "Unable to review payment."
        );

      }


      closePaymentReview();


      router.refresh();

    }
    catch (
      error
    ) {

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to review payment."
      );

    }
    finally {

      setActionLoading(
        null
      );

    }

  }


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const summary =
    useMemo(
      () => {

        const total =
          orders.reduce(
            (
              sum,
              order
            ) =>
              sum +
              (order.payment?.status === "VERIFIED"
                ? order.finalAmount
                : 0),
            0
          );


        const pending =
          orders.filter(
            (
              order
            ) =>
              order.status ===
              "PENDING"
          ).length;


        const paid =
          orders.filter(
            (
              order
            ) =>
              order.payment?.status ===
                "VERIFIED"
          ).length;


        return {
          total,
          pending,
          paid,
        };

      },
      [
        orders,
      ]
    );


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <>

      {/* ======================================================
          SUMMARY
          ====================================================== */}

      <div
        className="
          mb-6
          grid
          grid-cols-2
          gap-3
          lg:grid-cols-3
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            sm:p-5
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
            Orders
          </p>


          <p
            className="
              mt-2
              text-2xl
              font-light
              text-neutral-900
            "
          >
            {orders.length}
          </p>

        </div>


        <div
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            sm:p-5
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
            Sales
          </p>


          <p
            className="
              mt-2
              text-2xl
              font-light
              text-neutral-900
            "
          >
            {formatAmount(
              summary.total
            )}
          </p>

        </div>


        <div
          className="
            col-span-2
            rounded-2xl
            border
            border-neutral-200
            bg-white
            p-4
            sm:p-5
            lg:col-span-1
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
            Paid Orders
          </p>


          <p
            className="
              mt-2
              text-2xl
              font-light
              text-neutral-900
            "
          >
            {summary.paid}
          </p>

        </div>

      </div>


      {/* ======================================================
          ORDER GRID
          ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >

        {orders.map(
          (
            order
          ) => (

            <div
              key={
                order.id
              }
              className="
                overflow-hidden
                rounded-2xl
                border
                border-neutral-200
                bg-white
                sm:flex
                sm:h-full
                sm:flex-col
                transition-shadow
                hover:shadow-sm
              "
            >

              {/* ==================================================
                  HEADER
                  ================================================== */}

              <div
                className="
                  border-b
                  border-neutral-100
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >

                  <div
                    className="
                      min-w-0
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
                      Order
                    </p>


                    <h3
                      className="
                        mt-1
                        truncate
                        text-sm
                        font-medium
                        text-neutral-900
                      "
                    >
                      {order.orderNumber ??
                        `#${order.id}`}
                    </h3>

                  </div>


                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-medium
                      ${getStatusClass(
                        order.status
                      )}
                    `}
                  >
                    {order.status}
                  </span>

                </div>


                <p
                  className="
                    mt-2
                    text-xs
                    text-neutral-400
                  "
                >
                  {formatDate(
                    order.createdAt
                  )}
                </p>

              </div>


              {/* ==================================================
                  CUSTOMER
                  ================================================== */}

              <div
                className="
                  space-y-3
                  p-5
                  sm:flex-1
                "
              >

                <div>

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-neutral-400
                    "
                  >
                    Customer
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      font-medium
                      text-neutral-900
                    "
                  >
                    {order.customerName}
                  </p>


                  <p
                    className="
                      mt-1
                      break-all
                      text-xs
                      text-neutral-500
                    "
                  >
                    {order.customerPhone}
                  </p>


                  {order.customerEmail && (

                    <p
                      className="
                        mt-1
                        break-all
                        text-xs
                        text-neutral-500
                      "
                    >
                      {order.customerEmail}
                    </p>

                  )}

                </div>


                {/* ==================================================
                    AMOUNT
                    ================================================== */}

                <div
                  className="
                    rounded-xl
                    bg-neutral-50
                    p-4
                  "
                >

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-neutral-400
                    "
                  >
                    Order Total
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
                      order.finalAmount
                    )}
                  </p>

                  {order.payment?.paymentMethodType === "PAYPAL" && (

                    <p
                      className="
                        mt-2
                        text-xs
                        text-neutral-500
                      "
                    >
                      PayPal Fee ·{" "}
                      {formatAmount(
                        order.paypalFee
                      )}
                    </p>

                  )}

                </div>


                {/* ==================================================
                    PAYMENT
                    ================================================== */}

                {order.payment && (

                  <div
                    className="
                      rounded-xl
                      border
                      border-neutral-100
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <div>

                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.18em]
                            text-neutral-400
                          "
                        >
                          Payment
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
                            order.payment
                              .paymentMethodName
                          }
                        </p>

                      </div>


                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-[10px]
                          font-medium
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


                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >

                      <span
                        className="
                          text-xs
                          text-neutral-500
                        "
                      >
                        Amount
                      </span>


                      <span
                        className="
                          text-sm
                          font-semibold
                          text-neutral-900
                        "
                      >
                        {formatAmount(
                          order.payment.amount
                        )}
                      </span>

                    </div>


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
                          mt-4
                          inline-flex
                          w-full
                          items-center
                          justify-center
                          rounded-xl
                          bg-neutral-900
                          px-4
                          py-2.5
                          text-xs
                          font-medium
                          text-white
                          transition-opacity
                          hover:opacity-90
                        "
                      >
                        Review Payment
                      </button>

                    )}

                  </div>

                )}

              </div>


              {/* ==================================================
                  FOOTER
                  ================================================== */}

              <div
                className="
                  border-t
                  border-neutral-100
                  p-5
                "
              >

                <div
                  className="
                    flex
                    gap-2
                  "
                >

                  <a
                    href={`/admin/dashboard/orders/${order.id}`}
                    className="
                      inline-flex
                      flex-1
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-neutral-200
                      bg-white
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      text-neutral-700
                      transition-colors
                      hover:bg-neutral-50
                    "
                  >
                    View Order
                  </a>


                  <button
                    type="button"
                    onClick={() =>
                      deleteOrder(
                        order
                      )
                    }
                    disabled={
                      deleteLoading ===
                      order.id
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-1.5
                      rounded-xl
                      border
                      border-red-200
                      bg-white
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      text-red-600
                      transition-colors
                      hover:bg-red-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                    aria-label={`Delete ${order.orderNumber ?? `#${order.id}`}`}
                  >

                    {deleteLoading ===
                    order.id ? (

                      <Loader2
                        className="
                          h-3.5
                          w-3.5
                          animate-spin
                        "
                      />

                    ) : (

                      <Trash2
                        className="
                          h-3.5
                          w-3.5
                        "
                      />

                    )}

                    {deleteLoading ===
                    order.id
                      ? "Deleting..."
                      : "Delete"}

                  </button>

                </div>

              </div>

            </div>

          )
        )}

      </div>


      {deleteError && (

        <div
          className="
            mt-4
            rounded-xl
            border
            border-red-100
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {deleteError}
        </div>

      )}


      {/* ======================================================
          EMPTY STATE
          ====================================================== */}

      {orders.length === 0 && (

        <div
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            px-6
            py-16
            text-center
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-neutral-900
            "
          >
            No orders found
          </p>


          <p
            className="
              mt-2
              text-xs
              text-neutral-500
            "
          >
            Orders matching your current filters will appear here.
          </p>

        </div>

      )}


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

            {/* ==================================================
                MODAL HEADER
                ================================================== */}

            <div
              className="
                border-b
                border-neutral-100
                p-6
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
                      text-[10px]
                      uppercase
                      tracking-[0.3em]
                      text-neutral-400
                    "
                  >
                    Payment Review
                  </p>


                  <h2
                    className="
                      mt-2
                      text-2xl
                      font-light
                      text-neutral-900
                    "
                  >
                    {selectedPayment.orderNumber ??
                      `#${selectedPayment.orderId}`}
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
                    actionLoading !==
                    null
                  }
                  className="
                    shrink-0
                    rounded-full
                    p-2
                    text-neutral-400
                    transition-colors
                    hover:bg-neutral-100
                    hover:text-neutral-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                  aria-label="Close"
                >
                  ×
                </button>

              </div>

            </div>


            {/* ==================================================
                PAYMENT INFORMATION
                ================================================== */}

            <div
              className="
                space-y-5
                p-6
              "
            >

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >

                <div
                  className="
                    rounded-2xl
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


              {/* ==================================================
                  STATUS
                  ================================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-2xl
                  border
                  border-neutral-100
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
                    Payment Status
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
                    rounded-full
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


              {/* ==================================================
                  RECEIPT
                  ================================================== */}

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
                      mt-3
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
                      text-xs
                      font-medium
                      text-neutral-700
                      underline
                      underline-offset-4
                    "
                  >
                    Open Receipt
                  </a>

                </div>

              ) : (

                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-neutral-200
                    p-6
                    text-center
                  "
                >

                  <p
                    className="
                      text-sm
                      text-neutral-500
                    "
                  >
                    No payment receipt uploaded.
                  </p>

                </div>

              )}


              {/* ==================================================
                  ADMIN NOTE
                  ================================================== */}

              <div>

                <label
                  htmlFor="admin-payment-note"
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
                  id="admin-payment-note"
                  value={
                    adminNote
                  }
                  onChange={(
                    event
                  ) =>
                    setAdminNote(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Add a note for this payment..."
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
                    placeholder:text-neutral-400
                    focus:border-neutral-400
                  "
                />

              </div>


              {/* ==================================================
                  ERROR
                  ================================================== */}

              {actionError && (

                <div
                  className="
                    rounded-2xl
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                  "
                >
                  {actionError}
                </div>

              )}


              {/* ==================================================
                  ACTIONS
                  ================================================== */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  sm:flex-row
                  sm:justify-end
                "
              >

                <button
                  type="button"
                  onClick={
                    closePaymentReview
                  }
                  disabled={
                    actionLoading !==
                    null
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-neutral-200
                    bg-white
                    px-5
                    py-3
                    text-xs
                    font-medium
                    text-neutral-700
                    transition-colors
                    hover:bg-neutral-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={() =>
                    reviewPayment(
                      "REJECT"
                    )
                  }
                  disabled={
                    actionLoading !==
                      null ||
                    selectedPayment
                      .payment
                      .status !==
                      "SUBMITTED"
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-red-200
                    bg-white
                    px-5
                    py-3
                    text-xs
                    font-medium
                    text-red-700
                    transition-colors
                    hover:bg-red-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {actionLoading ===
                  "REJECT"
                    ? "Rejecting..."
                    : "Reject Payment"}
                </button>


                <button
                  type="button"
                  onClick={() =>
                    reviewPayment(
                      "VERIFY"
                    )
                  }
                  disabled={
                    actionLoading !==
                      null ||
                    selectedPayment
                      .payment
                      .status !==
                      "SUBMITTED"
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-neutral-900
                    px-5
                    py-3
                    text-xs
                    font-medium
                    text-white
                    transition-opacity
                    hover:opacity-90
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {actionLoading ===
                  "VERIFY"
                    ? "Verifying..."
                    : "Verify Payment"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </>

  );

}