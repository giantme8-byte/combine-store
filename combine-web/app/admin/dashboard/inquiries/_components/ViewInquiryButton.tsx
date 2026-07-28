"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Inquiry,
  InquiryStatus,
  Product,
} from "@prisma/client";

import { updateInquiryStatus } from "../_actions/inquiry.actions";

type InquiryWithItems = Inquiry & {
  items: {
    product: Product;
    quantity: number;
    notes: string | null;
  }[];
};

type ViewInquiryButtonProps = {
  inquiry: InquiryWithItems;
};

export default function ViewInquiryButton({
  inquiry,
}: ViewInquiryButtonProps) {
  const [open, setOpen] = useState(false);

const [status, setStatus] = useState<InquiryStatus>(
  inquiry.status
);

const [isPending, startTransition] = useTransition();

const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border px-3 py-1 text-sm transition hover:bg-neutral-100"
      >
        View
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light">
                Inquiry Details
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="mb-2 font-medium">
                  Customer
                </h3>

<div className="space-y-1 text-sm">
  <p>
    <strong>Name:</strong> {inquiry.name}
  </p>

  <p>
    <strong>WhatsApp:</strong> {inquiry.whatsapp}
  </p>

  <p>
    <strong>Email:</strong> {inquiry.email ?? "-"}
  </p>

  <p>
    <strong>Country:</strong> {inquiry.country ?? "-"}
  </p>

  <div className="pt-4">
    <a
      href={`https://wa.me/${inquiry.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  `Hi ${inquiry.name},

Thank you for your inquiry with COMBINE.

We have received your inquiry and will get back to you as soon as possible.

If you have any additional questions, feel free to let us know.

Best regards,
COMBINE`
)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
    >
      Open WhatsApp
    </a>
    </div>
  </div>
</div>

              <div>
                <h3 className="mb-2 font-medium">
                  Products
                </h3>

                <div className="space-y-3">
                  {inquiry.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-xl border p-4"
                    >
                      <p className="font-medium">
                        {item.product.name}
                      </p>

                      <p className="text-sm text-neutral-500">
                        Quantity: {item.quantity}
                      </p>

                      {item.notes && (
                        <p className="mt-1 text-sm">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">
                  Customer Message
                </h3>

                <p className="rounded-xl border p-4 text-sm">
                  {inquiry.message || "-"}
                </p>
              </div>
              <div>
  <h3 className="mb-2 font-medium">
    Status
  </h3>

  <select
    value={status}
    onChange={(e) =>
      setStatus(e.target.value as InquiryStatus)
    }
    className="w-full rounded-xl border px-4 py-3"
    disabled={isPending}
  >
    <option value="PENDING">Pending</option>
    <option value="CONTACTED">Contacted</option>
    <option value="COMPLETED">Completed</option>
    <option value="CANCELLED">Cancelled</option>
  </select>

  <button
    type="button"
    onClick={() => {
startTransition(async () => {
  try {
    await updateInquiryStatus(
      inquiry.id,
      status
    );

    setOpen(false);

    router.refresh();
  } catch (error) {
    console.error(error);
    alert("Failed to update inquiry status.");
  }
});
    }}
    disabled={isPending}
    className="mt-4 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-neutral-800 disabled:opacity-50"
  >
    {isPending
      ? "Saving..."
      : "Save Status"}
  </button>
</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}