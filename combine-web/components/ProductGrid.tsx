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
  subCategory: string |null;

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  limited: boolean;
  onSale: boolean;
};

type Props = {
  products: Product[];

  featuredProducts: Product[];

  searchKeyword?: string;

  onClearFilters?: () => void;
};

export default function ProductGrid({
  products,
  featuredProducts,
  searchKeyword,
  onClearFilters,
}: Props) {

  function handleWhatsApp() {

    const message = searchKeyword
      ? `Hi COMBINE,

I'm looking for:

${searchKeyword}

Can you help me source it?`
      : `Hi COMBINE,

I'm looking for a product that I couldn't find on your website.

Can you help me source it?`;

    window.open(
      `https://wa.me/60168848453?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );

  }

  if (products.length === 0) {

    return (

      <div className="space-y-16">

        <div className="mx-auto flex max-w-2xl flex-col items-center py-12 text-center">

          <div className="mb-6 text-6xl">
            🔍
          </div>

          <h2 className="text-4xl font-light tracking-tight">
            Don&apos;t worry — we can help you source it.
          </h2>

          <p className="mt-5 max-w-xl leading-8 text-neutral-500">
We couldn&apos;t find any products matching your search.

Don&apos;t worry — we can help you source it.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <button
              type="button"
              onClick={handleWhatsApp}
              className="
                rounded-full
                bg-black
                px-8
                py-4
                text-sm
                font-medium
                uppercase
                tracking-[0.2em]
                text-white
                transition
                hover:bg-neutral-800
              "
            >
              Ask on WhatsApp
            </button>

            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="
                  rounded-full
                  border
                  border-neutral-300
                  px-8
                  py-4
                  text-sm
                  uppercase
                  tracking-[0.2em]
                  transition
                  hover:bg-neutral-100
                "
              >
                Clear Filters
              </button>
            )}

          </div>

        </div>

        {featuredProducts.length > 0 && (

          <div>

            <div className="mb-10 text-center">

              <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
                Featured Collection
              </p>

              <h3 className="mt-3 text-3xl font-light">
                You may also like
              </h3>

            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">

              {featuredProducts.map((product) => (

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

          </div>

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