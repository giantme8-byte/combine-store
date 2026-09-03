"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  VoucherType,
} from "@prisma/client";

import Link from "next/link";

import {
  createVoucher,
} from "../_actions/voucher.actions";


// ============================================================
// TYPES
// ============================================================

type CategoryOption = {
  id: number;
  name: string;
};


// ============================================================
// PROPS
// ============================================================

type VoucherFormProps = {
  categories: CategoryOption[];
};


// ============================================================
// MALAYSIA DATE/TIME HELPERS
// ============================================================

const MALAYSIA_TIMEZONE_OFFSET_MINUTES = 8 * 60;

function getMalaysiaDateTimeLocal() {
  const now = new Date();
  const malaysiaTime = new Date(
    now.getTime() + MALAYSIA_TIMEZONE_OFFSET_MINUTES * 60 * 1000
  );

  const year = malaysiaTime.getUTCFullYear();
  const month = String(malaysiaTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(malaysiaTime.getUTCDate()).padStart(2, "0");
  const hours = String(malaysiaTime.getUTCHours()).padStart(2, "0");
  const minutes = String(malaysiaTime.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function addOneMonthToMalaysiaDateTime(value: string) {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
  );

  if (!match) return "";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hours = Number(match[4]);
  const minutes = Number(match[5]);

  const targetMonthIndex = month;
  const lastDayOfTargetMonth = new Date(
    Date.UTC(year, targetMonthIndex + 1, 0)
  ).getUTCDate();

  const targetDay = Math.min(day, lastDayOfTargetMonth);

  const result = new Date(
    Date.UTC(year, targetMonthIndex, targetDay, hours, minutes)
  );

  return [
    result.getUTCFullYear(),
    String(result.getUTCMonth() + 1).padStart(2, "0"),
    String(result.getUTCDate()).padStart(2, "0"),
  ].join("-") +
    `T${String(result.getUTCHours()).padStart(2, "0")}:${String(
      result.getUTCMinutes()
    ).padStart(2, "0")}`;
}

// ============================================================
// COMPONENT
// ============================================================

export default function VoucherForm({
  categories,
}: VoucherFormProps) {

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    isPending,
    startTransition,
  ] = useTransition();


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  const [
    type,
    setType,
  ] = useState<VoucherType>(
    VoucherType.PERCENTAGE
  );


  const [
    code,
    setCode,
  ] = useState("");


  const [
    value,
    setValue,
  ] = useState("");


  const [
    minSpend,
    setMinSpend,
  ] = useState("");


  const [
    maxDiscount,
    setMaxDiscount,
  ] = useState("");


  const [
    category,
    setCategory,
  ] = useState("");


  const [
    startAt,
    setStartAt,
  ] = useState(() => getMalaysiaDateTimeLocal());

  const [
    expiresAt,
    setExpiresAt,
  ] = useState("");


  const [
    usageLimit,
    setUsageLimit,
  ] = useState("");


  const [
    usagePerCustomer,
    setUsagePerCustomer,
  ] = useState("");


  const [
    newCustomerOnly,
    setNewCustomerOnly,
  ] = useState(false);


  const [
    isActive,
    setIsActive,
  ] = useState(true);


  // ==========================================================
  // SUBMIT
  // ==========================================================

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setError(null);


    const form =
      event.currentTarget;


    const formData =
      new FormData(form);


    startTransition(
      async () => {

        try {

          await createVoucher(
            formData
          );

        } catch (
          error
        ) {

          if (
            error instanceof Error
          ) {

            /*
             * Next.js redirect() internally
             * throws a special error.
             *
             * Do not display that as a
             * normal form error.
             */

            if (
              error.message.includes(
                "NEXT_REDIRECT"
              )
            ) {
              return;
            }


            setError(
              error.message
            );

            return;

          }


          setError(
            "Unable to create voucher."
          );

        }

      }
    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <form
      onSubmit={
        handleSubmit
      }
      className="
        space-y-6
        sm:space-y-8
      "
    >

      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-3
            py-3
            text-xs
            leading-5
            text-red-700
            sm:px-4
            sm:text-sm
            sm:leading-normal
          "
        >
          {error}
        </div>

      )}


      {/* ================================================== */}
      {/* BASIC INFORMATION */}
      {/* ================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-4
          shadow-sm
          sm:p-6
        "
      >

        <div className="mb-6">

          <h2
            className="
              text-base
              font-semibold
              text-gray-900
            "
          >
            Basic Information
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Set the voucher code and discount type.
          </p>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:gap-6
            md:grid-cols-2
          "
        >

          {/* CODE */}

          <div
            className="
              md:col-span-2
            "
          >

            <label
              htmlFor="code"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Voucher Code
            </label>


            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={(
                event
              ) =>
                setCode(
                  event.target.value
                    .toUpperCase()
                )
              }
              placeholder="WELCOME10"
              maxLength={50}
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-3
                py-3
                text-sm
                sm:px-4
                uppercase
                outline-none
                transition
                focus:border-gray-900
                focus:ring-1
                focus:ring-gray-900
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-500
              "
            >
              Customers will enter this code at checkout.
            </p>

          </div>


          {/* TYPE */}

          <div>

            <label
              htmlFor="type"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Discount Type
            </label>


            <select
              id="type"
              name="type"
              value={type}
              onChange={(
                event
              ) =>
                setType(
                  event.target.value as VoucherType
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-3
                py-3
                text-sm
                sm:px-4
                outline-none
                focus:border-gray-900
                focus:ring-1
                focus:ring-gray-900
              "
            >

              <option
                value={
                  VoucherType.PERCENTAGE
                }
              >
                Percentage
              </option>

              <option
                value={
                  VoucherType.FIXED
                }
              >
                Fixed Amount
              </option>

            </select>

          </div>


          {/* VALUE */}

          <div>

            <label
              htmlFor="value"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Discount Value
            </label>


            <div
              className="
                relative
              "
            >

              <input
                id="value"
                name="value"
                type="number"
                min="0"
                step="0.01"
                value={value}
                onChange={(
                  event
                ) =>
                  setValue(
                    event.target.value
                  )
                }
                placeholder={
                  type ===
                  VoucherType.PERCENTAGE
                    ? "10"
                    : "100"
                }
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  px-3
                  py-3
                  pr-11
                  text-sm
                  sm:px-4
                  outline-none
                  focus:border-gray-900
                  focus:ring-1
                  focus:ring-gray-900
                "
              />


              <span
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  sm:right-4
                  -translate-y-1/2
                  text-sm
                  text-gray-400
                "
              >
                {type ===
                VoucherType.PERCENTAGE
                  ? "%"
                  : "RM"}
              </span>

            </div>


            <p
              className="
                mt-2
                text-xs
                text-gray-500
              "
            >
              {type ===
              VoucherType.PERCENTAGE
                ? "Example: 10 = 10% off."
                : "Example: 100 = RM100 off."
              }
            </p>

          </div>

        </div>

      </section>


      {/* ================================================== */}
      {/* DISCOUNT RULES */}
      {/* ================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-4
          shadow-sm
          sm:p-6
        "
      >

        <div className="mb-6">

          <h2
            className="
              text-base
              font-semibold
              text-gray-900
            "
          >
            Discount Rules
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Control when and where the voucher can be used.
          </p>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:gap-6
            md:grid-cols-2
          "
        >

          {/* MIN SPEND */}

          <div>

            <label
              htmlFor="minSpend"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Minimum Spend
            </label>


            <div
              className="
                relative
              "
            >

              <span
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  sm:left-4
                  -translate-y-1/2
                  text-sm
                  text-gray-400
                "
              >
                RM
              </span>


              <input
                id="minSpend"
                name="minSpend"
                type="number"
                min="0"
                step="0.01"
                value={minSpend}
                onChange={(
                  event
                ) =>
                  setMinSpend(
                    event.target.value
                  )
                }
                placeholder="0"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  py-3
                  pl-10
                  pr-3
                  sm:pl-11
                  sm:pr-4
                  text-sm
                  outline-none
                  focus:border-gray-900
                  focus:ring-1
                  focus:ring-gray-900
                "
              />

            </div>


            <p
              className="
                mt-2
                text-xs
                text-gray-500
              "
            >
              Leave at 0 if there is no minimum spend.
            </p>

          </div>


          {/* MAX DISCOUNT */}

          <div>

            <label
              htmlFor="maxDiscount"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Maximum Discount
            </label>


            <div
              className="
                relative
              "
            >

              <span
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  sm:left-4
                  -translate-y-1/2
                  text-sm
                  text-gray-400
                "
              >
                RM
              </span>


              <input
                id="maxDiscount"
                name="maxDiscount"
                type="number"
                min="0"
                step="0.01"
                value={maxDiscount}
                onChange={(
                  event
                ) =>
                  setMaxDiscount(
                    event.target.value
                  )
                }
                placeholder="No limit"
                disabled={
                  type ===
                  VoucherType.FIXED
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  py-3
                  pl-10
                  pr-3
                  sm:pl-11
                  sm:pr-4
                  text-sm
                  outline-none
                  transition
                  disabled:cursor-not-allowed
                  disabled:bg-gray-50
                  disabled:text-gray-400
                  focus:border-gray-900
                  focus:ring-1
                  focus:ring-gray-900
                "
              />

            </div>


            <p
              className="
                mt-2
                text-xs
                text-gray-500
              "
            >
              Mainly used to cap percentage discounts.
            </p>

          </div>


          {/* CATEGORY */}

          <div
            className="
              md:col-span-2
            "
          >

            <label
              htmlFor="category"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Category Restriction
            </label>


            <select
              id="category"
              name="category"
              value={category}
              onChange={(
                event
              ) =>
                setCategory(
                  event.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-3
                py-3
                text-sm
                sm:px-4
                outline-none
                focus:border-gray-900
                focus:ring-1
                focus:ring-gray-900
              "
            >

              <option value="">
                All Categories
              </option>


              {categories.map(
                (
                  item
                ) => (

                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>

                )
              )}

            </select>


            <p
              className="
                mt-2
                text-xs
                text-gray-500
              "
            >
              Leave as All Categories to allow the voucher across the store.
            </p>

          </div>

        </div>

      </section>


      {/* ================================================== */}
      {/* VALIDITY & USAGE */}
      {/* ================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-4
          shadow-sm
          sm:p-6
        "
      >

        <div className="mb-6">

          <h2
            className="
              text-base
              font-semibold
              text-gray-900
            "
          >
            Validity & Usage
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Control the voucher availability and redemption limits.
          </p>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:gap-6
            md:grid-cols-2
          "
        >

          {/* START */}

          <div>

            <label
              htmlFor="startAt"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Start Date
            </label>


            <input
              id="startAt"
              name="startAt"
              type="datetime-local"
              value={startAt}
              onChange={(
                event
              ) =>
                setStartAt(
                  event.target.value
                )
              }
              required
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-3
                py-3
                text-sm
                sm:px-4
                outline-none
                focus:border-gray-900
                focus:ring-1
                focus:ring-gray-900
              "
            />

          </div>


          {/* EXPIRY */}

          <div>

            <label
              htmlFor="expiresAt"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Expiry Date
            </label>

            {newCustomerOnly ? (

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-800
                  "
                >
                  Dynamic expiry
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-gray-500
                  "
                >
                  This voucher is exclusively for new customers and expires 1 month after their registration date.
                </p>
              </div>

            ) : (

              <>
                <input
                  id="expiresAt"
                  name="expiresAt"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(
                    event
                  ) =>
                    setExpiresAt(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-3
                    text-sm
                    sm:px-4
                    outline-none
                    focus:border-gray-900
                    focus:ring-1
                    focus:ring-gray-900
                  "
                />

                <p
                  className="
                    mt-2
                    text-xs
                    text-gray-500
                  "
                >
                  Leave empty for no expiry date.
                </p>
              </>

            )}

          </div>


          {/* USAGE LIMIT */}

          <div>

            <label
              htmlFor="usageLimit"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Total Usage Limit
            </label>


            <input
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="1"
              step="1"
              value={usageLimit}
              onChange={(
                event
              ) =>
                setUsageLimit(
                  event.target.value
                )
              }
              placeholder="Unlimited"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-3
                py-3
                text-sm
                sm:px-4
                outline-none
                focus:border-gray-900
                focus:ring-1
                focus:ring-gray-900
              "
            />


            <p
              className="
                mt-2
                text-xs
                text-gray-500
              "
            >
              Example: 100 means the voucher can be used 100 times in total.
            </p>

          </div>


          {/* PER CUSTOMER */}

          <div>

            <label
              htmlFor="usagePerCustomer"
              className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Usage Per Customer
            </label>


            <input
              id="usagePerCustomer"
              name="usagePerCustomer"
              type="number"
              min="1"
              step="1"
              value={usagePerCustomer}
              onChange={(
                event
              ) =>
                setUsagePerCustomer(
                  event.target.value
                )
              }
              placeholder="Unlimited"
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-3
                py-3
                text-sm
                sm:px-4
                outline-none
                focus:border-gray-900
                focus:ring-1
                focus:ring-gray-900
              "
            />


            <p
              className="
                mt-2
                text-xs
                text-gray-500
              "
            >
              Limit how many times one customer can use this voucher.
            </p>

          </div>

        </div>


        {/* ================================================== */}
        {/* CHECKBOXES */}
        {/* ================================================== */}

        <div
          className="
            mt-8
            space-y-4
            border-t
            border-gray-100
            pt-6
          "
        >

          <label
            className="
              flex
              cursor-pointer
              items-start
              gap-3
            "
          >

            <input
              type="checkbox"
              name="newCustomerOnly"
              value="true"
              checked={
                newCustomerOnly
              }
              onChange={(
                event
              ) =>
                setNewCustomerOnly(
                  event.target.checked
                )
              }
              className="
                mt-1
                h-4
                w-4
                rounded
                border-gray-300
                accent-black
              "
            />


            <span>

              <span
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-800
                "
              >
                New Customers Only
              </span>

              <span
                className="
                  mt-1
                  block
                  text-xs
                  leading-5
                  text-gray-500
                "
              >
                Restrict this voucher to customers who have not placed a previous order.
              </span>

              {newCustomerOnly && (
                <span
                  className="
                    mt-1
                    block
                    text-xs
                    leading-5
                    text-gray-500
                  "
                >
                  This voucher is exclusively for new customers and expires 1 month after their registration date.
                </span>
              )}

            </span>

          </label>


          <label
            className="
              flex
              cursor-pointer
              items-start
              gap-3
            "
          >

            <input
              type="checkbox"
              name="isActive"
              value="true"
              checked={
                isActive
              }
              onChange={(
                event
              ) =>
                setIsActive(
                  event.target.checked
                )
              }
              className="
                mt-1
                h-4
                w-4
                rounded
                border-gray-300
                accent-black
              "
            />


            <span>

              <span
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-800
                "
              >
                Active
              </span>

              <span
                className="
                  mt-1
                  block
                  text-xs
                  text-gray-500
                "
              >
                Customers can use this voucher immediately when the start date is reached.
              </span>

            </span>

          </label>

        </div>

      </section>


      {/* ================================================== */}
      {/* ACTIONS */}
      {/* ================================================== */}

      <div
        className="
          flex
          flex-col-reverse
          gap-3
          sm:flex-row
          sm:justify-end
        "
      >

        <Link
          href="/admin/dashboard/vouchers"
          className="
            inline-flex
            w-full
            items-center
            justify-center
            rounded-xl
            border
            border-gray-300
            bg-white
            px-5
            py-3
            sm:w-auto
            sm:px-6
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
          "
        >
          Cancel
        </Link>


        <button
          type="submit"
          disabled={
            isPending
          }
          className="
            inline-flex
            w-full
            items-center
            justify-center
            rounded-xl
            bg-black
            px-6
            py-3
            sm:w-auto
            sm:px-7
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          {isPending
            ? "Creating..."
            : "Create Voucher"}

        </button>

      </div>

    </form>

  );

}