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
  quality={100}
  className="
    object-cover
    object-[68%_center]
    md:object-center
    scale-105
    animate-[heroZoom_18s_ease-in-out_infinite_alternate]
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
    h-56
    bg-gradient-to-t
    from-white
    via-white/10
    to-transparent
    md:h-80
  "
 />

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
          min-h-[540px]
          max-w-[1440px]
          items-center
          px-5
          md:min-h-[820px]
          md:px-10
          xl:px-14
        "
      >
        <div className="max-w-xl text-white md:max-w-3xl">
          {/* Small Title */}
<p
  className="
    mb-6
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
    text-[48px]
    font-extralight
    leading-[0.9]
    tracking-[-0.06em]
    text-white
    drop-shadow-2xl
    md:text-[108px]
  "
>
Discover

<br />

Timeless Luxury
          </h1>

          {/* Description */}
<p
  className="
    mt-8
    max-w-2xl
    text-[15px]
    leading-8
    text-white/80
    md:text-xl
    md:leading-10
  "
>
Curated luxury handbags, watches and jewellery with exceptional craftsmanship, timeless elegance and worldwide shipping.
          </p>

{/* Buttons */}
<div
  className="
    mt-12
    flex
    flex-wrap
    items-center
    gap-4
    md:mt-16
  "
>
  <Link
    href="/shop"
    className="
      group
      inline-flex
      items-center
      gap-3
      overflow-hidden
      rounded-full
      bg-white
      px-8
      py-4
      text-[11px]
      font-semibold
      uppercase
      tracking-[0.28em]
      text-black
      shadow-2xl
      transition-all
      duration-500
      hover:-translate-y-1
      hover:shadow-white/20
    "
  >
    Discover Collection

    <ArrowRight
      size={18}
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
      group
      inline-flex
      items-center
      rounded-full
      border
      border-white/30
      bg-white/10
      px-8
      py-4
      text-[11px]
      font-medium
      uppercase
      tracking-[0.28em]
      text-white
      backdrop-blur-xl
      transition-all
      duration-500
      hover:border-[#D5B47F]
      hover:bg-[#D5B47F]
      hover:text-black
    "
  >
    WhatsApp Us
  </Link>
</div>

{/* Luxury Stats */}
<div
  className="
    mt-14
    grid
    max-w-xl
    grid-cols-3
    gap-8
  "
>
  <div>
    <p className="text-3xl font-extralight text-white md:text-4xl">
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
    <p className="text-3xl font-extralight text-white md:text-4xl">
      99%
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
      Premium Quality
    </p>
  </div>

  <div>
    <p className="text-3xl font-extralight text-white md:text-4xl">
      Worldwide
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

      {/* Scroll Indicator */}
      <div
        className="
          absolute
          bottom-10
          left-1/2
          hidden
          -translate-x-1/2
          md:flex
          flex-col
          items-center
          text-white/70
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