"use client";

import { useState } from "react";

import {
  Check,
  Loader2,
  Package,
  X,
} from "lucide-react";

import {
  OrderStatus,
} from "@prisma/client";

import {
  updateOrderFulfillmentStatus,
} from "../_actions/order.actions";


type OrderFulfillmentActionsProps = {
  orderId: number;

  status:
    | "PENDING_PAYMENT"
    | "PAYMENT_REVIEW"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCELLED";

  shippingCourier: string | null;

  trackingNumber: string | null;
};


export default function OrderFulfillmentActions({
  orderId,
  status,
}: OrderFulfillmentActionsProps) {

  const [
    loading,
    setLoading,
  ] = useState<
    OrderStatus | null
  >(null);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  async function handleUpdateStatus(
    nextStatus: OrderStatus,
    message: string
  ) {

    setError(null);


    // ========================================================
    // CONFIRM
    // ========================================================

    const confirmed =
      window.confirm(
        message
      );


    if (!confirmed) {
      return;
    }


    // ========================================================
    // UPDATE
    // ========================================================

    try {

      setLoading(
        nextStatus
      );


      await updateOrderFulfillmentStatus(
        orderId,
        nextStatus
      );


      window.location.reload();


    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update order status."
      );


    } finally {

      setLoading(null);

    }

  }


  // ==========================================================
  // COMPLETED
  // ==========================================================

  if (
    status === "COMPLETED"
  ) {

    return (
      <div
        className="
          rounded-xl
          border
          border-emerald-200
          bg-emerald-50
          p-4
          sm:p-5
        "
      >

        <div
          className="
            flex
            items-start
            gap-3
            sm:items-center
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-emerald-100
              text-emerald-700
            "
          >

            <Check
              className="h-5 w-5"
            />

          </div>


          <div>

            <p
              className="
                font-medium
                text-emerald-900
              "
            >
              Order Completed
            </p>


            <p
              className="
                mt-1
                text-sm
                text-emerald-700
              "
            >
              This order has been completed.
            </p>

          </div>

        </div>

      </div>
    );

  }


  // ==========================================================
  // CANCELLED
  // ==========================================================

  if (
    status === "CANCELLED"
  ) {

    return (
      <div
        className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-4
          sm:p-5
        "
      >

        <div
          className="
            flex
            items-start
            gap-3
            sm:items-center
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-red-100
              text-red-600
            "
          >

            <X
              className="h-5 w-5"
            />

          </div>


          <div>

            <p
              className="
                font-medium
                text-red-900
              "
            >
              Order Cancelled
            </p>


            <p
              className="
                mt-1
                text-sm
                text-red-700
              "
            >
              This order has been cancelled.
            </p>

          </div>

        </div>

      </div>
    );

  }


  return (
    <div className="space-y-5">


      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-3
            py-3
            sm:px-4
            text-sm
            leading-6
            text-red-700
          "
        >
          {error}
        </div>

      )}


      {/* ======================================================
          PAID → PROCESSING
          ====================================================== */}

      {status === "PAID" && (

        <div>

          <p
            className="
              text-sm
              text-neutral-500
            "
          >
            Payment has been verified. The order is ready for processing.
          </p>


          <button
            type="button"
            onClick={() =>
              handleUpdateStatus(
                OrderStatus.PROCESSING,
                "Start processing this order?"
              )
            }
            disabled={
              loading !== null
            }
            className="
              mt-4
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-black
              px-4
              py-3
              sm:w-auto
              sm:px-5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-neutral-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {loading ===
            OrderStatus.PROCESSING ? (

              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />

            ) : (

              <Package
                className="h-4 w-4"
              />

            )}

            Start Processing

          </button>

        </div>

      )}


      {/* ======================================================
          PROCESSING
          ====================================================== */}

      {status === "PROCESSING" && (

        <div>

          <p
            className="
              text-sm
              text-neutral-500
            "
          >
            This order is currently being prepared for shipment.
          </p>


          <div
            className="
              mt-4
              rounded-xl
              border
              border-blue-200
              bg-blue-50
              p-3
              sm:p-4
            "
          >

            <p
              className="
                text-sm
                font-medium
                text-blue-900
              "
            >
              Shipping information required
            </p>


            <p
              className="
                mt-2
                text-sm
                leading-6
                text-blue-700
              "
            >
              Enter the ABX Express tracking number
              in the Shipping Information section below.
              Saving the tracking number will automatically
              mark this order as Shipped.
            </p>

          </div>

        </div>

      )}


      {/* ======================================================
          SHIPPED → COMPLETED
          ====================================================== */}

      {status === "SHIPPED" && (

        <div>

          <p
            className="
              text-sm
              text-neutral-500
            "
          >
            This order has been shipped and is waiting to be completed.
          </p>


          <button
            type="button"
            onClick={() =>
              handleUpdateStatus(
                OrderStatus.COMPLETED,
                "Mark this order as completed?"
              )
            }
            disabled={
              loading !== null
            }
            className="
              mt-4
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-black
              px-4
              py-3
              sm:w-auto
              sm:px-5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-neutral-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {loading ===
            OrderStatus.COMPLETED ? (

              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />

            ) : (

              <Check
                className="h-4 w-4"
              />

            )}

            Mark as Completed

          </button>

        </div>

      )}


      {/* ======================================================
          CANCEL ORDER
          ====================================================== */}

      {(status === "PAID" ||
        status === "PROCESSING" ||
        status === "SHIPPED") && (

        <div
          className="
            border-t
            border-neutral-200
            pt-4
            sm:pt-5
          "
        >

          <button
            type="button"
            onClick={() =>
              handleUpdateStatus(
                OrderStatus.CANCELLED,
                "Are you sure you want to cancel this order?"
              )
            }
            disabled={
              loading !== null
            }
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-red-200
              bg-white
              px-4
              py-3
              sm:w-auto
              sm:px-5
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {loading ===
            OrderStatus.CANCELLED ? (

              <Loader2
                className="
                  h-4
                  w-4
                  animate-spin
                "
              />

            ) : (

              <X
                className="h-4 w-4"
              />

            )}

            Cancel Order

          </button>

        </div>

      )}

    </div>
  );
}