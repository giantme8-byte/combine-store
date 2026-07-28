import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden">
      {/* Background */}
      <Image
        src="/images/hero-luxury.png"
        alt="COMBINE Luxury Collection"
        fill
        priority
        className="object-cover object-center animate-hero-zoom"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/22" />

      {/* Luxury Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white via-white/5 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-[1440px] items-center px-10 xl:px-14">
        <div className="max-w-xl text-white">
          {/* Small Title */}
          <p className="animate-fade-up mb-8 text-[11px] uppercase tracking-[0.55em] text-white/70">
            COMBINE · Luxury Collection
          </p>

          {/* Main Title */}
          <h1 className="animate-fade-up delay-200 text-5xl font-light leading-[0.95] tracking-[-0.03em] md:text-7xl">
            Timeless
            <br />
            Elegance
          </h1>

          {/* Description */}
          <p className="animate-fade-up delay-400 mt-10 max-w-lg text-lg leading-8 text-white/80">
            Discover carefully curated luxury handbags, fine timepieces and
            exquisite jewellery, crafted with exceptional attention to detail
            for modern elegance.
          </p>

          {/* Buttons */}
          <div className="animate-fade-up delay-600 mt-16 flex flex-wrap gap-5">
            <Link
              href="/shop"
              className="rounded-xl bg-white px-9 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-100"
            >
              Discover Collection
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/40 px-9 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              WhatsApp Us
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
        <div className="flex flex-col items-center">
          <span className="animate-fade-up delay-800 text-[10px] uppercase tracking-[0.45em] text-white/70">
            Scroll
          </span>

          <div className="mt-4 h-16 w-px bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}