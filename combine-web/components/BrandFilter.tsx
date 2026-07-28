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
    <div className="space-y-3">
      <label
        htmlFor="brand-filter"
        className="block text-xs uppercase tracking-[0.35em] text-neutral-400"
      >
        Brand
      </label>

      <select
        id="brand-filter"
        aria-label="Filter by brand"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-neutral-200
          bg-white
          px-6
          py-5
          text-base
          text-neutral-900
          shadow-sm
          outline-none
          transition-all
          duration-300
          focus:border-black
          focus:ring-4
          focus:ring-black/5
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
    </div>
  );
}