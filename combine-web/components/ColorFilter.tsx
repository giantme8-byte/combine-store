"use client";

type Props = {
  selected: string;
  onSelect: (value: string) => void;
  colors: string[];
};

export default function ColorFilter({
  selected,
  onSelect,
  colors,
}: Props) {
  return (
    <div className="space-y-3">
      <label
        htmlFor="color-filter"
        className="block text-xs uppercase tracking-[0.35em] text-neutral-400"
      >
        Color
      </label>

      <select
        id="color-filter"
        aria-label="Filter by color"
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
        {colors.map((color) => (
          <option
            key={color}
            value={color}
          >
            {color}
          </option>
        ))}
      </select>
    </div>
  );
}