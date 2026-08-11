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
     * All
     *
     * Selecting All clears
     * every selected sub category.
     */
    if (value === "All") {
      onSelect([]);
      return;
    }

    /*
     * Toggle selected value.
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
        space-y-3
        sm:space-y-4
      "
    >
      {/* ================================================= */}
      {/* Label */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <p
          className="
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
          flex
          max-h-[220px]
          flex-wrap
          gap-2
          overflow-y-auto
          pr-1
          sm:max-h-[280px]
          sm:gap-2.5
        "
      >
        {subCategories.map(
          (item) => {
            const active =
              item === "All"
                ? selectedCount ===
                  0
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
                  group
                  min-h-10
                  rounded-full
                  border
                  px-3.5
                  py-2
                  text-[10px]
                  font-medium
                  tracking-[0.04em]
                  transition-all
                  duration-300
                  active:scale-[0.97]

                  sm:min-h-11
                  sm:px-4
                  sm:py-2.5
                  sm:text-[11px]

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
                    items-center
                    gap-2
                  "
                >
                  {/* Check */}

                  {active &&
                    item !==
                      "All" && (
                      <span
                        className="
                          text-[10px]
                          font-semibold
                        "
                      >
                        ✓
                      </span>
                    )}

                  {item}
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
        Select multiple categories
      </p>
    </div>
  );
}