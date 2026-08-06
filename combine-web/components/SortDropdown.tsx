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
    <div className="space-y-4">
      {/* Label */}
      <p
        className="
          text-[11px]
          font-medium
          uppercase
          tracking-[0.45em]
          text-neutral-400
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
            h-16
            w-full
            appearance-none
            rounded-[24px]
            border
            border-neutral-200
            bg-white
            px-6
            pr-14
            text-[15px]
            font-light
            text-neutral-900
            shadow-[0_12px_35px_rgba(0,0,0,.04)]
            outline-none
            transition-all
            duration-500
            hover:border-neutral-300
            hover:shadow-[0_18px_45px_rgba(0,0,0,.06)]
            focus:border-[#C8A96A]
            focus:shadow-[0_25px_60px_rgba(200,169,106,.18)]
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
            right-6
            top-1/2
            -translate-y-1/2
            text-neutral-400
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
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
          text-[11px]
          uppercase
          tracking-[0.3em]
          text-neutral-400
        "
      >
        Display Order
      </p>
    </div>
  );
}