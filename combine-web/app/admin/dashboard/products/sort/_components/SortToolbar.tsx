"use client";

type SortToolbarProps = {
  search: string;
  brand: string;
  category: string;

  brands: {
    id: number;
    name: string;
  }[];

  categories: {
    id: number;
    name: string;
  }[];

  onSearchChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export default function SortToolbar({
  search,
  brand,
  category,
  brands,
  categories,
  onSearchChange,
  onBrandChange,
  onCategoryChange,
}: SortToolbarProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">

      <div className="grid gap-4 md:grid-cols-3">

        <input
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search Product..."
          className="
            rounded-xl
            border
            border-neutral-300
            px-4
            py-3
            outline-none
            transition
            focus:border-black
          "
        />

        <select
          value={brand}
          onChange={(e) =>
            onBrandChange(e.target.value)
          }
          className="
            rounded-xl
            border
            border-neutral-300
            px-4
            py-3
          "
        >
          <option value="">
            All Brands
          </option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.name}
            >
              {brand.name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value)
          }
          className="
            rounded-xl
            border
            border-neutral-300
            px-4
            py-3
          "
        >
          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.name}
            >
              {category.name}
            </option>
          ))}
        </select>

      </div>

    </div>
  );
}