import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  UserRole,
} from "@prisma/client";

import {
  requireRole,
} from "@/lib/authorize";

import {
  prisma,
} from "@/lib/prisma";

import {
  updatePaymentMethod,
} from "../../_actions/payment-method.actions";

import PaymentMethodForm from "../../_components/PaymentMethodForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export default async function EditPaymentMethodPage({
  params,
}: Props) {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);

  const {
    id: idParam,
  } = await params;

  const id =
    Number(idParam);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    notFound();
  }

  const paymentMethod =
    await prisma.paymentMethod.findUnique({
      where: {
        id,
      },
    });

  if (!paymentMethod) {
    notFound();
  }

  async function handleUpdate(
    formData: FormData
  ) {
    "use server";

    await updatePaymentMethod(
      id,
      formData
    );
  }

  return (
    <main className="space-y-8">
      {/* =========================================================
          HEADER
          ========================================================= */}

      <div>
        <Link
          href="/admin/dashboard/payment-methods"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-neutral-500
            transition
            hover:text-neutral-900
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Payment Methods
        </Link>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
            SYSTEM
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            Edit Payment Method
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Update the payment details displayed
            to customers during checkout.
          </p>
        </div>
      </div>

      {/* =========================================================
          FORM
          ========================================================= */}

      <PaymentMethodForm
        paymentMethod={{
          id:
            paymentMethod.id,

          name:
            paymentMethod.name,

          type:
            paymentMethod.type,

          bankName:
            paymentMethod.bankName,

          accountName:
            paymentMethod.accountName,

          accountNumber:
            paymentMethod.accountNumber,

          qrImageUrl:
            paymentMethod.qrImageUrl,

          qrPublicId:
            paymentMethod.qrPublicId,

          instructions:
            paymentMethod.instructions,

          active:
            paymentMethod.active,

          sortOrder:
            paymentMethod.sortOrder,
        }}
        action={handleUpdate}
      />
    </main>
  );
}