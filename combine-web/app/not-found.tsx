import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>

      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">

        <Image
          src="/about/hero-v2.png"
          alt="404 Not Found"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 flex items-center justify-center text-center text-white">

          <div className="max-w-4xl px-6">

            <p className="text-xs uppercase tracking-[0.5em] text-white/70">
              ERROR 404
            </p>

            <h1 className="mt-6 text-7xl font-extralight tracking-[-0.05em] md:text-9xl">
              Page Not
              <br />
              Found
            </h1>

            <p className="mx-auto mt-10 max-w-2xl text-lg leading-8 text-white/80">
              The page you&apos;re looking for doesn&apos;t exist, has been moved,
              or is temporarily unavailable.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                href="/"
                className="rounded-full bg-white px-10 py-4 text-sm font-medium uppercase tracking-[0.3em] text-black transition-all duration-300 hover:scale-105 hover:bg-neutral-100"
              >
                Back to Home
              </Link>

              <Link
                href="/shop"
                className="rounded-full border border-white/50 px-10 py-4 text-sm uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
              >
                Browse Collection
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* Helpful Links */}
      <section className="bg-white py-28">

        <div className="mx-auto max-w-6xl px-6 text-center">

          <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
            CONTINUE EXPLORING
          </p>

          <h2 className="mt-5 text-5xl font-extralight tracking-[-0.03em]">
            Discover COMBINE
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Continue exploring our carefully curated collections and discover timeless luxury pieces.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            <Link
              href="/shop"
              className="rounded-3xl border border-neutral-200 p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-5xl">👜</div>

              <h3 className="mt-6 text-2xl font-light">
                Bags
              </h3>

              <p className="mt-4 text-neutral-600">
                Explore our signature handbag collection.
              </p>
            </Link>

            <Link
              href="/shop?category=watches"
              className="rounded-3xl border border-neutral-200 p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-5xl">⌚</div>

              <h3 className="mt-6 text-2xl font-light">
                Watches
              </h3>

              <p className="mt-4 text-neutral-600">
                Timeless craftsmanship for every occasion.
              </p>
            </Link>

            <Link
              href="/shop?category=jewelry"
              className="rounded-3xl border border-neutral-200 p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-5xl">💍</div>

              <h3 className="mt-6 text-2xl font-light">
                Jewellery
              </h3>

              <p className="mt-4 text-neutral-600">
                Elegant pieces to complete your style.
              </p>
            </Link>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-black text-white">

        <div className="mx-auto max-w-5xl px-8 py-32 text-center">

          <p className="text-xs uppercase tracking-[0.5em] text-white/60">
            COMBINE
          </p>

          <h2 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-6xl">
            Explore Our Collection
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Discover luxury handbags, watches and jewellery curated with timeless elegance.
          </p>

          <Link
            href="/shop"
            className="mt-12 inline-flex rounded-full bg-white px-10 py-4 text-sm uppercase tracking-[0.3em] text-black transition-all duration-300 hover:scale-105 hover:bg-neutral-100"
          >
            Browse Collection
          </Link>

        </div>

      </section>

    </main>
  );
}