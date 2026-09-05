import Link from "next/link";

import {
  VoucherType,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

import PageHeader from "../_components/PageHeader";
import Card from "../_components/Card";
import Button from "../_components/Button";
import EmptyState from "../_components/EmptyState";

import VoucherActions from "./_components/VoucherActions";


// ============================================================
// HELPERS
// ============================================================

function formatAmount(
  amount: number
) {

  return `RM ${amount.toLocaleString(
    "en-MY",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(
  date: Date
) {

  return date.toLocaleDateString(
    "en-MY",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

}


// ============================================================
// PAGE
// ============================================================

export default async function VouchersPage() {

  // ==========================================================
  // LOAD VOUCHERS
  // ==========================================================

  const vouchers =
    await prisma.voucher.findMany({

      orderBy: [

        {
          isActive:
            "desc",
        },

        {
          createdAt:
            "desc",
        },

      ],

      include: {

        _count: {

          select: {

            usage:
              true,

          },

        },

      },

    });


  // ==========================================================
  // CURRENT DATE
  // ==========================================================

  const now =
    new Date();


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <main
      className="
        space-y-8
      "
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <PageHeader
        title="Vouchers"
        description="Manage discount vouchers and promotional offers."
      >

        <Link
          href="/admin/dashboard/vouchers/new"
        >

          <Button>
            + Create Voucher
          </Button>

        </Link>

      </PageHeader>


      {/* ======================================================
          VOUCHER TABLE
          ====================================================== */}

      <Card
        className="
          overflow-hidden
          p-0
        "
      >

        {vouchers.length === 0 ? (

          <EmptyState
            title="No Vouchers"
            description="Create your first voucher to offer discounts to customers."
          />

        ) : (

          <>

          {/* ==================================================
              MOBILE VOUCHER LIST
              ================================================== */}

          <div className="space-y-3 p-4 md:hidden">
            {vouchers.map((voucher) => {
              const isPercentage =
                voucher.type === VoucherType.PERCENTAGE;

              const discountLabel =
                isPercentage
                  ? `${voucher.value}% OFF`
                  : `${formatAmount(voucher.value)} OFF`;

              const usageLabel =
                voucher.usageLimit === null
                  ? `${voucher.usageCount} / Unlimited`
                  : `${voucher.usageCount} / ${voucher.usageLimit}`;

              const isExpired =
                voucher.expiresAt !== null &&
                voucher.expiresAt < now;

              const notStarted =
                voucher.startAt > now;

              const usageLimitReached =
                voucher.usageLimit !== null &&
                voucher.usageCount >= voucher.usageLimit;

              let statusLabel = "Active";
              let statusClass = "bg-green-50 text-green-700";

              if (!voucher.isActive) {
                statusLabel = "Inactive";
                statusClass = "bg-neutral-100 text-neutral-500";
              } else if (isExpired) {
                statusLabel = "Expired";
                statusClass = "bg-red-50 text-red-700";
              } else if (notStarted) {
                statusLabel = "Scheduled";
                statusClass = "bg-blue-50 text-blue-700";
              } else if (usageLimitReached) {
                statusLabel = "Fully Used";
                statusClass = "bg-orange-50 text-orange-700";
              }

              return (
                <div
                  key={voucher.id}
                  className="
                    min-w-0
                    rounded-2xl
                    border
                    border-neutral-200
                    bg-white
                    p-4
                    transition
                    hover:border-neutral-300
                    hover:shadow-sm
                  "
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm font-semibold tracking-wide text-neutral-900">
                        {voucher.code}
                      </p>

                      {voucher.newCustomerOnly && (
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-400">
                          New customers only
                        </p>
                      )}
                    </div>

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        ${statusClass}
                      `}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-neutral-50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                        Discount
                      </p>
                      <p className="mt-1 text-sm font-semibold text-neutral-900">
                        {discountLabel}
                      </p>
                      {isPercentage && voucher.maxDiscount !== null && (
                        <p className="mt-1 text-[10px] text-neutral-400">
                          Max {formatAmount(voucher.maxDiscount)}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                        Min. Spend
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-900">
                        {voucher.minSpend > 0
                          ? formatAmount(voucher.minSpend)
                          : "No minimum"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                        Usage
                      </p>
                      <Link
                        href={`/admin/dashboard/vouchers/${voucher.id}/usage`}
                        className="mt-1 block truncate text-sm font-medium text-neutral-900 hover:underline"
                      >
                        {usageLabel}
                      </Link>
                      {voucher.usagePerCustomer !== null && (
                        <p className="mt-1 text-[10px] text-neutral-400">
                          {voucher.usagePerCustomer} per customer
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl bg-neutral-50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400">
                        Validity
                      </p>
                      <p className="mt-1 text-sm text-neutral-900">
                        {formatDate(voucher.startAt)}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-neutral-400">
                        {voucher.expiresAt
                          ? `Until ${formatDate(voucher.expiresAt)}`
                          : "No expiry"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex min-w-0 gap-2 border-t border-neutral-100 pt-4">
                    <Link
                      href={`/admin/dashboard/vouchers/${voucher.id}`}
                      className="
                        inline-flex
                        min-w-0
                        flex-1
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-neutral-200
                        px-3
                        py-2.5
                        text-xs
                        font-medium
                        text-neutral-700
                        transition
                        hover:bg-neutral-100
                      "
                    >
                      View / Edit
                    </Link>

                    <div className="shrink-0">
                      <VoucherActions
                        id={voucher.id}
                        isActive={voucher.isActive}
                        usageCount={voucher.usageCount}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}

          <div
            className="
              hidden
              overflow-x-auto
              md:block
            "
          >

            <table
              className="
                w-full
                min-w-[1180px]
              "
            >

              {/* ==================================================
                  HEADER
                  ================================================== */}

              <thead
                className="
                  border-b
                  border-neutral-200
                  bg-neutral-50
                "
              >

                <tr>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-neutral-500
                    "
                  >
                    Code
                  </th>


                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-neutral-500
                    "
                  >
                    Discount
                  </th>


                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-neutral-500
                    "
                  >
                    Min. Spend
                  </th>


                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-neutral-500
                    "
                  >
                    Category
                  </th>


                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-neutral-500
                    "
                  >
                    Usage
                  </th>


                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-neutral-500
                    "
                  >
                    Validity
                  </th>


                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-neutral-500
                    "
                  >
                    Status
                  </th>


                  <th
                    className="
                      px-6
                      py-4
                      text-right
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-neutral-500
                    "
                  >
                    Actions
                  </th>

                </tr>

              </thead>


              {/* ==================================================
                  BODY
                  ================================================== */}

              <tbody
                className="
                  divide-y
                  divide-neutral-100
                "
              >

                {vouchers.map(
                  (voucher) => {

                    // ==========================================
                    // TYPE
                    // ==========================================

                    const isPercentage =
                      voucher.type ===
                      VoucherType.PERCENTAGE;


                    // ==========================================
                    // DISCOUNT
                    // ==========================================

                    const discountLabel =
                      isPercentage

                        ? `${voucher.value}% OFF`

                        : `${formatAmount(
                            voucher.value
                          )} OFF`;


                    // ==========================================
                    // USAGE
                    // ==========================================

                    const usageLabel =
                      voucher.usageLimit ===
                      null

                        ? `${voucher.usageCount} / Unlimited`

                        : `${voucher.usageCount} / ${voucher.usageLimit}`;


                    // ==========================================
                    // EXPIRED
                    // ==========================================

                    const isExpired =
                      voucher.expiresAt !==
                        null &&
                      voucher.expiresAt <
                        now;


                    // ==========================================
                    // NOT STARTED
                    // ==========================================

                    const notStarted =
                      voucher.startAt >
                      now;


                    // ==========================================
                    // USAGE LIMIT REACHED
                    // ==========================================

                    const usageLimitReached =
                      voucher.usageLimit !==
                        null &&
                      voucher.usageCount >=
                        voucher.usageLimit;


                    // ==========================================
                    // STATUS
                    // ==========================================

                    let statusLabel =
                      "Active";


                    let statusClass =
                      "bg-green-50 text-green-700";


                    if (
                      !voucher.isActive
                    ) {

                      statusLabel =
                        "Inactive";

                      statusClass =
                        "bg-neutral-100 text-neutral-500";

                    } else if (
                      isExpired
                    ) {

                      statusLabel =
                        "Expired";

                      statusClass =
                        "bg-red-50 text-red-700";

                    } else if (
                      notStarted
                    ) {

                      statusLabel =
                        "Scheduled";

                      statusClass =
                        "bg-blue-50 text-blue-700";

                    } else if (
                      usageLimitReached
                    ) {

                      statusLabel =
                        "Fully Used";

                      statusClass =
                        "bg-orange-50 text-orange-700";

                    }


                    return (

                      <tr
                        key={
                          voucher.id
                        }
                        className="
                          transition-colors
                          hover:bg-neutral-50
                        "
                      >

                        {/* ======================================
                            CODE
                            ====================================== */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <div
                            className="
                              font-mono
                              text-sm
                              font-semibold
                              tracking-wide
                              text-neutral-900
                            "
                          >
                            {voucher.code}
                          </div>


                          {voucher.newCustomerOnly && (

                            <div
                              className="
                                mt-1
                                text-xs
                                text-neutral-400
                              "
                            >
                              New customers only
                            </div>

                          )}

                        </td>


                        {/* ======================================
                            DISCOUNT
                            ====================================== */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <div
                            className="
                              text-sm
                              font-semibold
                              text-neutral-900
                            "
                          >
                            {discountLabel}
                          </div>


                          {isPercentage &&
                            voucher.maxDiscount !==
                              null && (

                            <div
                              className="
                                mt-1
                                text-xs
                                text-neutral-400
                              "
                            >
                              Max{" "}
                              {formatAmount(
                                voucher.maxDiscount
                              )}
                            </div>

                          )}

                        </td>


                        {/* ======================================
                            MIN SPEND
                            ====================================== */}

                        <td
                          className="
                            px-6
                            py-5
                            text-sm
                            text-neutral-700
                          "
                        >

                          {voucher.minSpend >
                          0

                            ? formatAmount(
                                voucher.minSpend
                              )

                            : "No minimum"}

                        </td>


                        {/* ======================================
                            CATEGORY
                            ====================================== */}

                        <td
                          className="
                            px-6
                            py-5
                            text-sm
                            text-neutral-700
                          "
                        >

                          {voucher.category ||
                            "All categories"}

                        </td>


                        {/* ======================================
                            USAGE
                            ====================================== */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

<Link
  href={`/admin/dashboard/vouchers/${voucher.id}/usage`}
  className="
    text-sm
    font-medium
    text-neutral-800
    underline-offset-4
    hover:underline
  "
>
  {usageLabel}
</Link>


                          {voucher.usagePerCustomer !==
                            null && (

                            <div
                              className="
                                mt-1
                                text-xs
                                text-neutral-400
                              "
                            >
                              {voucher.usagePerCustomer} per customer
                            </div>

                          )}

                        </td>


                        {/* ======================================
                            VALIDITY
                            ====================================== */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <div
                            className="
                              text-sm
                              text-neutral-700
                            "
                          >
                            {formatDate(
                              voucher.startAt
                            )}
                          </div>


                          <div
                            className="
                              mt-1
                              text-xs
                              text-neutral-400
                            "
                          >

                            {voucher.expiresAt

                              ? `Until ${formatDate(
                                  voucher.expiresAt
                                )}`

                              : "No expiry"}

                          </div>

                        </td>


                        {/* ======================================
                            STATUS
                            ====================================== */}

                        <td
                          className="
                            px-6
                            py-5
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-medium
                              ${statusClass}
                            `}
                          >
                            {statusLabel}
                          </span>

                        </td>


                        {/* ======================================
                            ACTIONS
                            ====================================== */}

                        <td
                          className="
                            px-6
                            py-5
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

                            {/* ==================================
                                VIEW / EDIT
                                ================================== */}

                            <Link
                              href={`/admin/dashboard/vouchers/${voucher.id}`}
                              className="
                                inline-flex
                                items-center
                                whitespace-nowrap
                                rounded-lg
                                border
                                border-neutral-200
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-neutral-700
                                transition-colors
                                hover:bg-neutral-100
                              "
                            >
                              View / Edit
                            </Link>


                            {/* ==================================
                                ACTIONS
                                ================================== */}

                            <VoucherActions
                              id={
                                voucher.id
                              }

                              isActive={
                                voucher.isActive
                              }

                              usageCount={
                                voucher.usageCount
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

          </>

        )}

      </Card>

    </main>

  );

}