import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main>

{/* Hero */}
<section className="relative h-[80vh] overflow-hidden">

  <Image
    src="/about/hero-v2.png"
    alt="Contact COMBINE"
    fill
    priority
    className="object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/45" />

  {/* Gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

  {/* Content */}
  <div className="absolute inset-0 flex items-center justify-center text-center text-white">

    <div className="max-w-4xl px-6">

      <p className="mb-6 text-xs uppercase tracking-[0.5em] text-white/70">
        CONTACT
      </p>

      <h1 className="text-6xl font-extralight leading-none tracking-[-0.04em] md:text-8xl xl:text-9xl">
        Let&apos;s Start
        <br />
        a Conversation
      </h1>

      <p className="mx-auto mt-10 max-w-2xl text-lg leading-9 text-white/80 md:text-xl">
        Whether you&apos;re looking for a timeless handbag, luxury accessories,
        or personalised assistance, our team is here to help you every step
        of the way.
      </p>

      <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">

<Link
  href="https://wa.me/60166620448?text=Hi%20COMBINE,%20I'm%20interested%20in%20your%20collection."
  target="_blank"
  rel="noopener noreferrer"
  className="rounded-full bg-white px-10 py-4 text-sm font-medium uppercase tracking-[0.3em] text-black transition-all duration-300 hover:scale-105 hover:bg-neutral-100"
>
  Chat on WhatsApp
</Link>

<Link
  href="#contact-information"
  className="rounded-full border border-white/50 px-10 py-4 text-sm uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
>
  Contact Information
</Link>

      </div>

    </div>

  </div>

</section>

{/* Contact Information */}
<section
  id="contact-information"
  className="bg-white py-24"
>
  <div className="mx-auto max-w-7xl px-6">

    <div className="text-center">

      <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
        CONTACT INFORMATION
      </p>

      <h2 className="mt-5 text-5xl font-extralight tracking-[-0.03em] text-neutral-900">
        Get in Touch
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
        Choose the most convenient way to contact us.
        Our team is always ready to assist you.
      </p>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

      <Link
        href="https://wa.me/60166620448?text=Hi%20COMBINE,%20I'm%20interested%20in%20your%20collection."
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-3xl border border-neutral-200 p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="text-4xl">💬</div>

        <h3 className="mt-6 text-2xl font-light">
          WhatsApp
        </h3>

        <p className="mt-4 text-neutral-600">
          +60 16-662 0448
        </p>
      </Link>

      <Link
        href="mailto:support@combine.com"
        className="block rounded-3xl border border-neutral-200 p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="text-4xl">✉️</div>

        <h3 className="mt-6 text-2xl font-light">
          Email
        </h3>

        <p className="mt-4 text-neutral-600">
          support@combine.com
        </p>
      </Link>

      <div className="rounded-3xl border border-neutral-200 p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="text-4xl">🕒</div>

        <h3 className="mt-6 text-2xl font-light">
          Business Hours
        </h3>

        <p className="mt-4 text-neutral-600">
          Monday – Sunday
          <br />
          10:00 AM – 10:00 PM
        </p>
      </div>

      <div className="rounded-3xl border border-neutral-200 p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="text-4xl">📍</div>

        <h3 className="mt-6 text-2xl font-light">
          Location
        </h3>

        <p className="mt-4 text-neutral-600">
        Malaysia
        </p>
      </div>

    </div>

  </div>
</section>

{/* Contact Form */}
<section
  id="contact-form"
  className="bg-[#fafafa] py-36"
