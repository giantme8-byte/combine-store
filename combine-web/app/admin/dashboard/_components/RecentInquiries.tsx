import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";

const dateFormatter =
  new Intl.DateTimeFormat(
    "en-MY",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

export default async function RecentInquiries() {
  const inquiries =
    await prisma.inquiryItem.findMany({
      take: 8,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,

        createdAt: true,

        inquiry: {
          select: {
            id: true,
            name: true,
            whatsapp: true,
            status: true,
          },
        },

        product: {
          select: {
            brand: true,
            name: true,
          },
        },
      },
    });

  function getStatusVariant(
    status: string
  ) {
    switch (status) {
      case "PENDING":
        return "warning";

      case "CONTACTED":
        return "info";

      case "COMPLETED":
        return "success";

      case "CANCELLED":
        return "danger";

      default:
        return "default";
    }
  }

  return (
    <div
      className="
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-4
        shadow-sm

        sm:rounded-3xl
        sm:p-6

        lg:p-8
      "
    >
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div
        className="
          mb-5
          flex
          min-w-0
          items-center
          justify-between
          gap-3

          sm:mb-6
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-neutral-400

              sm:text-xs
            "
          >
            CRM
          </p>

          <h2
            className="
              mt-1.5
              truncate
              text-xl
              font-light
              text-neutral-900

              sm:mt-2
              sm:text-2xl
            "
          >
            Recent Inquiries
          </h2>
        </div>

        <Link
          href="/admin/dashboard/inquiries"
          className="
            flex
            shrink-0
            items-center
            rounded-xl
            px-2
            py-2
            text-[11px]
            text-neutral-500
            transition
            hover:bg-neutral-100
            hover:text-black

            sm:px-3
            sm:text-sm
          "
        >
          <span className="sm:hidden">
            View
          </span>

          <span className="hidden sm:inline">
            View All
          </span>

          <span className="ml-1">
            →
          </span>
        </Link>
      </div>

      {/* ====================================================== */}
      {/* EMPTY */}
      {/* ====================================================== */}

      {inquiries.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-neutral-300
            py-10
            text-center
            text-sm
            text-neutral-500
          "
        >
          No inquiries yet.
        </div>
      ) : (
        /* ==================================================== */
        /* INQUIRIES */
        /* ==================================================== */

        <div
          className="
            min-w-0
            space-y-2.5

            sm:space-y-4
          "
        >
          {inquiries.map(
            (item) => (
              <div
                key={item.id}
                className="
                  flex
                  min-w-0
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-neutral-200
                  p-3
                  transition-all
                  duration-300
                  hover:bg-neutral-50
                  hover:shadow-sm

                  sm:items-center
                  sm:justify-between
                  sm:gap-6
                  sm:p-4
                "
              >
                {/* ================================================= */}
                {/* CUSTOMER + PRODUCT */}
                {/* ================================================= */}

                <div
                  className="
                    min-w-0
                    flex-1
                    overflow-hidden
                  "
                >
                  {/* Customer */}

                  <p
                    className="
                      truncate
                      text-sm
                      font-medium
                      text-neutral-900

                      sm:text-base
                    "
                  >
                    {item.inquiry.name}
                  </p>

                  {/* WhatsApp */}

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[11px]
                      text-neutral-500

                      sm:text-sm
                    "
                  >
                    {item.inquiry.whatsapp}
                  </p>

                  {/* Product */}

                  <p
                    className="
                      mt-1
                      line-clamp-2
                      break-words
                      text-[11px]
                      leading-4
                      text-neutral-500

                      sm:text-sm
                      sm:leading-5
                    "
                  >
                    {item.product.brand}
                    {" · "}
                    {item.product.name}
                  </p>
                </div>

                {/* ================================================= */}
                {/* STATUS + DATE */}
                {/* ================================================= */}

                <div
                  className="
                    flex
                    w-[72px]
                    shrink-0
                    flex-col
                    items-end
                    gap-1.5

                    sm:w-auto
                    sm:gap-3
                  "
                >
                  <Badge
                    variant={getStatusVariant(
                      item.inquiry.status
                    )}
                    className="
                      max-w-full
                      truncate
                      text-[9px]

                      sm:text-xs
                    "
                  >
                    {item.inquiry.status}
                  </Badge>

                  <p
                    className="
                      whitespace-nowrap
                      text-[10px]
                      text-neutral-400

                      sm:text-sm
                    "
                  >
                    {dateFormatter.format(
                      item.createdAt
                    )}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}