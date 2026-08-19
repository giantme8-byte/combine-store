"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";


// ============================================================
// SALES PERIOD
// ============================================================

export type SalesPeriod =
  | "ALL_TIME"
  | "TODAY"
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


  // ==========================================================
  // CHANGE PERIOD
  // ==========================================================

  function changePeriod(
    period: SalesPeriod
  ) {

    const params =
      new URLSearchParams(
        searchParams.toString()
      );


    if (
      period ===
      "ALL_TIME"
    ) {

      params.delete(
        "salesPeriod"
      );

    } else {

      params.set(
        "salesPeriod",
        period
      );

    }


    const query =
      params.toString();


    router.push(
      query
        ? `${pathname}?${query}`
        : pathname
    );

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
      {/* ALL TIME */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() =>
          changePeriod(
            "ALL_TIME"
          )
        }
        className={`
          rounded-full
          px-4
          py-2
          text-xs
          font-medium
          transition
          ${
            value === "ALL_TIME"
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }
        `}
      >
        All Time
      </button>


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
        className={`
          rounded-full
          px-4
          py-2
          text-xs
          font-medium
          transition
          ${
            value === "TODAY"
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }
        `}
      >
        Today
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
        className={`
          rounded-full
          px-4
          py-2
          text-xs
          font-medium
          transition
          ${
            value === "THIS_WEEK"
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }
        `}
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
        className={`
          rounded-full
          px-4
          py-2
          text-xs
          font-medium
          transition
          ${
            value === "THIS_MONTH"
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }
        `}
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
        className={`
          rounded-full
          px-4
          py-2
          text-xs
          font-medium
          transition
          ${
            value === "THIS_YEAR"
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }
        `}
      >
        This Year
      </button>

    </div>

  );

}