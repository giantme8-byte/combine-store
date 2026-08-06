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
    <div className="mt-12 space-y-12">
      {/* Colour */}
      {colors.length > 0 && (
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.38em] text-neutral-400">
            Colour
          </p>

          <div className="flex flex-wrap gap-4">
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
                    px-6
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-300
                    ${
                      active
                        ? "border-black bg-black text-white shadow-xl scale-105"
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
          <p className="mb-3 text-[11px] uppercase tracking-[0.38em] text-neutral-400">
            Size
          </p>

          <div className="grid grid-cols-2 gap-4">
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
                    rounded-3xl
                    border
                    p-5
                    text-left
                    transition-all
                    duration-300
                    ${
                      active
                        ? "border-black bg-black text-white shadow-xl scale-[1.02]"
                        : "border-neutral-200 bg-white hover:-translate-y-1 hover:border-black hover:shadow-lg"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium">
                      {variant.size}
                    </p>

                    {active && (
                      <span className="text-xs uppercase tracking-[0.2em]">
                        ✓
                      </span>
                    )}
                  </div>

                  {variant.dimensions && (
                    <p
                      className={`mt-2 text-xs ${
                        active
                          ? "text-neutral-300"
                          : "text-neutral-500"
                      }`}
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
        <p className="mb-3 text-[11px] uppercase tracking-[0.38em] text-neutral-400">
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
            onClick={() =>
              setQuantity(
                Math.max(
                  1,
                  quantity - 1
                )
              )
            }
            className="
              px-6
              py-3
              text-xl
              transition
              hover:bg-neutral-100
            "
          >
            −
          </button>

          <div className="min-w-16 px-6 text-center text-base font-medium">
            {quantity}
          </div>

          <button
            type="button"
            onClick={() =>
              setQuantity(quantity + 1)
            }
            className="
              px-6
              py-3
              text-xl
              transition
              hover:bg-neutral-100
            "
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}