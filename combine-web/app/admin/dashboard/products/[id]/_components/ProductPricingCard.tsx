type ProductPricingCardProps = {
  product: {
    costPriceCny: number | null;
    price: number;
  };
  pricing: {
    costMyr: number;
    profit: number;
    margin: number;
  };
  exchangeRate: number;
};

export default function ProductPricingCard({
  product,
  pricing,
  exchangeRate,
}: ProductPricingCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

<p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">
  PRICING
</p>

<h2 className="mt-2 mb-6 text-2xl font-light">
  Pricing
</h2>

      <div className="space-y-4">

        <Row
          label="Cost Price (CNY)"
          value={`¥ ${product.costPriceCny?.toFixed(2) ?? "0.00"}`}
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
    <div className="flex items-center justify-between">
      <span className="text-neutral-500">{label}</span>

      <span className={`font-semibold ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}