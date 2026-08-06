import Image from "next/image";

export default function ShopHeader() {
  return (
    <section
      className="
        relative
        mb-24
        overflow-hidden
        rounded-[36px]
        lg:rounded-[44px]
      "
    >
      <div className="relative h-[340px] md:h-[720px]">

        {/* Background */}
        <Image
          src="/images/shop-banner-v2.png"
          alt="COMBINE Collection"
          fill
          priority
          quality={100}
          className="
            object-cover
            object-[65%_center]
            md:object-center
            scale-105
            animate-[heroZoom_20s_ease-in-out_infinite_alternate]
          "
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Luxury Gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/80
            via-black/35
            to-black/10
          "
        />

        {/* Light Glow */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.18),transparent_40%)]
          "
        />

        {/* Bottom Fade */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-44
            bg-gradient-to-t
            from-white/20
            to-transparent
          "
        />

        {/* Content */}
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            px-6
          "
        >
          <div className="max-w-4xl text-center text-white">

            {/* Small Badge */}
            <p
              className="
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-white/20
                bg-white/10
                px-5
                py-2
                text-[10px]
                font-medium
                uppercase
                tracking-[0.45em]
                text-white/90
                backdrop-blur-xl
                md:text-[11px]
              "
            >
              COMBINE

              <span className="h-1 w-1 rounded-full bg-[#D5B47F]" />

              COLLECTION
            </p>

            {/* Title */}
            <h1
              className="
                mt-8
                text-[48px]
                font-extralight
                leading-[0.92]
                tracking-[-0.06em]
                drop-shadow-2xl
                md:text-[92px]
              "
            >
              Curated
              <br />
              Collection
            </h1>

            {/* Divider */}
            <div
              className="
                mx-auto
                mt-8
                h-px
                w-24
                bg-gradient-to-r
                from-transparent
                via-[#D5B47F]
                to-transparent
              "
            />

            {/* Description */}
            <p
              className="
                mx-auto
                mt-8
                max-w-3xl
                text-[15px]
                leading-8
                text-white/80
                md:text-xl
                md:leading-10
              "
            >
              Discover luxury handbags, Swiss timepieces,
              jewellery, premium footwear, fragrances and
              ready-to-wear fashion, carefully curated with
              timeless elegance and exceptional craftsmanship.
            </p>

            {/* Stats */}
            <div
              className="
                mt-14
                grid
                grid-cols-3
                gap-8
                md:max-w-2xl
                md:mx-auto
              "
            >
              <div>
                <p className="text-3xl font-extralight md:text-4xl">
                  2000+
                </p>

                <p
                  className="
                    mt-2
                    text-[10px]
                    uppercase
                    tracking-[0.35em]
                    text-white/60
                  "
                >
                  Products
                </p>
              </div>

              <div>
                <p className="text-3xl font-extralight md:text-4xl">
                  Premium
                </p>

                <p
                  className="
                    mt-2
                    text-[10px]
                    uppercase
                    tracking-[0.35em]
                    text-white/60
                  "
                >
                  Quality
                </p>
              </div>

              <div>
                <p className="text-3xl font-extralight md:text-4xl">
                  Global
                </p>

                <p
                  className="
                    mt-2
                    text-[10px]
                    uppercase
                    tracking-[0.35em]
                    text-white/60
                  "
                >
                  Shipping
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}