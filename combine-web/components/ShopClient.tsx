"use client";

import { useMemo, useState } from "react";

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
  sku: string |null;

  price: number;

  image: string;

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
};

export default function ShopClient({
  products,
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [color, setColor] = useState("All");
  const [sort, setSort] = useState("Newest");

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setSubCategory("All");
    setColor("All");
    setSort("Newest");
  }

  const brands = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(products.map((p) => p.brand))).sort(),
    ];
  }, [products]);

  const subCategories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          products
            .map((p) => p.subCategory)
            .filter(
              (item): item is string => item !== null
            )
        )
      ).sort(),
    ];
  }, [products]);

  const colors = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          products
            .map((p) => p.mainColor)
            .filter(
              (item): item is string => item !== null
            )
        )
      ).sort(),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const keyword = [
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
        keyword.includes(search.toLowerCase()) &&
        (category === "All" ||
          product.category === category) &&
        (brand === "All" ||
          product.brand === brand) &&
        (subCategory === "All" ||
          product.subCategory === subCategory) &&
        (color === "All" ||
          product.mainColor === color)
      );
    });

    switch (sort) {
      case "Price Low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "Price High":
        result.sort((a, b) => b.price - a.price);
        break;

      case "Brand":
        result.sort((a, b) =>
          a.brand.localeCompare(b.brand)
        );
        break;

      default:
        result.sort((a, b) => b.id - a.id);
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
    <div className="space-y-10">
      {/* Search */}
      <div className="relative">
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <SearchAutocomplete query={search} />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <CategoryFilter
          selected={category}
          onSelect={setCategory}
        />

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

      {/* Product Count */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
          Showing{" "}
          <span className="font-semibold text-neutral-900">
            {filteredProducts.length}
          </span>{" "}
          Product
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        onClearFilters={clearFilters}
      />
    </div>
  );
}