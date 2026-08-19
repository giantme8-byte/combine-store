import Link from "next/link";

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

import VoucherForm from "../_components/VoucherForm";


// ============================================================
// PAGE
// ============================================================

export default async function NewVoucherPage() {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);


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
        name: "asc",
      },

    });


  // ==========================================================
  // RENDER
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
        title="Create Voucher"
        description="Create a discount voucher for your customers."
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

      <VoucherForm
        categories={
          categories
        }
      />

    </main>

  );

}