import Image from "next/image";

export default function ShopHeader() {
  return (
    <section className="relative mb-16 overflow-hidden rounded-[28px] md:mb-24 md:rounded-[40px]">
      <div className="relative h-[320px] md:h-[700px]">
        {/* Background */}
        <Image
          src="/images/shop-banner-v2.png"
          alt="COMBINE Collection"
          fill
          priority
          className="
            object-cover
            object-[65%_center]
            md:object-center
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Luxury Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center text-white md:px-8">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.4em]
                text-white/70
                md:text-xs
                md:tracking-[0.5em]
              "
            >
              COLLECTION
            </p>

            <h1
              className="
                mt-4
                text-3xl
                font-extralight
                tracking-[-0.03em]
                md:mt-6
                md:text-7xl
              "
            >
              Curated Collection
            </h1>

            <div className="mx-auto mt-5 h-px w-16 bg-white/40 md:mt-8 md:w-20" />

            <p
              className="
                mx-auto
                mt-5
                max-w-md
                text-sm
                leading-6
                text-white/80
                md:mt-8
                md:max-w-2xl
                md:text-lg
                md:leading-8
              "
            >
              Explore our curated selection of luxury handbags,
              Swiss timepieces, fine jewellery, premium footwear,
              fragrances and ready-to-wear fashion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}