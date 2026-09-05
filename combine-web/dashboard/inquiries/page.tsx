import Link from "next/link";

import { InquiryStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import InquirySearch from "./_components/InquirySearch";
import InquiryTable from "./_components/InquiryTable";


// ============================================================
// PAGE
// ============================================================

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}) {

  const {
    status,
    search,
    page,
  } = await searchParams;


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const currentPage =
    Math.max(
      1,
      Number(page ?? "1") || 1
    );


  const pageSize = 20;


  const skip =
    (currentPage - 1) *
    pageSize;


  // ==========================================================
  // STATUS BUTTONS
  // ==========================================================

  const activeClass =
    `
      rounded-lg
      border
      border-black
      bg-black
      px-4
      py-2
      text-sm
      text-white
      transition
    `;


  const inactiveClass =
    `
      rounded-lg
      border
      border-neutral-200
      bg-white
      px-4
      py-2
      text-sm
      text-neutral-700
      transition
      hover:bg-neutral-100
    `;


  // ==========================================================
  // WHERE
  // ==========================================================

  const where = {

    ...(status &&
    status !== "ALL"
      ? {
          status:
            status as InquiryStatus,
        }
      : {}),


    ...(search
      ? {

          OR: [

            {
              name: {
                contains:
                  search,

                mode:
                  "insensitive" as const,
              },
            },

            {
              email: {
                contains:
                  search,

                mode:
                  "insensitive" as const,
              },
            },

            {
              whatsapp: {
                contains:
                  search,

                mode:
                  "insensitive" as const,
              },
            },

          ],

        }
      : {}),

  };


  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const [
    totalCount,
    pendingCount,
    contactedCount,
    completedCount,
    cancelledCount,
    inquiries,
  ] = await Promise.all([

    // --------------------------------------------------------
    // TOTAL
    // --------------------------------------------------------

    prisma.inquiry.count({
      where,
    }),


    // --------------------------------------------------------
    // PENDING
    // --------------------------------------------------------

    prisma.inquiry.count({
      where: {
        status:
          InquiryStatus.PENDING,
      },
    }),


    // --------------------------------------------------------
    // CONTACTED
    // --------------------------------------------------------

    prisma.inquiry.count({
      where: {
        status:
          InquiryStatus.CONTACTED,
      },
    }),


    // --------------------------------------------------------
    // COMPLETED
    // --------------------------------------------------------

    prisma.inquiry.count({
      where: {
        status:
          InquiryStatus.COMPLETED,
      },
    }),


    // --------------------------------------------------------
    // CANCELLED
    // --------------------------------------------------------

    prisma.inquiry.count({
      where: {
        status:
          InquiryStatus.CANCELLED,
      },
    }),


    // --------------------------------------------------------
    // INQUIRIES
    // --------------------------------------------------------

    prisma.inquiry.findMany({

      where,

      include: {

        items: {

          include: {
            product: true,
          },

        },

      },

      orderBy: {
        createdAt:
          "desc",
      },

      skip,

      take:
        pageSize,

    }),

  ]);


  // ==========================================================
  // TOTAL PAGES
  // ==========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalCount /
          pageSize
      )
    );


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <main
      className="
        space-y-6

        sm:space-y-8
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div>

        <h1
          className="
            text-3xl
            font-light
            tracking-tight

            sm:text-4xl
          "
        >
          Inquiries
        </h1>


        <p
          className="
            mt-2
            text-sm
            leading-6
            text-neutral-500

            sm:text-base
          "
        >
          Manage customer inquiries.
        </p>


        {/* ==================================================
            SEARCH
            ================================================== */}

        <div
          className="
            mt-5

            sm:mt-6
          "
        >

          <InquirySearch />

        </div>


        {/* ==================================================
            STATUS FILTERS
            ================================================== */}

        <div
          className="
            mt-4
            flex
            gap-2
            overflow-x-auto
            pb-1

            sm:mt-6
            sm:flex-wrap
            sm:gap-3
            sm:overflow-visible
            sm:pb-0
          "
        >

          {/* ================================================
              ALL
              ================================================ */}

          <Link
            href="/admin/dashboard/inquiries"
            className={`
              shrink-0
              ${!status ||
              status === "ALL"
                ? activeClass
                : inactiveClass}
            `}
          >
            All ({totalCount})
          </Link>


          {/* ================================================
              PENDING
              ================================================ */}

          <Link
            href="/admin/dashboard/inquiries?status=PENDING"
            className={`
              shrink-0
              ${status === "PENDING"
                ? activeClass
                : inactiveClass}
            `}
          >
            🟡 Pending ({pendingCount})
          </Link>


          {/* ================================================
              CONTACTED
              ================================================ */}

          <Link
            href="/admin/dashboard/inquiries?status=CONTACTED"
            className={`
              shrink-0
              ${status === "CONTACTED"
                ? activeClass
                : inactiveClass}
            `}
          >
            🔵 Contacted ({contactedCount})
          </Link>


          {/* ================================================
              COMPLETED
              ================================================ */}

          <Link
            href="/admin/dashboard/inquiries?status=COMPLETED"
            className={`
              shrink-0
              ${status === "COMPLETED"
                ? activeClass
                : inactiveClass}
            `}
          >
            🟢 Completed ({completedCount})
          </Link>


          {/* ================================================
              CANCELLED
              ================================================ */}

          <Link
            href="/admin/dashboard/inquiries?status=CANCELLED"
            className={`
              shrink-0
              ${status === "CANCELLED"
                ? activeClass
                : inactiveClass}
            `}
          >
            🔴 Cancelled ({cancelledCount})
          </Link>

        </div>

      </div>


      {/* ================================================== */}
      {/* INQUIRIES */}
      {/* ================================================== */}

      <InquiryTable
        inquiries={
          inquiries
        }
      />

    </main>

  );

}