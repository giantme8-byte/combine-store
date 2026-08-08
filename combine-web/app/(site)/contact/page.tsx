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
    <main
      className="
        mx-auto
        max-w-7xl
        px-5
        py-16
        sm:px-8
        sm:py-24
        lg:px-8
        lg:py-28
      "
    >
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center">
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.45em]
            text-neutral-400
            sm:text-xs
            sm:tracking-[0.5em]
          "
        >
          CONTACT
        </p>

        <h1
          className="
            mt-5
            text-4xl
            font-extralight
            leading-[1.05]
            tracking-[-0.04em]
            sm:mt-6
            sm:text-5xl
            md:text-6xl
          "
        >
          We&apos;d Love To
          <br />
          Hear From You.
        </h1>

        <p
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-[15px]
            leading-7
            text-neutral-500
            sm:mt-8
            sm:text-lg
            sm:leading-8
          "
        >
          Have questions about a product?
          Contact us for the latest availability,
          pricing and personalised assistance.
        </p>
      </div>

      {/* Contact Cards */}
      <div
        className="
          mt-14
          grid
          gap-4
          sm:mt-20
          sm:gap-8
          lg:grid-cols-3
        "
      >
        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            rounded-[24px]
            border
            border-neutral-200
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-[0_30px_80px_rgba(0,0,0,0.10)]
            sm:rounded-[32px]
            sm:p-10
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-neutral-400
              sm:text-xs
              sm:tracking-[0.4em]
            "
          >
            WhatsApp
          </p>

          <h2
            className="
              mt-4
              text-2xl
              font-extralight
              tracking-[-0.02em]
              sm:mt-5
              sm:text-3xl
            "
          >
            {whatsappDisplay}
          </h2>

          <p
            className="
              mt-4
              text-[14px]
              leading-7
              text-neutral-600
              sm:mt-6
              sm:leading-8
            "
          >
            Contact us directly for product enquiries,
            latest pricing and availability.
          </p>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/combine.premiumselection"
          target="_blank"
          rel="noopener noreferrer"
          className="
            rounded-[24px]
            border
            border-neutral-200
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-[0_30px_80px_rgba(0,0,0,0.10)]
            sm:rounded-[32px]
            sm:p-10
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-neutral-400
              sm:text-xs
              sm:tracking-[0.4em]
            "
          >
            Instagram
          </p>

          <h2
            className="
              mt-4
              break-all
              text-2xl
              font-extralight
              tracking-[-0.02em]
              sm:mt-5
              sm:text-3xl
            "
          >
            @combine.premiumselection
          </h2>

          <p
            className="
              mt-4
              text-[14px]
              leading-7
              text-neutral-600
              sm:mt-6
              sm:leading-8
            "
          >
            Follow us for new arrivals,
            featured collections and exclusive updates.
          </p>
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/combine.premiumselection"
          target="_blank"
          rel="noopener noreferrer"
          className="
            rounded-[24px]
            border
            border-neutral-200
            bg-white
            p-6
            shadow-sm
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-[0_30px_80px_rgba(0,0,0,0.10)]
            sm:rounded-[32px]
            sm:p-10
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-neutral-400
              sm:text-xs
              sm:tracking-[0.4em]
            "
          >
            Facebook
          </p>

          <h2
            className="
              mt-4
              text-2xl
              font-extralight
              leading-tight
              tracking-[-0.02em]
              sm:mt-5
              sm:text-3xl
            "
          >
            Combine Premium Selection
            <br />
            <span className="text-xl sm:text-2xl">
              | Fashion &amp; Luxury
            </span>
          </h2>

          <p
            className="
              mt-4
              text-[14px]
              leading-7
              text-neutral-600
              sm:mt-6
              sm:leading-8
            "
          >
            Visit our official Facebook page for new arrivals,
            featured collections and the latest updates.
          </p>
        </a>
      </div>

      {/* Business Hours */}
      <div
        className="
          mt-14
          rounded-[28px]
          border
          border-neutral-200
          bg-[#fafafa]
          p-8
          text-center
          sm:mt-20
          sm:rounded-[40px]
          sm:p-14
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.4em]
            text-neutral-400
            sm:text-xs
            sm:tracking-[0.45em]
          "
        >
          BUSINESS HOURS
        </p>

        <h2
          className="
            mt-5
            text-3xl
            font-extralight
            tracking-[-0.03em]
            sm:mt-6
            sm:text-4xl
          "
        >
          Monday – Sunday
        </h2>

        <p
          className="
            mt-4
            text-base
            text-neutral-600
            sm:mt-5
            sm:text-lg
          "
        >
          10:00 AM – 10:00 PM
        </p>
      </div>

      {/* Support */}
      <div
        className="
          mt-16
          rounded-[28px]
          border
          border-neutral-200
          bg-white
          p-8
          shadow-sm
          sm:mt-24
          sm:rounded-[40px]
          sm:p-14
        "
      >
        <div className="max-w-3xl">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.4em]
              text-neutral-400
              sm:text-xs
              sm:tracking-[0.45em]
            "
          >
            NEED ASSISTANCE?
          </p>

          <h2
            className="
              mt-5
              text-3xl
              font-extralight
              tracking-[-0.03em]
              sm:mt-6
              sm:text-4xl
            "
          >
            We&apos;re Here To Help.
          </h2>

          <p
            className="
              mt-6
              text-[15px]
              leading-7
              text-neutral-600
              sm:mt-8
              sm:leading-8
            "
          >
            Whether you&apos;re looking for additional photos,
            product information or the latest availability,
            our team is happy to assist you through WhatsApp.
          </p>

          <div
            className="
              mt-8
              grid
              grid-cols-2
              gap-6
              sm:mt-10
              sm:flex
              sm:flex-wrap
              sm:gap-12
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-neutral-400
                  sm:text-xs
                  sm:tracking-[0.35em]
                "
              >
                Average Response
              </p>

              <p
                className="
                  mt-2
                  text-base
                  font-light
                  sm:mt-3
                  sm:text-xl
                "
              >
                Within 30 Minutes
              </p>
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-neutral-400
                  sm:text-xs
                  sm:tracking-[0.35em]
                "
              >
                Customer Support
              </p>

              <p
                className="
                  mt-2
                  text-base
                  font-light
                  sm:mt-3
                  sm:text-xl
                "
              >
                7 Days A Week
              </p>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-9
              inline-flex
              rounded-full
              bg-black
              px-8
              py-3.5
              text-[11px]
              uppercase
              tracking-[0.25em]
              text-white
              transition-all
              duration-300
              hover:scale-105
              hover:bg-neutral-800
              sm:mt-12
              sm:px-10
              sm:py-4
              sm:text-sm
              sm:tracking-[0.3em]
            "
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* CTA */}
      <div
        className="
          mt-20
          text-center
          sm:mt-28
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.45em]
            text-neutral-400
            sm:text-xs
            sm:tracking-[0.5em]
          "
        >
          DISCOVER MORE
        </p>

        <h2
          className="
            mt-5
            text-4xl
            font-extralight
            tracking-[-0.04em]
            sm:mt-6
            sm:text-5xl
            md:text-6xl
          "
        >
          Explore Our Collection
        </h2>

        <p
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-[15px]
            leading-7
            text-neutral-500
            sm:mt-8
            sm:text-lg
            sm:leading-8
          "
        >
          Browse our latest collection and discover timeless
          pieces curated to complement your personal style.
        </p>

        <Link
          href="/shop"
          className="
            mt-9
            inline-flex
            rounded-full
            bg-black
            px-8
            py-3.5
            text-[11px]
            uppercase
            tracking-[0.25em]
            text-white
            transition-all
            duration-300
            hover:scale-105
            hover:bg-neutral-800
            sm:mt-12
            sm:px-10
            sm:py-4
            sm:text-sm
            sm:tracking-[0.3em]
          "
        >
          Browse Collection
        </Link>
      </div>
    </main>
  );
}