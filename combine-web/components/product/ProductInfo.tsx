type ProductInfoProps = {
  product: {
    brand: string;
    name: string;
    shortDescription: string | null;
    newArrival: boolean;
    featured: boolean;
    bestSeller: boolean;
    limited: boolean;
    onSale: boolean;
  };
};

export default function ProductInfo({
  product,
}: ProductInfoProps) {
  return (
    <div>
      {/* Brand */}
      <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
        {product.brand}
      </p>

      {/* Name */}
      <h1 className="mt-5 text-5xl font-extralight leading-[1.05] tracking-[-0.03em] md:text-6xl">
        {product.name}
      </h1>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-500">
          {product.shortDescription}
        </p>
      )}

      {/* Badges */}
      <div className="mt-10 border-t border-neutral-200 pt-8">
        <div className="flex flex-wrap gap-3">
          {product.newArrival && (
            <span className="rounded-full bg-black px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-white">
              NEW
            </span>
          )}

          {product.featured && (
            <span className="rounded-full bg-[#C8A96A] px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-white">
              FEATURED
            </span>
          )}

          {product.bestSeller && (
            <span className="rounded-full bg-neutral-800 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-white">
              BEST SELLER
            </span>
          )}

          {product.limited && (
            <span className="rounded-full border border-black px-4 py-1 text-[11px] uppercase tracking-[0.18em]">
              LIMITED
            </span>
          )}

          {product.onSale && (
            <span className="rounded-full bg-[#7A4E2C] px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-white">
              SALE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}