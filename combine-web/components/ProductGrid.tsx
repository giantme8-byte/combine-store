import ProductCard from "./ProductCard";

type Product = {
  id: number;
  slug: string;

  brand: string;
  name: string;
  model: string | null;

  price: number | null;

  variants: {
    price: number | null;
  }[];

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

    const message =
      searchKeyword
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


  /*
   * =========================================================
   * Empty State
   * =========================================================
   */

  if (
    products.length === 0
  ) {

    return (
      <div
        className="
          space-y-16
          sm:space-y-20
        "
      >

        {/* ================================================= */}
        {/* Empty State */}
        {/* ================================================= */}

        <div
          className="
            mx-auto
            flex
            max-w-3xl
            flex-col
            items-center
            rounded-[24px]
            border
            border-neutral-200
            bg-gradient-to-b
            from-white
            to-neutral-50
            px-5
            py-12
            text-center
            shadow-[0_30px_80px_rgba(0,0,0,.05)]
            sm:rounded-[36px]
            sm:px-12
            sm:py-20
          "
        >

          {/* Search Icon */}

          <div
            className="
              mb-6
              flex
              h-18
              w-18
              items-center
              justify-center
              rounded-full
              bg-neutral-100
              text-4xl
              sm:mb-8
              sm:h-24
              sm:w-24
              sm:text-5xl
            "
          >
            🔍
          </div>


          {/* Title */}

          <h2
            className="
              text-[32px]
              font-extralight
              leading-tight
              tracking-[-0.04em]
              text-neutral-900
              sm:text-5xl
            "
          >
            We Couldn&apos;t Find It
          </h2>


          {/* Description */}

          <p
            className="
              mt-5
              max-w-xl
              text-[14px]
              leading-7
              text-neutral-500
              sm:mt-8
              sm:text-lg
              sm:leading-9
            "
          >
            We couldn&apos;t find a matching
            product, but our concierge team
            can help source it for you.
          </p>


          {/* Actions */}

          <div
            className="
              mt-8
              flex
              w-full
              flex-col
              gap-3
              sm:mt-12
              sm:w-auto
              sm:flex-row
              sm:gap-4
            "
          >

            <button
              type="button"
              onClick={
                handleWhatsApp
              }
              className="
                w-full
                rounded-full
                bg-black
                px-8
                py-4
                text-[11px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-white
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#C8A96A]
                hover:shadow-xl
                sm:w-auto
                sm:text-sm
              "
            >
              Ask on WhatsApp
            </button>


            {onClearFilters && (

              <button
                type="button"
                onClick={
                  onClearFilters
                }
                className="
                  w-full
                  rounded-full
                  border
                  border-neutral-300
                  px-8
                  py-4
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-black
                  hover:bg-black
                  hover:text-white
                  sm:w-auto
                  sm:text-sm
                "
              >
                Clear Filters
              </button>

            )}

          </div>

        </div>


        {/* ================================================= */}
        {/* Featured Products */}
        {/* ================================================= */}

        {featuredProducts.length > 0 && (

          <section>

            {/* Header */}

            <div
              className="
                mb-10
                text-center
                sm:mb-14
              "
            >

              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.4em]
                  text-neutral-400
                  sm:text-[11px]
                  sm:tracking-[0.45em]
                "
              >
                FEATURED COLLECTION
              </p>


              <h3
                className="
                  mt-4
                  text-3xl
                  font-extralight
                  tracking-[-0.03em]
                  sm:mt-5
                  sm:text-5xl
                "
              >
                You May Also Like
              </h3>

            </div>


            {/* Featured Grid */}

            <div
              className="
                grid
                grid-cols-2
                gap-x-3
                gap-y-10
                sm:grid-cols-2
                sm:gap-x-8
                sm:gap-y-14
                xl:grid-cols-3
                2xl:grid-cols-4
              "
            >

              {featuredProducts.map(
                (product) => (

                  <ProductCard
                    key={
                      product.id
                    }

                    id={
                      product.id
                    }

                    slug={
                      product.slug
                    }

                    brand={
                      product.brand
                    }

                    name={
                      product.name
                    }

                    model={
                      product.model
                    }

                    price={
                      product.price
                    }

                    variants={
                      product.variants
                    }

                    image={
                      product.image
                    }

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

          </section>

        )}

      </div>
    );
  }


  /*
   * =========================================================
   * Product Grid
   * =========================================================
   */

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-x-3
        gap-y-10
        sm:grid-cols-2
        sm:gap-x-8
        sm:gap-y-14
        xl:grid-cols-3
        2xl:grid-cols-4
      "
    >

      {products.map(
        (product) => (

          <ProductCard
            key={
              product.id
            }

            id={
              product.id
            }

            slug={
              product.slug
            }

            brand={
              product.brand
            }

            name={
              product.name
            }

            model={
              product.model
            }

            price={
              product.price
            }

            variants={
              product.variants
            }

            image={
              product.image
            }

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
  );
}