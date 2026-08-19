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
  //
  // IMPORTANT:
  //
  // Size options are based on ALL ProductVariants.
  //
  // We do NOT filter Size by selected Color.
  //
  // This prevents the Size options from disappearing
  // when the selected Color does not perfectly match
  // ProductVariant.colorId.
  //
  // Example:
  //
  // Beige & Black / Small
  // Beige & Black / Large
  // Black / Small
  // Black / Large
  //
  // The customer will see:
  //
  // Small
  // Large
  //
  // regardless of which Color is selected.
  //
  // ============================================================

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
     * Try to keep the current Size.
     *
     * Example:
     *
     * Beige & Black / Large
     *       ↓
     * Black / Large
     *
     * If that exact Color + Size Variant exists,
     * select it.
     *
     * If it does not exist, keep the current Size
     * but select the first Variant available for
     * the selected Color.
     *
     * If the Color is not connected to Variants,
     * keep the current Variant.
     */

    const currentSize =
      selectedVariant?.size ?? null;


    const matchingColorVariants =
      variants.filter(
        (variant) =>
          variant.colorId === color.id
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
      selectedVariant ??
      variants[0] ??
      null;


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
     * FIRST:
     *
     * Try to find the exact:
     *
     * Selected Color + Selected Size
     *
     * Variant.
     */

    let variant =
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
     * FALLBACK:
     *
     * If the selected Color does not have
     * this Size, find ANY Variant with
     * the requested Size.
     *
     * This keeps the Size option functional
     * even if the Color / Variant relationship
     * in existing product data is incomplete.
     */

    if (!variant) {

      variant =
        variants.find(
          (item) =>
            item.size
              .trim()
              .toLowerCase() ===
            normalizedSize
        ) ?? null;

    }


    if (!variant) {
      return;
    }


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
      {/*
       * IMPORTANT:
       *
       * Do NOT use:
       *
       * colorVariants.length > 0
       *
       * here.
       *
       * Size is based on ALL ProductVariants.
       *
       * Also:
       *
       * One Size = still display the Size option.
       *
       * No "No sizes" text.
       */}

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
                 * The active state should compare
                 * the selected Variant's Size.
                 *
                 * We do NOT require the active Variant
                 * to belong to the selected Color.
                 */

                const active =
                  selectedVariant?.size
                    ?.trim()
                    .toLowerCase() ===
                  size
                    .trim()
                    .toLowerCase();


                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() =>
                      handleSizeChange(
                        size
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