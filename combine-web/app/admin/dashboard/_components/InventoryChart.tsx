"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type InventoryChartProps = {
  title: string;
  data: {
    name: string;
    value: number;
  }[];
};

const COLORS = [
  "#111827",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#E5E7EB",
  "#F3F4F6",
];

export default function InventoryChart({
  title,
  data,
}: InventoryChartProps) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="group rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">
            Analytics
          </p>

          <h2 className="mt-2 text-2xl font-light">
            {title}
          </h2>
        </div>

        <div className="rounded-2xl bg-neutral-100 px-4 py-2">
          <p className="text-sm font-medium text-neutral-700">
            {total} Products
          </p>
        </div>

      </div>

      <div className="grid items-center gap-10 xl:grid-cols-[380px_1fr]">

        {/* Chart */}
        <div className="relative mx-auto h-80 w-80">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

            <h3 className="text-5xl font-extralight">
              {total}
            </h3>

            <p className="mt-1 text-sm uppercase tracking-[0.25em] text-neutral-400">
              PRODUCTS
            </p>

          </div>

        </div>

        {/* Legend */}
        <div className="space-y-3">

          {data.map((item, index) => {
            const percentage =
              total === 0
                ? 0
                : (item.value / total) * 100;

            return (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 transition hover:bg-neutral-50"
              >

                <div className="flex items-center gap-4">

                  <div
                    className="h-4 w-4 rounded-full"
                    style={{
                      background:
                        COLORS[index % COLORS.length],
                    }}
                  />

                  <div>

                    <p className="font-medium text-neutral-900">
                      {item.name}
                    </p>

                    <p className="text-sm text-neutral-500">
                      {item.value} Products
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium">
                  {percentage.toFixed(1)}%
                </span>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}