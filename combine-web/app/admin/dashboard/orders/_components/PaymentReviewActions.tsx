"use client";

import { useState } from "react";

import {
  Check,
  Loader2,
  X,
  Clock,
} from "lucide-react";

import {
  rejectPayment,
  verifyPayment,
} from "../_actions/order.actions";


type PaymentReviewActionsProps = {
  orderId: number;

  paymentStatus:
    | "PENDING"
    | "SUBMITTED"
    | "VERIFIED"
    | "REJECTED";

  hasProof: boolean;

  adminNote?: string | null;
};


export default function PaymentReviewActions({
  orderId,
  paymentStatus,
  hasProof,
  adminNote,
}: PaymentReviewActionsProps) {

  const [
    loading,
    setLoading,
  ] = useState<
    "verify" |
    "reject" |
    null
  >(null);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  const [
    note,
    setNote,
  ] = useState("");


  // ==========================================================
  // VERIFY
  // ==========================================================

  async function handleVerify() {

    setError(null);


    if (
      paymentStatus !==
      "SUBMITTED"
    ) {

      setError(
        "Only submitted payments can be verified."
      );

      return;
    }


    if (!hasProof) {

      setError(
        "Payment proof is required before verification."
      );

      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to verify this payment?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setLoading("verify");


      await verifyPayment(
        orderId
      );


      window.location.reload();


    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Failed to verify payment."
      );


    } finally {

      setLoading(null);

    }
  }


  // ==========================================================
  // REJECT
  // ==========================================================

  async function handleReject() {

    setError(null);


    if (
      paymentStatus !==
      "SUBMITTED"
    ) {

      setError(
        "Only submitted payments can be rejected."
      );

      return;
    }


    if (!hasProof) {

      setError(
        "Payment proof is required before rejection."
      );

      return;
    }


    const trimmedNote =
      note.trim();


    if (!trimmedNote) {

      setError(
        "Please enter a reason before rejecting the payment."
      );

      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to reject this payment?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setLoading("reject");


      await rejectPayment(
        orderId,
        trimmedNote
      );


      window.location.reload();


    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Failed to reject payment."
      );


    } finally {

      setLoading(null);

    }
  }


  // ==========================================================
  // VERIFIED
  // ==========================================================

  if (
    paymentStatus ===
    "VERIFIED"
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
              shrink-0
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
              Payment Verified
            </p>


            <p
              className="
                mt-1
                text-sm
                text-emerald-700
              "
            >
              This payment has already been verified.
            </p>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================================
  // REJECTED
  // ==========================================================

  if (
    paymentStatus ===
    "REJECTED"
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
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
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


          <div className="min-w-0">

            <p
              className="
                font-medium
                text-red-900
              "
            >
              Payment Rejected
            </p>


            <p
              className="
                mt-1
                text-sm
                text-red-700
              "
            >
              The customer needs to submit a new payment proof.
            </p>


            {adminNote && (

              <div
                className="
                  mt-4
                  rounded-lg
                  border
                  border-red-200
                  bg-white
                  p-3
                  sm:p-4
                "
              >

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-red-500
                  "
                >
                  Admin Note
                </p>


                <p
                  className="
                    mt-2
                    whitespace-pre-line
                    text-sm
                    leading-6
                    text-neutral-700
                  "
                >
                  {adminNote}
                </p>

              </div>

            )}

          </div>

        </div>

      </div>
    );
  }


  // ==========================================================
  // PENDING WITHOUT PROOF
  // ==========================================================

  if (
    paymentStatus ===
      "PENDING" &&
    !hasProof
  ) {

    return (
      <div
        className="
          rounded-xl
          border
          border-neutral-200
          bg-neutral-50
          p-4
          sm:p-5
        "
      >

        <div
          className="
            flex
            items-start
            gap-3
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-neutral-100
              text-neutral-500
            "
          >

            <Clock
              className="h-5 w-5"
            />

          </div>


          <div>

            <p
              className="
                font-medium
                text-neutral-700
              "
            >
              Waiting for Payment Proof
            </p>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-neutral-500
              "
            >
              The customer must upload a payment receipt before the payment can be reviewed.
            </p>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================================
  // ONLY SUBMITTED PAYMENTS CAN BE REVIEWED
  // ==========================================================

  if (
    paymentStatus !==
    "SUBMITTED"
  ) {

    return (
      <div
        className="
          rounded-xl
          border
          border-neutral-200
          bg-neutral-50
          p-4
          sm:p-5
        "
      >

        <p
          className="
            text-sm
            font-medium
            text-neutral-700
          "
        >
          Payment Not Ready for Review
        </p>


        <p
          className="
            mt-1
            text-sm
            leading-6
            text-neutral-500
          "
        >
          This payment is not currently available for verification.
        </p>

      </div>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  return (
    <div className="space-y-5">


      {/* ====================================================
          REJECTION NOTE
          ==================================================== */}

      <div>

        <label
          htmlFor="payment-admin-note"
          className="
            block
            text-sm
            font-medium
            text-neutral-900
          "
        >
          Admin Note
        </label>


        <p
          className="
            mt-1
            text-xs
            text-neutral-500
          "
        >
          Required when rejecting a payment.
        </p>


        <textarea
          id="payment-admin-note"
          value={note}
          onChange={(event) =>
            setNote(
              event.target.value
            )
          }
          rows={4}
          maxLength={1000}
          placeholder="Example: Payment amount does not match the order total."
          disabled={
            loading !== null
          }
          className="
            mt-3
            w-full
            rounded-xl
            border
            border-neutral-300
            p-4
            text-sm
            outline-none
            transition
            focus:border-black
            disabled:bg-neutral-100
          "
        />


        <div className="mt-1 text-right">

          <span
            className="
              text-xs
              text-neutral-400
            "
          >
            {note.length}/1000
          </span>

        </div>

      </div>


      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-3
            py-3
            text-xs
            leading-5
            sm:px-4
            sm:text-sm
            sm:leading-6
            text-red-700
          "
        >
          {error}
        </div>

      )}


      {/* ====================================================
          ACTIONS
          ==================================================== */}

      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
        "
      >

        {/* ==================================================
            VERIFY
            ================================================== */}

        <button
          type="button"
          onClick={
            handleVerify
          }
          disabled={
            loading !== null
          }
          className="
            inline-flex
            min-h-11
            flex-1
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-black
            px-4
            py-3
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
          "verify" ? (

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

          Verify Payment

        </button>


        {/* ==================================================
            REJECT
            ================================================== */}

        <button
          type="button"
          onClick={
            handleReject
          }
          disabled={
            loading !== null
          }
          className="
            inline-flex
            min-h-11
            flex-1
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-red-200
            bg-white
            px-4
            py-3
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
          "reject" ? (

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

          Reject Payment

        </button>

      </div>

    </div>
  );
}