"use client";

import type { KeyboardEventHandler } from "react";
import {
  Search,
  X,
} from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

export default function SearchBar({
  value,
  onChange,
  onFocus,
  onKeyDown,
}: SearchBarProps) {
  return (
    <div className="mb-14">
      {/* Label */}
      <p
        className="
          mb-4
          text-[11px]
          font-medium
          uppercase
          tracking-[0.45em]
          text-neutral-400
        "
      >
        Search Collection
      </p>

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-neutral-200
          bg-white
          shadow-[0_15px_45px_rgba(0,0,0,.04)]
          transition-all
          duration-500
          hover:border-neutral-300
          hover:shadow-[0_25px_70px_rgba(0,0,0,.08)]
          focus-within:border-[#C8A96A]
          focus-within:shadow-[0_30px_80px_rgba(200,169,106,.18)]
        "
      >
        {/* Luxury Glow */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(200,169,106,.08),transparent_45%)]
          "
        />

        {/* Search Icon */}
        <Search
          size={22}
          className="
            pointer-events-none
            absolute
            left-7
            top-1/2
            -translate-y-1/2
            text-neutral-400
            transition-colors
            duration-300
            group-focus-within:text-[#C8A96A]
          "
        />

        {/* Input */}
        <input
          id="product-search"
          type="text"
          autoComplete="off"
          placeholder="Search handbags, watches, jewellery..."
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className="
            h-20
            w-full
            bg-transparent
            pl-16
            pr-16
            text-lg
            font-light
            text-neutral-900
            outline-none
            placeholder:text-neutral-400
          "
        />

        {/* Clear */}
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="
              absolute
              right-6
              top-1/2
              flex
              h-10
              w-10
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              text-neutral-400
              transition-all
              duration-300
              hover:scale-110
              hover:bg-neutral-100
              hover:text-black
            "
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Hint */}
      <p
        className="
          mt-4
          text-[11px]
          uppercase
          tracking-[0.3em]
          text-neutral-400
        "
      >
        Search by Brand · Model · SKU · Category
      </p>
    </div>
  );
}