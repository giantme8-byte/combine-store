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
      <p className="text-[11px] font-medium uppercase tracking-[0.5em] text-neutral-500">
        {product.brand}
      </p>

      {/* Product Name */}
      <h1
        className="
          mt-5
          text-4xl
          font-extralight
          leading-tight
          tracking-[-0.02em]
          text-neutral-900
          md:text-5xl
          xl:text-6xl
        "
      >
        {product.name}
      </h1>

      {/* Divider */}
      <div className="mt-8 h-px w-20 bg-gradient-to-r from-neutral-900 to-transparent" />

      {/* Short Description */}
      {product.shortDescription && (
        <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-600">
          {product.shortDescription}
        </p>
      )}

      {/* Badges */}
      <div className="mt-12 flex flex-wrap gap-3">
        {product.newArrival && (
          <span className="rounded-full bg-black px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white">
            NEW
          </span>
        )}

        {product.featured && (
          <span className="rounded-full bg-[#C8A96A] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white">
            FEATURED
          </span>
        )}

        {product.bestSeller && (
          <span className="rounded-full bg-neutral-800 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white">
            BEST SELLER
          </span>
        )}

        {product.limited && (
          <span className="rounded-full border border-neutral-900 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-900">
            LIMITED
          </span>
        )}

        {product.onSale && (
          <span className="rounded-full bg-[#7A4E2C] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white">
            SALE
          </span>
        )}
      </div>
    </div>
  );
}