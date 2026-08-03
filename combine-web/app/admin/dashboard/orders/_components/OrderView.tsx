"use client";

import { useState } from "react";
import { LayoutGrid, Table } from "lucide-react";

import OrderTable from "./OrderTable";
import OrderGrid from "./OrderGrid";

type Order = {
  id: number;
};

type OrderViewProps = {
  orders: Order[];
};

export default function OrderView({
  orders,
}: OrderViewProps) {

  const [view, setView] =
    useState<"table" | "grid">("table");

  return (
    <div className="space-y-4">

      <div className="flex justify-end">

        <div className="flex rounded-xl border border-neutral-200 bg-white p-1">

          <button
            type="button"
            onClick={() => setView("table")}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2 transition
              ${
                view === "table"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >
            <Table size={18} />
            Table
          </button>

          <button
            type="button"
            onClick={() => setView("grid")}
            className={`
              flex items-center gap-2 rounded-lg px-4 py-2 transition
              ${
                view === "grid"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >
            <LayoutGrid size={18} />
            Grid
          </button>

        </div>

      </div>

      {view === "table"
        ? (
          <OrderTable
            orders={orders}
          />
        )
        : (
          <OrderGrid
            orders={orders}
          />
        )}

    </div>
  );
}