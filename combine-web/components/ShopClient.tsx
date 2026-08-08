"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import SubCategoryFilter from "./SubCategoryFilter";
import ColorFilter from "./ColorFilter";
import SortDropdown from "./SortDropdown";
import ProductGrid from "./ProductGrid";
import SearchAutocomplete from "./SearchAutocomplete";

type Product = {
  id: number;
  slug: string;

  brand: string;
  name: string;
  model: string | null;
  sku: string | null;

  price: number;
  displayOrder: number;

  image: string;
  secondImage?: string;

  createdAt: Date;

  category: string;
  subCategory: string | null;
  mainColor: string | null;

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  limited: boolean;
  onSale: boolean;
};

type Props = {
  products: Product[];
  featuredProducts: Product[];
};

export default function ShopClient({
  products,
  featuredProducts,
}: Props) {
  const searchParams = useSearchParams();

  const category =
    searchParams.get("category") ?? "All";

  const [search, setSearch] =
    useState("");

  const [brand, setBrand] =
    useState("All");

  const [subCategory, setSubCategory] =
    useState("All");

  const [color, setColor] =
    useState("All");

  const [sort, setSort] =
    useState("Newest");

  function clearFilters() {
    setSearch("");
    setBrand("All");
    setSubCategory("All");
    setColor("All");
    setSort("Newest");
  }

  const brands = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          products.map((p) => p.brand)
        )
      ).sort(),
    ],
    [products]
  );

  const subCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          products
            .map((p) => p.subCategory)
            .filter(
              (v): v is string =>
                v !== null
            )
        )
      ).sort(),
    ],
    [products]
  );

  const colors = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          products
            .map((p) => p.mainColor)
            .filter(
              (v): v is string =>
                v !== null
            )
        )
      ).sort(),
    ],
    [products]
  );

  const filteredProducts =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      const result = products.filter(
        (product) => {
          const searchable = [
            product.brand,
            product.name,
            product.model,
            product.sku,
            product.category,
            product.subCategory,
            product.mainColor,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return (
            searchable.includes(
              keyword
            ) &&
            (category === "All" ||
              product.category ===
                category) &&
            (brand === "All" ||
              product.brand ===
                brand) &&
            (subCategory === "All" ||
              product.subCategory ===
                subCategory) &&
            (color === "All" ||
              product.mainColor ===
                color)
          );
        }
      );

      switch (sort) {
        case "Newest":
          result.sort(
            (a, b) =>
              b.createdAt.getTime() -
              a.createdAt.getTime()
          );
          break;

        case "Price Low":
          result.sort(
            (a, b) =>
              a.price - b.price
          );
          break;

        case "Price High":
          result.sort(
            (a, b) =>
              b.price - a.price
          );
          break;

        case "Brand":
          result.sort((a, b) =>
            a.brand.localeCompare(
              b.brand
            )
          );
          break;

        default:
          result.sort(
            (a, b) =>
              a.displayOrder -
              b.displayOrder
          );
      }

      return result;
    }, [
      products,
      search,
      category,
      brand,
      subCategory,
      color,
      sort,
    ]);

return (
  <div className="space-y-8 sm:space-y-10">
    {/* Search */}
    <div className="relative">
      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <SearchAutocomplete
        query={search}
      />
    </div>

    {/* Filters */}
    <div
      className="
        rounded-[24px]
        border
        border-neutral-200
        bg-white
        p-4
        shadow-sm
        sm:rounded-[30px]
        sm:p-7
      "
    >
      <div
        className={`grid grid-cols-2 gap-3 sm:gap-4 xl:gap-6 ${
          category === "All"
            ? "xl:grid-cols-5"
            : "xl:grid-cols-4"
        }`}
      >
        {category === "All" && (
          <CategoryFilter
            selected={category}
            onSelect={() => {}}
          />
        )}

        <BrandFilter
          selected={brand}
          onSelect={setBrand}
          brands={brands}
        />

        <SubCategoryFilter
          selected={subCategory}
          onSelect={setSubCategory}
          subCategories={subCategories}
        />

        <ColorFilter
          selected={color}
          onSelect={setColor}
          colors={colors}
        />

        <SortDropdown
          value={sort}
          onChange={setSort}
        />
      </div>
    </div>

    {/* Result Header */}
    <div
      className="
        flex
        flex-col
        gap-4
        border-b
        border-neutral-200
        pb-5
        md:flex-row
        md:items-end
        md:justify-between
        md:gap-5
        md:pb-6
      "
    >
      <div>
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-neutral-400
            sm:text-[11px]
            sm:tracking-[0.35em]
          "
        >
          COLLECTION
        </p>

        <h2
          className="
            mt-2
            text-2xl
            font-extralight
            tracking-[-0.03em]
            text-neutral-900
            sm:text-3xl
          "
        >
          {filteredProducts.length} Product
          {filteredProducts.length !== 1
            ? "s"
            : ""}
        </h2>
      </div>

      {(search ||
        brand !== "All" ||
        subCategory !== "All" ||
        color !== "All") && (
        <button
          type="button"
          onClick={clearFilters}
          className="
            self-start
            rounded-full
            border
            border-neutral-300
            px-5
            py-2.5
            text-[10px]
            uppercase
            tracking-[0.25em]
            transition-all
            duration-300
            hover:border-black
            hover:bg-black
            hover:text-white
            sm:px-6
            sm:py-3
            sm:text-[11px]
            sm:tracking-[0.3em]
            md:self-auto
          "
        >
          Clear Filters
        </button>
      )}
    </div>

    {/* Products */}
    <ProductGrid
      products={filteredProducts}
      featuredProducts={featuredProducts}
      searchKeyword={search}
      onClearFilters={clearFilters}
    />
  </div>
);
}