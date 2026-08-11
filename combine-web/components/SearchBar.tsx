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
    <div className="mb-7 sm:mb-12">
      {/* Label */}
      <p
        className="
          mb-3
          text-[9px]
          font-medium
          uppercase
          tracking-[0.32em]
          text-neutral-400
          sm:mb-4
          sm:text-[11px]
          sm:tracking-[0.45em]
        "
      >
        Search Collection
      </p>

      {/* Search Box */}
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-[18px]
          border
          border-neutral-200
          bg-white
          shadow-[0_12px_35px_rgba(0,0,0,.035)]
          transition-all
          duration-500
          hover:border-neutral-300
          hover:shadow-[0_20px_55px_rgba(0,0,0,.06)]
          focus-within:border-[#C8A96A]
          focus-within:shadow-[0_25px_70px_rgba(200,169,106,.14)]
          sm:rounded-[28px]
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
          aria-hidden="true"
          size={18}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-neutral-400
            transition-colors
            duration-300
            group-focus-within:text-[#C8A96A]
            sm:left-7
            sm:size-[22px]
          "
        />

        {/* Input */}
        <input
          id="product-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          placeholder="Search handbags, watches, jewellery..."
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          className="
            relative
            z-10
            h-14
            w-full
            bg-transparent
            pl-12
            pr-12
            text-[14px]
            font-light
            text-neutral-900
            outline-none
            placeholder:text-neutral-400
            sm:h-20
            sm:pl-16
            sm:pr-16
            sm:text-lg
          "
        />

        {/* Clear */}
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() =>
              onChange("")
            }
            className="
              absolute
              right-3
              top-1/2
              z-20
              flex
              h-8
              w-8
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
              active:scale-95
              sm:right-5
              sm:h-10
              sm:w-10
            "
          >
            <X
              size={16}
              className="sm:size-[18px]"
            />
          </button>
        )}
      </div>

      {/* Hint */}
      <p
        className="
          mt-3
          text-[8px]
          uppercase
          tracking-[0.18em]
          text-neutral-400
          sm:mt-4
          sm:text-[11px]
          sm:tracking-[0.3em]
        "
      >
        Search by Brand · Model · SKU · Category
      </p>
    </div>
  );
}