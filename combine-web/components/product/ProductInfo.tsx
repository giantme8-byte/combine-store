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
    <div className="space-y-2">
      {/* Brand */}
      <p
        className="
          text-[11px]
          font-medium
          uppercase
          tracking-[0.6em]
          text-neutral-500
        "
      >
        {product.brand}
      </p>

      {/* Product Name */}
      <h1
        className="
          mt-5
          text-[42px]
          font-extralight
          leading-[1.02]
          tracking-[-0.045em]
          text-neutral-950
          md:text-[52px]
          xl:text-[60px]
        "
      >
        {product.name}
      </h1>

      {/* Divider */}
      <div
        className="
          mt-8
          h-px
          w-36
          bg-gradient-to-r
          from-neutral-900
          via-neutral-400
          to-transparent
        "
      />

      {/* Short Description */}
      {product.shortDescription && (
        <p
          className="
            mt-8
            max-w-xl
            text-[17px]
            font-light
            leading-[2]
            text-neutral-500
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
              border
              border-black/10
              bg-white/70
              px-5
              py-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.32em]
              text-black
              shadow-sm
              backdrop-blur-md
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            NEW ARRIVAL
          </span>
        )}

        {product.featured && (
          <span
            className="
              rounded-full
              border
              border-[#D6BE86]
              bg-[#FFF8E7]
              px-5
              py-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.32em]
              text-[#9C6B11]
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            FEATURED
          </span>
        )}

        {product.bestSeller && (
          <span
            className="
              rounded-full
              border
              border-neutral-300
              bg-neutral-100
              px-5
              py-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.32em]
              text-neutral-800
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
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
              border-black
              bg-white
              px-5
              py-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.32em]
              text-black
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-black
              hover:text-white
            "
          >
            LIMITED
          </span>
        )}

        {product.onSale && (
          <span
            className="
              rounded-full
              border
              border-[#8B5A2B]
              bg-[#FDF3E8]
              px-5
              py-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.32em]
              text-[#8B5A2B]
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            SALE
          </span>
        )}
      </div>
    </div>
  );
}