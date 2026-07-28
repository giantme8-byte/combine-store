import Image from "next/image";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <main>

      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden">

        <Image
          src="/about/hero-v2.png"
          alt="Terms & Conditions"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute inset-0 flex items-center justify-center text-center text-white">

          <div className="max-w-4xl px-6">

            <p className="text-xs uppercase tracking-[0.5em] text-white/70">
              LEGAL
            </p>

            <h1 className="mt-6 text-6xl font-extralight tracking-[-0.04em] md:text-8xl">
              Terms & Conditions
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80">
              Please read these Terms & Conditions carefully before using
              our website or submitting an enquiry.
            </p>

          </div>

        </div>

      </section>

      {/* Content */}
      <section className="bg-white py-24">

        <div className="mx-auto max-w-4xl px-6">

          <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
            TERMS & CONDITIONS
          </p>

          <h2 className="mt-5 text-5xl font-extralight tracking-[-0.03em]">
            Website Terms of Use
          </h2>

          <div className="mt-12 space-y-12 leading-8 text-neutral-600">

            <div>
              <h3 className="text-2xl font-light text-black">
                Acceptance of Terms
              </h3>

              <p className="mt-4">
                By accessing or using the COMBINE website, you agree to be
                bound by these Terms & Conditions. If you do not agree with
                any part of these terms, please discontinue using our website.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Product Information
              </h3>

              <p className="mt-4">
                We make every effort to ensure that product descriptions,
                images and specifications are presented accurately. However,
                colours, dimensions and product appearance may vary slightly
                depending on display settings and manufacturing updates.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Orders & Enquiries
              </h3>

              <p className="mt-4">
                Submitting an enquiry through our website or WhatsApp does
                not constitute a confirmed order. Orders are considered
                confirmed only after all details have been agreed upon by
                both parties.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Pricing & Availability
              </h3>

              <p className="mt-4">
                Product availability and pricing may change without prior
                notice. We reserve the right to update information whenever
                necessary.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Intellectual Property
              </h3>

              <p className="mt-4">
                All content on this website, including text, photographs,
                graphics, logos and layout, is protected by applicable
                intellectual property laws and may not be copied,
                reproduced or distributed without prior written permission.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Limitation of Liability
              </h3>

              <p className="mt-4">
                COMBINE shall not be liable for any indirect, incidental or
                consequential damages arising from the use of this website or
                reliance on the information provided.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Changes to These Terms
              </h3>

              <p className="mt-4">
                We reserve the right to modify these Terms & Conditions at
                any time. Updated versions will be published on this page.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Contact Us
              </h3>

              <p className="mt-4">
                If you have any questions regarding these Terms &
                Conditions, please contact us via our Contact page or
                WhatsApp.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-black text-white">

        <div className="mx-auto max-w-5xl px-8 py-28 text-center">

          <p className="text-xs uppercase tracking-[0.5em] text-white/60">
            COMBINE
          </p>

          <h2 className="mt-6 text-5xl font-extralight">
            Explore Our Collection
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Discover timeless handbags, watches and jewellery curated
            with elegance and exceptional craftsmanship.
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