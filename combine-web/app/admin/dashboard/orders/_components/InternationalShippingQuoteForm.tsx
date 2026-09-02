"use client";

import { useState, useTransition } from "react";

import { quoteInternationalShippingFee } from "../_actions/order.actions";

type InternationalShippingQuoteFormProps = {
  orderId: number;
  currentFee: number;
  quoteStatus: "PENDING" | "QUOTED";
};

export default function InternationalShippingQuoteForm({
  orderId,
  currentFee,
  quoteStatus,
}: InternationalShippingQuoteFormProps) {
  const [shippingFee, setShippingFee] = useState(
    quoteStatus === "QUOTED"
      ? Number(currentFee).toFixed(2)
      : ""
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const fee = Number(shippingFee);

    if (!Number.isFinite(fee) || fee < 0) {
      setError(
        "Please enter a valid shipping fee."
      );
      return;
    }

    startTransition(async () => {
      try {
        const result =
          await quoteInternationalShippingFee(
            orderId,
            fee
          );

        setShippingFee(
          Number(result.shippingFee).toFixed(2)
        );

        setSuccess(
          `Shipping fee updated to RM ${Number(
            result.shippingFee
          ).toFixed(2)}. Order total is now RM ${Number(
            result.finalAmount
          ).toFixed(2)}.`
        );
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Failed to update shipping fee."
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        mt-5
        border-t
        border-amber-200
        pt-5
      "
    >
      <div
        className="
          grid
          gap-4
          sm:grid-cols-[1fr_auto]
          sm:items-end
        "
      >
        <div>
          <label
            htmlFor="international-shipping-fee"
            className="
              block
              text-xs
              font-semibold
              uppercase
              tracking-[0.15em]
              text-amber-800
            "
          >
            Shipping Fee (RM)
          </label>

          <input
            id="international-shipping-fee"
            name="shippingFee"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={shippingFee}
            onChange={(event) => {
              setShippingFee(event.target.value);
              setError("");
              setSuccess("");
            }}
            disabled={isPending}
            placeholder="0.00"
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-amber-300
              bg-white
              px-4
              py-3
              text-sm
              text-neutral-900
              outline-none
              transition
              focus:border-neutral-900
              focus:ring-1
              focus:ring-neutral-900
              disabled:cursor-not-allowed
              disabled:bg-neutral-100
            "
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            rounded-xl
            bg-neutral-900
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-neutral-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isPending
            ? "Saving..."
            : quoteStatus === "QUOTED"
              ? "Update Shipping Fee"
              : "Confirm Shipping Fee"}
        </button>
      </div>

      {error && (
        <p
          className="
            mt-3
            text-sm
            font-medium
            text-red-600
          "
        >
          {error}
        </p>
      )}

      {success && (
        <p
          className="
            mt-3
            text-sm
            font-medium
            text-emerald-700
          "
        >
          {success}
        </p>
      )}
    </form>
  );
}
