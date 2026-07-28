"use client";

import type { KeyboardEventHandler } from "react";
import { Search, X } from "lucide-react";

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
    <div className="mb-12">
      <label
        htmlFor="product-search"
        className="mb-3 block text-xs uppercase tracking-[0.35em] text-neutral-400"
      >
        Search
      </label>

      <div className="relative">
        {/* Search Icon */}
        <Search
          size={20}
          className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400"
        />

        <input
          id="product-search"
          type="text"
          autoComplete="off"
          placeholder="Search luxury products..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className="
            w-full
            rounded-2xl
            border
            border-neutral-200
            bg-white
            py-5
            pl-14
            pr-14
            text-lg
            text-neutral-900
            shadow-[0_8px_24px_rgba(0,0,0,0.03)]
            outline-none
            transition-all
            duration-300
            placeholder:text-neutral-400
            hover:border-neutral-300
            focus:border-black
            focus:ring-4
            focus:ring-black/5
          "
        />

        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="
              absolute
              right-5
              top-1/2
              flex
              h-9
              w-9
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              text-neutral-400
              transition-colors
              duration-200
              hover:bg-neutral-100
              hover:text-neutral-700
            "
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}