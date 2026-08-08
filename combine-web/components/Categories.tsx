import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Bags",
    image: "/categories/bags-v3.png",
    href: "/shop?category=Bags",
  },
  {
    title: "Watches",
    image: "/categories/watches-v3.png",
    href: "/shop?category=Watches",
  },
  {
    title: "Jewelry",
    image: "/categories/jewelry-v3.png",
    href: "/shop?category=Jewelry",
  },
  {
    title: "Shoes",
    image: "/categories/shoes-v3.png",
    href: "/shop?category=Shoes",
  },
  {
    title: "Fragrance",
    image: "/categories/fragrance-v3.png",
    href: "/shop?category=Fragrance",
  },
  {
    title: "Clothing",
    image: "/categories/clothing-v3.png",
    href: "/shop?category=Clothing",
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-24 sm:px-6 sm:py-36 lg:px-14">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-5xl text-center sm:mb-28">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.55em]
            text-neutral-400
            sm:text-[11px]
          "
        >
          CURATED COLLECTIONS
        </p>

        <h2
          className="
            mt-6
            text-4xl
            font-extralight
            tracking-[-0.05em]
            text-neutral-950
            sm:mt-7
            sm:text-5xl
            md:text-7xl
          "
        >
          Discover Exceptional Luxury
        </h2>

        <div
          className="
            mx-auto
            mt-8
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C9A86A]
            to-transparent
            sm:mt-10
            sm:w-28
          "
        />

        <p
          className="
            mx-auto
            mt-8
            max-w-3xl
            text-base
            leading-8
            text-neutral-500
            sm:mt-10
            sm:text-lg
            sm:leading-9
          "
        >
          Explore luxury handbags, Swiss timepieces, jewellery,
          footwear, fragrances and ready-to-wear pieces curated
          for modern elegance.
        </p>
      </div>

      {/* Cards */}
      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:gap-6
          lg:gap-10
        "
      >
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="group"
          >
            <article
              className="
                overflow-hidden
                rounded-[20px]
                bg-white
                shadow-[0_10px_30px_rgba(0,0,0,0.05)]
                transition-all
                duration-700
                group-hover:-translate-y-2
                group-hover:shadow-[0_35px_80px_rgba(0,0,0,0.12)]
                sm:rounded-[28px]
                lg:rounded-[32px]
              "
            >
              <div
                className="
                  relative
                  aspect-[4/5]
                  overflow-hidden
                  sm:aspect-[5/4]
                "
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="
                    (max-width: 640px) 50vw,
                    (max-width: 1024px) 50vw,
                    50vw
                  "
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
                    from-black/65
                    via-black/15
                    to-transparent
                    transition-all
                    duration-700
                    group-hover:from-black/45
                  "
                />

                {/* Content */}
                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    p-4
                    text-white
                    sm:p-6
                    lg:p-8
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-light
                      uppercase
                      tracking-[0.06em]
                      sm:text-2xl
                      lg:text-3xl
                      lg:tracking-[0.08em]
                    "
                  >
                    {category.title}
                  </h3>

                  <div
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-2
                      text-[8px]
                      uppercase
                      tracking-[0.2em]
                      text-white/90
                      sm:mt-5
                      sm:gap-3
                      sm:text-[10px]
                      sm:tracking-[0.25em]
                      lg:mt-7
                      lg:text-[11px]
                      lg:tracking-[0.3em]
                    "
                  >
                    <span>Explore Collection</span>

                    <ArrowRight
                      size={14}
                      className="
                        transition-transform
                        duration-500
                        group-hover:translate-x-2
                        sm:h-4
                        sm:w-4
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