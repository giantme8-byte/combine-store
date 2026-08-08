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
    <div className="space-y-3 sm:space-y-4">
      {/* Label */}
      <p
        className="
          text-[10px]
          font-medium
          uppercase
          tracking-[0.35em]
          text-neutral-400
          sm:text-[11px]
          sm:tracking-[0.45em]
        "
      >
        Sort By
      </p>

      <div className="relative">
        {/* Select */}
        <select
          id="sort-dropdown"
          aria-label="Sort products"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            h-12
            w-full
            appearance-none
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-4
            pr-10
            text-[12px]
            font-light
            text-neutral-900
            shadow-[0_8px_24px_rgba(0,0,0,.03)]
            outline-none
            transition-all
            duration-500
            hover:border-neutral-300
            hover:shadow-[0_18px_45px_rgba(0,0,0,.06)]
            focus:border-[#C8A96A]
            focus:shadow-[0_25px_60px_rgba(200,169,106,.18)]
            sm:h-16
            sm:rounded-[24px]
            sm:px-6
            sm:pr-14
            sm:text-[15px]
          "
        >
          <option value="Newest">
            Newest
          </option>

          <option value="Price Low">
            Price · Low → High
          </option>

          <option value="Price High">
            Price · High → Low
          </option>

          <option value="Brand">
            Brand · A–Z
          </option>
        </select>

        {/* Custom Arrow */}
        <div
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-neutral-400
            sm:right-6
          "
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            className="sm:h-4 sm:w-4"
          >
            <path
              d="M5 7L10 12L15 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Hint */}
      <p
        className="
          text-[9px]
          uppercase
          tracking-[0.22em]
          text-neutral-400
          sm:text-[11px]
          sm:tracking-[0.3em]
        "
      >
        Display Order
      </p>
    </div>
  );
}