>
  <div className="mx-auto grid max-w-7xl gap-20 px-8 lg:grid-cols-2">

    {/* Left */}
    <div>

      <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
        GET IN TOUCH
      </p>

      <h2 className="mt-6 text-5xl font-extralight leading-tight tracking-[-0.03em] md:text-6xl">
        We&apos;d Love
        <br />
        to Hear
        <br />
        From You
      </h2>

      <p className="mt-10 max-w-lg leading-9 text-neutral-600">
        Whether you have a product enquiry, need assistance
        selecting the perfect piece, or simply want to learn more
        about COMBINE, our team is always ready to assist you.
      </p>

      <div className="mt-16 rounded-[28px] border border-neutral-200 bg-white p-8">

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
          Average Response Time
        </p>

        <h3 className="mt-4 text-3xl font-extralight">
          Within 24 Hours
        </h3>

        <p className="mt-4 leading-8 text-neutral-600">
          Every enquiry is reviewed carefully by our team to ensure timely assistance.
        </p>

      </div>

    </div>

    {/* Right */}
    <div>

      <form className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm">

        <div className="grid gap-6">

          <input
            type="text"
            placeholder="Full Name"
            className="h-14 rounded-2xl border border-neutral-300 px-5 outline-none transition focus:border-black"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="h-14 rounded-2xl border border-neutral-300 px-5 outline-none transition focus:border-black"
          />

          <input
            type="text"
            placeholder="WhatsApp Number"
            className="h-14 rounded-2xl border border-neutral-300 px-5 outline-none transition focus:border-black"
          />

          <input
            type="text"
            placeholder="Subject"
            className="h-14 rounded-2xl border border-neutral-300 px-5 outline-none transition focus:border-black"
          />

          <textarea
            rows={6}
            placeholder="Message"
            className="rounded-2xl border border-neutral-300 p-5 outline-none transition focus:border-black"
          />

<button
  type="submit"
  className="mt-2 w-full rounded-full bg-black px-8 py-4 text-sm font-medium uppercase tracking-[0.3em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-800"
>
  Send Message
</button>

        </div>

      </form>

    </div>

  </div>
</section>

{/* FAQ */}
<section className="bg-white py-36">

  <div className="mx-auto max-w-5xl px-8">

    <div className="text-center">

      <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
        FAQ
      </p>

      <h2 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-6xl">
        Frequently Asked
        <br />
        Questions
      </h2>

      <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
        Find answers to some of the most common questions about our
        products, ordering process and customer service.
      </p>

    </div>

    <div className="mt-20 space-y-6">

      <div className="rounded-[28px] border border-neutral-200 p-8">
        <h3 className="text-2xl font-light">
          How can I place an order?
        </h3>

        <p className="mt-4 leading-8 text-neutral-600">
          Browse our collection, choose your preferred item and contact us
          via WhatsApp. Our team will guide you through the ordering process.
        </p>
      </div>

      <div className="rounded-[28px] border border-neutral-200 p-8">
        <h3 className="text-2xl font-light">
          How long does delivery take?
        </h3>

        <p className="mt-4 leading-8 text-neutral-600">
          Delivery times may vary depending on the destination and product
          availability. Estimated delivery details will be provided before
          your order is confirmed.
        </p>
      </div>

      <div className="rounded-[28px] border border-neutral-200 p-8">
        <h3 className="text-2xl font-light">
          Can I enquire before placing an order?
        </h3>

        <p className="mt-4 leading-8 text-neutral-600">
          Absolutely. We encourage customers to contact us if they have any
          questions about our products, sizes, colours or availability.
        </p>
      </div>

      <div className="rounded-[28px] border border-neutral-200 p-8">
        <h3 className="text-2xl font-light">
          Do you provide customer support?
        </h3>

        <p className="mt-4 leading-8 text-neutral-600">
          Yes. Our team is available to assist you before, during and after
          your purchase to ensure a smooth shopping experience.
        </p>
      </div>

    </div>

  </div>

</section>

      {/* CTA */}
      <section className="bg-black text-white">

        <div className="mx-auto max-w-5xl px-8 py-32 text-center">

          <p className="text-xs uppercase tracking-[0.5em] text-white/60">
            DISCOVER MORE
          </p>

          <h2 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-6xl">
            Explore Our Collection
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Browse our latest collection and discover timeless pieces
            curated for those who appreciate exceptional style.
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