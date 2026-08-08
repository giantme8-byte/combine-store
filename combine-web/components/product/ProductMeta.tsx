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
    <div
      className="
        border-t
        border-neutral-200
        py-4
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
        className="
          mt-1.5
          text-sm
          font-medium
          text-neutral-900
          sm:mt-2
          sm:text-base
        "
      >
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
    <div className="mt-8 sm:mt-12">
      {sku && (
        <MetaItem
          label="Reference"
          value={sku}
        />
      )}

      {/*
      {model && (
        <MetaItem
          label="Model"
          value={model}
        />
      )}
      */}

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