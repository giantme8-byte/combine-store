import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import PaymentProofForm from "./_components/PaymentProofForm";


// ============================================================
// ORDER PROGRESS
// ============================================================

function getOrderProgress(
  orderStatus: string,
  paymentStatus: string
) {

  const isCancelled =
    orderStatus === "CANCELLED";

  const paymentVerified =
    paymentStatus === "VERIFIED" ||
    orderStatus === "PAID" ||
    orderStatus === "PROCESSING" ||
    orderStatus === "SHIPPED" ||
    orderStatus === "COMPLETED";

  const processing =
    orderStatus === "PROCESSING" ||
    orderStatus === "SHIPPED" ||
    orderStatus === "COMPLETED";

  const shipped =
    orderStatus === "SHIPPED" ||
    orderStatus === "COMPLETED";

  const completed =
    orderStatus === "COMPLETED";

  return {
    isCancelled,
    steps: [
      { key: "placed", label: "Order Placed", completed: true },
      { key: "payment", label: "Payment Verified", completed: paymentVerified },
      { key: "processing", label: "Processing", completed: processing },
      { key: "shipped", label: "Shipped", completed: shipped },
      { key: "completed", label: "Completed", completed },
    ],
  };
}


// ============================================================
// PAYMENT PAGE
// ============================================================

