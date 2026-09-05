"use client";

import { useEffect, useState } from "react";

import {
  Search,
  RotateCcw,
} from "lucide-react";


type OrderFiltersProps = {
  search: string;
  orderStatus: string;
  paymentStatus: string;
};


// ============================================================
// ORDER STATUSES
// ============================================================

const ORDER_STATUSES = [
  {
    value: "PENDING_PAYMENT",
    label: "Pending Payment",
  },
  {
    value: "PAYMENT_REVIEW",
    label: "Payment Review",
  },
  {
    value: "PAID",
    label: "Paid",
  },
  {
    value: "PROCESSING",
    label: "Processing",
  },
  {
    value: "SHIPPED",
    label: "Shipped",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];


// ============================================================
// PAYMENT STATUSES
// ============================================================

const PAYMENT_STATUSES = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "SUBMITTED",
    label: "Submitted",
  },
  {
    value: "VERIFIED",
    label: "Verified",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
];


// ============================================================
// COMPONENT
// ============================================================

export default function OrderFilters({
  search: initialSearch,
  orderStatus: initialOrderStatus,
  paymentStatus: initialPaymentStatus,
}: OrderFiltersProps) {

  const [
    search,
    setSearch,
  ] = useState(
    initialSearch
  );


  const [
    orderStatus,
    setOrderStatus,
  ] = useState(
    initialOrderStatus
  );


  const [
    paymentStatus,
    setPaymentStatus,
  ] = useState(
    initialPaymentStatus
  );


  // ==========================================================
  // SYNC URL STATE
  // ==========================================================

  useEffect(() => {

    setSearch(
      initialSearch
    );

    setOrderStatus(
      initialOrderStatus
    );

    setPaymentStatus(
      initialPaymentStatus
    );

  }, [
    initialSearch,
    initialOrderStatus,
    initialPaymentStatus,
  ]);


  // ==========================================================
  // APPLY FILTERS
  // ==========================================================

  function applyFilters() {

    const params =
      new URLSearchParams();


    const trimmedSearch =
      search.trim();


    if (trimmedSearch) {

      params.set(
        "search",
        trimmedSearch
      );

    }


    if (orderStatus) {

      params.set(
        "orderStatus",
        orderStatus
      );

    }


    if (paymentStatus) {

      params.set(
        "paymentStatus",
        paymentStatus
      );

    }


    const query =
      params.toString();


    window.location.href =
      query
        ? `/admin/dashboard/orders?${query}`
        : "/admin/dashboard/orders";

  }


  // ==========================================================
  // RESET
  // ==========================================================

  function resetFilters() {

    setSearch("");

    setOrderStatus("");

    setPaymentStatus("");


    window.location.href =
      "/admin/dashboard/orders";

  }


  // ==========================================================
  // ENTER KEY
  // ==========================================================

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      applyFilters();

    }

  }


  return (
    <div
      className="
        mb-6
        rounded-2xl
        border
        border-neutral-200
        bg-neutral-50
        p-4

        sm:p-5
      "
    >

      <div
        className="
          grid
          grid-cols-1
          gap-3

          lg:grid-cols-[minmax(0,1fr)_220px_220px_auto_auto]
        "
      >

        {/* ====================================================
            SEARCH
            ==================================================== */}

        <div
          className="
            relative
            min-w-0
          "
        >

          <Search
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-neutral-400
            "
          />


          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder="
              Search order, customer, phone or tracking...
            "
            className="
              h-11
              w-full
              rounded-xl
              border
              border-neutral-200
              bg-white
              pl-11
              pr-4
              text-sm
              outline-none
              transition
              focus:border-neutral-400
            "
          />

        </div>


        {/* ====================================================
            ORDER STATUS
            ==================================================== */}

        <select
          value={
            orderStatus
          }
          onChange={(event) =>
            setOrderStatus(
              event.target.value
            )
          }
          className="
            h-11
            w-full
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-4
            text-sm
            text-neutral-700
            outline-none
            transition
            focus:border-neutral-400
          "
        >

          <option value="">
            All Order Status
          </option>


          {ORDER_STATUSES.map(
            (status) => (

              <option
                key={
                  status.value
                }
                value={
                  status.value
                }
              >
                {status.label}
              </option>

            )
          )}

        </select>


        {/* ====================================================
            PAYMENT STATUS
            ==================================================== */}

        <select
          value={
            paymentStatus
          }
          onChange={(event) =>
            setPaymentStatus(
              event.target.value
            )
          }
          className="
            h-11
            w-full
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-4
            text-sm
            text-neutral-700
            outline-none
            transition
            focus:border-neutral-400
          "
        >

          <option value="">
            All Payment Status
          </option>


          {PAYMENT_STATUSES.map(
            (status) => (

              <option
                key={
                  status.value
                }
                value={
                  status.value
                }
              >
                {status.label}
              </option>

            )
          )}

        </select>


        {/* ====================================================
            ACTIONS
            ==================================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-3

            lg:contents
          "
        >

          {/* ==================================================
              APPLY
              ================================================== */}

          <button
            type="button"
            onClick={
              applyFilters
            }
            className="
              h-11
              w-full
              rounded-xl
              bg-black
              px-4
              text-sm
              font-medium
              text-white
              transition
              hover:bg-neutral-800

              lg:px-5
            "
          >
            Apply
          </button>


          {/* ==================================================
              RESET
              ================================================== */}

          <button
            type="button"
            onClick={
              resetFilters
            }
            className="
              inline-flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-4
              text-sm
              text-neutral-600
              transition
              hover:bg-neutral-100
            "
          >

            <RotateCcw
              className="
                h-4
                w-4
              "
            />

            Reset

          </button>

        </div>

      </div>

    </div>
  );
}