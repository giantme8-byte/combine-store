import Link from "next/link";

import {
  CreditCard,
  Pencil,
  Plus,
  QrCode,
  ArrowLeftRight,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/authorize";

import DeletePaymentMethodButton from "./_components/DeletePaymentMethodButton";

export const dynamic = "force-dynamic";

export default async function PaymentMethodsPage() {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);

  const paymentMethods =
    await prisma.paymentMethod.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

  return (
    <main className="space-y-8">
      {/* =========================================================
          HEADER
          ========================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
            SYSTEM
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            Payment Methods
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Manage the payment methods displayed to customers during checkout.
          </p>
        </div>

        <Link
          href="/admin/dashboard/payment-methods/new"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-black
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-neutral-800
          "
        >
          <Plus className="h-4 w-4" />

          Add Payment Method
        </Link>
      </div>

      {/* =========================================================
          CONTENT
          ========================================================= */}

      {paymentMethods.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            px-6
            py-16
            text-center
            shadow-sm
          "
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <CreditCard className="h-6 w-6 text-neutral-500" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-neutral-900">
            No Payment Methods
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
            Add a bank transfer or QR payment method so customers can choose
            how they want to pay.
          </p>

          <Link
            href="/admin/dashboard/payment-methods/new"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-black
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-neutral-800
            "
          >
            <Plus className="h-4 w-4" />

            Add Payment Method
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* =======================================================
              DESKTOP TABLE
              ======================================================= */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Payment Method
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Details
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Order
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paymentMethods.map(
                  (paymentMethod) => {
                    const isQr =
                      paymentMethod.type ===
                      "QR";

                    return (
                      <tr
                        key={
                          paymentMethod.id
                        }
                        className="border-b border-neutral-100 last:border-0"
                      >
                        {/* Payment Method */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                              {isQr ? (
                                <QrCode className="h-5 w-5 text-neutral-600" />
                              ) : (
                                <ArrowLeftRight className="h-5 w-5 text-neutral-600" />
                              )}
                            </div>

                            <div>
                              <p className="font-medium text-neutral-900">
                                {
                                  paymentMethod.name
                                }
                              </p>

                              {paymentMethod.instructions && (
                                <p className="mt-1 max-w-xs truncate text-xs text-neutral-400">
                                  {
                                    paymentMethod.instructions
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Type */}

                        <td className="px-6 py-5">
                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-full
                              bg-neutral-100
                              px-3
                              py-1
                              text-xs
                              font-medium
                              text-neutral-700
                            "
                          >
                            {isQr
                              ? "QR Payment"
                              : "Bank Transfer"}
                          </span>
                        </td>

                        {/* Details */}

                        <td className="px-6 py-5">
                          {isQr ? (
                            <div className="text-sm text-neutral-600">
                              {paymentMethod.qrImageUrl
                                ? "QR Code uploaded"
                                : "No QR Code"}
                            </div>
                          ) : (
                            <div className="space-y-1 text-sm">
                              {paymentMethod.bankName && (
                                <p className="font-medium text-neutral-800">
                                  {
                                    paymentMethod.bankName
                                  }
                                </p>
                              )}

                              {paymentMethod.accountName && (
                                <p className="text-neutral-500">
                                  {
                                    paymentMethod.accountName
                                  }
                                </p>
                              )}

                              {paymentMethod.accountNumber && (
                                <p className="font-mono text-xs text-neutral-500">
                                  {
                                    paymentMethod.accountNumber
                                  }
                                </p>
                              )}

                              {!paymentMethod.bankName &&
                                !paymentMethod.accountName &&
                                !paymentMethod.accountNumber && (
                                  <p className="text-neutral-400">
                                    No bank details
                                  </p>
                                )}
                            </div>
                          )}
                        </td>

                        {/* Status */}

                        <td className="px-6 py-5 text-center">
                          {paymentMethod.active ? (
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-emerald-50
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-emerald-700
                              "
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                              Active
                            </span>
                          ) : (
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-neutral-100
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-neutral-500
                              "
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />

                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Sort Order */}

                        <td className="px-6 py-5 text-center text-sm text-neutral-500">
                          {
                            paymentMethod.sortOrder
                          }
                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/dashboard/payment-methods/${paymentMethod.id}/edit`}
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-neutral-200
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-neutral-700
                                transition
                                hover:bg-neutral-50
                              "
                            >
                              <Pencil className="h-4 w-4" />

                              Edit
                            </Link>

                            <DeletePaymentMethodButton
                              id={
                                paymentMethod.id
                              }
                              name={
                                paymentMethod.name
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* =======================================================
              MOBILE CARDS
              ======================================================= */}

          <div className="divide-y divide-neutral-100 md:hidden">
            {paymentMethods.map(
              (paymentMethod) => {
                const isQr =
                  paymentMethod.type ===
                  "QR";

                return (
                  <div
                    key={
                      paymentMethod.id
                    }
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                          {isQr ? (
                            <QrCode className="h-5 w-5 text-neutral-600" />
                          ) : (
                            <ArrowLeftRight className="h-5 w-5 text-neutral-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-neutral-900">
                            {
                              paymentMethod.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-neutral-400">
                            {isQr
                              ? "QR Payment"
                              : "Bank Transfer"}
                          </p>
                        </div>
                      </div>

                      {paymentMethod.active ? (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="mt-5 rounded-xl bg-neutral-50 p-4">
                      {isQr ? (
                        <p className="text-sm text-neutral-600">
                          {paymentMethod.qrImageUrl
                            ? "QR Code uploaded"
                            : "No QR Code"}
                        </p>
                      ) : (
                        <div className="space-y-1 text-sm">
                          {paymentMethod.bankName && (
                            <p className="font-medium text-neutral-800">
                              {
                                paymentMethod.bankName
                              }
                            </p>
                          )}

                          {paymentMethod.accountName && (
                            <p className="text-neutral-500">
                              {
                                paymentMethod.accountName
                              }
                            </p>
                          )}

                          {paymentMethod.accountNumber && (
                            <p className="font-mono text-xs text-neutral-500">
                              {
                                paymentMethod.accountNumber
                              }
                            </p>
                          )}

                          {!paymentMethod.bankName &&
                            !paymentMethod.accountName &&
                            !paymentMethod.accountNumber && (
                              <p className="text-neutral-400">
                                No bank details
                              </p>
                            )}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-xs text-neutral-400">
                        Sort Order:{" "}
                        {
                          paymentMethod.sortOrder
                        }
                      </p>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/dashboard/payment-methods/${paymentMethod.id}/edit`}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-neutral-200
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-neutral-700
                            transition
                            hover:bg-neutral-50
                          "
                        >
                          <Pencil className="h-4 w-4" />

                          Edit
                        </Link>

                        <DeletePaymentMethodButton
                          id={
                            paymentMethod.id
                          }
                          name={
                            paymentMethod.name
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </main>
  );
}