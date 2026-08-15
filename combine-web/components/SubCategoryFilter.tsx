"use client";

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
  function handleSelect(
    value: string
  ) {
    /*
     * =====================================================
     * All
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
     * Toggle Selected Value
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

  return (
    <div
      className="
        w-full
        min-w-0
        space-y-4
        sm:space-y-5
      "
    >
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

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

        {/* Selected Count */}

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

      {/* ================================================= */}
      {/* Options */}
      {/* ================================================= */}

      <div
        className="
          grid
          w-full
          min-w-0
          grid-cols-2
          gap-2
          sm:grid-cols-3
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
                  min-h-12
                  w-full
                  min-w-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-3
                  py-3
                  text-center
                  transition-all
                  duration-300
                  active:scale-[0.97]

                  sm:min-h-13
                  sm:px-4
                  sm:py-3

                  xl:min-h-14
                  xl:px-4

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
                  {/* Check */}

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

                  {/* Text */}

                  <span
                    className="
                      min-w-0
                      max-w-full
                      text-center
                      text-[10px]
                      font-medium
                      leading-4
                      tracking-[0.02em]
                      break-words

                      sm:text-[11px]
                      sm:leading-5

                      xl:text-[12px]
                      xl:leading-5
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

      {/* ================================================= */}
      {/* Helper */}
      {/* ================================================= */}

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