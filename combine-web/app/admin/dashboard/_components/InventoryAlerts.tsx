import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function InventoryAlerts() {
  const [
    noImages,
    noCostPrice,
    noShortDescription,
  ] = await Promise.all([
    prisma.product.count({
      where: {
        images: {
          none: {},
        },
      },
    }),

    prisma.product.count({
      where: {
        costPriceCny: null,
      },
    }),

    prisma.product.count({
      where: {
        OR: [
          {
            shortDescription: null,
          },
          {
            shortDescription: "",
          },
        ],
      },
    }),
  ]);

  const alerts = [
    {
      label: "Missing Images",
      count: noImages,
    },
    {
      label: "Missing Cost Price",
      count: noCostPrice,
    },
    {
      label: "Missing Short Description",
      count: noShortDescription,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-medium">
        Inventory Alerts
      </h2>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.label}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span>{alert.label}</span>

            <span
              className={
                alert.count > 0
                  ? "font-semibold text-red-600"
                  : "font-medium text-green-600"
              }
            >
              {alert.count}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/admin/dashboard/products"
        className="mt-6 block text-sm text-gray-500 hover:text-black"
      >
        View Products →
      </Link>
    </div>
  );
}