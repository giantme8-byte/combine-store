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
        w-full
        flex-col
        items-stretch
        gap-2

        sm:w-auto
        sm:items-end
      "
    >

      {/* ================================================== */}
      {/* BUTTONS */}
      {/* ================================================== */}

      <div
        className="
          flex
          w-full
          items-center
          gap-2

          sm:w-auto
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
            min-w-0
            flex-1
            items-center
            justify-center
            gap-1.5
            rounded-lg
            border
            border-neutral-200
            px-2.5
            py-2
            text-[11px]
            font-medium
            text-neutral-700
            transition-colors
            hover:bg-neutral-100
            disabled:cursor-not-allowed
            disabled:opacity-50

            sm:flex-none
            sm:gap-2
            sm:px-3
            sm:py-2
            sm:text-xs
          "
        >

          <Power
            size={14}
            className="shrink-0 sm:h-[15px] sm:w-[15px]"
          />

          <span className="truncate">
            {isActive
              ? "Deactivate"
              : "Activate"}
          </span>

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
            min-w-0
            flex-1
            items-center
            justify-center
            gap-1.5
            rounded-lg
            border
            border-red-200
            px-2.5
            py-2
            text-[11px]
            font-medium
            text-red-600
            transition-colors
            hover:bg-red-50
            disabled:cursor-not-allowed
            disabled:opacity-40

            sm:flex-none
            sm:gap-2
            sm:px-3
            sm:py-2
            sm:text-xs
          "
        >

          <Trash2
            size={14}
            className="shrink-0 sm:h-[15px] sm:w-[15px]"
          />

          <span className="truncate">
            Delete
          </span>

        </button>

      </div>


      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (

        <div
          className="
            w-full
            max-w-full
            break-words
            text-left
            text-[11px]
            leading-4
            text-red-600

            sm:max-w-[260px]
            sm:text-right
            sm:text-xs
            sm:leading-normal
          "
        >
          {error}
        </div>

      )}

    </div>

  );

}