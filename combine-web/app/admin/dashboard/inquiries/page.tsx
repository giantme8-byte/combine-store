import Link from "next/link";

import { InquiryStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import InquirySearch from "./_components/InquirySearch";
import InquiryTable from "./_components/InquiryTable";

export default async function InquiriesPage({
  searchParams,
}: {
searchParams: Promise<{
  status?: string;
  search?: string;
  page?: string;
}>;
}) {
  const { status, search, page } = await searchParams;

const currentPage = Number(page ?? "1");
const pageSize = 20;
const skip = (currentPage - 1) * pageSize;

  const activeClass =
    "rounded-lg border border-black bg-black px-4 py-2 text-sm text-white";

  const inactiveClass =
    "rounded-lg border px-4 py-2 text-sm hover:bg-neutral-100";

    const where = {
  ...(status && status !== "ALL"
    ? {
        status: status as InquiryStatus,
      }
    : {}),

  ...(search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            whatsapp: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {}),
};

  const [
    totalCount,
    pendingCount,
    contactedCount,
    completedCount,
    cancelledCount,
    inquiries,
  ] = await Promise.all([
    prisma.inquiry.count({
  where,
}),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.PENDING,
      },
    }),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.CONTACTED,
      },
    }),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.COMPLETED,
      },
    }),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.CANCELLED,
      },
    }),

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
    createdAt: "desc",
  },

  skip,
  take: pageSize,
}),
  ]);

  const totalPages = Math.max(
  1,
  Math.ceil(totalCount / pageSize)
);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light">
          Inquiries
        </h1>

        <p className="mt-2 text-neutral-500">
          Manage customer inquiries.
        </p>

        <div className="mt-6">
  <InquirySearch />
</div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard/inquiries"
            className={
              !status || status === "ALL"
                ? activeClass
                : inactiveClass
            }
          >
            All ({totalCount})
          </Link>

          <Link
            href="/admin/dashboard/inquiries?status=PENDING"
            className={
              status === "PENDING"
                ? activeClass
                : inactiveClass
            }
          >
            🟡 Pending ({pendingCount})
          </Link>

          <Link
            href="/admin/dashboard/inquiries?status=CONTACTED"
            className={
              status === "CONTACTED"
                ? activeClass
                : inactiveClass
            }
          >
            🔵 Contacted ({contactedCount})
          </Link>

          <Link
            href="/admin/dashboard/inquiries?status=COMPLETED"
            className={
              status === "COMPLETED"
                ? activeClass
                : inactiveClass
            }
          >
            🟢 Completed ({completedCount})
          </Link>

          <Link
            href="/admin/dashboard/inquiries?status=CANCELLED"
            className={
              status === "CANCELLED"
                ? activeClass
                : inactiveClass
            }
          >
            🔴 Cancelled ({cancelledCount})
          </Link>
        </div>
      </div>

      <InquiryTable inquiries={inquiries} />
    </div>
  );
}