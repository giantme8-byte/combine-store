import Image from "next/image";

export default function ShopHeader() {
  return (
<section className="relative mb-24 overflow-hidden rounded-[40px]">
  <div className="relative h-[700px]">
    <Image
      src="/images/shop-banner-v2.png"
      alt="COMBINE Collection"
      fill
      priority
      className="object-cover object-center"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-3xl px-8 text-center text-white">
            <p className="text-xs uppercase tracking-[0.5em] text-white/70">
              COLLECTION
            </p>

            <h1 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-7xl">
              Curated Collection
            </h1>

            <div className="mx-auto mt-8 h-px w-20 bg-white/40" />

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80">
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