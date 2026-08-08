"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type Props = {
  selected: string;
  onSelect: (category: string) => void;
};

const categories = [
  "All",
  "Bags",
  "Shoes",
  "Clothing",
  "Watches",
  "Jewelry",
  "Accessories",
  "Fragrance",
];

export default function CategoryFilter({
  selected,
  onSelect,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="col-span-2 space-y-3 xl:col-span-1 xl:space-y-4">
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
        Category
      </p>

      {/* Pills */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {categories.map((category) => {
          const active =
            selected === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                onSelect(category);

                const params =
                  new URLSearchParams(
                    searchParams.toString()
                  );

                if (category === "All") {
                  params.delete(
                    "category"
                  );
                } else {
                  params.set(
                    "category",
                    category
                  );
                }

                router.push(
                  `/shop?${params.toString()}`
                );
              }}
              className={`
                rounded-full
                border
                px-3.5
                py-2
                text-[10px]
                font-medium
                tracking-[0.06em]
                transition-all
                duration-500
                sm:px-6
                sm:py-3
                sm:text-[13px]
                sm:tracking-[0.08em]
                ${
                  active
                    ? `
                      border-[#C8A96A]
                      bg-[#C8A96A]
                      text-white
                      shadow-[0_15px_35px_rgba(200,169,106,.35)]
                    `
                    : `
                      border-neutral-200
                      bg-white
                      text-neutral-700
                      hover:-translate-y-0.5
                      hover:border-[#C8A96A]
                      hover:text-[#A88755]
                      hover:shadow-lg
                    `
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Bottom Divider */}
      <div
        className="
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-neutral-200
          to-transparent
        "
      />
    </div>
  );
}