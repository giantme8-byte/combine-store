import { Availability } from "@prisma/client";

type SelectionToolbarProps = {
  selectedCount: number;

  brands: {
    id: number;
    name: string;
  }[];

  categories: {
    id: number;
    name: string;
  }[];

  onClear: () => void;
  onDelete: () => void;

  availability: Availability | "";
  brand: string;
  category: string;

  featured: string;
  newArrival: string;
  bestSeller: string;
  limited: string;
  onSale: string;

  onAvailabilityChange: (
    value: Availability | ""
  ) => void;

  onBrandChange: (
    value: string
  ) => void;

  onCategoryChange: (
    value: string
  ) => void;

  onFeaturedChange: (
    value: string
  ) => void;

  onNewArrivalChange: (
    value: string
  ) => void;

  onBestSellerChange: (
    value: string
  ) => void;

  onLimitedChange: (
    value: string
  ) => void;

  onOnSaleChange: (
    value: string
  ) => void;

  onApplyAvailability: () => void;
};

export default function SelectionToolbar({
  selectedCount,
  brands,
  categories,
  onClear,
  onDelete,
  availability,
  brand,
  category,
  featured,
  newArrival,
  bestSeller,
  limited,
  onSale,
  onAvailabilityChange,
  onBrandChange,
  onCategoryChange,
  onFeaturedChange,
  onNewArrivalChange,
  onBestSellerChange,
  onLimitedChange,
  onOnSaleChange,
  onApplyAvailability,
}: SelectionToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-6 py-3">
      <span className="text-sm font-medium text-neutral-700">
        {selectedCount} product
        {selectedCount > 1 ? "s" : ""} selected
      </span>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Change Brand</option>
          {brands.map((brandItem) => (
            <option key={brandItem.id} value={brandItem.name}>
              {brandItem.name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Change Category</option>
          {categories.map((categoryItem) => (
            <option key={categoryItem.id} value={categoryItem.name}>
              {categoryItem.name}
            </option>
          ))}
        </select>

        <select
          value={availability}
          onChange={(e) =>
            onAvailabilityChange(
              e.target.value as Availability | ""
            )
          }
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Change Availability</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="PRE_ORDER">Pre Order</option>
          <option value="LIMITED">Limited</option>
          <option value="SOLD_OUT">Sold Out</option>
        </select>

        <select
          value={featured}
          onChange={(e) => onFeaturedChange(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Featured</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <select
          value={newArrival}
          onChange={(e) => onNewArrivalChange(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">New Arrival</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <select
          value={bestSeller}
          onChange={(e) => onBestSellerChange(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Best Seller</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <select
          value={limited}
          onChange={(e) => onLimitedChange(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Limited</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <select
          value={onSale}
          onChange={(e) => onOnSaleChange(e.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">On Sale</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <button
          type="button"
          onClick={onApplyAvailability}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Delete Selected
        </button>

        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
        >
          Clear
        </button>
      </div>
    </div>
  );
}