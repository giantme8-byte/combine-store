"use client";

import {
  useProduct,
} from "./ProductContext";

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
   * Size options are based on ALL Product Variants.
   *
   * Examples:
   *
   * Keepall 35
   * Keepall 20
   *
   * Products with Colours:
   *
   * Black / 20
   * Black / 35
   * White / 20
   * White / 35
   */

  const availableSizes =
    Array.from(
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
     * Keep the current Size when possible.
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

    setSelectedVariant(
      nextVariant
    );

    /*
     * Selecting a Colour uses the
     * Colour gallery until a specific
     * Size / Variant is selected.
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

    let variant = null;

    /*
     * ==========================================================
     * PRODUCTS WITH COLOURS
     * ==========================================================
     *
     * Find:
     *
     * Selected Colour + Selected Size
     */

    if (
      colors.length > 0 &&
      selectedColor
    ) {
      variant =
        variants.find(
          (item) =>
            item.colorId ===
              selectedColor.id &&
            item.size
              .trim()
              .toLowerCase() ===
              normalizedSize
        ) ?? null;
    }

    /*
     * ==========================================================
     * PRODUCTS WITHOUT COLOURS
     * ==========================================================
     *
     * IMPORTANT:
     *
     * If the product has NO Colours,
     * we do NOT require colorId === null.
     *
     * The Size itself identifies the Variant.
     *
     * Example:
     *
     * Keepall 35
     * Keepall 20
     *
     * → Size is enough to find the exact Variant.
     */

    if (
      colors.length === 0
    ) {
      variant =
        variants.find(
          (item) =>
            item.size
              .trim()
              .toLowerCase() ===
            normalizedSize
        ) ?? null;
    }

    /*
     * ==========================================================
     * SAFETY FALLBACK
     * ==========================================================
     *
     * If there are Colours but no selected
     * Colour for some reason, try to find
     * the Variant by Size only.
     *
     * This prevents the Size button from
     * becoming completely unresponsive.
     */

    if (
      !variant &&
      colors.length > 0 &&
      !selectedColor
    ) {
      variant =
        variants.find(
          (item) =>
            item.size
              .trim()
              .toLowerCase() ===
            normalizedSize
        ) ?? null;
    }

    /*
     * ==========================================================
     * NO VARIANT FOUND
     * ==========================================================
     */

    if (!variant) {
      return;
    }

    /*
     * ==========================================================
     * UPDATE EXACT VARIANT
     * ==========================================================
     */

    setSelectedVariant(
      variant
    );

    /*
     * ==========================================================
     * SWITCH PRODUCT GALLERY TO VARIANT
     * ==========================================================
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
      {/* COLOUR */}
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
      {/* SIZE */}
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

                const normalizedSize =
                  size
                    .trim()
                    .toLowerCase();

                /*
                 * ------------------------------------------------
                 * ACTIVE VARIANT
                 * ------------------------------------------------
                 */

                const active =
                  selectedVariant?.size
                    ?.trim()
                    .toLowerCase() ===
                  normalizedSize;

                /*
                 * ------------------------------------------------
                 * CHECK WHETHER THIS SIZE EXISTS
                 * ------------------------------------------------
                 *
                 * No Colour:
                 *
                 * Size alone identifies Variant.
                 *
                 * With Colour:
                 *
                 * Selected Colour + Size identifies Variant.
                 */

                const hasMatchingVariant =
                  colors.length === 0
                    ? variants.some(
                        (item) =>
                          item.size
                            .trim()
                            .toLowerCase() ===
                          normalizedSize
                      )
                    : selectedColor
                    ? variants.some(
                        (item) =>
                          item.colorId ===
                            selectedColor.id &&
                          item.size
                            .trim()
                            .toLowerCase() ===
                          normalizedSize
                      )
                    : variants.some(
                        (item) =>
                          item.size
                            .trim()
                            .toLowerCase() ===
                          normalizedSize
                      );

                /*
                 * IMPORTANT:
                 *
                 * We do NOT disable Size buttons
                 * for products without Colours.
                 */

                const disabled =
                  colors.length > 0 &&
                  selectedColor !== null &&
                  !hasMatchingVariant;

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
                      disabled
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
                          : hasMatchingVariant
                          ? "border-neutral-200 bg-white hover:-translate-y-1 hover:border-black hover:shadow-lg"
                          : "cursor-not-allowed border-neutral-100 bg-neutral-50 opacity-40"
                      }
                    `}
                  >
                    {/* ================================================= */}
                    {/* SIZE + CHECK */}
                    {/* ================================================= */}

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

                    {/* ================================================= */}
                    {/* DIMENSIONS */}
                    {/* ================================================= */}

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
                        {
                          variant.dimensions
                        }
                      </p>
                    )}

                    {/* ================================================= */}
                    {/* SIZE NOTICE */}
                    {/* ================================================= */}

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
      {/* QUANTITY */}
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