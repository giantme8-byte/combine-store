import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Bags",
    subtitle: "Luxury Handbags",
    image: "/categories/bags-v2.png",
    href: "/shop?category=bags",
  },
  {
    title: "Watches",
    subtitle: "Swiss Timepieces",
    image: "/categories/watches-v2.png",
    href: "/shop?category=watches",
  },
  {
    title: "Jewelry",
    subtitle: "Fine Jewellery",
    image: "/categories/jewelry-v2.png",
    href: "/shop?category=jewelry",
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-32 lg:px-12">
      {/* Header */}
      <div className="mx-auto mb-24 max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">
          COLLECTIONS
        </p>

        <h2 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-6xl">
          Discover Our Collections
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-500">
          Timeless handbags, luxury watches and fine jewellery, thoughtfully
          curated for those who appreciate refined elegance.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="group"
          >
            <article className="overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />

                {/* Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/18 to-transparent transition-all duration-700 group-hover:from-black/50" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/70 transition-opacity duration-500 group-hover:text-white/85">
                    {category.subtitle}
                  </p>

                  <h3 className="mt-3 text-3xl font-light uppercase tracking-[0.08em] transition-transform duration-500 group-hover:-translate-y-0.5">
                    {category.title}
                  </h3>

                  <div className="mt-6 flex items-center gap-2 text-sm uppercase tracking-[0.25em]">
                    <span>Discover</span>

                    <span className="transition-transform duration-500 group-hover:translate-x-2">
                      →
                    </span>
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