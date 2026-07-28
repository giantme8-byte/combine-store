import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main>

      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden">

        <Image
          src="/about/hero-v2.png"
          alt="Privacy Policy"
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
              Privacy Policy
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80">
              Your privacy is important to us. This page explains how COMBINE
              collects, uses and protects your personal information.
            </p>

          </div>

        </div>

      </section>

      {/* Content */}
      <section className="bg-white py-24">

        <div className="mx-auto max-w-4xl px-6">

          <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
            PRIVACY POLICY
          </p>

          <h2 className="mt-5 text-5xl font-extralight tracking-[-0.03em]">
            Protecting Your Information
          </h2>

          <div className="mt-12 space-y-12 text-neutral-600 leading-8">

            <div>
              <h3 className="text-2xl font-light text-black">
                Information We Collect
              </h3>

              <p className="mt-4">
                We may collect information you provide when contacting us,
                placing enquiries, or communicating through WhatsApp, email
                or other supported channels.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                How We Use Your Information
              </h3>

              <p className="mt-4">
                Your information is used to respond to enquiries, provide
                customer support, process requests and improve your overall
                experience with COMBINE.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Data Protection
              </h3>

              <p className="mt-4">
                We take reasonable measures to protect your personal
                information against unauthorised access, disclosure or misuse.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Third-Party Services
              </h3>

              <p className="mt-4">
                Some services such as payment providers, shipping partners or
                communication platforms may have their own privacy policies.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-light text-black">
                Contact Us
              </h3>

              <p className="mt-4">
                If you have any questions regarding this Privacy Policy,
                please contact us through our Contact page or WhatsApp.
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
            Discover timeless handbags, watches and jewellery curated with
            elegance and exceptional craftsmanship.
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