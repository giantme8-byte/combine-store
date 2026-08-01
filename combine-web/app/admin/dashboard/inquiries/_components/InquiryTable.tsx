import { Inquiry, Product } from "@prisma/client";

import InquiryRow from "./InquiryRow";

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

export default function InquiryTable({
  inquiries,
}: InquiryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full">
        <thead className="border-b bg-neutral-50">
          <tr>
            <th className="px-6 py-4 text-left">
              Customer
            </th>

            <th className="px-6 py-4 text-left">
              WhatsApp
            </th>

            <th className="px-6 py-4 text-center">
              Products
            </th>

            <th className="px-6 py-4 text-center">
              Status
            </th>

            <th className="px-6 py-4 text-left">
              Created
            </th>

            <th className="px-6 py-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {inquiries.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-10 text-center text-neutral-500"
              >
                No inquiries found.
              </td>
            </tr>
          ) : (
            inquiries.map((inquiry) => (
              <InquiryRow
                key={inquiry.id}
                inquiry={inquiry}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}