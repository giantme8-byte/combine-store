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

import PageHeader from "../../_components/PageHeader";

import VoucherEditForm from "../_components/VoucherEditForm";


// ============================================================
// TYPES
// ============================================================

type VoucherPageProps = {
  params: Promise<{
    id: string;
  }>;
};


// ============================================================
// PAGE
// ============================================================

export default async function VoucherEditPage({
  params,
}: VoucherPageProps) {

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

      include: {

        _count: {
          select: {
            usage: true,
          },
        },

      },

    });


  if (
    !voucher
  ) {

    notFound();

  }


  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  const categories =
    await prisma.category.findMany({

      where: {
        active: true,
      },

      select: {

        id: true,

        name: true,

      },

      orderBy: {

        name:
          "asc",

      },

    });


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <main
      className="
        space-y-8
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <PageHeader
        title={`Edit Voucher — ${voucher.code}`}
        description="Update voucher settings and usage rules."
      >

        <Link
          href="/admin/dashboard/vouchers"
          className="
            inline-flex
            items-center
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
          "
        >
          Back to Vouchers
        </Link>

      </PageHeader>


      {/* ================================================== */}
      {/* FORM */}
      {/* ================================================== */}

      <VoucherEditForm
        voucher={{
          id:
            voucher.id,

          code:
            voucher.code,

          type:
            voucher.type,

          value:
            voucher.value,

          minSpend:
            voucher.minSpend,

          maxDiscount:
            voucher.maxDiscount,

          category:
            voucher.category,

          startAt:
            voucher.startAt
              .toISOString(),

          expiresAt:
            voucher.expiresAt
              ? voucher.expiresAt.toISOString()
              : null,

          usageLimit:
            voucher.usageLimit,

          usageCount:
            voucher.usageCount,

          usagePerCustomer:
            voucher.usagePerCustomer,

          newCustomerOnly:
            voucher.newCustomerOnly,

          isActive:
            voucher.isActive,

        }}

        categories={
          categories
        }
      />

    </main>

  );

}