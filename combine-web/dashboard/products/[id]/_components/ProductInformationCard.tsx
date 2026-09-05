type ProductInformationCardProps = {
  product: {
    sku: string | null;
    brand: string;
    category: string;
    subCategory: string | null;
    model: string | null;
    availability: string;
    mainColor: string | null;
    dimensions: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

function formatAvailability(value: string) {
  switch (value) {
    case "IN_STOCK":
      return "In Stock";

    case "PRE_ORDER":
      return "Pre-order (7–10 Days)";

    case "LIMITED":
      return "Limited Stock";

    case "SOLD_OUT":
      return "Sold Out";

    default:
      return value;
  }
}

export default function ProductInformationCard({
  product,
}: ProductInformationCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
<p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">
  DETAILS
</p>

<h2 className="mt-2 mb-6 text-2xl font-light">
  Product Information
</h2>

<div className="grid gap-4 sm:grid-cols-2">
        <InfoItem
          label="SKU"
          value={product.sku ?? "-"}
        />

        <InfoItem
          label="Brand"
          value={product.brand}
        />

        <InfoItem
          label="Category"
          value={product.category}
        />

        <InfoItem
          label="Sub Category"
          value={product.subCategory ?? "-"}
        />

        <InfoItem
          label="Model"
          value={product.model ?? "-"}
        />

        <InfoItem
          label="Availability"
          value={formatAvailability(product.availability)}
        />

        <InfoItem
          label="Main Color"
          value={product.mainColor ?? "-"}
        />

        <InfoItem
          label="Dimensions"
          value={product.dimensions ?? "-"}
        />

        <InfoItem
          label="Created"
          value={product.createdAt.toLocaleDateString()}
        />

        <InfoItem
          label="Updated"
          value={product.updatedAt.toLocaleDateString()}
        />
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        {label}
      </p>

      <p className="mt-2 font-medium text-neutral-900">
        {value}
      </p>
    </div>
  );
}