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
    <div className="mt-10 space-y-10">
      {/* Colour */}
      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-neutral-400">
            Colour
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() =>
                  setSelectedColor(color)
                }
                className={`rounded-full border px-5 py-2 text-sm transition ${
                  selectedColor?.id === color.id
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 hover:border-black"
                }`}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {variants.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-neutral-400">
            Size
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() =>
                  setSelectedVariant(variant)
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedVariant?.id === variant.id
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 hover:border-black"
                }`}
              >
                <p className="font-medium">
                  {variant.size}
                </p>

                {variant.dimensions && (
                  <p
                    className={`mt-1 text-xs ${
                      selectedVariant?.id ===
                      variant.id
                        ? "text-neutral-300"
                        : "text-neutral-500"
                    }`}
                  >
                    {variant.dimensions}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-neutral-400">
          Quantity
        </p>

        <div className="mt-4 inline-flex items-center overflow-hidden rounded-full border border-neutral-300">
          <button
            type="button"
            onClick={() =>
              setQuantity(
                Math.max(1, quantity - 1)
              )
            }
            className="px-5 py-3 transition hover:bg-neutral-100"
          >
            −
          </button>

          <div className="min-w-16 px-4 text-center font-medium">
            {quantity}
          </div>

          <button
            type="button"
            onClick={() =>
              setQuantity(quantity + 1)
            }
            className="px-5 py-3 transition hover:bg-neutral-100"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}