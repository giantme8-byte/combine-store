"use client";

import { useState } from "react";

import {
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import {
  deletePaymentMethod,
} from "../_actions/payment-method.actions";

type Props = {
  id: number;
  name: string;
};

export default function DeletePaymentMethodButton({
  id,
  name,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      await deletePaymentMethod(id);
    } catch (error) {
      console.error(
        "Delete payment method error:",
        error
      );

      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          border
          border-red-200
          px-3
          py-2
          text-sm
          font-medium
          text-red-600
          transition
          hover:bg-red-50
        "
      >
        <Trash2 className="h-4 w-4" />

        Delete
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              if (!deleting) {
                setOpen(false);
              }
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
            "
          >
            {/* Header */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-neutral-900">
                  Delete Payment Method?
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-neutral-900">
                    {name}
                  </span>
                  ?
                </p>
              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setOpen(false)
                }
                className="
                  rounded-lg
                  p-2
                  text-neutral-400
                  transition
                  hover:bg-neutral-100
                  hover:text-neutral-700
                  disabled:cursor-not-allowed
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Warning */}

            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3">
              <p className="text-xs leading-5 text-red-700">
                This payment method will be
                permanently removed. If it has a QR
                image, the QR image will also be
                removed from Cloudinary.
              </p>
            </div>

            {/* Actions */}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setOpen(false)
                }
                className="
                  rounded-xl
                  border
                  border-neutral-200
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-neutral-700
                  transition
                  hover:bg-neutral-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  void handleDelete();
                }}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />

                    Delete
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