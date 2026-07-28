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
    <div className="space-y-3">
      <label
        htmlFor="subcategory-filter"
        className="block text-xs uppercase tracking-[0.35em] text-neutral-400"
      >
        Sub Category
      </label>

      <select
        id="subcategory-filter"
        aria-label="Filter by sub category"
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
        {subCategories.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}