"use client";

import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-100/80 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-8">

        <div>
          <p className="text-sm text-neutral-500">
            {today}
          </p>

          <h1 className="mt-1 text-2xl font-light">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">

          <div className="flex w-80 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <Search size={18} className="text-neutral-400" />

            <input
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <button className="rounded-xl border border-neutral-200 bg-white p-3 transition hover:bg-neutral-50">
            <Bell size={18} />
          </button>

        </div>

      </div>
    </header>
  );
}