export default async function PaymentPage({
  params,
}: {
  params: Promise<{
    publicToken: string;
  }>;
}) {

  const {
    publicToken,
  } = await params;


  // ==========================================================
  // LOAD ORDER
  // ==========================================================

  const order =
    await prisma.order.findUnique({

      where: {
        publicToken,
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


  // ==========================================================
  // ORDER NOT FOUND
  // ==========================================================

  if (!order) {
    notFound();
  }


  // ==========================================================
  // PAYMENT
  // ==========================================================

  const payment =
    order.payment;


  // ==========================================================
  // FORMAT MONEY
  // ==========================================================

  function formatMoney(
    value: number
  ) {

    return `RM ${value.toFixed(2)}`;

  }


  // ==========================================================
  // PAYMENT METHOD
  // ==========================================================

  const isBankTransfer =
    payment?.paymentMethodType ===
    "BANK_TRANSFER";


  const isQrPayment =
    payment?.paymentMethodType ===
    "QR";


  // ==========================================================
  // PAYMENT STATUS
  // ==========================================================

  const paymentStatus =
    payment?.status ?? "PENDING";


  const isPaymentPending =
    paymentStatus ===
    "PENDING";


  const isPaymentSubmitted =
    paymentStatus ===
    "SUBMITTED";


  const isPaymentVerified =
    paymentStatus ===
    "VERIFIED";


  const isPaymentRejected =
    paymentStatus ===
    "REJECTED";


  const orderProgress =
    getOrderProgress(
      order.status,
      paymentStatus
    );


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      className="
        mx-auto
        max-w-[1200px]
        px-6
        pb-32
        pt-32
        sm:px-8
        lg:px-12
      "
    >

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          mx-auto
          max-w-3xl
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
          ORDER CONFIRMED
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
          Thank You For Your Order
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
            text-sm
            leading-7
            text-neutral-500
            sm:text-base
          "
        >
          {paymentStatus === "PENDING"
            ? "Your order has been successfully received. Please complete your payment using the information below."
            : paymentStatus === "SUBMITTED"
              ? "Your payment proof has been submitted and is awaiting manual verification."
              : paymentStatus === "REJECTED"
                ? "Your payment proof was rejected. Please review the payment note and submit a new proof."
                : order.status === "COMPLETED"
                  ? "Your order has been completed. Thank you for shopping with COMBINE."
                  : order.status === "SHIPPED"
                    ? "Your order has been shipped. Your tracking information is available below."
                    : order.status === "PROCESSING"
                      ? "Your payment has been verified and your order is now being prepared."
                      : "Your payment has been verified successfully. No further payment action is required."}
        </p>


        {/* ================================================== */}
        {/* ORDER REFERENCE */}
        {/* ================================================== */}

        <div
          className="
            mt-8
            inline-flex
            flex-col
            items-center
            rounded-2xl
            border
            border-neutral-200
            bg-white
            px-6
            py-4
            shadow-sm
          "
        >

          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]
              text-neutral-400
            "
          >
            Order Reference
          </span>


          <span
            className="
              mt-2
              font-mono
              text-sm
              font-semibold
              text-neutral-900
            "
          >
            {order.publicToken}
          </span>

        </div>

      </div>


      {/* ==================================================== */}
      {/* ORDER PROGRESS */}
      {/* ==================================================== */}

      <section
        className="
          mx-auto
          mt-12
          max-w-5xl
          rounded-3xl
          border
          border-neutral-200
          bg-white
          p-6
          shadow-sm
          sm:p-8
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
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-neutral-400
              "
            >
              ORDER PROGRESS
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-light
                tracking-[-0.02em]
                text-neutral-900
              "
            >
              Your Order Journey
            </h2>
          </div>

          <div
            className={`
              rounded-full
              border
              px-3
              py-1.5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.16em]
              ${
                orderProgress.isCancelled
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-neutral-200 bg-neutral-50 text-neutral-500"
              }
            `}
          >
            {orderProgress.isCancelled
              ? "Cancelled"
              : order.status.replace(/_/g, " ")}
          </div>
        </div>

        {orderProgress.isCancelled ? (
          <div
            className="
              mt-8
              flex
              items-start
              gap-4
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-5
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-sm
                font-semibold
                text-red-600
                shadow-sm
              "
            >
              !
            </div>

            <div>
              <p className="font-medium text-neutral-900">
                Order Cancelled
              </p>

              <p className="mt-1 text-sm leading-6 text-neutral-500">
                This order has been cancelled and will not proceed to shipment.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto pb-2">
            <div className="min-w-[620px]">
              <div className="relative grid grid-cols-5 gap-3">
                <div
                  className="
                    absolute
                    left-[10%]
                    right-[10%]
                    top-5
                    h-px
                    bg-neutral-200
                  "
                />

                {orderProgress.steps.map((step) => (
                  <div
                    key={step.key}
                    className="
                      relative
                      z-10
                      flex
                      flex-col
                      items-center
                      text-center
                    "
                  >
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        bg-white
                        text-xs
                        font-medium
                        shadow-sm
                        ${
                          step.completed
                            ? "border-[#C8A96A] bg-[#C8A96A] text-white"
                            : "border-neutral-200 text-neutral-300"
                        }
                      `}
                    >
                      {step.completed ? "✓" : ""}
                    </div>

                    <p
                      className={`
                        mt-4
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        ${
                          step.completed
                            ? "text-neutral-800"
                            : "text-neutral-400"
                        }
                      `}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>

              {paymentStatus === "SUBMITTED" && (
                <p
                  className="
                    mt-7
                    text-center
                    text-xs
                    leading-6
                    text-neutral-500
                  "
                >
                  Your payment proof has been submitted and is awaiting manual verification.
                </p>
              )}

              {paymentStatus === "REJECTED" && (
                <p
                  className="
                    mt-7
                    text-center
                    text-xs
                    leading-6
                    text-red-600
                  "
                >
                  Your payment proof was rejected. Please review the payment note below and submit a new proof.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ==================================================== */}
      {/* CONTENT */}
      {/* ==================================================== */}

      <div
        className="
          mt-16
          grid
          gap-8
          lg:grid-cols-[1.2fr_0.8fr]
        "
      >

        {/* ================================================== */}
        {/* ORDER SUMMARY */}
        {/* ================================================== */}

        <section
          className="
            rounded-3xl
            border
            border-neutral-200
            bg-white
            p-6
            shadow-sm
            sm:p-8
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

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-neutral-400
                "
              >
                YOUR ORDER
              </p>


              <h2
                className="
                  mt-2
                  text-2xl
                  font-light
                  text-neutral-900
                "
              >
                Order Summary
              </h2>

            </div>


            <div
              className="
                rounded-full
                bg-neutral-100
                px-4
                py-2
                text-xs
                font-medium
                capitalize
                text-neutral-600
              "
            >
              {order.status.replace(
                /_/g,
                " "
              )}
            </div>

          </div>


          {/* ================================================= */}
          {/* PRODUCTS */}
          {/* ================================================= */}

          <div
            className="
              mt-8
              divide-y
              divide-neutral-200
            "
          >

            {order.items.map(
              (item) => (

                <div
                  key={item.id}
                  className="
                    py-6
                    first:pt-0
                    last:pb-0
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-6
                    "
                  >

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
                          tracking-[0.22em]
                          text-neutral-400
                        "
                      >
                        {item.brand}
                      </p>


                      <h3
                        className="
                          mt-2
                          text-base
                          font-medium
                          text-neutral-900
                        "
                      >
                        {item.productName}
                      </h3>


                      {item.sku && (
                        <p
                          className="
                            mt-1
                            text-xs
                            text-neutral-400
                          "
                        >
                          SKU · {item.sku}
                        </p>
                      )}


                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          gap-x-4
                          gap-y-1
                          text-xs
                          text-neutral-500
                        "
                      >

                        {item.color && (
                          <span>
                            Colour · {item.color}
                          </span>
                        )}


                        {item.variant && (
                          <span>
                            Size · {item.variant}
                          </span>
                        )}


                        <span>
                          Qty · {item.quantity}
                        </span>

                      </div>

                    </div>


                    <div
                      className="
                        shrink-0
                        text-right
                      "
                    >

                      <p
                        className="
                          font-semibold
                          tabular-nums
                          text-neutral-900
                        "
                      >
                        {formatMoney(
                          item.totalPrice
                        )}
                      </p>


                      {item.quantity > 1 && (
                        <p
                          className="
                            mt-1
                            text-xs
                            text-neutral-400
                          "
                        >
                          {formatMoney(
                            item.unitPrice
                          )} × {item.quantity}
                        </p>
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          {/* ================================================= */}
          {/* TOTALS */}
          {/* ================================================= */}

          <div
            className="
              mt-8
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
                className="
                  text-neutral-500
                "
              >
                Subtotal
              </span>


              <span
                className="
                  font-medium
                  tabular-nums
                "
              >
                {formatMoney(
                  order.subtotal
                )}
              </span>

            </div>


            {order.voucherDiscount > 0 && (
              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-between
                  text-sm
                "
              >

                <div>

                  <span
                    className="
                      text-neutral-500
                    "
                  >
                    Voucher
                  </span>

                  {order.voucherCode && (
                    <span
                      className="
                        ml-2
                        rounded-full
                        bg-neutral-100
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.08em]
                        text-neutral-500
                      "
                    >
                      {order.voucherCode}
                    </span>
                  )}

                </div>


                <span
                  className="
                    font-medium
                    tabular-nums
                    text-green-600
                  "
                >
                  - {formatMoney(
                    order.voucherDiscount
                  )}
                </span>

              </div>
            )}


            {/* ================================================= */}
            {/* SHIPPING */}
            {/* ================================================= */}

            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                gap-4
                text-sm
              "
            >

              <div className="min-w-0">

                <span
                  className="
                    text-neutral-500
                  "
                >
                  Shipping
                </span>

                <div
                  className="
                    mt-1
                    flex
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-1
                    text-xs
                    text-neutral-400
                  "
                >

                  <span>
                    {order.shippingCourier ||
                      "ABX Express"}
                  </span>

                  {order.shippingRegion && (
                    <>
                      <span>·</span>
                      <span>
                        {order.shippingRegion}
                      </span>
                    </>
                  )}

                </div>

              </div>


              <span
                className={
                  order.shippingFee === 0
                    ? `
                      shrink-0
                      font-medium
                      text-green-600
                    `
                    : `
                      shrink-0
                      font-medium
                      tabular-nums
                      text-neutral-900
                    `
                }
              >
                {order.shippingFee === 0
                  ? "FREE"
                  : formatMoney(
                      order.shippingFee
                    )}
              </span>

            </div>


            <div
              className="
                mt-5
                flex
                items-end
                justify-between
                border-t
                border-neutral-200
                pt-5
              "
            >

              <span
                className="
                  text-sm
                  font-medium
                  text-neutral-500
                "
              >
                Total
              </span>


              <span
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-neutral-900
                  tabular-nums
                "
              >
                {formatMoney(
                  order.finalAmount
                )}
              </span>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* PAYMENT COLUMN */}
        {/* ================================================== */}

        <section
          className="
            space-y-6
          "
        >

          {/* ================================================= */}
          {/* PAYMENT METHOD */}
          {/* ================================================= */}

          <div
            className="
              rounded-3xl
              border
              border-neutral-200
              bg-white
              p-6
              shadow-sm
              sm:p-8
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
              PAYMENT
            </p>


            <h2
              className="
                mt-2
                text-2xl
                font-light
                text-neutral-900
              "
            >
              Payment Method
            </h2>


            {payment ? (

              <div className="mt-8">

                {/* ================================================= */}
                {/* SELECTED METHOD */}
                {/* ================================================= */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-neutral-50
                    p-5
                  "
                >

                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-[0.2em]
                      text-neutral-400
                    "
                  >
                    Selected Method
                  </p>


                  <p
                    className="
                      mt-2
                      text-lg
                      font-medium
                      text-neutral-900
                    "
                  >
                    {payment.paymentMethodName}
                  </p>

                </div>


                {/* ================================================= */}
                {/* AMOUNT */}
                {/* ================================================= */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-neutral-200
                    p-5
                  "
                >

                  <span
                    className="
                      text-sm
                      text-neutral-500
                    "
                  >
                    Amount to Pay
                  </span>


                  <span
                    className="
                      text-xl
                      font-semibold
                      tabular-nums
                      text-neutral-900
                    "
                  >
                    {formatMoney(
                      payment.amount
                    )}
                  </span>

                </div>


                {/* ================================================= */}
                {/* BANK TRANSFER */}
                {/* ================================================= */}

                {isBankTransfer && (
                  <div
                    className="
                      mt-6
                      space-y-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-[0.2em]
                        text-neutral-400
                      "
                    >
                      Bank Transfer Details
                    </p>


                    {payment.bankName && (
                      <PaymentRow
                        label="Bank"
                        value={
                          payment.bankName
                        }
                      />
                    )}


                    {payment.accountName && (
                      <PaymentRow
                        label="Account Name"
                        value={
                          payment.accountName
                        }
                      />
                    )}


                    {payment.accountNumber && (
                      <PaymentRow
                        label="Account Number"
                        value={
                          payment.accountNumber
                        }
                      />
                    )}

                  </div>
                )}


                {/* ================================================= */}
                {/* QR PAYMENT */}
                {/* ================================================= */}

                {isQrPayment && (
                  <div
                    className="
                      mt-6
                      text-center
                    "
                  >

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-[0.2em]
                        text-neutral-400
                      "
                    >
                      Scan To Pay
                    </p>


                    {payment.qrImageUrl ? (

                      <div
                        className="
                          mx-auto
                          mt-5
                          w-fit
                          rounded-2xl
                          border
                          border-neutral-200
                          bg-white
                          p-4
                        "
                      >

                        <img
                          src={
                            payment.qrImageUrl
                          }
                          alt="Payment QR Code"
                          className="
                            h-56
                            w-56
                            object-contain
                            sm:h-64
                            sm:w-64
                          "
                        />

                      </div>

                    ) : (

                      <p
                        className="
                          mt-5
                          text-sm
                          text-neutral-500
                        "
                      >
                        QR payment information
                        is currently unavailable.
                      </p>

                    )}

                  </div>
                )}

              </div>

            ) : (

              <p
                className="
                  mt-6
                  text-sm
                  text-neutral-500
                "
              >
                Payment information is
                currently unavailable.
              </p>

            )}

          </div>


          {/* ================================================= */}
          {/* PAYMENT STATUS */}
          {/* ================================================= */}

          <div
            className="
              rounded-3xl
              border
              border-neutral-200
              bg-white
              p-6
              shadow-sm
              sm:p-8
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
              PAYMENT STATUS
            </p>


            {/* ================================================= */}
            {/* PENDING */}
            {/* ================================================= */}

            {isPaymentPending && (

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-amber-50
                    text-lg
                  "
                >
                  ⏳
                </div>


                <div>

                  <p
                    className="
                      font-medium
                      text-neutral-900
                    "
                  >
                    Payment Pending
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-neutral-500
                    "
                  >
                    Please complete your payment
                    using the selected payment method.
                  </p>

                </div>

              </div>

            )}


            {/* ================================================= */}
            {/* SUBMITTED */}
            {/* ================================================= */}

            {isPaymentSubmitted && (

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-50
                    text-lg
                    text-blue-600
                  "
                >
                  ✓
                </div>


                <div>

                  <p
                    className="
                      font-medium
                      text-neutral-900
                    "
                  >
                    Payment Proof Submitted
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-neutral-500
                    "
                  >
                    Your payment receipt has been
                    received and is waiting for
                    manual verification.
                  </p>

                </div>

              </div>

            )}


            {/* ================================================= */}
            {/* VERIFIED */}
            {/* ================================================= */}

            {isPaymentVerified && (

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-green-50
                    text-lg
                    text-green-600
                  "
                >
                  ✓
                </div>


                <div>

                  <p
                    className="
                      font-medium
                      text-neutral-900
                    "
                  >
                    Payment Verified
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-neutral-500
                    "
                  >
                    Your payment has been verified
                    successfully.
                  </p>

                </div>

              </div>

            )}


            {/* ================================================= */}
            {/* REJECTED */}
            {/* ================================================= */}

            {isPaymentRejected && (

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-red-50
                    text-lg
                    text-red-600
                  "
                >
                  !
                </div>


                <div>

                  <p
                    className="
                      font-medium
                      text-neutral-900
                    "
                  >
                    Payment Proof Rejected
                  </p>


                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-neutral-500
                    "
                  >
                    Your payment proof could not
                    be verified. Please upload a
                    valid receipt or contact our team.
                  </p>

                </div>

              </div>

            )}

          </div>


          {/* ================================================= */}
          {/* PAYMENT PROOF */}
          {/* ================================================= */}

          {payment && (
            <PaymentProofForm
              publicToken={
                order.publicToken
              }

              initialProofUrl={
                payment.proofUrl ??
                null
              }

              initialStatus={
                payment.status
              }
            />
          )}


          {/* ================================================= */}
          {/* SHIPPING INFORMATION */}
          {/* ================================================= */}

          {(order.status === "PROCESSING" ||
            order.status === "SHIPPED" ||
            order.status === "COMPLETED") && (
            <div
              className="
                rounded-3xl
                border
                border-neutral-200
                bg-white
                p-6
                shadow-sm
                sm:p-8
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
                SHIPPING INFORMATION
              </p>


              <h2
                className="
                  mt-2
                  text-2xl
                  font-light
                  text-neutral-900
                "
              >
                Shipping
              </h2>


              {order.shippingCourier && order.trackingNumber ? (
                <div className="mt-8 space-y-5">

                  <div
                    className="
                      flex
                      items-start
                      gap-4
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-neutral-50
                      p-5
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-lg
                        shadow-sm
                      "
                    >
                      🚚
                    </div>


                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-medium text-neutral-900">
                        Your order has been shipped
                      </p>

                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        Your tracking information is now available.
                      </p>

                    </div>

                  </div>


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
                        p-5
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
                        Shipping Method
                      </p>

                      <p className="mt-2 text-sm font-medium text-neutral-900">
                        {order.shippingCourier}
                      </p>

                    </div>


                    <div
                      className="
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-neutral-50
                        p-5
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
                        Tracking Number
                      </p>

                      <p
                        className="
                          mt-2
                          break-all
                          font-mono
                          text-sm
                          font-medium
                          text-neutral-900
                        "
                      >
                        {order.trackingNumber}
                      </p>

                    </div>

                  </div>


                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-black
                        px-5
                        py-3.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-neutral-800
                        sm:w-auto
                      "
                    >
                      Track Shipment ↗
                    </a>
                  )}

                </div>
              ) : (
                <div className="mt-8 space-y-5">

                  <div
                    className="
                      flex
                      items-start
                      gap-4
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-neutral-50
                      p-5
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-lg
                        shadow-sm
                      "
                    >
                      📦
                    </div>


                    <div>

                      <p className="text-sm font-medium text-neutral-900">
                        Your order is being prepared
                      </p>

                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        Our team is currently processing your order.
                        Your tracking number will be updated within
                        <span className="font-medium text-neutral-700"> 1–5 business days</span> after your order has been processed.
                      </p>

                    </div>

                  </div>


                  <div
                    className="
                      rounded-2xl
                      border
                      border-neutral-200
                      bg-neutral-50
                      p-5
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
                      Tracking Information
                    </p>

                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      Once your tracking number is available, you may use it to track your shipment.
                    </p>

                  </div>

                </div>
              )}

            </div>
          )}


          {/* ================================================= */}
          {/* PAYMENT / ORDER NEXT STEPS */}
          {/* ================================================= */}

          <div
            className="
              rounded-3xl
              border
              border-neutral-200
              bg-neutral-50
              p-6
              sm:p-8
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
              {paymentStatus === "VERIFIED"
                ? "PAYMENT VERIFIED"
                : order.status === "PROCESSING"
                  ? "ORDER PROCESSING"
                  : order.status === "SHIPPED"
                    ? "SHIPMENT"
                    : order.status === "COMPLETED"
                      ? "ORDER COMPLETED"
                      : "PAYMENT INSTRUCTIONS"}
            </p>

            <div
              className="
                mt-5
                space-y-3
                text-sm
                leading-7
                text-neutral-600
              "
            >

              {paymentStatus === "PENDING" && (
                <>
                  <p>
                    1. Complete the payment using
                    the selected payment method.
                  </p>

                  <p>
                    2. Upload your payment receipt
                    after completing the transfer.
                  </p>

                  <p>
                    3. Our team will manually review
                    your payment proof.
                  </p>

                  <p>
                    4. Your order will be updated
                    after payment verification.
                  </p>
                </>
              )}

              {paymentStatus === "SUBMITTED" && (
                <>
                  <p>
                    Your payment proof has been
                    successfully submitted.
                  </p>

                  <p>
                    Our team is currently reviewing
                    your payment manually.
                  </p>

                  <p>
                    No further action is required
                    from you at this time.
                  </p>
                </>
              )}

              {paymentStatus === "REJECTED" && (
                <>
                  <p>
                    Your payment proof could not
                    be verified.
                  </p>

                  <p>
                    Please review the payment note
                    above and submit a new payment
                    proof.
                  </p>

                  <p>
                    Once submitted, our team will
                    review it again.
                  </p>
                </>
              )}

              {paymentStatus === "VERIFIED" &&
                order.status === "PAID" && (
                  <>
                    <p>
                      Your payment has been verified
                      successfully.
                    </p>

                    <p>
                      No further payment action is
                      required from you.
                    </p>

                    <p>
                      Our team will now prepare your
                      order for processing.
                    </p>
                  </>
                )}

              {order.status === "PROCESSING" && (
                <>
                  <p>
                    Your payment has been verified
                    and your order is now being
                    prepared.
                  </p>

                  <p>
                    Your tracking number will be
                    updated once your shipment is
                    dispatched.
                  </p>
                </>
              )}

              {order.status === "SHIPPED" && (
                <>
                  <p>
                    Your order has been shipped
                    successfully.
                  </p>

                  <p>
                    Your ABX Express tracking
                    information is available in the
                    Shipping Information section.
                  </p>
                </>
              )}

              {order.status === "COMPLETED" && (
                <>
                  <p>
                    Your order has been completed.
                  </p>

                  <p>
                    Thank you for shopping with
                    COMBINE. We truly appreciate
                    your support.
                  </p>
                </>
              )}

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}


// ============================================================
// PAYMENT ROW
// ============================================================

function PaymentRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
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
        {label}
      </p>


      <p
        className="
          mt-1
          break-all
          text-sm
          font-medium
          text-neutral-900
        "
      >
        {value}
      </p>

    </div>
  );
}