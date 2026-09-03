"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  useTransition,
} from "react";


// ============================================================
// SALES PERIOD
// ============================================================

export type SalesPeriod =
  | "TODAY"
  | "YESTERDAY"
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "THIS_YEAR";


// ============================================================
// PROPS
// ============================================================

type SalesAnalyticsProps = {
  value: SalesPeriod;
};


// ============================================================
// COMPONENT
// ============================================================

export default function SalesAnalytics({
  value,
}: SalesAnalyticsProps) {

  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();


  const [
    isPending,
    startTransition,
  ] = useTransition();


  // ==========================================================
  // CHANGE PERIOD
  // ==========================================================

  function changePeriod(
    period: SalesPeriod
  ) {

    if (
      period ===
      value
    ) {
      return;
    }


    const params =
      new URLSearchParams(
        searchParams.toString()
      );


    params.set(
      "salesPeriod",
      period
    );


    const query =
      params.toString();


    const url =
      query
        ? `${pathname}?${query}`
        : pathname;


    startTransition(() => {

      router.replace(
        url,
        {
          scroll:
            false,
        }
      );

    });

  }


  // ==========================================================
  // BUTTON CLASS
  // ==========================================================

  function getButtonClass(
    period: SalesPeriod
  ) {

    const isActive =
      value ===
      period;


    return `
      rounded-full
      px-4
      py-2
      text-xs
      font-medium
      transition
      ${
        isActive
          ? "bg-black text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }
      ${
        isPending
          ? "pointer-events-none opacity-70"
          : ""
      }
    `;

  }


  // ==========================================================
  // RETURN
  // ==========================================================

  return (

    <div
      className="
        flex
        flex-wrap
        items-center
        gap-2
      "
    >

      {/* ==================================================== */}
      {/* TODAY */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() =>
          changePeriod(
            "TODAY"
          )
        }
        disabled={
          isPending
        }
        className={
          getButtonClass(
            "TODAY"
          )
        }
      >
        Today
      </button>


      {/* ==================================================== */}
      {/* YESTERDAY */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() =>
          changePeriod(
            "YESTERDAY"
          )
        }
        disabled={
          isPending
        }
        className={
          getButtonClass(
            "YESTERDAY"
          )
        }
      >
        Yesterday
      </button>


      {/* ==================================================== */}
      {/* THIS WEEK */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() =>
          changePeriod(
            "THIS_WEEK"
          )
        }
        disabled={
          isPending
        }
        className={
          getButtonClass(
            "THIS_WEEK"
          )
        }
      >
        This Week
      </button>


      {/* ==================================================== */}
      {/* THIS MONTH */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() =>
          changePeriod(
            "THIS_MONTH"
          )
        }
        disabled={
          isPending
        }
        className={
          getButtonClass(
            "THIS_MONTH"
          )
        }
      >
        This Month
      </button>


      {/* ==================================================== */}
      {/* THIS YEAR */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() =>
          changePeriod(
            "THIS_YEAR"
          )
        }
        disabled={
          isPending
        }
        className={
          getButtonClass(
            "THIS_YEAR"
          )
        }
      >
        This Year
      </button>

    </div>

  );

}