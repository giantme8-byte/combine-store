import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { formatWhatsAppNumber } from "@/lib/phone";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default async function ContactPage() {
const settings = await getSettings();
const whatsappLink = await getWhatsAppLink();

const whatsappDisplay = formatWhatsAppNumber(
  settings.whatsappNumber
);

  return (
    <main className="mx-auto max-w-7xl px-8 py-24">

      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center">

        <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">
          CONTACT
        </p>

        <h1 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-6xl">
          We&apos;d Love To
          <br />
          Hear From You.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-500">
          Have questions about a product?
          Contact us for the latest availability,
          pricing and personalised assistance.
        </p>

      </div>

      {/* Contact Cards */}
      <div className="mt-24 grid gap-8 lg:grid-cols-3">

        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.10)]"
        >

          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
            WhatsApp
          </p>

<h2 className="mt-5 text-3xl font-extralight">
  {whatsappDisplay}
</h2>

          <p className="mt-6 leading-8 text-neutral-600">
            Contact us directly for product enquiries,
            latest pricing and availability.
          </p>

        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/combine.premiumselection"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.10)]"
        >

          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
            Instagram
          </p>

          <h2 className="mt-5 break-all text-3xl font-extralight">
            @combine.premiumselection
          </h2>

          <p className="mt-6 leading-8 text-neutral-600">
            Follow us for new arrivals,
            featured collections and exclusive updates.
          </p>

        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/combine.premiumselection"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[32px] border border-neutral-200 bg-white p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.10)]"
        >

          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
            Facebook
          </p>

          <h2 className="mt-5 text-3xl font-extralight leading-tight">
            Combine Premium Selection
            <br />
            <span className="text-2xl">
              | Fashion & Luxury
            </span>
          </h2>

          <p className="mt-6 leading-8 text-neutral-600">
            Visit our official Facebook page for new arrivals,
            featured collections and the latest updates.
          </p>

        </a>

      </div>

            {/* Business Hours */}
      <div className="mt-20 rounded-[40px] border border-neutral-200 bg-[#fafafa] p-14 text-center">

        <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
          BUSINESS HOURS
        </p>

        <h2 className="mt-6 text-4xl font-extralight tracking-[-0.02em]">
          Monday – Sunday
        </h2>

        <p className="mt-5 text-lg text-neutral-600">
          10:00 AM – 10:00 PM
        </p>

      </div>

      {/* Support */}
      <div className="mt-24 rounded-[40px] border border-neutral-200 bg-white p-14 shadow-sm">

        <div className="max-w-3xl">

          <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
            NEED ASSISTANCE?
          </p>

          <h2 className="mt-6 text-4xl font-extralight tracking-[-0.02em]">
            We&apos;re Here To Help.
          </h2>

          <p className="mt-8 leading-8 text-neutral-600">
            Whether you&apos;re looking for additional photos,
            product information or the latest availability,
            our team is happy to assist you through WhatsApp.
          </p>

          <div className="mt-10 flex flex-wrap gap-12">

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                Average Response
              </p>

              <p className="mt-3 text-xl font-light">
                Within 30 Minutes
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                Customer Support
              </p>

              <p className="mt-3 text-xl font-light">
                7 Days A Week
              </p>

            </div>

          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-flex rounded-full bg-black px-10 py-4 text-sm uppercase tracking-[0.3em] text-white transition-all duration-300 hover:scale-105 hover:bg-neutral-800"
          >
            Chat on WhatsApp
          </a>

        </div>

      </div>

      {/* CTA */}
      <div className="mt-28 text-center">

        <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">
          DISCOVER MORE
        </p>

        <h2 className="mt-6 text-5xl font-extralight tracking-[-0.03em] md:text-6xl">
          Explore Our Collection
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-500">
          Browse our latest collection and discover timeless
          pieces curated to complement your personal style.
        </p>

        <Link
          href="/shop"
          className="mt-12 inline-flex rounded-full bg-black px-10 py-4 text-sm uppercase tracking-[0.3em] text-white transition-all duration-300 hover:scale-105 hover:bg-neutral-800"
        >
          Browse Collection
        </Link>

      </div>

    </main>
  );
}