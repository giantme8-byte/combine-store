import ProductCard from "./ProductCard";

type Product = {
  id: number;
  slug: string;

  brand: string;
  name: string;
  model: string | null;

  price: number;
  image: string;

  category: string;
  subCategory: string | null;

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  limited: boolean;
  onSale: boolean;
};

type Props = {
  products: Product[];
  onClearFilters?: () => void;
};

export default function ProductGrid({
  products,
  onClearFilters,
}: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-8 text-6xl">🔍</div>

        <h2 className="text-4xl font-extralight tracking-[-0.02em]">
          No Products Found
        </h2>

        <p className="mt-5 max-w-md leading-7 text-neutral-500">
          We couldn&apos;t find any products matching your search.
          Try adjusting your filters or browse our full collection.
        </p>

        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-10 rounded-full bg-black px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          slug={product.slug}
          brand={product.brand}
          name={product.name}
          model={product.model}
          image={product.image}
          featured={product.featured}
          newArrival={product.newArrival}
          bestSeller={product.bestSeller}
          limited={product.limited}
          onSale={product.onSale}
        />
      ))}
    </div>
  );
}