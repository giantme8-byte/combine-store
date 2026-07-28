type ProductMetaProps = {
  sku: string | null;
  model: string | null;
  category: string;
  subCategory: string | null;
  mainColor: string | null;
  dimensions: string | null;
};

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-neutral-200 py-6 first:border-t-0 first:pt-0 last:pb-0">
      <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
        {label}
      </p>

      <p className="mt-3 text-lg text-neutral-900">
        {value}
      </p>
    </div>
  );
}

export default function ProductMeta({
  sku,
  model,
  category,
  subCategory,
  mainColor,
  dimensions,
}: ProductMetaProps) {
  return (
    <div className="mt-12">
      {sku && (
        <MetaItem
          label="Reference"
          value={sku}
        />
      )}

      {model && (
        <MetaItem
          label="Model"
          value={model}
        />
      )}

      <MetaItem
        label="Collection"
        value={category}
      />

      {subCategory && (
        <MetaItem
          label="Product Type"
          value={subCategory}
        />
      )}

      {mainColor && (
        <MetaItem
          label="Primary Colour"
          value={mainColor}
        />
      )}

      {dimensions && (
        <MetaItem
          label="Dimensions"
          value={dimensions}
        />
      )}
    </div>
  );
}