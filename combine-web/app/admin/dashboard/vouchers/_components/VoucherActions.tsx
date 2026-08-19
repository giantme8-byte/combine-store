"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Power,
  Trash2,
} from "lucide-react";

import {
  deleteVoucher,
  toggleVoucherStatus,
} from "../_actions/voucher.actions";


// ============================================================
// PROPS
// ============================================================

type VoucherActionsProps = {
  id: number;

  isActive: boolean;

  usageCount: number;
};


// ============================================================
// COMPONENT
// ============================================================

export default function VoucherActions({
  id,
  isActive,
  usageCount,
}: VoucherActionsProps) {

  const [
    isPending,
    startTransition,
  ] = useTransition();


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  function handleToggle() {

    if (
      isPending
    ) {
      return;
    }


    setError(null);


    startTransition(
      async () => {

        try {

          await toggleVoucherStatus(
            id
          );

        } catch (
          error
        ) {

          if (
            error instanceof Error
          ) {

            if (
              error.message.includes(
                "NEXT_REDIRECT"
              )
            ) {

              return;

            }


            setError(
              error.message
            );

            return;

          }


          setError(
            "Unable to update voucher status."
          );

        }

      }
    );

  }


  // ==========================================================
  // DELETE
  // ==========================================================

  function handleDelete() {

    if (
      isPending
    ) {
      return;
    }


    if (
      usageCount > 0
    ) {

      setError(
        "This voucher has already been used. Please deactivate it instead."
      );

      return;

    }


    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this voucher?"
      );


    if (
      !confirmed
    ) {
      return;
    }


    setError(null);


    startTransition(
      async () => {

        try {

          await deleteVoucher(
            id
          );

        } catch (
          error
        ) {

          if (
            error instanceof Error
          ) {

            if (
              error.message.includes(
                "NEXT_REDIRECT"
              )
            ) {

              return;

            }


            setError(
              error.message
            );

            return;

          }


          setError(
            "Unable to delete voucher."
          );

        }

      }
    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        flex
        flex-col
        items-end
        gap-2
      "
    >

      {/* ================================================== */}
      {/* BUTTONS */}
      {/* ================================================== */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        {/* ==================================================
            TOGGLE
            ================================================== */}

        <button
          type="button"
          onClick={
            handleToggle
          }
          disabled={
            isPending
          }
          title={
            isActive
              ? "Deactivate voucher"
              : "Activate voucher"
          }
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-neutral-200
            px-3
            py-2
            text-xs
            font-medium
            text-neutral-700
            transition-colors
            hover:bg-neutral-100
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          <Power
            size={15}
          />

          {isActive
            ? "Deactivate"
            : "Activate"}

        </button>


        {/* ==================================================
            DELETE
            ================================================== */}

        <button
          type="button"
          onClick={
            handleDelete
          }
          disabled={
            isPending ||
            usageCount > 0
          }
          title={
            usageCount > 0
              ? "Used vouchers cannot be deleted"
              : "Delete voucher"
          }
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-red-200
            px-3
            py-2
            text-xs
            font-medium
            text-red-600
            transition-colors
            hover:bg-red-50
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >

          <Trash2
            size={15}
          />

          Delete

        </button>

      </div>


      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (

        <div
          className="
            max-w-[260px]
            text-right
            text-xs
            text-red-600
          "
        >
          {error}
        </div>

      )}

    </div>

  );

}