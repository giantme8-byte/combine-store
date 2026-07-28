import { Inquiry, InquiryStatus, Product } from "@prisma/client";

import ViewInquiryButton from "./ViewInquiryButton";

type InquiryWithItems = Inquiry & {
  items: {
    product: Product;
    quantity: number;
    notes: string | null;
  }[];
};

type InquiryRowProps = {
  inquiry: InquiryWithItems;
};

function getStatusColor(status: InquiryStatus) {
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

export default function InquiryRow({
  inquiry,
}: InquiryRowProps) {
  return (
    <tr className="border-b">
      <td className="px-6 py-4 font-medium">
        {inquiry.name}
      </td>

      <td className="px-6 py-4">
        {inquiry.whatsapp}
      </td>

      <td className="px-6 py-4 text-center">
        {inquiry.items.length}
      </td>

      <td className="px-6 py-4 text-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
            inquiry.status
          )}`}
        >
          {inquiry.status}
        </span>
      </td>

      <td className="px-6 py-4">
        {inquiry.createdAt.toLocaleDateString()}
      </td>

      <td className="px-6 py-4 text-right">
        <ViewInquiryButton
          inquiry={inquiry}
        />
      </td>
    </tr>
  );
}