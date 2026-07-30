export default function ShopHeader() {
  return (
    <section className="mx-auto mb-24 max-w-4xl text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.55em] text-neutral-400">
        COMBINE
      </p>

      <h1 className="mt-6 text-5xl font-extralight tracking-[-0.03em] text-neutral-900 md:text-7xl">
        Curated Collection
      </h1>

      <div className="mx-auto mt-8 h-px w-20 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

      <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
        Explore our carefully curated selection of luxury handbags,
        fine watches, jewellery and refined accessories. Designed for
        timeless style and everyday sophistication.
      </p>
    </section>
  );
}