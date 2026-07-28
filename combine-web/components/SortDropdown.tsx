"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SortDropdown({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-3">
      <label
        htmlFor="sort-dropdown"
        className="block text-xs uppercase tracking-[0.35em] text-neutral-400"
      >
        Sort
      </label>

      <select
        id="sort-dropdown"
        aria-label="Sort products"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
        <option value="Newest">Newest</option>
        <option value="Price Low">Price: Low → High</option>
        <option value="Price High">Price: High → Low</option>
        <option value="Brand">Brand (A–Z)</option>
      </select>
    </div>
  );
}