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
    <div className="space-y-4">
      {/* Label */}
      <label
        htmlFor="brand-filter"
        className="
          block
          text-[11px]
          font-medium
          uppercase
          tracking-[0.45em]
          text-neutral-400
        "
      >
        Brand
      </label>

      {/* Select */}
      <div className="relative">
        <select
          id="brand-filter"
          aria-label="Filter by brand"
          value={selected}
          onChange={(e) =>
            onSelect(e.target.value)
          }
          className="
            w-full
            appearance-none
            rounded-2xl
            border
            border-neutral-200
            bg-white
            px-6
            py-5
            pr-14
            text-[15px]
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
          "
        >
          {brands.map((brand) => (
            <option
              key={brand}
              value={brand}
            >
              {brand}
            </option>
          ))}
        </select>

        {/* Arrow */}
        <div
          className="
            pointer-events-none
            absolute
            right-6
            top-1/2
            -translate-y-1/2
            text-neutral-400
          "
        >
          ▼
        </div>
      </div>
    </div>
  );
}