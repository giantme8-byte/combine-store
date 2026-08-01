"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ProductFiltersProps = {
  brands: {
    id: number;
    name: string;
  }[];

  categories: {
    id: number;
    name: string;
  }[];
};

export default function ProductFilters({
  brands,
  categories,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  const [brand, setBrand] = useState(
    searchParams.get("brand") ?? ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") ?? ""
  );

const [availability, setAvailability] = useState(
  searchParams.get("availability") ?? ""
);

const [sort, setSort] = useState(
  searchParams.get("sort") ?? "featured"
);

  useEffect(() => {
  const timeout = setTimeout(() => {
    updateFilters({
      search,
    });
  }, 500);

  return () => clearTimeout(timeout);
}, [search]);

function updateFilters(
  values: {
    search?: string;
    brand?: string;
    category?: string;
    availability?: string;
    sort?: string;
  }
) {
  const params = new URLSearchParams(
    searchParams.toString()
  );

  if (values.search !== undefined) {
    values.search
      ? params.set("search", values.search)
      : params.delete("search");
  }

  if (values.brand !== undefined) {
    values.brand
      ? params.set("brand", values.brand)
      : params.delete("brand");
  }

  if (values.category !== undefined) {
    values.category
      ? params.set("category", values.category)
      : params.delete("category");
  }

if (values.availability !== undefined) {
  values.availability
    ? params.set("availability", values.availability)
    : params.delete("availability");
}

  if (values.sort !== undefined) {
    values.sort
      ? params.set("sort", values.sort)
      : params.delete("sort");
  }

  router.push(
    `/admin/dashboard/products?${params.toString()}`
  );
}

  function applyFilters() {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (brand) {
      params.set("brand", brand);
    }

    if (category) {
      params.set("category", category);
    }

if (availability) {
  params.set("availability", availability);
}

    if (sort) {
      params.set("sort", sort);
    }

    router.push(
      `/admin/dashboard/products?${params.toString()}`
    );
  }

  function resetFilters() {
    setSearch("");
    setBrand("");
    setCategory("");
    setAvailability("");
    setSort("featured");

    router.push("/admin/dashboard/products");
  }

  return (
    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

      <div className="grid gap-4 md:grid-cols-5">

        {/* Search */}
<input
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  }}
  className="rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
/>

        {/* Brand */}
        <select
          value={brand}
onChange={(e) => {
  const value = e.target.value;

  setBrand(value);

  updateFilters({
    brand: value,
  });
}}
          className="rounded-lg border border-neutral-300 px-4 py-3"
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

                {/* Category */}
        <select
          value={category}
onChange={(e) => {
  const value = e.target.value;

  setCategory(value);

  updateFilters({
    category: value,
  });
}}
          className="rounded-lg border border-neutral-300 px-4 py-3"
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

{/* Availability */}
<select
  value={availability}
  onChange={(e) => {
    const value = e.target.value;

    setAvailability(value);

    updateFilters({
      availability: value,
    });
  }}
  className="rounded-lg border border-neutral-300 px-4 py-3"
>
  <option value="">
    All Availability
  </option>

  <option value="IN_STOCK">
    In Stock
  </option>

  <option value="PRE_ORDER">
    Pre Order
  </option>

  <option value="LIMITED">
    Limited
  </option>

  <option value="SOLD_OUT">
    Sold Out
  </option>
</select>

        {/* Sort */}
<select
  value={sort}
  onChange={(e) => {
    const value = e.target.value;

    setSort(value);

    updateFilters({
      sort: value,
    });
  }}
  className="rounded-lg border border-neutral-300 px-4 py-3"
>
  <option value="featured">
    Featured Order
  </option>

  <option value="latest">
    Latest
  </option>

  <option value="oldest">
    Oldest
  </option>

  <option value="az">
    Name A-Z
  </option>

  <option value="za">
    Name Z-A
  </option>
</select>

      </div>

      <div className="mt-5 flex justify-end gap-3">

        <button
          type="button"
          onClick={resetFilters}
          className="rounded-lg border border-neutral-300 px-5 py-3 transition hover:bg-neutral-100"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={applyFilters}
          className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-neutral-800"
        >
          Apply Filters
        </button>

      </div>

    </div>
  );
}