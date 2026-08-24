"use client";

import {
  useProduct,
} from "./ProductContext";


// ============================================================
// PRODUCT VARIANT
// ============================================================

type ProductVariant = {
  id: number;

  colorId: number | null;

  size: string;

  model: string | null;

  dimensions: string | null;
};


// ============================================================
// PRODUCT META PROPS
// ============================================================

type ProductMetaProps = {
  sku: string | null;

  /*
   * Product-level Model No.
   *
   * This is the fallback model.
   *
   * Priority:
   *
   * Variant Model
   * ↓
   * Color Model
   * ↓
   * Product Model
   */
  model: string | null;

  category: string;

  subCategory: string | null;

  mainColor: string | null;

  dimensions: string | null;

  variants?: ProductVariant[];
};


// ============================================================
// META ITEM
// ============================================================

function MetaItem({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className="
        border-t
        border-neutral-200
        py-3.5
        first:border-t-0
        first:pt-0
        sm:py-5
        sm:first:pt-0
      "
    >

      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.3em]
          text-neutral-400
          sm:text-[11px]
          sm:tracking-[0.35em]
        "
      >
        {label}
      </p>


      <p
        className={`
          mt-1.5
          break-words
          leading-6
          text-neutral-900
          sm:mt-2
          sm:leading-7

          ${
            emphasis
              ? `
                text-lg
                font-semibold
                tracking-[0.01em]
                sm:text-xl
              `
              : `
                text-sm
                font-medium
                sm:text-base
              `
          }
        `}
      >
        {value}
      </p>

    </div>
  );
}


// ============================================================
// PRODUCT META
// ============================================================

export default function ProductMeta({
  sku,
  model,
  category,
  subCategory,
  mainColor,
  dimensions,
  variants = [],
}: ProductMetaProps) {

  // ==========================================================
  // PRODUCT CONTEXT
  // ==========================================================

  const {
    selectedColor,
    selectedVariant,
  } = useProduct();


  // ==========================================================
  // CURRENT MODEL
  // ==========================================================
  //
  // Priority:
  //
  // 1. Selected Variant Model
  // 2. Selected Color Model
  // 3. Product Model
  //
  // Example:
  //
  // Product Model:
  // M10000
  //
  // Black:
  // M12345
  //
  // White:
  // M67890
  //
  // Black / Small:
  // M11111
  //
  // Black / Large:
  // M11112
  //
  // ==========================================================

  const currentModel =
    selectedVariant?.model?.trim() ||
    selectedColor?.model?.trim() ||
    model?.trim() ||
    null;


  // ==========================================================
  // VARIANTS WITH DIMENSIONS
  // ==========================================================

  const variantsWithDimensions =
    variants.filter(
      (variant) =>
        variant.dimensions?.trim()
    );


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        mt-7
        sm:mt-12
      "
    >

      {/* ================================================= */}
      {/* Reference */}
      {/* ================================================= */}

      {sku && (

        <MetaItem
          label="Reference"
          value={sku}
        />

      )}


      {/* ================================================= */}
      {/* Model No. */}
      {/* ================================================= */}

      {currentModel && (

        <MetaItem
          label="Model No."
          value={currentModel}
          emphasis
        />

      )}


      {/* ================================================= */}
      {/* Collection */}
      {/* ================================================= */}

      <MetaItem
        label="Collection"
        value={category}
      />


      {/* ================================================= */}
      {/* Product Type */}
      {/* ================================================= */}

      {subCategory && (

        <MetaItem
          label="Product Type"
          value={subCategory}
        />

      )}


      {/* ================================================= */}
      {/* Primary Colour */}
      {/* ================================================= */}

      {mainColor && (

        <MetaItem
          label="Primary Colour"
          value={mainColor}
        />

      )}


      {/* ================================================= */}
      {/* Size & Dimensions */}
      {/* ================================================= */}

      {variantsWithDimensions.length > 0 ? (

        <div
          className="
            border-t
            border-neutral-200
            py-3.5
            sm:py-5
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-neutral-400
              sm:text-[11px]
              sm:tracking-[0.35em]
            "
          >
            Size & Dimensions
          </p>


          <div
            className="
              mt-4
              space-y-5
              sm:mt-5
              sm:space-y-6
            "
          >

            {variantsWithDimensions.map(
              (variant) => (

                <div
                  key={variant.id}
                  className="
                    border-b
                    border-neutral-100
                    pb-5
                    last:border-b-0
                    last:pb-0
                    sm:pb-6
                    sm:last:pb-0
                  "
                >

                  {/* Size */}

                  <p
                    className="
                      text-sm
                      font-medium
                      text-neutral-900
                      sm:text-base
                    "
                  >
                    {variant.size}
                  </p>


                  {/* Dimensions */}

                  <p
                    className="
                      mt-1
                      text-sm
                      leading-6
                      text-neutral-700
                      sm:text-base
                      sm:leading-7
                    "
                  >
                    {variant.dimensions}
                  </p>


                  {/* Measurement Disclaimer */}

                  <p
                    className="
                      mt-1.5
                      text-[10px]
                      font-light
                      italic
                      leading-5
                      text-neutral-400
                      sm:text-[11px]
                    "
                  >
                    Measurements may vary
                    slightly by 1–3 cm due
                    to manual measurement.
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      ) : (

        dimensions && (

          <div
            className="
              border-t
              border-neutral-200
              py-3.5
              sm:py-5
            "
          >

            {/* Dimensions */}

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-neutral-400
                sm:text-[11px]
                sm:tracking-[0.35em]
              "
            >
              Dimensions
            </p>


            <p
              className="
                mt-1.5
                break-words
                text-sm
                font-medium
                leading-6
                text-neutral-900
                sm:mt-2
                sm:text-base
                sm:leading-7
              "
            >
              {dimensions}
            </p>


            {/* Measurement Disclaimer */}

            <p
              className="
                mt-1.5
                text-[10px]
                font-light
                italic
                leading-5
                text-neutral-400
                sm:text-[11px]
              "
            >
              Measurements may vary
              slightly by 1–3 cm due
              to manual measurement.
            </p>

          </div>

        )

      )}

    </div>
  );
}