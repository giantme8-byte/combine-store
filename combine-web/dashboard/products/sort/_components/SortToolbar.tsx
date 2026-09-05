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
    <div
      className="
        w-full
        min-w-0
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-4

        sm:rounded-3xl
        sm:p-6
      "
    >
      <div
        className="
          grid
          min-w-0
          grid-cols-1
          gap-4

          sm:gap-5
          md:grid-cols-3
        "
      >

        {/* ================================================== */}
        {/* SEARCH */}
        {/* ================================================== */}

        <div className="min-w-0">

          <label
            htmlFor="product-sort-search"
            className="
              mb-1.5
              block
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-neutral-400

              sm:mb-2
              sm:text-xs
            "
          >
            Search
          </label>

          <input
            id="product-sort-search"
            type="search"
            value={search}
            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }
            placeholder="Search products..."
            autoComplete="off"
            className="
              h-11
              w-full
              min-w-0
              appearance-none
              rounded-xl
              border
              border-neutral-300
              bg-white
              px-4
              text-sm
              text-neutral-900
              outline-none
              transition
              placeholder:text-neutral-400
              focus:border-black
              focus:ring-1
              focus:ring-black

              sm:h-12
            "
          />

        </div>


        {/* ================================================== */}
        {/* BRAND */}
        {/* ================================================== */}

        <div className="min-w-0">

          <label
            htmlFor="product-sort-brand"
            className="
              mb-1.5
              block
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-neutral-400

              sm:mb-2
              sm:text-xs
            "
          >
            Brand
          </label>

          <select
            id="product-sort-brand"
            value={brand}
            onChange={(e) =>
              onBrandChange(
                e.target.value
              )
            }
            className="
              h-11
              w-full
              min-w-0
              rounded-xl
              border
              border-neutral-300
              bg-white
              px-4
              text-sm
              text-neutral-900
              outline-none
              transition
              focus:border-black
              focus:ring-1
              focus:ring-black

              sm:h-12
            "
          >

            <option value="">
              All Brands
            </option>

            {brands.map(
              (brand) => (

                <option
                  key={
                    brand.id
                  }
                  value={
                    brand.name
                  }
                >
                  {brand.name}
                </option>

              )
            )}

          </select>

        </div>


        {/* ================================================== */}
        {/* CATEGORY */}
        {/* ================================================== */}

        <div className="min-w-0">

          <label
            htmlFor="product-sort-category"
            className="
              mb-1.5
              block
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-neutral-400

              sm:mb-2
              sm:text-xs
            "
          >
            Category
          </label>

          <select
            id="product-sort-category"
            value={category}
            onChange={(e) =>
              onCategoryChange(
                e.target.value
              )
            }
            className="
              h-11
              w-full
              min-w-0
              rounded-xl
              border
              border-neutral-300
              bg-white
              px-4
              text-sm
              text-neutral-900
              outline-none
              transition
              focus:border-black
              focus:ring-1
              focus:ring-black

              sm:h-12
            "
          >

            <option value="">
              All Categories
            </option>

            {categories.map(
              (category) => (

                <option
                  key={
                    category.id
                  }
                  value={
                    category.name
                  }
                >
                  {category.name}
                </option>

              )
            )}

          </select>

        </div>

      </div>
    </div>
  );
}