"use client";

import { useProduct } from "./ProductContext";

export default function ProductOptions() {
  const {
    colors,
    variants,

    selectedColor,
    setSelectedColor,

    selectedVariant,
    setSelectedVariant,

    quantity,
    setQuantity,
  } = useProduct();

  return (
    <div
      className="
        mt-7
        space-y-7
        sm:mt-12
        sm:space-y-12
      "
    >
      {/* ================================================= */}
      {/* Colour */}
      {/* ================================================= */}

      {colors.length > 0 && (
        <div>
          <p
            className="
              mb-3
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-neutral-400
              sm:text-[11px]
              sm:tracking-[0.38em]
            "
          >
            Colour
          </p>

          <div
            className="
              flex
              flex-wrap
              gap-2
              sm:gap-4
            "
          >
            {colors.map((color) => {
              const active =
                selectedColor?.id === color.id;

              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() =>
                    setSelectedColor(color)
                  }
                  className={`
                    min-h-11
                    rounded-full
                    border
                    px-4
                    py-2.5
                    text-[13px]
                    font-medium
                    transition-all
                    duration-300
                    sm:min-h-12
                    sm:px-6
                    sm:py-3
                    sm:text-sm
                    ${
                      active
                        ? "scale-[1.02] border-black bg-black text-white shadow-lg"
                        : "border-neutral-300 bg-white hover:-translate-y-0.5 hover:border-black hover:shadow-md"
                    }
                  `}
                >
                  {color.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* Size */}
      {/* ================================================= */}

      {variants.length > 0 && (
        <div>
          <p
            className="
              mb-3
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-neutral-400
              sm:text-[11px]
              sm:tracking-[0.38em]
            "
          >
            Size
          </p>

          <div
            className="
              grid
              grid-cols-2
              gap-2.5
              sm:gap-4
            "
          >
            {variants.map((variant) => {
              const active =
                selectedVariant?.id ===
                variant.id;

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() =>
                    setSelectedVariant(
                      variant
                    )
                  }
                  className={`
                    min-h-[100px]
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-300
                    sm:min-h-[120px]
                    sm:rounded-3xl
                    sm:p-5
                    ${
                      active
                        ? "scale-[1.01] border-black bg-black text-white shadow-lg"
                        : "border-neutral-200 bg-white hover:-translate-y-1 hover:border-black hover:shadow-lg"
                    }
                  `}
                >
                  {/* Size + Check */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-medium
                        sm:text-base
                      "
                    >
                      {variant.size}
                    </p>

                    {active && (
                      <span
                        className="
                          text-[10px]
                          uppercase
                          tracking-[0.2em]
                          sm:text-xs
                        "
                      >
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Dimensions */}
                  {variant.dimensions && (
                    <p
                      className={`
                        mt-1.5
                        text-[11px]
                        sm:mt-2
                        sm:text-xs
                        ${
                          active
                            ? "text-neutral-300"
                            : "text-neutral-500"
                        }
                      `}
                    >
                      {variant.dimensions}
                    </p>
                  )}

                  {/* Size Variation Notice */}
                  <p
                    className={`
                      mt-2
                      text-[9px]
                      leading-4
                      sm:mt-2.5
                      sm:text-[10px]
                      sm:leading-5
                      ${
                        active
                          ? "text-neutral-400"
                          : "text-neutral-400"
                      }
                    `}
                  >
                    * Size may vary by 1–3 cm
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* Quantity */}
      {/* ================================================= */}

      <div>
        <p
          className="
            mb-3
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-neutral-400
            sm:text-[11px]
            sm:tracking-[0.38em]
          "
        >
          Quantity
        </p>

        <div
          className="
            inline-flex
            min-h-11
            items-center
            overflow-hidden
            rounded-full
            border
            border-neutral-300
            bg-white
            shadow-sm
            sm:min-h-12
          "
        >
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() =>
              setQuantity(
                Math.max(
                  1,
                  quantity - 1
                )
              )
            }
            className="
              flex
              min-h-11
              min-w-11
              items-center
              justify-center
              text-lg
              transition
              hover:bg-neutral-100
              sm:min-h-12
              sm:min-w-12
              sm:text-xl
            "
          >
            −
          </button>

          <div
            className="
              min-w-12
              px-3
              text-center
              text-sm
              font-medium
              sm:min-w-16
              sm:px-6
              sm:text-base
            "
          >
            {quantity}
          </div>

          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() =>
              setQuantity(
                quantity + 1
              )
            }
            className="
              flex
              min-h-11
              min-w-11
              items-center
              justify-center
              text-lg
              transition
              hover:bg-neutral-100
              sm:min-h-12
              sm:min-w-12
              sm:text-xl
            "
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}