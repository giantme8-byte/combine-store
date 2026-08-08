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
    <div className="mt-8 space-y-8 sm:mt-12 sm:space-y-12">
      {/* Colour */}
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

          <div className="flex flex-wrap gap-2.5 sm:gap-4">
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
                    rounded-full
                    border
                    px-4
                    py-2.5
                    text-[13px]
                    font-medium
                    transition-all
                    duration-300
                    sm:px-6
                    sm:py-3
                    sm:text-sm
                    ${
                      active
                        ? "border-black bg-black text-white shadow-lg scale-[1.02]"
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

      {/* Size */}
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

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
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
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-300
                    sm:rounded-3xl
                    sm:p-5
                    ${
                      active
                        ? "border-black bg-black text-white shadow-lg scale-[1.01]"
                        : "border-neutral-200 bg-white hover:-translate-y-1 hover:border-black hover:shadow-lg"
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium sm:text-base">
                      {variant.size}
                    </p>

                    {active && (
                      <span className="text-[10px] uppercase tracking-[0.2em] sm:text-xs">
                        ✓
                      </span>
                    )}
                  </div>

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
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
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
            items-center
            overflow-hidden
            rounded-full
            border
            border-neutral-300
            bg-white
            shadow-sm
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
              px-5
              py-2.5
              text-lg
              transition
              hover:bg-neutral-100
              sm:px-6
              sm:py-3
              sm:text-xl
            "
          >
            −
          </button>

          <div
            className="
              min-w-12
              px-4
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
              setQuantity(quantity + 1)
            }
            className="
              px-5
              py-2.5
              text-lg
              transition
              hover:bg-neutral-100
              sm:px-6
              sm:py-3
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