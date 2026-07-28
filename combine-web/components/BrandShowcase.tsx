import Link from "next/link";

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
    <section className="border-y border-gray-100 bg-[#fafafa] py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-400">
            LUXURY BRANDS
          </p>

          <h2 className="mt-5 text-5xl font-extralight tracking-tight">
            Discover by Brand
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-500">
            Explore timeless collections from some of the world&apos;s most iconic
            fashion houses and watchmakers.
          </p>

        </div>

        {/* Brands */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/shop?brand=${encodeURIComponent(brand)}`}
              className="group flex h-28 items-center justify-center rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-lg"
            >
              <span className="text-center text-lg font-light tracking-wide transition group-hover:tracking-[0.08em]">
                {brand}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}