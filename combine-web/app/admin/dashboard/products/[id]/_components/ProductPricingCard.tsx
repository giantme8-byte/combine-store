type ProductPricingCardProps = {
  product: {
    costPriceCny: number | null;
    price: number;
  };

  variants: {
    id: number;

    size: string;

    colorId: number | null;

    costPriceCny: number | null;

    exchangeRate: number | null;

    price: number | null;

    color: {
      id: number;
      name: string;
    } | null;
  }[];

  pricing: {
    costMyr: number;
    profit: number;
    margin: number;
  };

  exchangeRate: number;
};

export default function ProductPricingCard({
  product,
  variants,
  pricing,
  exchangeRate,
}: ProductPricingCardProps) {

  // =========================================================
  // PRODUCT WITHOUT VARIANTS
  // =========================================================

  if (variants.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-6
          shadow-sm
        "
      >

        <p
          className="
            text-xs
            font-medium
            uppercase
            tracking-[0.28em]
            text-neutral-400
          "
        >
          PRICING
        </p>

        <h2
          className="
            mt-2
            mb-6
            text-2xl
            font-light
          "
        >
          Pricing
        </h2>

        <div className="space-y-4">

          <Row
            label="Cost Price (CNY)"
            value={
              `¥ ${
                product.costPriceCny
                  ?.toFixed(2) ??
                "0.00"
              }`
            }
          />

          <Row
            label="Exchange Rate"
            value={exchangeRate.toFixed(2)}
          />

          <Row
            label="Cost (MYR)"
            value={`RM ${pricing.costMyr.toFixed(2)}`}
          />

          <Row
            label="Selling Price"
            value={`RM ${product.price.toFixed(2)}`}
          />

          <hr />

          <Row
            label="Estimated Profit"
            value={`RM ${pricing.profit.toFixed(2)}`}
            valueClass={
              pricing.profit >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          />

          <Row
            label="Margin"
            value={`${pricing.margin.toFixed(1)}%`}
            valueClass={
              pricing.margin >= 40
                ? "text-green-600"
                : pricing.margin >= 20
                ? "text-yellow-600"
                : "text-red-600"
            }
          />

        </div>

      </div>
    );
  }

  // =========================================================
  // PRODUCT WITH VARIANTS
  // =========================================================

  return (
    <div
      className="
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-6
        shadow-sm
      "
    >

      {/* =================================================== */}
      {/* Header */}
      {/* =================================================== */}

      <p
        className="
          text-xs
          font-medium
          uppercase
          tracking-[0.28em]
          text-neutral-400
        "
      >
        PRICING
      </p>

      <h2
        className="
          mt-2
          mb-6
          text-2xl
          font-light
        "
      >
        Variant Pricing
      </h2>

      {/* =================================================== */}
      {/* Variants */}
      {/* =================================================== */}

      <div className="space-y-6">

        {variants.map((variant) => {

          // -------------------------------------------------
          // Effective Exchange Rate
          // -------------------------------------------------

          const effectiveExchangeRate =
            variant.exchangeRate ??
            exchangeRate;

          // -------------------------------------------------
          // Cost Price
          // -------------------------------------------------
          //
          // Variant cost takes priority.
          //
          // Product cost is only a fallback for legacy data.
          //
          // -------------------------------------------------

          const costPriceCny =
            variant.costPriceCny ??
            product.costPriceCny ??
            0;

          // -------------------------------------------------
          // Cost MYR
          // -------------------------------------------------

          const costMyr =
            costPriceCny *
            effectiveExchangeRate;

          // -------------------------------------------------
          // Selling Price
          // -------------------------------------------------
          //
          // Variant price takes priority.
          //
          // Product price is only fallback.
          //
          // -------------------------------------------------

          const sellingPrice =
            variant.price ??
            product.price;

          // -------------------------------------------------
          // Profit
          // -------------------------------------------------

          const profit =
            sellingPrice -
            costMyr;

          // -------------------------------------------------
          // Margin
          // -------------------------------------------------

          const margin =
            sellingPrice <= 0
              ? 0
              : (
                  profit /
                  sellingPrice
                ) * 100;

          // -------------------------------------------------
          // Color
          // -------------------------------------------------

          const colorName =
            variant.color?.name ??
            (
              variant.colorId !== null
                ? `Color #${variant.colorId}`
                : null
            );

          // -------------------------------------------------
          // Variant Label
          // -------------------------------------------------

          const variantName =
            colorName
              ? `${colorName} / ${variant.size}`
              : variant.size;

          return (
            <div
              key={variant.id}
              className="
                rounded-2xl
                border
                border-neutral-200
                bg-neutral-50/50
                p-5
              "
            >

              {/* ========================================= */}
              {/* Variant */}
              {/* ========================================= */}

              <div className="mb-5">

                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-neutral-400
                  "
                >
                  Variant
                </p>

                <h3
                  className="
                    mt-1.5
                    text-base
                    font-semibold
                    text-neutral-900
                  "
                >
                  {variantName}
                </h3>

              </div>

              {/* ========================================= */}
              {/* Pricing Details */}
              {/* ========================================= */}

              <div className="space-y-4">

                <Row
                  label="Cost Price (CNY)"
                  value={`¥ ${costPriceCny.toFixed(2)}`}
                />

                <Row
                  label="Exchange Rate"
                  value={effectiveExchangeRate.toFixed(2)}
                />

                <Row
                  label="Cost (MYR)"
                  value={`RM ${costMyr.toFixed(2)}`}
                />

                <Row
                  label="Selling Price"
                  value={`RM ${sellingPrice.toFixed(2)}`}
                />

                <hr />

                <Row
                  label="Estimated Profit"
                  value={`RM ${profit.toFixed(2)}`}
                  valueClass={
                    profit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                />

                <Row
                  label="Margin"
                  value={`${margin.toFixed(1)}%`}
                  valueClass={
                    margin >= 40
                      ? "text-green-600"
                      : margin >= 20
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                />

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}


// ============================================================
// ROW
// ============================================================

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6">

      <span className="text-neutral-500">
        {label}
      </span>

      <span
        className={`
          font-semibold
          tabular-nums
          ${valueClass}
        `}
      >
        {value}
      </span>

    </div>
  );
}