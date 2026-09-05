import { prisma } from "@/lib/prisma";


export default async function TopBrands() {

  const products =
    await prisma.product.findMany({
      select: {
        brand: true,
      },
    });


  const brands =
    Object.values(
      products.reduce(
        (acc, product) => {

          if (!acc[product.brand]) {

            acc[product.brand] = {
              name: product.brand,
              value: 0,
            };

          }


          acc[product.brand].value++;


          return acc;

        },
        {} as Record<
          string,
          {
            name: string;
            value: number;
          }
        >
      )
    )
      .sort(
        (a, b) =>
          b.value - a.value
      )
      .slice(0, 5);


  const max =
    brands[0]?.value ?? 1;


  const total =
    brands.reduce(
      (sum, brand) =>
        sum + brand.value,
      0
    );


  return (

    <div
      className="
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-4
        shadow-sm

        sm:rounded-3xl
        sm:p-6

        lg:p-8
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        className="
          mb-6
          min-w-0
        "
      >

        <p
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.3em]
            text-neutral-400

            sm:text-xs
          "
        >
          Analytics
        </p>


        <div
          className="
            mt-1.5
            flex
            min-w-0
            items-end
            justify-between
            gap-3

            sm:mt-2
          "
        >

          <h2
            className="
              truncate
              text-xl
              font-light
              text-neutral-900

              sm:text-2xl
            "
          >
            Top Brands
          </h2>


          {brands.length > 0 && (
            <span
              className="
                shrink-0
                whitespace-nowrap
                text-[10px]
                text-neutral-400

                sm:text-xs
              "
            >
              {total} products
            </span>
          )}

        </div>

      </div>


      {/* ================================================== */}
      {/* EMPTY */}
      {/* ================================================== */}

      {brands.length === 0 ? (

        <p
          className="
            py-10
            text-center
            text-sm
            text-neutral-500
          "
        >
          No brand data available.
        </p>

      ) : (

        <div
          className="
            min-w-0
            space-y-5
          "
        >

          {brands.map(
            (brand, index) => {

              const percentage =
                total === 0
                  ? 0
                  : (
                      brand.value /
                      total
                    ) *
                    100;


              const width =
                (
                  brand.value /
                  max
                ) *
                100;


              return (

                <div
                  key={brand.name}
                  className="
                    min-w-0
                  "
                >

                  {/* Brand Header */}

                  <div
                    className="
                      mb-2
                      flex
                      min-w-0
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-2.5
                      "
                    >

                      <span
                        className="
                          flex
                          h-6
                          w-6
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-neutral-100
                          text-[10px]
                          font-medium
                          text-neutral-500
                        "
                      >
                        {index + 1}
                      </span>


                      <span
                        className="
                          min-w-0
                          truncate
                          text-sm
                          font-medium
                          text-neutral-900

                          sm:text-base
                        "
                      >
                        {brand.name}
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                      "
                    >

                      <span
                        className="
                          text-[10px]
                          text-neutral-400

                          sm:text-xs
                        "
                      >
                        {percentage.toFixed(0)}%
                      </span>


                      <span
                        className="
                          min-w-[28px]
                          text-right
                          text-sm
                          font-medium
                          text-neutral-900
                        "
                      >
                        {brand.value}
                      </span>

                    </div>

                  </div>


                  {/* Progress Bar */}

                  <div
                    className="
                      h-2
                      w-full
                      overflow-hidden
                      rounded-full
                      bg-neutral-100
                    "
                  >

                    <div
                      className="
                        h-full
                        rounded-full
                        bg-black
                        transition-all
                        duration-500
                      "
                      style={{
                        width:
                          `${width}%`,
                      }}
                    />

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </div>

  );
}