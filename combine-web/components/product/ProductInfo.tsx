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
          text-[10px]
          font-medium
          uppercase
          tracking-[0.45em]
          text-neutral-500
          sm:text-[11px]
          sm:tracking-[0.6em]
        "
      >
        {product.brand}
      </p>

      {/* Product Name */}
      <h1
        className="
          mt-3
          text-[32px]
          font-extralight
          leading-[1.05]
          tracking-[-0.04em]
          text-neutral-950
          sm:mt-5
          sm:text-[42px]
          sm:leading-[1.02]
          md:text-[52px]
          xl:text-[60px]
        "
      >
        {product.name}
      </h1>

      {/* Divider */}
      <div
        className="
          mt-5
          h-px
          w-24
          bg-gradient-to-r
          from-neutral-900
          via-neutral-400
          to-transparent
          sm:mt-8
          sm:w-36
        "
      />

      {/* Short Description */}
      {product.shortDescription && (
        <p
          className="
            mt-5
            max-w-xl
            text-[14px]
            font-light
            leading-7
            text-neutral-500
            sm:mt-8
            sm:text-[17px]
            sm:leading-[2]
          "
        >
          {product.shortDescription}
        </p>
      )}

      {/* Badges */}
      <div
        className="
          mt-6
          flex
          flex-wrap
          gap-2
          sm:mt-10
          sm:gap-3
        "
      >
        {product.newArrival && (
          <span
            className="
              rounded-full
              border
              border-black/10
              bg-white/70
              px-3
              py-1.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-black
              shadow-sm
              backdrop-blur-md
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
              sm:px-5
              sm:py-2
              sm:text-[10px]
              sm:tracking-[0.32em]
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
              px-3
              py-1.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#9C6B11]
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
              sm:px-5
              sm:py-2
              sm:text-[10px]
              sm:tracking-[0.32em]
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
              px-3
              py-1.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-neutral-800
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
              sm:px-5
              sm:py-2
              sm:text-[10px]
              sm:tracking-[0.32em]
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
              px-3
              py-1.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-black
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-black
              hover:text-white
              sm:px-5
              sm:py-2
              sm:text-[10px]
              sm:tracking-[0.32em]
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
              px-3
              py-1.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#8B5A2B]
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
              sm:px-5
              sm:py-2
              sm:text-[10px]
              sm:tracking-[0.32em]
            "
          >
            SALE
          </span>
        )}
      </div>
    </div>
  );
}