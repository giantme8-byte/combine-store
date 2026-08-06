import ProductCard from "./ProductCard";

type Product = {
  id: number;
  slug: string;

  brand: string;
  name: string;
  model: string | null;

  price: number;

  image: string;
  secondImage?: string;

  createdAt: Date;

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
      <div className="space-y-20">
        {/* Empty State */}
        <div
          className="
            mx-auto
            flex
            max-w-3xl
            flex-col
            items-center
            rounded-[36px]
            border
            border-neutral-200
            bg-gradient-to-b
            from-white
            to-neutral-50
            px-12
            py-20
            text-center
            shadow-[0_30px_80px_rgba(0,0,0,.05)]
          "
        >
          <div
            className="
              mb-8
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              bg-neutral-100
              text-5xl
            "
          >
            🔍
          </div>

          <h2
            className="
              text-5xl
              font-extralight
              tracking-[-0.04em]
              text-neutral-900
            "
          >
            We Couldn't Find It
          </h2>

          <p
            className="
              mt-8
              max-w-xl
              text-lg
              leading-9
              text-neutral-500
            "
          >
            We couldn't find a matching
            product, but our concierge team
            can help source it for you.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
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
                tracking-[0.25em]
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#C8A96A]
                hover:shadow-xl
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
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-black
                  hover:bg-black
                  hover:text-white
                "
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Featured */}
        {featuredProducts.length > 0 && (
          <div>
            <div className="mb-14 text-center">
              <p
                className="
                  text-[11px]
                  uppercase
                  tracking-[0.45em]
                  text-neutral-400
                "
              >
                FEATURED COLLECTION
              </p>

              <h3
                className="
                  mt-5
                  text-5xl
                  font-extralight
                  tracking-[-0.03em]
                "
              >
                You May Also Like
              </h3>
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-x-8
                gap-y-14
                sm:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
              "
            >
              {featuredProducts.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    brand={product.brand}
                    name={product.name}
                    model={product.model}
                    image={product.image}
                    secondImage={
                      product.secondImage
                    }
                    createdAt={
                      product.createdAt
                    }
                    featured={
                      product.featured
                    }
                    newArrival={
                      product.newArrival
                    }
                    bestSeller={
                      product.bestSeller
                    }
                    limited={
                      product.limited
                    }
                    onSale={
                      product.onSale
                    }
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-x-8
        gap-y-14
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          slug={product.slug}
          brand={product.brand}
          name={product.name}
          model={product.model}
          image={product.image}
          secondImage={
            product.secondImage
          }
          createdAt={
            product.createdAt
          }
          featured={product.featured}
          newArrival={
            product.newArrival
          }
          bestSeller={
            product.bestSeller
          }
          limited={product.limited}
          onSale={product.onSale}
        />
      ))}
    </div>
  );
}