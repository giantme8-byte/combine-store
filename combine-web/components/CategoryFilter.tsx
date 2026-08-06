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
  const searchParams =
    useSearchParams();

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
        Category
      </p>

      {/* Pills */}
      <div className="flex flex-wrap gap-3">
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

                if (
                  category === "All"
                ) {
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
                px-6
                py-3
                text-[13px]
                font-medium
                tracking-[0.08em]
                transition-all
                duration-500
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