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


// ============================================================
// PROPS
// ============================================================

type Props = {
  id: number;
  name: string;
};


// ============================================================
// COMPONENT
// ============================================================

export default function DeletePaymentMethodButton({
  id,
  name,
}: Props) {

  const [
    open,
    setOpen,
  ] = useState(false);


  const [
    deleting,
    setDeleting,
  ] = useState(false);


  // ==========================================================
  // DELETE
  // ==========================================================

  async function handleDelete() {

    setDeleting(true);


    try {

      await deletePaymentMethod(
        id
      );

    } catch (error) {

      console.error(
        "Delete payment method error:",
        error
      );


      setDeleting(false);

    }

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <>

      {/* ======================================================
          DELETE BUTTON
          ====================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="
          inline-flex
          min-h-10
          w-full
          items-center
          justify-center
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

          sm:w-auto
        "
      >

        <Trash2
          className="
            h-4
            w-4
          "
        />

        Delete

      </button>


      {/* ======================================================
          CONFIRMATION MODAL
          ====================================================== */}

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
              p-5
              shadow-2xl

              sm:p-6
            "
          >

            {/* ==================================================
                HEADER
                ================================================== */}

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

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-red-50

                    sm:h-11
                    sm:w-11
                  "
                >

                  <Trash2
                    className="
                      h-5
                      w-5
                      text-red-600
                    "
                  />

                </div>


                <h2
                  className="
                    mt-4
                    text-lg
                    font-semibold
                    text-neutral-900
                  "
                >
                  Delete Payment Method?
                </h2>


                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-neutral-500
                  "
                >
                  Are you sure you want to delete{" "}

                  <span
                    className="
                      font-medium
                      text-neutral-900
                    "
                  >
                    {name}
                  </span>

                  ?
                </p>

              </div>


              {/* CLOSE */}

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setOpen(false)
                }
                className="
                  shrink-0
                  rounded-lg
                  p-2
                  text-neutral-400
                  transition
                  hover:bg-neutral-100
                  hover:text-neutral-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="Close"
              >

                <X
                  className="
                    h-5
                    w-5
                  "
                />

              </button>

            </div>


            {/* ==================================================
                WARNING
                ================================================== */}

            <div
              className="
                mt-5
                rounded-xl
                bg-red-50
                px-4
                py-3
              "
            >

              <p
                className="
                  text-xs
                  leading-5
                  text-red-700
                "
              >
                This payment method will be
                permanently removed. If it has a QR
                image, the QR image will also be
                removed from Cloudinary.
              </p>

            </div>


            {/* ==================================================
                ACTIONS
                ================================================== */}

            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-2

                sm:flex-row
                sm:justify-end
                sm:gap-3
              "
            >

              {/* CANCEL */}

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setOpen(false)
                }
                className="
                  inline-flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
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

                  sm:w-auto
                "
              >
                Cancel
              </button>


              {/* DELETE */}

              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  void handleDelete();
                }}
                className="
                  inline-flex
                  min-h-11
                  w-full
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

                  sm:w-auto
                "
              >

                {deleting ? (

                  <>

                    <Loader2
                      className="
                        h-4
                        w-4
                        animate-spin
                      "
                    />

                    Deleting...

                  </>

                ) : (

                  <>

                    <Trash2
                      className="
                        h-4
                        w-4
                      "
                    />

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