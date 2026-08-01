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

export default function ViewInquiryButton({
  inquiry,
}: ViewInquiryButtonProps) {
  const [open, setOpen] = useState(false);

  const [status, setStatus] =
    useState<InquiryStatus>(inquiry.status);

  const [isPending, startTransition] =
    useTransition();

  const router = useRouter();

  const phone = inquiry.whatsapp.replace(
    /\D/g,
    ""
  );

  const whatsappMessage = encodeURIComponent(
`Hi ${inquiry.name},

Thank you for your inquiry with COMBINE.

We have received your inquiry and will get back to you as soon as possible.

If you have any additional questions, feel free to let us know.

Best regards,
COMBINE`
  );

  function handleClose() {
    if (isPending) return;

    setStatus(inquiry.status);
    setOpen(false);
  }

  function handleSaveStatus() {
    startTransition(async () => {
      try {
        await updateInquiryStatus(
          inquiry.id,
          status
        );

        setOpen(false);

        router.refresh();
      } catch (error) {
        console.error(
          "Failed to update inquiry status:",
          error
        );
      }
    });
  }

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
          <div
  className="
    w-full
    max-w-3xl
    max-h-[90vh]
    overflow-y-auto
    rounded-3xl
    bg-white
    p-8
    shadow-xl
  "
>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light">
                Inquiry Details
              </h2>

              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="rounded-lg border px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <div className="mt-8 space-y-6">

              {/* Customer */}
              <div>
                <h3 className="mb-2 font-medium">
                  Customer
                </h3>

<div className="mt-4 grid gap-3 text-sm text-neutral-600">

  <div className="flex justify-between gap-4">
    <span className="font-medium text-neutral-500">
      Name
    </span>

    <span className="text-right">
      {inquiry.name}
    </span>
  </div>

  <div className="flex justify-between gap-4">
    <span className="font-medium text-neutral-500">
      WhatsApp
    </span>

    <span className="text-right">
      {inquiry.whatsapp}
    </span>
  </div>

  <div className="flex justify-between gap-4">
    <span className="font-medium text-neutral-500">
      Email
    </span>

    <span className="text-right">
      {inquiry.email ?? "-"}
    </span>
  </div>

  <div className="flex justify-between gap-4">
    <span className="font-medium text-neutral-500">
      Country
    </span>

    <span className="text-right">
      {inquiry.country ?? "-"}
    </span>
  </div>

  <div className="pt-4">
    <a
      href={`https://wa.me/${phone}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
    >
      💬 Open WhatsApp
    </a>
  </div>

</div>
              </div>

              {/* Products */}
              <div>
<h3 className="mb-4 text-lg font-medium">
  Products
</h3>

<div className="space-y-4">
  {inquiry.items.map((item) => (
    <div
      key={item.product.id}
      className="rounded-2xl border border-neutral-200 bg-white p-5"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
        {item.product.brand}
      </p>

      <h4 className="mt-2 text-lg font-medium text-neutral-900">
        {item.product.name}
      </h4>

      <div className="mt-5 grid gap-3 text-sm text-neutral-600">

        <div className="flex justify-between gap-4">
          <span className="font-medium text-neutral-500">
            Reference
          </span>

          <span className="text-right">
            {item.product.sku ?? "-"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="font-medium text-neutral-500">
            Colour
          </span>

          <span className="text-right">
            {item.color ?? "-"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="font-medium text-neutral-500">
            Size
          </span>

          <span className="text-right">
            {item.variant ?? "-"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="font-medium text-neutral-500">
            Dimensions
          </span>

          <span className="text-right">
            {item.dimensions ?? "-"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="font-medium text-neutral-500">
            Packaging
          </span>

          <span className="text-right">
            {item.packaging ?? "-"}
          </span>
        </div>

        <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3">
          <span className="font-semibold text-neutral-700">
            Quantity
          </span>

          <span className="font-semibold">
            {item.quantity}
          </span>
        </div>

      </div>

      {item.notes && (
        <div className="mt-5 rounded-xl bg-neutral-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Customer Notes
          </p>

          <p className="mt-2 text-sm text-neutral-700">
            {item.notes}
          </p>
        </div>
      )}
    </div>
  ))}
</div>
              </div>

              {/* Customer Message */}
              <div>
                <h3 className="mb-2 font-medium">
                  Customer Message
                </h3>

<div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
  <p className="whitespace-pre-wrap text-sm text-neutral-700">
    {inquiry.message || "-"}
  </p>
</div>
              </div>

              {/* Status */}
              <div>
                <h3 className="mb-2 font-medium">
                  Status
                </h3>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as InquiryStatus
                    )
                  }
                  disabled={isPending}
                  className="w-full rounded-xl border px-4 py-3"
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
                  onClick={handleSaveStatus}
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