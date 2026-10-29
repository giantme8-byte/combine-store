import Image from "next/image";
import Link from "next/link";

const principles = [
  {
    number: "01",
    title: "Considered Design",
    text: "We are drawn to distinctive silhouettes, thoughtful details, and pieces with a clear sense of identity.",
  },
  {
    number: "02",
    title: "Personal Expression",
    text: "Style is personal. Our collection is designed to help you discover pieces that feel true to your own taste.",
  },
  {
    number: "03",
    title: "A Lasting Point of View",
    text: "Beyond passing moments, we look for enduring appeal, versatility, and character that continues to feel relevant.",
  },
];

const standards = [
  {
    number: "01",
    title: "Design",
    text: "A thoughtful balance of form, proportion, and detail.",
  },
  {
    number: "02",
    title: "Selection",
    text: "A considered edit across bags, watches, jewellery, shoes, and accessories.",
  },
  {
    number: "03",
    title: "Guidance",
    text: "Personal assistance to help you explore the collection and make an informed choice.",
  },
  {
    number: "04",
    title: "Experience",
    text: "A clear, attentive enquiry process from your first question to order arrangements.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white text-neutral-900">
      {/* HERO */}
      <section className="relative min-h-[650px] overflow-hidden sm:min-h-[720px] lg:min-h-[820px]">
        <Image
          src="/about/hero-v2.png"
          alt="The COMBINE collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-5 py-24 sm:min-h-[720px] sm:px-8 lg:min-h-[820px]">
          <div className="max-w-4xl text-white">
            <p className="mb-6 text-[10px] uppercase tracking-[0.45em] text-white/70 sm:mb-8 sm:text-xs sm:tracking-[0.55em]">
              The World of COMBINE
            </p>
            <h1 className="max-w-4xl text-5xl font-extralight leading-[0.94] tracking-[-0.055em] sm:text-7xl md:text-8xl lg:text-[7.5rem]">
              A Considered
              <br />
              Expression of
              <br />
              Style.
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/80 sm:mt-9 sm:text-lg sm:leading-9">
              Discover a curated world of bags, watches, jewellery, shoes, and
              accessories chosen for their design, character, and individuality.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:mt-11 sm:flex-row sm:gap-4">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-black transition-colors duration-300 hover:bg-neutral-200 sm:px-10 sm:text-xs"
              >
                Explore the Collection
              </Link>
              <Link
                href="#our-approach"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-8 py-4 text-[10px] uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:border-white hover:bg-white/10 sm:px-10 sm:text-xs"
              >
                Discover COMBINE
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 z-10 px-5 sm:bottom-9 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between border-t border-white/25 pt-4 text-[9px] uppercase tracking-[0.28em] text-white/65 sm:pt-5 sm:text-[10px]">
            <span>Curated for Individuality</span>
            <span>COMBINE / About</span>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section id="our-approach" className="py-20 sm:py-28 lg:py-36">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 sm:text-xs sm:tracking-[0.45em]">
              A Note on COMBINE
            </p>
            <div className="mt-6 h-px w-14 bg-[#C9A86A]" />
          </div>
          <div>
            <h2 className="max-w-4xl text-3xl font-extralight leading-[1.12] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Personal style begins with pieces that speak to you.
            </h2>
            <div className="mt-7 max-w-2xl space-y-5 text-sm leading-7 text-neutral-600 sm:mt-10 sm:space-y-6 sm:text-base sm:leading-8">
              <p>
                COMBINE brings together a considered selection of fashion and
                lifestyle pieces for those who appreciate distinctive design
                and individual expression.
              </p>
              <p>
                We believe exploring a collection should feel inspiring rather
                than overwhelming. Our aim is to make it easier to discover
                pieces that suit your preferences, complement your style, and
                feel right for the way you choose to express yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE EDITORIAL */}
      <section className="relative grid min-h-[560px] bg-[#171614] lg:min-h-[680px] lg:grid-cols-2">
        <div className="relative min-h-[360px] overflow-hidden sm:min-h-[480px] lg:min-h-[680px]">
          <Image
            src="/about/about-1-v2.png"
            alt="A closer look at the COMBINE collection"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center px-6 py-14 text-white sm:px-10 sm:py-20 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.45em] text-white/50 sm:text-xs">
              The COMBINE Perspective
            </p>
            <h2 className="mt-6 text-4xl font-extralight leading-[1.04] tracking-[-0.045em] sm:mt-8 sm:text-6xl">
              Style is found
              <br />
              in the details.
            </h2>
            <div className="mt-7 h-px w-14 bg-[#C9A86A] sm:mt-9" />
            <p className="mt-7 text-sm leading-7 text-white/70 sm:mt-9 sm:text-base sm:leading-8">
              From the shape of a silhouette to the finishing touches, details
              help define the character of a piece. We bring together a varied
              collection so you can explore different expressions of style in
              one considered destination.
            </p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-[#f8f7f4] py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.45em] text-neutral-400 sm:text-xs">
              Our Philosophy
            </p>
            <h2 className="mt-5 text-4xl font-extralight leading-[1.03] tracking-[-0.05em] sm:mt-7 sm:text-6xl md:text-7xl">
              A little less noise.
              <br />
              A little more meaning.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-600 sm:mt-8 sm:text-base sm:leading-8">
              We want the experience of discovering something new to feel
              thoughtful, personal, and easy to navigate.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:mt-20 lg:grid-cols-3 lg:gap-12">
            {principles.map((item) => (
              <article
                key={item.number}
                className="border-t border-neutral-300 pt-5 sm:pt-7"
              >
                <span className="text-[10px] tracking-[0.25em] text-neutral-400">
                  {item.number}
                </span>
                <h3 className="mt-6 text-2xl font-light tracking-[-0.03em] sm:mt-8 sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-600 sm:mt-5 sm:leading-8">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CURATION */}
      <section className="py-20 sm:py-28 lg:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <div className="relative min-h-[430px] overflow-hidden bg-neutral-100 sm:min-h-[560px] lg:min-h-[680px]">
            <Image
              src="/about/about-2-v2.png"
              alt="Selected details from the COMBINE collection"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:py-10">
            <p className="text-[10px] uppercase tracking-[0.45em] text-neutral-400 sm:text-xs">
              The Collection
            </p>
            <h2 className="mt-5 text-4xl font-extralight leading-[1.04] tracking-[-0.045em] sm:mt-7 sm:text-6xl">
              Find your own
              <br />
              point of view.
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-7 text-neutral-600 sm:mt-9 sm:text-base sm:leading-8">
              Explore bags, watches, jewellery, shoes, and accessories across
              a range of styles. Whether you know exactly what you are looking
              for or are simply browsing for inspiration, COMBINE invites you
              to discover the pieces that feel most like you.
            </p>
            <div className="mt-9 space-y-0 border-t border-neutral-200 sm:mt-12">
              {[
                "Bags & Small Leather Goods",
                "Watches & Jewellery",
                "Shoes & Accessories",
              ].map((label, index) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-neutral-200 py-4 sm:py-5"
                >
                  <span className="text-sm text-neutral-700 sm:text-base">
                    {label}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] text-neutral-400">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-3 border-b border-neutral-900 pb-2 text-[10px] uppercase tracking-[0.25em] transition-colors hover:border-[#C9A86A] hover:text-neutral-500 sm:mt-10 sm:text-xs"
            >
              Browse the Collection <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* OUR STANDARDS */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="px-5 py-16 sm:px-8 sm:py-24 lg:border-r lg:border-neutral-200 lg:py-32">
            <p className="text-[10px] uppercase tracking-[0.45em] text-neutral-400 sm:text-xs">
              What Matters to Us
            </p>
            <h2 className="mt-6 max-w-xl text-4xl font-extralight leading-[1.05] tracking-[-0.045em] sm:text-6xl">
              The experience matters as much as the discovery.
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-neutral-600 sm:mt-9 sm:text-base sm:leading-8">
              We aim to make every step clear and welcoming, with product
              information and personal assistance available when you need it.
            </p>
          </div>
          <div className="px-5 pb-16 sm:px-8 sm:pb-24 lg:py-32">
            <div className="divide-y divide-neutral-200">
              {standards.map((item) => (
                <div
                  key={item.number}
                  className="grid grid-cols-[38px_1fr] gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[50px_1fr] sm:gap-6 sm:py-7"
                >
                  <span className="pt-1 text-[10px] tracking-[0.2em] text-neutral-400">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-light sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-neutral-600 sm:mt-3 sm:leading-8">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="bg-[#f8f7f4] px-5 py-20 text-center sm:px-8 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 sm:text-xs">
            COMBINE
          </p>
          <h2 className="mt-6 text-4xl font-extralight leading-[1.02] tracking-[-0.055em] sm:mt-8 sm:text-6xl md:text-8xl">
            Discover thoughtfully.
            <br />
            Choose personally.
          </h2>
          <div className="mx-auto mt-8 h-px w-16 bg-[#C9A86A] sm:mt-11 sm:w-20" />
          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-neutral-600 sm:mt-9 sm:text-lg sm:leading-9">
            A considered collection for individual style — and the pleasure of
            finding a piece that feels right for you.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#171614] text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-28 lg:py-32">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/50 sm:text-xs">
            Your Next Discovery
          </p>
          <h2 className="mt-6 text-4xl font-extralight leading-[1.05] tracking-[-0.045em] sm:mt-8 sm:text-6xl md:text-7xl">
            Something here
            <br />
            may speak to you.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:mt-8 sm:text-lg sm:leading-8">
            Explore the COMBINE collection and discover a piece that reflects
            your own sense of style.
          </p>
          <Link
            href="/shop"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-black transition-colors duration-300 hover:bg-neutral-200 sm:mt-12 sm:px-10 sm:text-xs"
          >
            Explore the Collection
          </Link>
        </div>
      </section>
    </main>
  );
}
