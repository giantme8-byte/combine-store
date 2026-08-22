"use client";

import { useMemo, useState } from "react";

type Props = {
  selected: string[];
  onSelect: (values: string[]) => void;
  subCategories: string[];
};

export default function SubCategoryFilter({
  selected,
  onSelect,
  subCategories,
}: Props) {
  const [expanded, setExpanded] =
    useState(false);

  // ==========================================================
  // SELECT
  // ==========================================================

  function handleSelect(
    value: string
  ) {
    /*
     * =====================================================
     * ALL
     *
     * Selecting All clears
     * every selected sub-category.
     * =====================================================
     */

    if (value === "All") {
      onSelect([]);
      return;
    }

    /*
     * =====================================================
     * TOGGLE SELECTED VALUE
     * =====================================================
     */

    const exists =
      selected.includes(value);

    if (exists) {
      onSelect(
        selected.filter(
          (item) =>
            item !== value
        )
      );

      return;
    }

    onSelect([
      ...selected,
      value,
    ]);
  }

  const selectedCount =
    selected.length;


  // ==========================================================
  // MOBILE PREVIEW
  // ==========================================================

  const mobileSubCategories =
    useMemo(() => {
      /*
       * Always keep "All" visible.
       *
       * Then show the first 7 real
       * sub-categories.
       */

      const allItem =
        subCategories.includes("All")
          ? ["All"]
          : [];

      const normalItems =
        subCategories.filter(
          (item) =>
            item !== "All"
        );

      const preview =
        normalItems.slice(0, 7);

      /*
       * If the customer has selected
       * a hidden sub-category, keep it
       * visible even when collapsed.
       */

      const selectedHidden =
        selected.filter(
          (item) =>
            item !== "All" &&
            !preview.includes(item)
        );

      return [
        ...allItem,
        ...preview,
        ...selectedHidden,
      ];
    }, [
      subCategories,
      selected,
    ]);


  // ==========================================================
  // ITEMS TO RENDER ON MOBILE
  // ==========================================================

  const mobileItems =
    expanded
      ? subCategories
      : mobileSubCategories;


  // ==========================================================
  // HAS MORE
  // ==========================================================

  const hasMore =
    subCategories.length >
    mobileSubCategories.length;


  return (
    <div
      className="
        w-full
        min-w-0
        space-y-4

        sm:space-y-5
      "
    >

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex
          w-full
          min-w-0
          items-center
          justify-between
          gap-3
        "
      >

        <p
          className="
            min-w-0
            text-[10px]
            font-medium
            uppercase
            tracking-[0.35em]
            text-neutral-400

            sm:text-[11px]
            sm:tracking-[0.45em]
          "
        >
          Sub Category
        </p>


        {/* ================================================== */}
        {/* SELECTED COUNT */}
        {/* ================================================== */}

        {selectedCount > 0 && (
          <span
            className="
              shrink-0
              rounded-full
              bg-[#C8A96A]/10
              px-2.5
              py-1
              text-[9px]
              font-medium
              uppercase
              tracking-[0.15em]
              text-[#A88755]

              sm:px-3
              sm:text-[10px]
            "
          >
            {selectedCount} Selected
          </span>
        )}

      </div>


      {/* ==================================================== */}
      {/* MOBILE OPTIONS */}
      {/* ==================================================== */}

      <div
        className="
          grid
          w-full
          min-w-0
          grid-cols-2
          items-stretch
          gap-2

          sm:hidden
        "
      >

        {mobileItems.map(
          (item) => {

            const active =
              item === "All"
                ? selectedCount === 0
                : selected.includes(
                    item
                  );

            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  handleSelect(
                    item
                  )
                }
                className={`
                  flex
                  h-12
                  w-full
                  min-w-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-2
                  py-2
                  text-center
                  transition-all
                  duration-300
                  active:scale-[0.97]

                  ${
                    active
                      ? `
                        border-[#C8A96A]
                        bg-[#C8A96A]
                        text-white
                        shadow-[0_10px_25px_rgba(200,169,106,.25)]
                      `
                      : `
                        border-neutral-200
                        bg-white
                        text-neutral-700
                        hover:border-[#C8A96A]
                        hover:text-[#A88755]
                        hover:shadow-md
                      `
                  }
                `}
              >

                <span
                  className="
                    flex
                    w-full
                    min-w-0
                    items-center
                    justify-center
                    gap-1.5
                  "
                >

                  {/* ====================================== */}
                  {/* CHECK */}
                  {/* ====================================== */}

                  {active &&
                    item !== "All" && (
                      <span
                        className="
                          shrink-0
                          text-[10px]
                          font-semibold
                        "
                      >
                        ✓
                      </span>
                    )}


                  {/* ====================================== */}
                  {/* TEXT */}
                  {/* ====================================== */}

                  <span
                    className="
                      min-w-0
                      max-w-full
                      truncate
                      text-center
                      text-[10px]
                      font-medium
                      leading-4
                      tracking-[0.01em]
                    "
                    title={item}
                  >
                    {item}
                  </span>

                </span>

              </button>
            );
          }
        )}

      </div>


      {/* ==================================================== */}
      {/* DESKTOP OPTIONS */}
      {/* ==================================================== */}

      <div
        className="
          hidden
          w-full
          min-w-0

          sm:grid
          sm:grid-cols-3
          sm:items-stretch
          sm:gap-3

          xl:grid-cols-4
          xl:gap-3
        "
      >

        {subCategories.map(
          (item) => {

            const active =
              item === "All"
                ? selectedCount === 0
                : selected.includes(
                    item
                  );

            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  handleSelect(
                    item
                  )
                }
                className={`
                  flex
                  min-h-13
                  w-full
                  min-w-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-center
                  transition-all
                  duration-300
                  active:scale-[0.97]

                  xl:min-h-14

                  ${
                    active
                      ? `
                        border-[#C8A96A]
                        bg-[#C8A96A]
                        text-white
                        shadow-[0_10px_25px_rgba(200,169,106,.25)]
                      `
                      : `
                        border-neutral-200
                        bg-white
                        text-neutral-700
                        hover:-translate-y-0.5
                        hover:border-[#C8A96A]
                        hover:text-[#A88755]
                        hover:shadow-md
                      `
                  }
                `}
              >

                <span
                  className="
                    flex
                    w-full
                    min-w-0
                    items-center
                    justify-center
                    gap-1.5
                  "
                >

                  {/* ====================================== */}
                  {/* CHECK */}
                  {/* ====================================== */}

                  {active &&
                    item !== "All" && (
                      <span
                        className="
                          shrink-0
                          text-[10px]
                          font-semibold
                        "
                      >
                        ✓
                      </span>
                    )}


                  {/* ====================================== */}
                  {/* TEXT */}
                  {/* ====================================== */}

                  <span
                    className="
                      min-w-0
                      max-w-full
                      break-words
                      text-center
                      text-[11px]
                      font-medium
                      leading-5
                      tracking-[0.02em]

                      xl:text-[12px]
                    "
                  >
                    {item}
                  </span>

                </span>

              </button>
            );
          }
        )}

      </div>


      {/* ==================================================== */}
      {/* MOBILE VIEW ALL */}
      {/* ==================================================== */}

      {hasMore && (
        <div
          className="
            flex
            justify-center

            sm:hidden
          "
        >

          <button
            type="button"
            onClick={() =>
              setExpanded(
                (value) => !value
              )
            }
            className="
              inline-flex
              items-center
              justify-center
              rounded-full
              border
              border-neutral-200
              bg-white
              px-5
              py-2.5
              text-[9px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-neutral-600
              transition-all
              duration-300

              hover:border-[#C8A96A]
              hover:text-[#A88755]
              hover:shadow-sm
            "
          >

            {expanded
              ? "Show Less"
              : "View All Categories"}

          </button>

        </div>
      )}


      {/* ==================================================== */}
      {/* HELPER */}
      {/* ==================================================== */}

      <p
        className="
          text-[9px]
          uppercase
          tracking-[0.2em]
          text-neutral-400

          sm:text-[10px]
          sm:tracking-[0.25em]
        "
      >
        Select multiple sub-categories
      </p>

    </div>
  );
}