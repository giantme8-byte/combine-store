"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Inquiry,
  InquiryStatus,
  Product,
} from "@prisma/client";

import {
  updateInquiryStatus,
} from "../_actions/inquiry.actions";


// ============================================================
// TYPES
// ============================================================

type InquiryWithItems = Inquiry & {
  items: {
    product: Product;

    quantity: number;

    color: string | null;

    variant: string | null;

    dimensions: string | null;

    packaging: string | null;

    notes: string | null;
  }[];
};


type ViewInquiryButtonProps = {
  inquiry: InquiryWithItems;
};


// ============================================================
// COMPONENT
// ============================================================

export default function ViewInquiryButton({
  inquiry,
}: ViewInquiryButtonProps) {

  const [
    open,
    setOpen,
  ] = useState(false);


  const [
    status,
    setStatus,
  ] = useState<InquiryStatus>(
    inquiry.status
  );


  const [
    isPending,
    startTransition,
  ] = useTransition();


  const router =
    useRouter();


  // ==========================================================
  // WHATSAPP
  // ==========================================================

  const phone =
    inquiry.whatsapp.replace(
      /\D/g,
      ""
    );


  const whatsappMessage =
    encodeURIComponent(
      `Hi ${inquiry.name},

Thank you for your inquiry with COMBINE.

We have received your inquiry and will get back to you as soon as possible.

If you have any additional questions, feel free to let us know.

Best regards,
COMBINE`
    );


  // ==========================================================
  // CLOSE
  // ==========================================================

  function handleClose() {

    if (
      isPending
    ) {
      return;
    }


    setStatus(
      inquiry.status
    );


    setOpen(
      false
    );

  }


  // ==========================================================
  // SAVE STATUS
  // ==========================================================

  function handleSaveStatus() {

    startTransition(
      async () => {

        try {

          await updateInquiryStatus(
            inquiry.id,
            status
          );


          setOpen(
            false
          );


          router.refresh();

        } catch (
          error
        ) {

          console.error(
            "Failed to update inquiry status:",
            error
          );

        }

      }
    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <>

      {/* ======================================================
          VIEW BUTTON
          ====================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="
          inline-flex
          items-center
          justify-center
          rounded-lg
          border
          border-neutral-200
          px-3
          py-2
          text-sm
          font-medium
          text-neutral-700
          transition
          hover:bg-neutral-100
        "
      >
        View
      </button>


      {/* ======================================================
          MODAL
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
            p-3
            sm:p-6
          "
          onMouseDown={(
            event
          ) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              handleClose();

            }

          }}
        >

          <div
            className="
              flex
              max-h-[94vh]
              w-full
              max-w-3xl
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
              sm:max-h-[90vh]
              sm:rounded-3xl
            "
          >

            {/* ==================================================
                HEADER
                ================================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-4
                border-b
                border-neutral-100
                px-4
                py-4
                sm:px-8
                sm:py-5
              "
            >

              <div
                className="
                  min-w-0
                "
              >

                <h2
                  className="
                    text-lg
                    font-medium
                    text-neutral-900
                    sm:text-2xl
                    sm:font-light
                  "
                >
                  Inquiry Details
                </h2>

                <p
                  className="
                    mt-1
                    truncate
                    text-xs
                    text-neutral-400
                    sm:text-sm
                  "
                >
                  #{inquiry.id}
                </p>

              </div>


              <button
                type="button"
                onClick={
                  handleClose
                }
                disabled={
                  isPending
                }
                className="
                  shrink-0
                  rounded-lg
                  border
                  border-neutral-200
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-neutral-600
                  transition
                  hover:bg-neutral-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:px-4
                  sm:text-sm
                "
              >
                Close
              </button>

            </div>


            {/* ==================================================
                CONTENT
                ================================================== */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                px-4
                py-5
                sm:px-8
                sm:py-7
              "
            >

              <div
                className="
                  space-y-6
                  sm:space-y-8
                "
              >

                {/* ==================================================
                    CUSTOMER
                    ================================================== */}

                <div>

                  <h3
                    className="
                      text-base
                      font-medium
                      text-neutral-900
                      sm:text-lg
                    "
                  >
                    Customer
                  </h3>


                  <div
                    className="
                      mt-3
                      space-y-3
                      text-sm
                      text-neutral-600
                    "
                  >

                    {/* NAME */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <span
                        className="
                          shrink-0
                          font-medium
                          text-neutral-500
                        "
                      >
                        Name
                      </span>

                      <span
                        className="
                          max-w-[65%]
                          text-right
                          text-neutral-900
                        "
                      >
                        {inquiry.name}
                      </span>

                    </div>


                    {/* WHATSAPP */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <span
                        className="
                          shrink-0
                          font-medium
                          text-neutral-500
                        "
                      >
                        WhatsApp
                      </span>

                      <span
                        className="
                          max-w-[65%]
                          break-all
                          text-right
                          text-neutral-900
                        "
                      >
                        {inquiry.whatsapp}
                      </span>

                    </div>


                    {/* EMAIL */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <span
                        className="
                          shrink-0
                          font-medium
                          text-neutral-500
                        "
                      >
                        Email
                      </span>

                      <span
                        className="
                          max-w-[65%]
                          break-all
                          text-right
                        "
                      >
                        {inquiry.email ??
                          "-"}
                      </span>

                    </div>


                    {/* COUNTRY */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <span
                        className="
                          shrink-0
                          font-medium
                          text-neutral-500
                        "
                      >
                        Country
                      </span>

                      <span
                        className="
                          max-w-[65%]
                          text-right
                        "
                      >
                        {inquiry.country ??
                          "-"}
                      </span>

                    </div>


                    {/* WHATSAPP BUTTON */}

                    <div
                      className="
                        pt-2
                      "
                    >

                      <a
                        href={`https://wa.me/${phone}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex
                          w-full
                          items-center
                          justify-center
                          rounded-xl
                          bg-green-600
                          px-4
                          py-3
                          text-sm
                          font-medium
                          text-white
                          transition
                          hover:bg-green-700
                          sm:w-auto
                        "
                      >
                        💬 Open WhatsApp
                      </a>

                    </div>

                  </div>

                </div>


                {/* ==================================================
                    PRODUCTS
                    ================================================== */}

                <div>

                  <h3
                    className="
                      text-base
                      font-medium
                      text-neutral-900
                      sm:text-lg
                    "
                  >
                    Products
                  </h3>


                  <div
                    className="
                      mt-4
                      space-y-4
                    "
                  >

                    {inquiry.items.map(
                      (item) => (

                        <div
                          key={
                            item.product.id
                          }
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
                              sm:text-xs
                            "
                          >
                            {item.product.brand}
                          </p>


                          <h4
                            className="
                              mt-2
                              text-base
                              font-medium
                              text-neutral-900
                              sm:text-lg
                            "
                          >
                            {item.product.name}
                          </h4>


                          <div
                            className="
                              mt-4
                              space-y-3
                              text-sm
                              text-neutral-600
                            "
                          >

                            {/* REFERENCE */}

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >

                              <span
                                className="
                                  shrink-0
                                  font-medium
                                  text-neutral-500
                                "
                              >
                                Reference
                              </span>

                              <span
                                className="
                                  max-w-[60%]
                                  break-all
                                  text-right
                                "
                              >
                                {item.product.sku ??
                                  "-"}
                              </span>

                            </div>


                            {/* COLOUR */}

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >

                              <span
                                className="
                                  shrink-0
                                  font-medium
                                  text-neutral-500
                                "
                              >
                                Colour
                              </span>

                              <span
                                className="
                                  max-w-[60%]
                                  text-right
                                "
                              >
                                {item.color ??
                                  "-"}
                              </span>

                            </div>


                            {/* SIZE */}

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >

                              <span
                                className="
                                  shrink-0
                                  font-medium
                                  text-neutral-500
                                "
                              >
                                Size
                              </span>

                              <span
                                className="
                                  max-w-[60%]
                                  text-right
                                "
                              >
                                {item.variant ??
                                  "-"}
                              </span>

                            </div>


                            {/* DIMENSIONS */}

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >

                              <span
                                className="
                                  shrink-0
                                  font-medium
                                  text-neutral-500
                                "
                              >
                                Dimensions
                              </span>

                              <span
                                className="
                                  max-w-[60%]
                                  text-right
                                "
                              >
                                {item.dimensions ??
                                  "-"}
                              </span>

                            </div>


                            {/* PACKAGING */}

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                              "
                            >

                              <span
                                className="
                                  shrink-0
                                  font-medium
                                  text-neutral-500
                                "
                              >
                                Packaging
                              </span>

                              <span
                                className="
                                  max-w-[60%]
                                  text-right
                                "
                              >
                                {item.packaging ??
                                  "-"}
                              </span>

                            </div>


                            {/* QUANTITY */}

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-4
                                border-t
                                border-neutral-200
                                pt-3
                              "
                            >

                              <span
                                className="
                                  font-semibold
                                  text-neutral-700
                                "
                              >
                                Quantity
                              </span>

                              <span
                                className="
                                  font-semibold
                                  text-neutral-900
                                "
                              >
                                {item.quantity}
                              </span>

                            </div>

                          </div>


                          {/* NOTES */}

                          {item.notes && (

                            <div
                              className="
                                mt-4
                                rounded-xl
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
                                  sm:text-xs
                                "
                              >
                                Customer Notes
                              </p>


                              <p
                                className="
                                  mt-2
                                  whitespace-pre-wrap
                                  break-words
                                  text-sm
                                  text-neutral-700
                                "
                              >
                                {item.notes}
                              </p>

                            </div>

                          )}

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* ==================================================
                    CUSTOMER MESSAGE
                    ================================================== */}

                <div>

                  <h3
                    className="
                      text-base
                      font-medium
                      text-neutral-900
                      sm:text-lg
                    "
                  >
                    Customer Message
                  </h3>


                  <div
                    className="
                      mt-3
                      rounded-xl
                      border
                      border-neutral-200
                      bg-neutral-50
                      p-4
                    "
                  >

                    <p
                      className="
                        whitespace-pre-wrap
                        break-words
                        text-sm
                        leading-6
                        text-neutral-700
                      "
                    >
                      {inquiry.message ||
                        "-"}
                    </p>

                  </div>

                </div>


                {/* ==================================================
                    STATUS
                    ================================================== */}

                <div>

                  <h3
                    className="
                      text-base
                      font-medium
                      text-neutral-900
                      sm:text-lg
                    "
                  >
                    Status
                  </h3>


                  <select
                    value={
                      status
                    }
                    onChange={(
                      event
                    ) =>
                      setStatus(
                        event.target.value as InquiryStatus
                      )
                    }
                    disabled={
                      isPending
                    }
                    className="
                      mt-3
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-neutral-200
                      bg-white
                      px-4
                      text-sm
                      outline-none
                      transition
                      focus:border-neutral-400
                      focus:ring-2
                      focus:ring-black/5
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="CONTACTED">
                      Contacted
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>

                  </select>


                  <button
                    type="button"
                    onClick={
                      handleSaveStatus
                    }
                    disabled={
                      isPending
                    }
                    className="
                      mt-3
                      w-full
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
                      sm:w-auto
                    "
                  >
                    {isPending
                      ? "Saving..."
                      : "Save Status"}
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </>

  );

}