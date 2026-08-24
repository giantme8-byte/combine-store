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

    setSelectionSource,

    quantity,
    setQuantity,
  } = useProduct();

  // ============================================================
  // ALL AVAILABLE SIZES
  // ============================================================

  /*
   * Size options are based on ALL ProductVariants.
   *
   * We keep all sizes visible for the product.
   *
   * The actual selected Variant is always resolved using:
   *
   * Selected Color + Selected Size
   */

  const availableSizes = Array.from(
    new Map(
      variants
        .filter(
          (variant) =>
            variant.size.trim() !== ""
        )
        .map(
          (variant) => [
            variant.size
              .trim()
              .toLowerCase(),

            variant,
          ]
        )
    ).values()
  );

  // ============================================================
  // CHANGE COLOR
  // ============================================================

  function handleColorChange(
    color: (typeof colors)[number]
  ) {
    setSelectedColor(color);

    /*
     * ----------------------------------------------------------
     * Keep the currently selected Size when possible.
     * ----------------------------------------------------------
     *
     * Example:
     *
     * Black / Large
     *       ↓
     * White
     *       ↓
     * White / Large
     *
     * If White / Large does not exist,
     * select the first Variant belonging
     * to White.
     *
     * IMPORTANT:
     *
     * We NEVER fall back to a Variant
     * belonging to another Color.
     */

    const currentSize =
      selectedVariant?.size ?? null;

    const matchingColorVariants =
      variants.filter(
        (variant) =>
          variant.colorId ===
          color.id
      );

    const sameSizeVariant =
      currentSize
        ? matchingColorVariants.find(
            (variant) =>
              variant.size
                .trim()
                .toLowerCase() ===
              currentSize
                .trim()
                .toLowerCase()
          )
        : null;

    const nextVariant =
      sameSizeVariant ??
      matchingColorVariants[0] ??
      null;

    /*
     * ----------------------------------------------------------
     * Update Variant
     * ----------------------------------------------------------
     *
     * If the selected Color has Variants,
     * selectedVariant must belong to that Color.
     *
     * If the Color has no connected Variant,
     * clear the Variant instead of silently
     * selecting another Color's Variant.
     */

    setSelectedVariant(
      nextVariant
    );

    /*
     * Color selection means ProductGallery
     * should display the selected Color gallery.
     */

    setSelectionSource(
      "color"
    );
  }

  // ============================================================
  // CHANGE SIZE / VARIANT
  // ============================================================

  function handleSizeChange(
    size: string
  ) {
    const normalizedSize =
      size
        .trim()
        .toLowerCase();

    /*
     * ----------------------------------------------------------
     * Find EXACT Variant
     * ----------------------------------------------------------
     *
     * The selected Variant must match BOTH:
     *
     * 1. Selected Color
     * 2. Selected Size
     *
     * This guarantees:
     *
     * Color × Size
     *
     * always points to the correct ProductVariant.
     */

    const variant =
      selectedColor
        ? variants.find(
            (item) =>
              item.colorId ===
                selectedColor.id &&
              item.size
                .trim()
                .toLowerCase() ===
                normalizedSize
          ) ?? null
        : null;

    /*
     * ----------------------------------------------------------
     * IMPORTANT
     * ----------------------------------------------------------
     *
     * Do NOT fallback to another Color.
     *
     * Example:
     *
     * Black / M exists
     * White / M does not exist
     *
     * If White is selected and customer clicks M,
     * we must NOT silently switch to Black / M.
     *
     * The selected Color remains authoritative.
     */

    if (!variant) {
      return;
    }

    /*
     * Exact Color + Size Variant found.
     */

    setSelectedVariant(
      variant
    );

    /*
     * Variant selection means ProductGallery
     * should display the exact Variant gallery.
     */

    setSelectionSource(
      "variant"
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="
        mt-7
        space-y-7
        sm:mt-12
        sm:space-y-12
      "
    >
      {/* ====================================================== */}
      {/* Colour */}
      {/* ====================================================== */}

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
            {colors.map(
              (color) => {
                const active =
                  selectedColor?.id ===
                  color.id;

                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() =>
                      handleColorChange(
                        color
                      )
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
                          : "border-neutral-300 bg-white text-neutral-900 hover:-translate-y-0.5 hover:border-black hover:shadow-md"
                      }
                    `}
                  >
                    {color.name}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* Size */}
      {/* ====================================================== */}

      {availableSizes.length > 0 && (
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
            {availableSizes.map(
              (variant) => {
                const size =
                  variant.size;

                /*
                 * Active state is based on
                 * the currently selected Variant size.
                 */

                const active =
                  selectedVariant?.size
                    ?.trim()
                    .toLowerCase() ===
                  size
                    .trim()
                    .toLowerCase();

                /*
                 * ------------------------------------------------
                 * Check whether this Size actually exists for
                 * the currently selected Color.
                 * ------------------------------------------------
                 */

                const hasMatchingVariant =
                  selectedColor
                    ? variants.some(
                        (item) =>
                          item.colorId ===
                            selectedColor.id &&
                          item.size
                            .trim()
                            .toLowerCase() ===
                            size
                              .trim()
                              .toLowerCase()
                      )
                    : false;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() =>
                      handleSizeChange(
                        size
                      )
                    }
                    disabled={
                      colors.length > 0 &&
                      selectedColor !== null &&
                      !hasMatchingVariant
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
                          : hasMatchingVariant ||
                            colors.length === 0
                          ? "border-neutral-200 bg-white hover:-translate-y-1 hover:border-black hover:shadow-lg"
                          : "cursor-not-allowed border-neutral-100 bg-neutral-50 opacity-40"
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
                        {size}
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
                      className="
                        mt-2
                        text-[9px]
                        leading-4
                        text-neutral-400
                        sm:mt-2.5
                        sm:text-[10px]
                        sm:leading-5
                      "
                    >
                      * Size may vary by 1–3 cm
                    </p>
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* Quantity */}
      {/* ====================================================== */}

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