import {
  Inquiry,
  InquiryStatus,
  Product,
} from "@prisma/client";

import InquiryRow from "./InquiryRow";
import ViewInquiryButton from "./ViewInquiryButton";
import DeleteInquiryButton from "./DeleteInquiryButton";


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


type InquiryTableProps = {
  inquiries: InquiryWithItems[];
};


// ============================================================
// STATUS COLOR
// ============================================================

function getStatusColor(
  status: InquiryStatus
) {

  switch (status) {

    case "PENDING":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "CONTACTED":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-200";

    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-neutral-50 text-neutral-700 border-neutral-200";

  }

}


// ============================================================
// COMPONENT
// ============================================================

export default function InquiryTable({
  inquiries,
}: InquiryTableProps) {

  return (

    <>

      {/* ======================================================
          DESKTOP TABLE
          ====================================================== */}

      <div
        className="
          hidden
          overflow-hidden
          rounded-2xl
          border
          border-neutral-200
          bg-white
          md:block
        "
      >

        <table
          className="
            w-full
          "
        >

          {/* ==================================================
              TABLE HEADER
              ================================================== */}

          <thead
            className="
              border-b
              border-neutral-200
              bg-neutral-50
            "
          >

            <tr>

              {/* =================================================
                  CUSTOMER
                  ================================================= */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                Customer
              </th>


              {/* =================================================
                  WHATSAPP
                  ================================================= */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                WhatsApp
              </th>


              {/* =================================================
                  PRODUCTS
                  ================================================= */}

              <th
                className="
                  px-6
                  py-4
                  text-center
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                Products
              </th>


              {/* =================================================
                  STATUS
                  ================================================= */}

              <th
                className="
                  px-6
                  py-4
                  text-center
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                Status
              </th>


              {/* =================================================
                  CREATED
                  ================================================= */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                Created
              </th>


              {/* =================================================
                  ACTIONS
                  ================================================= */}

              <th
                className="
                  px-6
                  py-4
                  text-right
                  text-sm
                  font-medium
                  text-neutral-700
                "
              >
                Actions
              </th>

            </tr>

          </thead>


          {/* ==================================================
              TABLE BODY
              ================================================== */}

          <tbody>

            {inquiries.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="
                    px-6
                    py-12
                    text-center
                    text-sm
                    text-neutral-500
                  "
                >
                  No inquiries found.
                </td>

              </tr>

            ) : (

              inquiries.map(
                (inquiry) => (

                  <InquiryRow
                    key={
                      inquiry.id
                    }
                    inquiry={
                      inquiry
                    }
                  />

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* ======================================================
          MOBILE CARDS
          ====================================================== */}

      <div
        className="
          space-y-4
          md:hidden
        "
      >

        {inquiries.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-white
              px-5
              py-12
              text-center
              text-sm
              text-neutral-500
            "
          >
            No inquiries found.
          </div>

        ) : (

          inquiries.map(
            (inquiry) => (

              <MobileInquiryCard
                key={
                  inquiry.id
                }
                inquiry={
                  inquiry
                }
              />

            )
          )

        )}

      </div>

    </>

  );

}


// ============================================================
// MOBILE CARD
// ============================================================

function MobileInquiryCard({
  inquiry,
}: {
  inquiry: InquiryWithItems;
}) {

  return (

    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-neutral-200
        bg-white
      "
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
          border-b
          border-neutral-100
          px-4
          py-4
        "
      >

        {/* ====================================================
            CUSTOMER
            ==================================================== */}

        <div
          className="
            min-w-0
            flex-1
          "
        >

          <p
            className="
              truncate
              text-base
              font-medium
              text-neutral-900
            "
          >
            {inquiry.name}
          </p>


          <p
            className="
              mt-1
              truncate
              text-xs
              text-neutral-500
            "
          >
            {inquiry.email ??
              "No email provided"}
          </p>

        </div>


        {/* ====================================================
            STATUS
            ==================================================== */}

        <span
          className={`
            shrink-0
            rounded-full
            border
            px-2.5
            py-1
            text-[11px]
            font-medium
            ${getStatusColor(
              inquiry.status
            )}
          `}
        >
          {inquiry.status}
        </span>

      </div>


      {/* ======================================================
          DETAILS
          ====================================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-x-4
          gap-y-5
          px-4
          py-4
        "
      >

        {/* ====================================================
            WHATSAPP
            ==================================================== */}

        <div
          className="
            min-w-0
          "
        >

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.15em]
              text-neutral-400
            "
          >
            WhatsApp
          </p>


          <p
            className="
              mt-1
              truncate
              text-sm
              text-neutral-700
            "
          >
            {inquiry.whatsapp}
          </p>

        </div>


        {/* ====================================================
            PRODUCTS
            ==================================================== */}

        <div>

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.15em]
              text-neutral-400
            "
          >
            Products
          </p>


          <p
            className="
              mt-1
              text-sm
              font-medium
              text-neutral-900
            "
          >
            {inquiry.items.length}
          </p>

        </div>


        {/* ====================================================
            CREATED
            ==================================================== */}

        <div
          className="
            col-span-2
          "
        >

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.15em]
              text-neutral-400
            "
          >
            Created
          </p>


          <p
            className="
              mt-1
              text-sm
              text-neutral-700
            "
          >
            {inquiry.createdAt.toLocaleDateString(
              "en-MY",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </p>

        </div>

      </div>


      {/* ======================================================
          ACTIONS
          ====================================================== */}

      <div
        className="
          flex
          items-center
          gap-2
          border-t
          border-neutral-100
          px-4
          py-3
        "
      >

        {/* ====================================================
            VIEW
            ==================================================== */}

        <div
          className="
            flex-1
          "
        >

          <ViewInquiryButton
            inquiry={
              inquiry
            }
          />

        </div>


        {/* ====================================================
            DELETE
            ==================================================== */}

        <DeleteInquiryButton
          inquiryId={
            inquiry.id
          }
          customerName={
            inquiry.name
          }
        />

      </div>

    </div>

  );

}