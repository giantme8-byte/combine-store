"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
        Category
      </p>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const active = selected === category;

return (
  <button
    key={category}
    type="button"
    onClick={() => {
      onSelect(category);

      const params = new URLSearchParams(
        searchParams.toString()
      );

      if (category === "All") {
        params.delete("category");
      } else {
        params.set("category", category);
      }

      router.push(`/shop?${params.toString()}`);
    }}
    className={`
      rounded-full
      border
      px-5
      py-3
      text-sm
      font-medium
      transition-all
      duration-300
      ${
        active
          ? "border-black bg-black text-white shadow-lg"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
      }
    `}
  >
    {category}
  </button>
);
        })}
      </div>
    </div>
  );
}