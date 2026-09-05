import {
  Inquiry,
  InquiryStatus,
  Product,
} from "@prisma/client";

import ViewInquiryButton from "./ViewInquiryButton";
import DeleteInquiryButton from "./DeleteInquiryButton";


// ============================================================
// INQUIRY WITH ITEMS
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


// ============================================================
// PROPS
// ============================================================

type InquiryRowProps = {
  inquiry: InquiryWithItems;
};


// ============================================================
// STATUS COLOR
// ============================================================

function getStatusColor(
  status: InquiryStatus
) {

  switch (status) {

    case "PENDING":
      return "bg-yellow-100 text-yellow-800";

    case "CONTACTED":
      return "bg-blue-100 text-blue-800";

    case "COMPLETED":
      return "bg-green-100 text-green-800";

    case "CANCELLED":
      return "bg-red-100 text-red-800";

    default:
      return "bg-neutral-100 text-neutral-700";
  }

}


// ============================================================
// COMPONENT
// ============================================================

export default function InquiryRow({
  inquiry,
}: InquiryRowProps) {

  return (

    <tr
      className="
        border-b
        transition-colors
        hover:bg-neutral-50
      "
    >

      {/* ======================================================
          CUSTOMER
          ====================================================== */}

      <td
        className="
          px-6
          py-4
          font-medium
        "
      >
        {inquiry.name}
      </td>


      {/* ======================================================
          WHATSAPP
          ====================================================== */}

      <td
        className="
          px-6
          py-4
        "
      >
        {inquiry.whatsapp}
      </td>


      {/* ======================================================
          PRODUCTS
          ====================================================== */}

      <td
        className="
          px-6
          py-4
          text-center
        "
      >
        {inquiry.items.length}
      </td>


      {/* ======================================================
          STATUS
          ====================================================== */}

      <td
        className="
          px-6
          py-4
          text-center
        "
      >

        <span
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${getStatusColor(
              inquiry.status
            )}
          `}
        >
          {inquiry.status}
        </span>

      </td>


      {/* ======================================================
          CREATED
          ====================================================== */}

      <td
        className="
          px-6
          py-4
        "
      >
        {inquiry.createdAt.toLocaleDateString()}
      </td>


      {/* ======================================================
          ACTIONS
          ====================================================== */}

      <td
        className="
          px-6
          py-4
        "
      >

        <div
          className="
            flex
            items-center
            justify-end
            gap-2
          "
        >

          <ViewInquiryButton
            inquiry={inquiry}
          />

          <DeleteInquiryButton
            inquiryId={
              inquiry.id
            }
            customerName={
              inquiry.name
            }
          />

        </div>

      </td>

    </tr>

  );

}