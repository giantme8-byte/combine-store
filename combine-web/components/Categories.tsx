import Image from "next/image";
import Link from "next/link";

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
    <section className="mx-auto max-w-[1440px] px-8 py-32 lg:px-12">
      {/* Header */}
      <div className="mx-auto mb-24 max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">
          COLLECTIONS
        </p>

        <h2 className="mt-6 text-5xl font-extralight tracking-[-0.03em] text-neutral-900 md:text-6xl">
          Discover Our Collections
        </h2>

        <div className="mx-auto mt-8 h-px w-20 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-neutral-500">
          Explore an exceptional selection of luxury handbags, Swiss
          timepieces, fine jewellery, premium footwear, signature
          fragrances and ready-to-wear fashion, carefully curated for
          timeless sophistication.
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
                rounded-[28px]
                bg-white
                shadow-[0_12px_35px_rgba(0,0,0,0.05)]
                transition-all
                duration-700
                group-hover:-translate-y-2
                group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)]
              "
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-[1.05]"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent transition-all duration-700 group-hover:from-black/40" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/70 transition duration-500 group-hover:text-white/90">
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