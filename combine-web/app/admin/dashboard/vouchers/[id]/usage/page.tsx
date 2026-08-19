import Link from "next/link";
import { notFound } from "next/navigation";

import {
  UserRole,
} from "@prisma/client";

import {
  requireRole,
} from "@/lib/authorize";

import {
  prisma,
} from "@/lib/prisma";

import PageHeader from "../../../_components/PageHeader";
import Card from "../../../_components/Card";
import EmptyState from "../../../_components/EmptyState";


// ============================================================
// TYPES
// ============================================================

type VoucherUsagePageProps = {
  params: Promise<{
    id: string;
  }>;
};


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

function formatDateTime(
  date: Date
) {

  return date.toLocaleString(
    "en-MY",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

}


// ============================================================
// PAGE
// ============================================================

export default async function VoucherUsagePage({
  params,
}: VoucherUsagePageProps) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);


  // ==========================================================
  // PARAMS
  // ==========================================================

  const {
    id,
  } = await params;


  const voucherId =
    Number(id);


  if (
    !Number.isInteger(
      voucherId
    ) ||
    voucherId <= 0
  ) {

    notFound();

  }


  // ==========================================================
  // LOAD VOUCHER
  // ==========================================================

  const voucher =
    await prisma.voucher.findUnique({

      where: {
        id:
          voucherId,
      },

      select: {

        id:
          true,

        code:
          true,

        type:
          true,

        value:
          true,

        usageCount:
          true,

        usageLimit:
          true,

      },

    });


  if (
    !voucher
  ) {

    notFound();

  }


  // ==========================================================
  // LOAD USAGE
  // ==========================================================

  const usages =
    await prisma.voucherUsage.findMany({

      where: {
        voucherId:
          voucher.id,
      },

      orderBy: {
        createdAt:
          "desc",
      },

      include: {

        order: {
          select: {

            id:
              true,

            publicToken:
              true,

            customerName:
              true,

            customerPhone:
              true,

            finalAmount:
              true,

            status:
              true,

            createdAt:
              true,

          },

        },

        user: {
          select: {

            id:
              true,

            name:
              true,

            email:
              true,

          },

        },

      },

    });


  // ==========================================================
  // TOTAL DISCOUNT
  // ==========================================================

  const totalDiscount =
    usages.reduce(
      (
        total,
        usage
      ) =>
        total +
        usage.discount,
      0
    );


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
        title={`Voucher Usage — ${voucher.code}`}
        description="View orders and customers that have used this voucher."
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <Link
            href={`/admin/dashboard/vouchers/${voucher.id}`}
            className="
              inline-flex
              items-center
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-neutral-700
              transition-colors
              hover:bg-neutral-50
            "
          >
            Edit Voucher
          </Link>


          <Link
            href="/admin/dashboard/vouchers"
            className="
              inline-flex
              items-center
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-neutral-700
              transition-colors
              hover:bg-neutral-50
            "
          >
            Back to Vouchers
          </Link>

        </div>

      </PageHeader>


      {/* ======================================================
          SUMMARY
          ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-3
        "
      >

        {/* ====================================================
            TOTAL USED
            ==================================================== */}

        <Card>

          <div
            className="
              text-sm
              text-neutral-500
            "
          >
            Total Used
          </div>


          <div
            className="
              mt-2
              text-2xl
              font-semibold
              text-neutral-900
            "
          >
            {voucher.usageCount}
          </div>


          <div
            className="
              mt-1
              text-xs
              text-neutral-400
            "
          >
            {voucher.usageLimit !==
            null
              ? `Limit ${voucher.usageLimit}`
              : "Unlimited usage"}
          </div>

        </Card>


        {/* ====================================================
            TOTAL DISCOUNT
            ==================================================== */}

        <Card>

          <div
            className="
              text-sm
              text-neutral-500
            "
          >
            Total Discount Given
          </div>


          <div
            className="
              mt-2
              text-2xl
              font-semibold
              text-neutral-900
            "
          >
            {formatAmount(
              totalDiscount
            )}
          </div>


          <div
            className="
              mt-1
              text-xs
              text-neutral-400
            "
          >
            Across all recorded uses
          </div>

        </Card>


        {/* ====================================================
            REMAINING
            ==================================================== */}

        <Card>

          <div
            className="
              text-sm
              text-neutral-500
            "
          >
            Remaining Uses
          </div>


          <div
            className="
              mt-2
              text-2xl
              font-semibold
              text-neutral-900
            "
          >

            {voucher.usageLimit ===
            null

              ? "∞"

              : Math.max(
                  voucher.usageLimit -
                    voucher.usageCount,
                  0
                )}

          </div>


          <div
            className="
              mt-1
              text-xs
              text-neutral-400
            "
          >
            Available redemptions
          </div>

        </Card>

      </div>


      {/* ======================================================
          USAGE TABLE
          ====================================================== */}

      <Card
        className="
          overflow-hidden
          p-0
        "
      >

        {usages.length === 0 ? (

          <EmptyState
            title="No Usage Yet"
            description="This voucher has not been used by any customer yet."
          />

        ) : (

          <div
            className="
              overflow-x-auto
            "
          >

            <table
              className="
                w-full
                min-w-[1050px]
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
                    Customer
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
                    Order
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
                    Order Total
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
                    Order Status
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
                    Used At
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

                {usages.map(
                  (usage) => (

                    <tr
                      key={
                        usage.id
                      }
                      className="
                        transition-colors
                        hover:bg-neutral-50
                      "
                    >

                      {/* ==========================================
                          CUSTOMER
                          ========================================== */}

                      <td
                        className="
                          px-6
                          py-5
                        "
                      >

                        <div
                          className="
                            text-sm
                            font-medium
                            text-neutral-900
                          "
                        >
                          {usage.user?.name ||
                            usage.order.customerName}
                        </div>


                        <div
                          className="
                            mt-1
                            text-xs
                            text-neutral-400
                          "
                        >
                          {usage.user?.email ||
                            usage.order.customerPhone}
                        </div>

                      </td>


                      {/* ==========================================
                          ORDER
                          ========================================== */}

                      <td
                        className="
                          px-6
                          py-5
                        "
                      >

                        <Link
                          href={`/admin/dashboard/orders/${usage.order.id}`}
                          className="
                            text-sm
                            font-medium
                            text-neutral-900
                            underline-offset-4
                            hover:underline
                          "
                        >
                          #{usage.order.id}
                        </Link>


                        <div
                          className="
                            mt-1
                            text-xs
                            text-neutral-400
                          "
                        >
                          {formatDateTime(
                            usage.order.createdAt
                          )}
                        </div>

                      </td>


                      {/* ==========================================
                          ORDER TOTAL
                          ========================================== */}

                      <td
                        className="
                          px-6
                          py-5
                          text-sm
                          font-medium
                          text-neutral-800
                        "
                      >
                        {formatAmount(
                          usage.order.finalAmount
                        )}
                      </td>


                      {/* ==========================================
                          DISCOUNT
                          ========================================== */}

                      <td
                        className="
                          px-6
                          py-5
                          text-sm
                          font-semibold
                          text-green-700
                        "
                      >
                        -{" "}
                        {formatAmount(
                          usage.discount
                        )}
                      </td>


                      {/* ==========================================
                          ORDER STATUS
                          ========================================== */}

                      <td
                        className="
                          px-6
                          py-5
                        "
                      >

                        <span
                          className="
                            inline-flex
                            rounded-full
                            bg-neutral-100
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-neutral-700
                          "
                        >
                          {usage.order.status}
                        </span>

                      </td>


                      {/* ==========================================
                          USED AT
                          ========================================== */}

                      <td
                        className="
                          px-6
                          py-5
                          text-sm
                          text-neutral-600
                        "
                      >
                        {formatDateTime(
                          usage.createdAt
                        )}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </Card>

    </main>

  );

}