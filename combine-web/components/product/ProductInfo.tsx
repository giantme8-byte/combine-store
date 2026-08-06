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
      <p className="text-[11px] font-light uppercase tracking-[0.55em] text-neutral-500">
        {product.brand}
      </p>

      {/* Product Name */}
      <h1
        className="
          mt-5
          text-[42px]
          font-extralight
          leading-[1.08]
          tracking-[-0.04em]
          text-neutral-900
          md:text-[52px]
          xl:text-[60px]
        "
      >
        {product.name}
      </h1>

      {/* Divider */}
      <div className="mt-8 h-px w-28 bg-gradient-to-r from-neutral-900 to-transparent" />

      {/* Short Description */}
      {product.shortDescription && (
        <p
          className="
            mt-8
            max-w-xl
            text-[17px]
            font-light
            leading-9
            text-neutral-600
          "
        >
          {product.shortDescription}
        </p>
      )}

      {/* Badges */}
      <div className="mt-10 flex flex-wrap gap-3">
        {product.newArrival && (
          <span
            className="
              rounded-full
              bg-black
              px-5
              py-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-white
            "
          >
            NEW
          </span>
        )}

        {product.featured && (
          <span
            className="
              rounded-full
              bg-[#C8A96A]
              px-5
              py-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-white
            "
          >
            FEATURED
          </span>
        )}

        {product.bestSeller && (
          <span
            className="
              rounded-full
              bg-neutral-800
              px-5
              py-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-white
            "
          >
            BEST SELLER
          </span>
        )}

        {product.limited && (
          <span
            className="
              rounded-full
              border
              border-neutral-900
              px-5
              py-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-neutral-900
            "
          >
            LIMITED
          </span>
        )}

        {product.onSale && (
          <span
            className="
              rounded-full
              bg-[#7A4E2C]
              px-5
              py-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-white
            "
          >
            SALE
          </span>
        )}
      </div>
    </div>
  );
}