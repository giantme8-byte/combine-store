import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function RecentInquiries() {
const inquiries = await prisma.inquiryItem.findMany({
  take: 8,
  orderBy: {
    createdAt: "desc",
  },
  include: {
    inquiry: true,
    product: true,
  },
});

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium">
          Recent Inquiries
        </h2>

        <Link
          href="/admin/dashboard/inquiries"
          className="text-sm text-gray-500 hover:text-black"
        >
          View All →
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No inquiries yet.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
<p className="font-medium">
  {item.inquiry.name}
</p>

<p className="text-sm text-gray-500">
  {item.inquiry.whatsapp}
</p>

<p className="text-sm text-gray-500">
  {item.product.brand} · {item.product.name}
</p>
              </div>

              <div className="text-sm text-gray-400">
                {item.createdAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}