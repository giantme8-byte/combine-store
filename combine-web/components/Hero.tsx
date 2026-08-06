import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="
        relative
        isolate
        min-h-[540px]
        overflow-hidden
        md:min-h-[820px]
      "
    >
      {/* Background */}
      <Image
        src="/images/hero-luxury.png"
        alt="COMBINE Luxury Collection"
        fill
        priority
        className="
          object-cover
          object-[68%_center]
          md:object-center
        "
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Luxury Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/5 to-transparent md:h-72" />

      {/* Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[540px]
          max-w-[1440px]
          items-center
          px-5
          md:min-h-[820px]
          md:px-10
          xl:px-14
        "
      >
        <div className="max-w-md text-white md:max-w-2xl">
          {/* Small Title */}
          <p
            className="
              mb-5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.45em]
              text-white/70
              md:mb-8
              md:text-[11px]
              md:tracking-[0.55em]
            "
          >
            COMBINE · Luxury Collection
          </p>

          {/* Title */}
          <h1
            className="
              text-4xl
              font-light
              leading-[0.92]
              tracking-[-0.04em]
              text-white
              md:text-8xl
              md:leading-[0.88]
            "
          >
            Discover
            <br />
            Luxury
          </h1>

          {/* Description */}
          <p
            className="
              mt-6
              max-w-sm
              text-sm
              leading-6
              text-white/80
              md:mt-10
              md:max-w-xl
              md:text-lg
              md:leading-8
            "
          >
            Curated luxury handbags, watches and jewellery,
            crafted with exceptional attention to detail for
            timeless sophistication.
          </p>

          {/* Buttons */}
          <div
            className="
              mt-8
              flex
              flex-wrap
              gap-3
              md:mt-16
              md:gap-5
            "
          >
            <Link
              href="/shop"
              className="
                rounded-full
                bg-white
                px-6
                py-3
                text-[10px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-black
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-neutral-100
                md:px-10
                md:py-4
                md:text-[12px]
              "
            >
              Discover Collection
            </Link>

            <Link
              href="/contact"
              className="
                rounded-full
                border
                border-white/40
                px-6
                py-3
                text-[10px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-white
                transition-all
                duration-300
                hover:border-white
                hover:bg-white
                hover:text-black
                md:px-10
                md:py-4
                md:text-[12px]
              "
            >
              WhatsApp Us
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.45em] text-white/70">
            Scroll
          </span>

          <div className="mt-4 h-16 w-px bg-gradient-to-b from-white to-transparent" />

          <div className="mt-2 h-2 w-2 animate-bounce rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}