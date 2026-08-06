import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Bags",
    subtitle: "Luxury Handbags",
    image: "/categories/bags-v3.png",
    href: "/shop?category=Bags",
  },
  {
    title: "Watches",
    subtitle: "Swiss Timepieces",
    image: "/categories/watches-v3.png",
    href: "/shop?category=Watches",
  },
  {
    title: "Jewelry",
    subtitle: "Fine Jewellery",
    image: "/categories/jewelry-v3.png",
    href: "/shop?category=Jewelry",
  },
  {
    title: "Shoes",
    subtitle: "Luxury Footwear",
    image: "/categories/shoes-v3.png",
    href: "/shop?category=Shoes",
  },
  {
    title: "Fragrance",
    subtitle: "Signature Scents",
    image: "/categories/fragrance-v3.png",
    href: "/shop?category=Fragrance",
  },
  {
    title: "Clothing",
    subtitle: "Premium Apparel",
    image: "/categories/clothing-v3.png",
    href: "/shop?category=Clothing",
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-36 lg:px-14">
      {/* Header */}
      <div className="mx-auto mb-28 max-w-5xl text-center">
        <p
          className="
            text-[11px]
            uppercase
            tracking-[0.55em]
            text-neutral-400
          "
        >
          CURATED COLLECTIONS
        </p>

        <h2
          className="
            mt-7
            text-5xl
            font-extralight
            tracking-[-0.05em]
            text-neutral-950
            md:text-7xl
          "
        >
          Discover Exceptional Luxury
        </h2>

        <div
          className="
            mx-auto
            mt-10
            h-px
            w-28
            bg-gradient-to-r
            from-transparent
            via-[#C9A86A]
            to-transparent
          "
        />

        <p
          className="
            mx-auto
            mt-10
            max-w-3xl
            text-lg
            leading-9
            text-neutral-500
          "
        >
          Explore luxury handbags, Swiss timepieces, jewellery,
          footwear, fragrances and ready-to-wear pieces curated
          for modern elegance.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-10 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="group"
          >
            <article
              className="
                overflow-hidden
                rounded-[32px]
                bg-white
                shadow-[0_15px_40px_rgba(0,0,0,0.05)]
                transition-all
                duration-700
                group-hover:-translate-y-2
                group-hover:shadow-[0_35px_80px_rgba(0,0,0,0.12)]
              "
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/60
                    via-black/15
                    to-transparent
                    transition-all
                    duration-700
                    group-hover:from-black/45
                  "
                />

                {/* Glass Label */}
                <div
                  className="
                    absolute
                    left-6
                    top-6
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-4
                    py-2
                    text-[10px]
                    uppercase
                    tracking-[0.35em]
                    text-white
                    backdrop-blur-xl
                  "
                >
                  {category.subtitle}
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <h3
                    className="
                      text-3xl
                      font-light
                      uppercase
                      tracking-[0.08em]
                    "
                  >
                    {category.title}
                  </h3>

                  <div
                    className="
                      mt-7
                      inline-flex
                      items-center
                      gap-3
                      text-[11px]
                      uppercase
                      tracking-[0.3em]
                      text-white/90
                    "
                  >
                    <span>Explore Collection</span>

                    <ArrowRight
                      size={16}
                      className="
                        transition-transform
                        duration-500
                        group-hover:translate-x-2
                      "
                    />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}