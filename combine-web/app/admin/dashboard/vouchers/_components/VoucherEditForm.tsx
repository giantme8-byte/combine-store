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
  updateVoucher,
} from "../_actions/voucher.actions";


// ============================================================
// TYPES
// ============================================================

type CategoryOption = {
  id: number;
  name: string;
};


type VoucherData = {
  id: number;

  code: string;

  type: VoucherType;

  value: number;

  minSpend: number;

  maxDiscount: number | null;

  category: string | null;

  startAt: string;

  expiresAt: string | null;

  usageLimit: number | null;

  usageCount: number;

  usagePerCustomer: number | null;

  newCustomerOnly: boolean;

  isActive: boolean;
};


type VoucherEditFormProps = {
  voucher: VoucherData;

  categories: CategoryOption[];
};


// ============================================================
// DATE FORMATTER
// ============================================================

function toDateTimeLocal(
  value: string | null
) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  // Database values are UTC. Display them explicitly as Malaysia time (UTC+8).
  const malaysiaTime = new Date(
    date.getTime() + 8 * 60 * 60 * 1000
  );

  const year = malaysiaTime.getUTCFullYear();
  const month = String(malaysiaTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(malaysiaTime.getUTCDate()).padStart(2, "0");
  const hours = String(malaysiaTime.getUTCHours()).padStart(2, "0");
  const minutes = String(malaysiaTime.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// ============================================================
// COMPONENT
// ============================================================

export default function VoucherEditForm({
  voucher,
  categories,
}: VoucherEditFormProps) {

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
    voucher.type
  );


  const [
    code,
    setCode,
  ] = useState(
    voucher.code
  );


  const [
    value,
    setValue,
  ] = useState(
    String(
      voucher.value
    )
  );


  const [
    minSpend,
    setMinSpend,
  ] = useState(
    String(
      voucher.minSpend
    )
  );


  const [
    maxDiscount,
    setMaxDiscount,
  ] = useState(
    voucher.maxDiscount !==
      null
      ? String(
          voucher.maxDiscount
        )
      : ""
  );


  const [
    category,
    setCategory,
  ] = useState(
    voucher.category ??
      ""
  );


  const [
    startAt,
    setStartAt,
  ] = useState(
    toDateTimeLocal(
      voucher.startAt
    )
  );


  const [
    expiresAt,
    setExpiresAt,
  ] = useState(
    toDateTimeLocal(
      voucher.expiresAt
    )
  );


  const [
    usageLimit,
    setUsageLimit,
  ] = useState(
    voucher.usageLimit !==
      null
      ? String(
          voucher.usageLimit
        )
      : ""
  );


  const [
    usagePerCustomer,
    setUsagePerCustomer,
  ] = useState(
    voucher.usagePerCustomer !==
      null
      ? String(
          voucher.usagePerCustomer
        )
      : ""
  );


  const [
    newCustomerOnly,
    setNewCustomerOnly,
  ] = useState(
    voucher.newCustomerOnly
  );


  const [
    isActive,
    setIsActive,
  ] = useState(
    voucher.isActive
  );


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

          await updateVoucher(
            voucher.id,
            formData
          );

        } catch (
          error
        ) {

          if (
            error instanceof Error
          ) {

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
            "Unable to update voucher."
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
      {/* USAGE NOTICE */}
      {/* ================================================== */}

      {voucher.usageCount > 0 && (

        <div
          className="
            rounded-xl
            border
            border-amber-200
            bg-amber-50
            px-3
            py-3
            text-xs
            leading-5
            text-amber-800
            sm:px-4
            sm:py-4
            sm:text-sm
            sm:leading-normal
          "
        >

          This voucher has already been used{" "}
          <strong>
            {voucher.usageCount}
          </strong>{" "}
          time
          {voucher.usageCount === 1
            ? ""
            : "s"}.
          Changes will affect future uses only.

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

        <div className="mb-5 sm:mb-6">

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
            Update the voucher code and discount settings.
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
                focus:border-gray-900
                focus:ring-1
                focus:ring-gray-900
              "
            />

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

          </div>


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
              disabled={
                type ===
                VoucherType.FIXED
              }
              placeholder="No limit"
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
                disabled:cursor-not-allowed
                disabled:bg-gray-50
                disabled:text-gray-400
                focus:border-gray-900
                focus:ring-1
                focus:ring-gray-900
              "
            />

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
                    key={
                      item.id
                    }
                    value={
                      item.name
                    }
                  >
                    {item.name}
                  </option>

                )
              )}

            </select>

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

        <div className="mb-5 sm:mb-6">

          <h2
            className="
              text-base
              font-semibold
              text-gray-900
            "
          >
            Validity & Usage
          </h2>

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

          </div>

        </div>


        {/* CHECKBOXES */}

        <div
          className="
            mt-6
            space-y-4
            border-t
            border-gray-100
            pt-5
            sm:mt-8
            sm:pt-6
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
                Customers can use this voucher when it is active and within its validity period.
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
            items-center
            justify-center
            rounded-xl
            border
            border-gray-300
            bg-white
            w-full
            px-5
            py-3
            text-sm
            font-medium
            text-gray-700
            sm:w-auto
            sm:px-6
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
            items-center
            justify-center
            rounded-xl
            w-full
            bg-black
            px-6
            py-3
            text-sm
            sm:w-auto
            sm:px-7
            font-medium
            text-white
            transition
            hover:bg-gray-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          {isPending
            ? "Saving..."
            : "Save Changes"}

        </button>

      </div>

    </form>

  );

}