import CollectionCard from "./CollectionCard";

const collections = [
  {
    title: "BAGS",
    subtitle: "Luxury Handbags",
    image: "/collections/bags.jpg",
    href: "/shop?category=Bags",
  },
  {
    title: "WATCHES",
    subtitle: "Swiss Timepieces",
    image: "/collections/watches.jpg",
    href: "/shop?category=Watches",
  },
  {
    title: "JEWELLERY",
    subtitle: "Fine Jewellery",
    image: "/collections/jewelry.jpg",
    href: "/shop?category=Jewelry",
  },
  {
    title: "SHOES",
    subtitle: "Luxury Footwear",
    image: "/collections/shoes.jpg",
    href: "/shop?category=Shoes",
  },
];

export default function CollectionSection() {
  return (
    <section className="relative overflow-hidden bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.45em] text-neutral-500">
            EST. 2026
          </p>

          <h2 className="mt-5 text-4xl font-light tracking-wide text-neutral-900 md:text-5xl">
            Curated Luxury Collections
          </h2>

          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-neutral-400 to-transparent" />

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-neutral-600">
            Discover timeless handbags, Swiss timepieces, fine jewellery and
            luxury footwear, thoughtfully selected to elevate your everyday
            style.
          </p>
        </div>

        {/* Collections */}
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
          {collections.map((item) => (
            <CollectionCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}