"use client";

import { useState } from "react";

import {
  Check,
  Loader2,
  Truck,
} from "lucide-react";

import {
  updateShippingInformation,
} from "../_actions/order.actions";


type ShippingInformationFormProps = {
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

  trackingUrl: string | null;
};


export default function ShippingInformationForm({
  orderId,
  status,
  shippingCourier,
  trackingNumber,
  trackingUrl,
}: ShippingInformationFormProps) {

  // ==========================================================
  // SHIPPING METHOD
  // ==========================================================

  const shippingMethod = "ABX Express";


  // ==========================================================
  // TRACKING NUMBER
  // ==========================================================

  const [
    tracking,
    setTracking,
  ] = useState(
    trackingNumber ?? ""
  );


  // ==========================================================
  // TRACKING URL
  // ==========================================================

  const [
    url,
    setUrl,
  ] = useState(
    trackingUrl ?? ""
  );


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  const [
    saved,
    setSaved,
  ] = useState(false);


  // ==========================================================
  // SAVE SHIPPING INFORMATION
  // ==========================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setError(null);
    setSaved(false);


    const trimmedTracking =
      tracking.trim();

    const trimmedUrl =
      url.trim();


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!trimmedTracking) {

      setError(
        "Tracking number is required."
      );

      return;
    }


    if (trimmedUrl) {

      try {

        new URL(
          trimmedUrl
        );

      } catch {

        setError(
          "Please enter a valid tracking URL."
        );

        return;
      }

    }


    // ========================================================
    // SAVE
    // ========================================================

    try {

      setLoading(true);


      await updateShippingInformation(
        orderId,
        trimmedTracking,
        trimmedUrl
      );


      setSaved(true);


      window.location.reload();


    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save shipping information."
      );


    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // COMPLETED / CANCELLED
  // ==========================================================

  if (
    status === "COMPLETED" ||
    status === "CANCELLED"
  ) {

    if (
      !shippingCourier &&
      !trackingNumber &&
      !trackingUrl
    ) {

      return (
        <div
          className="
            rounded-xl
            border
            border-neutral-200
            bg-neutral-50
            p-5
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-neutral-700
            "
          >
            No Shipping Information
          </p>


          <p
            className="
              mt-1
              text-sm
              text-neutral-500
            "
          >
            Shipping information was not added to this order.
          </p>

        </div>
      );

    }

  }


  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >


      {/* ====================================================
          EXISTING SHIPPING STATUS
          ==================================================== */}

      {shippingCourier &&
        trackingNumber && (

        <div
          className="
            rounded-xl
            border
            border-neutral-200
            bg-neutral-50
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
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
                bg-white
                text-neutral-700
              "
            >

              <Truck
                className="h-5 w-5"
              />

            </div>


            <div>

              <p
                className="
                  text-sm
                  font-medium
                  text-neutral-900
                "
              >
                Shipping Information Saved
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  text-neutral-500
                "
              >
                {shippingCourier} ·{" "}
                {trackingNumber}
              </p>

            </div>

          </div>

        </div>

      )}


      {/* ====================================================
          SHIPPING METHOD
          ==================================================== */}

      <div className="space-y-2">

        <label
          htmlFor="shipping-method"
          className="
            block
            text-sm
            font-medium
            text-neutral-900
          "
        >
          Shipping Method
        </label>


        <div
          id="shipping-method"
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            border
            border-neutral-300
            bg-neutral-50
            px-4
            py-3
            text-sm
            text-neutral-900
          "
        >

          <Truck
            className="
              h-4
              w-4
              text-neutral-500
            "
          />

          <span>
            {shippingMethod}
          </span>

        </div>


        <p
          className="
            text-xs
            text-neutral-500
          "
        >
          Shipping method is fixed to ABX Express.
        </p>

      </div>


      {/* ====================================================
          TRACKING NUMBER
          ==================================================== */}

      <div className="space-y-2">

        <label
          htmlFor="tracking-number"
          className="
            block
            text-sm
            font-medium
            text-neutral-900
          "
        >
          Tracking Number
        </label>


        <input
          id="tracking-number"
          type="text"
          value={tracking}
          onChange={(event) => {

            setTracking(
              event.target.value
            );

            setSaved(false);
            setError(null);

          }}
          placeholder="Enter ABX tracking number"
          disabled={
            loading ||
            status === "COMPLETED" ||
            status === "CANCELLED"
          }
          className="
            w-full
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-4
            py-3
            text-sm
            outline-none
            transition
            placeholder:text-neutral-400
            focus:border-black
            disabled:cursor-not-allowed
            disabled:bg-neutral-100
          "
        />

      </div>


      {/* ====================================================
          TRACKING URL
          ==================================================== */}

      <div className="space-y-2">

        <label
          htmlFor="tracking-url"
          className="
            block
            text-sm
            font-medium
            text-neutral-900
          "
        >
          Tracking URL

          <span className="ml-1 text-neutral-400">
            (Optional)
          </span>

        </label>


        <input
          id="tracking-url"
          type="url"
          value={url}
          onChange={(event) => {

            setUrl(
              event.target.value
            );

            setSaved(false);
            setError(null);

          }}
          placeholder="https://..."
          disabled={
            loading ||
            status === "COMPLETED" ||
            status === "CANCELLED"
          }
          className="
            w-full
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-4
            py-3
            text-sm
            outline-none
            transition
            placeholder:text-neutral-400
            focus:border-black
            disabled:cursor-not-allowed
            disabled:bg-neutral-100
          "
        />

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
            px-4
            py-3
            text-sm
            leading-6
            text-red-700
          "
        >

          {error}

        </div>

      )}


      {/* ====================================================
          SUCCESS
          ==================================================== */}

      {saved && (

        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3
            text-sm
            text-emerald-700
          "
        >

          <Check
            className="h-4 w-4"
          />

          Shipping information saved.

        </div>

      )}


      {/* ====================================================
          SAVE BUTTON
          ==================================================== */}

      {status !== "COMPLETED" &&
        status !== "CANCELLED" && (

        <button
          type="submit"
          disabled={
            loading ||
            status !== "PROCESSING" &&
            status !== "SHIPPED"
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-black
            px-5
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

          {loading ? (

            <Loader2
              className="
                h-4
                w-4
                animate-spin
              "
            />

          ) : (

            <Truck
              className="h-4 w-4"
            />

          )}


          {shippingCourier &&
          trackingNumber
            ? "Update Shipping Information"
            : "Save Shipping Information"}

        </button>

      )}

    </form>
  );

}