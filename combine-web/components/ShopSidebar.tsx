"use client";

import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import SubCategoryFilter from "./SubCategoryFilter";
import SortDropdown from "./SortDropdown";

type Props = {
  search: string;
  onSearch: (value: string) => void;

  category: string;
  onCategory: (value: string) => void;

  brand: string;
  onBrand: (value: string) => void;

  // Sub Category = MULTI SELECT
  subCategory: string[];
  onSubCategory: (values: string[]) => void;

  sort: string;
  onSort: (value: string) => void;

  brands: string[];
  subCategories: string[];

  // Category options from database
  categories: string[];
};

export default function ShopSidebar({
  search,
  onSearch,

  category,
  onCategory,

  brand,
  onBrand,

  subCategory,
  onSubCategory,

  sort,
  onSort,

  brands,
  subCategories,

  categories,
}: Props) {
  return (
    <aside
      className="
        space-y-8
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* Search */}

      <SearchBar
        value={search}
        onChange={onSearch}
      />

      {/* Category */}

      <CategoryFilter
        selected={category}
        onSelect={onCategory}
        categories={categories}
      />

      {/* Brand */}

      <BrandFilter
        selected={brand}
        onSelect={onBrand}
        brands={brands}
      />

      {/* Sub Category
          MULTI SELECT */}

      <SubCategoryFilter
        selected={subCategory}
        onSelect={onSubCategory}
        subCategories={
          subCategories
        }
      />

      {/* Sort */}

      <SortDropdown
        value={sort}
        onChange={onSort}
      />
    </aside>
  );
}