import Link from "next/link";

import { ArrowRight } from "lucide-react";

const brands = [
  "Louis Vuitton",
  "Hermès",
  "Chanel",
  "Celine",
  "Gucci",
  "Prada",
  "Fendi",
  "Loewe",
  "Dior",
  "YSL",
  "Chloé",
  "Coach",
  "Goyard",
  "Versace",
  "Miu Miu",
  "Burberry",
  "Balenciaga",
  "Bottega Veneta",
  "Rolex",
  "Omega",
  "Hublot",
  "Cartier",
  "Richard Mille",
  "Patek Philippe",
  "Audemars Piguet",
  "Jaeger-LeCoultre",
  "Vacheron Constantin",
  "Van Cleef & Arpels",
  "Harry Winston",
  "Tiffany & Co.",
  "Mikimoto",
  "De Beers",
  "Bvlgari",
  "Chopard",
  "Messika",
  "Piaget",
];

export default function BrandShowcase() {
  return (
    <section className="border-y border-neutral-100 bg-[#faf9f7] py-36">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-14">

        {/* Header */}
        <div className="mx-auto mb-24 max-w-4xl text-center">

          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.55em]
              text-neutral-400
            "
          >
            WORLD'S FINEST BRANDS
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
            Explore Luxury Houses
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
            Discover iconic fashion houses and legendary Swiss
            watchmakers, curated for timeless elegance and modern
            luxury.
          </p>

        </div>

        {/* Brands */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">

          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/shop?brand=${encodeURIComponent(
                brand
              )}`}
              className="group"
            >
              <article
                className="
                  flex
                  h-32
                  flex-col
                  items-center
                  justify-center
                  rounded-[28px]
                  border
                  border-neutral-200
                  bg-white
                  shadow-[0_12px_30px_rgba(0,0,0,0.04)]
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-[#C9A86A]
                  hover:shadow-[0_28px_60px_rgba(0,0,0,0.10)]
                "
              >
                <span
                  className="
                    px-4
                    text-center
                    text-[18px]
                    font-light
                    tracking-wide
                    text-neutral-900
                    transition-all
                    duration-500
                    group-hover:tracking-[0.08em]
                  "
                >
                  {brand}
                </span>

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    uppercase
                    tracking-[0.28em]
                    text-neutral-400
                    transition-all
                    duration-500
                    group-hover:text-[#C9A86A]
                  "
                >
                  Explore

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-500
                      group-hover:translate-x-1
                    "
                  />
                </div>

              </article>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}