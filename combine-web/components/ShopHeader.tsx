import Image from "next/image";

export default function ShopHeader() {
  return (
    <section
      className="
        relative
        mb-12
        overflow-hidden
        rounded-[24px]
        sm:mb-20
        sm:rounded-[36px]
        lg:mb-24
        lg:rounded-[44px]
      "
    >
      <div
        className="
          relative
          h-[520px]
          sm:h-[600px]
          md:h-[720px]
        "
      >
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
            scale-105
            animate-[heroZoom_20s_ease-in-out_infinite_alternate]
            md:object-center
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
            h-36
            bg-gradient-to-t
            from-white/20
            to-transparent
            sm:h-44
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
            px-5
            sm:px-6
          "
        >
          <div className="max-w-4xl text-center text-white">

            {/* Small Badge */}
            <p
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-white/10
                px-4
                py-1.5
                text-[8px]
                font-medium
                uppercase
                tracking-[0.32em]
                text-white/90
                backdrop-blur-xl
                sm:gap-3
                sm:px-5
                sm:py-2
                sm:text-[10px]
                sm:tracking-[0.45em]
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
                mt-6
                text-[42px]
                font-extralight
                leading-[0.92]
                tracking-[-0.06em]
                drop-shadow-2xl
                sm:mt-8
                sm:text-[54px]
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
                mt-6
                h-px
                w-16
                bg-gradient-to-r
                from-transparent
                via-[#D5B47F]
                to-transparent
                sm:mt-8
                sm:w-24
              "
            />

            {/* Description */}
            <p
              className="
                mx-auto
                mt-6
                max-w-3xl
                text-[12px]
                leading-6
                text-white/80
                sm:mt-8
                sm:text-[15px]
                sm:leading-8
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
                mx-auto
                mt-9
                grid
                grid-cols-3
                gap-3
                sm:mt-14
                sm:max-w-2xl
                sm:gap-8
              "
            >
              <div>
                <p className="text-2xl font-extralight sm:text-3xl md:text-4xl">
                  2000+
                </p>

                <p
                  className="
                    mt-1.5
                    text-[8px]
                    uppercase
                    tracking-[0.22em]
                    text-white/60
                    sm:mt-2
                    sm:text-[10px]
                    sm:tracking-[0.35em]
                  "
                >
                  Products
                </p>
              </div>

              <div>
                <p className="text-2xl font-extralight sm:text-3xl md:text-4xl">
                  Premium
                </p>

                <p
                  className="
                    mt-1.5
                    text-[8px]
                    uppercase
                    tracking-[0.22em]
                    text-white/60
                    sm:mt-2
                    sm:text-[10px]
                    sm:tracking-[0.35em]
                  "
                >
                  Quality
                </p>
              </div>

              <div>
                <p className="text-2xl font-extralight sm:text-3xl md:text-4xl">
                  Global
                </p>

                <p
                  className="
                    mt-1.5
                    text-[8px]
                    uppercase
                    tracking-[0.22em]
                    text-white/60
                    sm:mt-2
                    sm:text-[10px]
                    sm:tracking-[0.35em]
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