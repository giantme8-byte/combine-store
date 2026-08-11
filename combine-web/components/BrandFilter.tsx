"use client";

type Props = {
  selected: string;
  onSelect: (value: string) => void;
  brands: string[];
};

export default function BrandFilter({
  selected,
  onSelect,
  brands,
}: Props) {
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

      <label
        htmlFor="brand-filter"
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
        Brand
      </label>

      {/* ================================================= */}
      {/* Select */}
      {/* ================================================= */}

      <div
        className="
          relative
        "
      >
        <select
          id="brand-filter"
          aria-label="Filter by brand"
          value={selected}
          onChange={(e) =>
            onSelect(
              e.target.value
            )
          }
          className="
            min-h-11
            w-full
            appearance-none
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-4
            py-2.5
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
            sm:min-h-12
            sm:rounded-2xl
            sm:px-6
            sm:py-4
            sm:pr-14
            sm:text-[15px]
          "
        >
          {brands.map(
            (brand) => (
              <option
                key={brand}
                value={brand}
              >
                {brand}
              </option>
            )
          )}
        </select>

        {/* ================================================= */}
        {/* Arrow */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            flex
            -translate-y-1/2
            items-center
            justify-center
            text-[8px]
            text-neutral-400
            sm:right-6
            sm:text-[10px]
          "
          aria-hidden="true"
        >
          ▼
        </div>
      </div>
    </div>
  );
}