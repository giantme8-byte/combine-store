"use client";

type Props = {
  selected: string;
  onSelect: (value: string) => void;
  subCategories: string[];
};

export default function SubCategoryFilter({
  selected,
  onSelect,
  subCategories,
}: Props) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Label */}
      <label
        htmlFor="subcategory-filter"
        className="
          block
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
      </label>

      {/* Select */}
      <div className="relative">
        <select
          id="subcategory-filter"
          aria-label="Filter by sub category"
          value={selected}
          onChange={(e) =>
            onSelect(e.target.value)
          }
          className="
            w-full
            appearance-none
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-4
            py-3.5
            pr-10
            text-[12px]
            font-light
            text-neutral-900
            shadow-[0_8px_24px_rgba(0,0,0,.03)]
            outline-none
            transition-all
            duration-500
            hover:border-[#C8A96A]
            focus:border-[#C8A96A]
            focus:ring-4
            focus:ring-[#C8A96A]/10
            sm:rounded-2xl
            sm:px-6
            sm:py-5
            sm:pr-14
            sm:text-[15px]
          "
        >
          {subCategories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        {/* Arrow */}
        <div
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-[9px]
            text-neutral-400
            sm:right-6
            sm:text-[11px]
          "
        >
          ▼
        </div>
      </div>
    </div>
  );
}