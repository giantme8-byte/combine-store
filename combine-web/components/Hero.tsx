import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      className="
        relative
        isolate
        min-h-[560px]
        overflow-hidden
        sm:min-h-[640px]
        md:min-h-[820px]
      "
    >
      {/* Background */}
      <Image
        src="/images/hero-luxury.png"
        alt="COMBINE Luxury Collection"
        fill
        priority
        quality={90}
        className="
          object-cover
          object-[68%_center]
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

      {/* Bottom Fade */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-32
          bg-gradient-to-t
          from-white
          via-white/10
          to-transparent
          sm:h-44
          md:h-80
        "
      />

      {/* Luxury Glow */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.18),transparent_40%)]
        "
      />

      {/* Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[560px]
          max-w-[1440px]
          items-center
          px-5
          py-12
          sm:min-h-[640px]
          sm:px-8
          sm:py-16
          md:min-h-[820px]
          md:px-10
          md:py-0
          xl:px-14
        "
      >
        <div
          className="
            max-w-xl
            text-white
            md:max-w-3xl
          "
        >
          {/* Small Title */}
          <p
            className="
              mb-5
              inline-flex
              items-center
              gap-2.5
              rounded-full
              border
              border-white/20
              bg-white/10
              px-4
              py-2
              text-[9px]
              font-medium
              uppercase
              tracking-[0.35em]
              text-white/90
              backdrop-blur-xl
              sm:mb-7
              sm:px-5
              sm:text-[10px]
              sm:tracking-[0.45em]
              md:mb-10
              md:text-[11px]
            "
          >
            COMBINE

            <span className="h-1 w-1 rounded-full bg-[#D5B47F]" />

            Luxury Collection
          </p>

          {/* Title */}
          <h1
            className="
              text-[40px]
              font-extralight
              leading-[0.94]
              tracking-[-0.055em]
              text-white
              drop-shadow-2xl
              sm:text-[52px]
              md:text-[108px]
              md:leading-[0.9]
              md:tracking-[-0.06em]
            "
          >
            Discover
            <br />
            Timeless Luxury
          </h1>

          {/* Description */}
          <p
            className="
              mt-5
              max-w-[350px]
              text-[13px]
              leading-6
              text-white/80
              sm:mt-7
              sm:max-w-xl
              sm:text-[15px]
              sm:leading-8
              md:mt-8
              md:max-w-2xl
              md:text-xl
              md:leading-10
            "
          >
            Curated luxury handbags, watches and jewellery
            with exceptional craftsmanship, timeless elegance
            and worldwide shipping.
          </p>

          {/* Buttons */}
          <div
            className="
              mt-7
              flex
              flex-col
              items-start
              gap-3
              sm:mt-10
              sm:flex-row
              sm:items-center
              sm:gap-4
              md:mt-16
            "
          >
            <Link
              href="/shop"
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2.5
                rounded-full
                bg-white
                px-6
                py-3.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-black
                shadow-2xl
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-white/20
                sm:px-8
                sm:py-4
                sm:text-[11px]
                sm:tracking-[0.28em]
              "
            >
              Discover Collection

              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>

            <Link
              href="/contact"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                border
                border-white/30
                bg-white/10
                px-6
                py-3.5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-white
                backdrop-blur-xl
                transition-all
                duration-500
                hover:border-[#D5B47F]
                hover:bg-[#D5B47F]
                hover:text-black
                sm:px-8
                sm:py-4
                sm:text-[11px]
                sm:tracking-[0.28em]
              "
            >
              WhatsApp Us
            </Link>
          </div>

          {/* Luxury Stats */}
          <div
            className="
              mt-8
              grid
              max-w-[350px]
              grid-cols-3
              gap-3
              sm:mt-14
              sm:max-w-xl
              sm:gap-8
            "
          >
            {/* Luxury Pieces */}
            <div>
              <p
                className="
                  text-2xl
                  font-extralight
                  text-white
                  sm:text-3xl
                  md:text-4xl
                "
              >
                10,000+
              </p>

              <p
                className="
                  mt-1.5
                  text-[8px]
                  uppercase
                  tracking-[0.18em]
                  text-white/60
                  sm:mt-2
                  sm:text-[10px]
                  sm:tracking-[0.3em]
                "
              >
                Luxury Pieces
              </p>
            </div>

            {/* Quality */}
            <div>
              <p
                className="
                  text-2xl
                  font-extralight
                  text-white
                  sm:text-3xl
                  md:text-4xl
                "
              >
                99%
              </p>

              <p
                className="
                  mt-1.5
                  text-[8px]
                  uppercase
                  tracking-[0.18em]
                  text-white/60
                  sm:mt-2
                  sm:text-[10px]
                  sm:tracking-[0.35em]
                "
              >
                Premium Quality
              </p>
            </div>

            {/* Shipping */}
            <div>
              <p
                className="
                  text-2xl
                  font-extralight
                  text-white
                  sm:text-3xl
                  md:text-4xl
                "
              >
                Global
              </p>

              <p
                className="
                  mt-1.5
                  text-[8px]
                  uppercase
                  tracking-[0.18em]
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

      {/* Scroll Indicator */}
      <div
        className="
          absolute
          bottom-10
          left-1/2
          hidden
          -translate-x-1/2
          flex-col
          items-center
          text-white/70
          md:flex
        "
      >
        <ChevronDown
          size={18}
          className="animate-bounce"
        />

        <span
          className="
            mt-3
            text-[10px]
            uppercase
            tracking-[0.45em]
          "
        >
          Scroll
        </span>
      </div>
    </section>
  );
}