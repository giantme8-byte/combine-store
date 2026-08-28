import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="bg-white">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative h-[72vh] min-h-[560px] overflow-hidden md:h-[80vh]">

        <Image
          src="/about/hero-v2.png"
          alt="Contact COMBINE"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center px-5 text-center text-white">

          <div className="w-full max-w-4xl">

            <p
              className="
                mb-5
                text-[10px]
                uppercase
                tracking-[0.45em]
                text-white/70
                sm:text-xs
                sm:tracking-[0.5em]
              "
            >
              CONTACT
            </p>

            <h1
              className="
                text-4xl
                font-extralight
                leading-[0.95]
                tracking-[-0.04em]
                sm:text-6xl
                md:text-8xl
                xl:text-9xl
              "
            >
              Let&apos;s Start
              <br />
              a Conversation
            </h1>

            <p
              className="
                mx-auto
                mt-7
                max-w-2xl
                text-sm
                leading-7
                text-white/80
                sm:mt-10
                sm:text-lg
                sm:leading-9
                md:text-xl
              "
            >
              Whether you&apos;re looking for a timeless handbag,
              luxury accessories, or personalised assistance,
              our team is here to help you every step of the way.
            </p>

            <div
              className="
                mt-9
                flex
                flex-col
                justify-center
                gap-3
                sm:mt-12
                sm:flex-row
                sm:gap-4
              "
            >

              <Link
                href="https://wa.me/60166620448?text=Hi%20COMBINE,%20I'm%20interested%20in%20your%20collection."
                target="_blank"
                rel="noopener noreferrer"
                className="
                  rounded-full
                  bg-white
                  px-8
                  py-3.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-black
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-neutral-100
                  sm:px-10
                  sm:py-4
                  sm:text-sm
                  sm:tracking-[0.3em]
                "
              >
                Chat on WhatsApp
              </Link>

              <Link
                href="#contact-information"
                className="
                  rounded-full
                  border
                  border-white/50
                  px-8
                  py-3.5
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-white
                  transition-all
                  duration-300
                  hover:border-white
                  hover:bg-white
                  hover:text-black
                  sm:px-10
                  sm:py-4
                  sm:text-sm
                  sm:tracking-[0.3em]
                "
              >
                Contact Information
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          CONTACT INFORMATION
      ========================================================= */}
      <section
        id="contact-information"
        className="bg-white py-20 sm:py-24 lg:py-32"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          {/* Header */}
          <div className="text-center">

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.45em]
                text-neutral-400
                sm:text-xs
              "
            >
              CONTACT INFORMATION
            </p>

            <h2
              className="
                mt-4
                text-4xl
                font-extralight
                tracking-[-0.04em]
                text-neutral-900
                sm:mt-5
                sm:text-5xl
              "
            >
              Get in Touch
            </h2>

            <div
              className="
                mx-auto
                mt-6
                h-px
                w-16
                bg-gradient-to-r
                from-transparent
                via-[#C9A86A]
                to-transparent
                sm:mt-8
                sm:w-20
              "
            />

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-sm
                leading-7
                text-neutral-600
                sm:mt-6
                sm:text-lg
                sm:leading-8
              "
            >
              Choose the most convenient way to contact us.
              Our team is always ready to assist you.
            </p>

          </div>


          {/* Contact Cards */}
          <div
            className="
              mt-12
              grid
              grid-cols-2
              gap-3
              sm:mt-20
              sm:gap-6
              xl:grid-cols-4
            "
          >

            {/* WhatsApp */}
            <Link
              href="https://wa.me/60166620448?text=Hi%20COMBINE,%20I'm%20interested%20in%20your%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                rounded-[22px]
                border
                border-neutral-200
                bg-white
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-neutral-300
                hover:shadow-xl
                sm:rounded-3xl
                sm:p-8
                lg:p-10
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-neutral-100
                  text-lg
                  sm:h-12
                  sm:w-12
                  sm:text-xl
                "
              >
                💬
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-light
                  sm:mt-6
                  sm:text-2xl
                "
              >
                WhatsApp
              </h3>

              <p
                className="
                  mt-2
                  break-words
                  text-xs
                  leading-5
                  text-neutral-600
                  sm:mt-4
                  sm:text-base
                "
              >
                +60 16-662 0448
              </p>

            </Link>


            {/* Email */}
            <Link
              href="mailto:support@combineluxe.com"
              className="
                group
                rounded-[22px]
                border
                border-neutral-200
                bg-white
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-neutral-300
                hover:shadow-xl
                sm:rounded-3xl
                sm:p-8
                lg:p-10
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-neutral-100
                  text-lg
                  sm:h-12
                  sm:w-12
                  sm:text-xl
                "
              >
                ✉️
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-light
                  sm:mt-6
                  sm:text-2xl
                "
              >
                Email
              </h3>

              <p
                className="
                  mt-2
                  break-all
                  text-xs
                  leading-5
                  text-neutral-600
                  sm:mt-4
                  sm:text-base
                "
              >
                support@combineluxe.com
              </p>

            </Link>


            {/* Business Hours */}
            <div
              className="
                rounded-[22px]
                border
                border-neutral-200
                bg-white
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-neutral-300
                hover:shadow-xl
                sm:rounded-3xl
                sm:p-8
                lg:p-10
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-neutral-100
                  text-lg
                  sm:h-12
                  sm:w-12
                  sm:text-xl
                "
              >
                🕒
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-light
                  sm:mt-6
                  sm:text-2xl
                "
              >
                Business Hours
              </h3>

              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-neutral-600
                  sm:mt-4
                  sm:text-base
                  sm:leading-7
                "
              >
                Monday – Sunday
                <br />
                10:00 AM – 10:00 PM
              </p>

            </div>


            {/* Location */}
            <div
              className="
                rounded-[22px]
                border
                border-neutral-200
                bg-white
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-neutral-300
                hover:shadow-xl
                sm:rounded-3xl
                sm:p-8
                lg:p-10
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-neutral-100
                  text-lg
                  sm:h-12
                  sm:w-12
                  sm:text-xl
                "
              >
                📍
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-light
                  sm:mt-6
                  sm:text-2xl
                "
              >
                Location
              </h3>

              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-neutral-600
                  sm:mt-4
                  sm:text-base
                "
              >
                Malaysia
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          CONTACT FORM
      ========================================================= */}
      <section
        id="contact-form"
        className="bg-[#fafafa] py-24 sm:py-32 lg:py-36"
      >

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-12
            px-5
            sm:px-8
            lg:grid-cols-2
            lg:gap-20
          "
        >

          {/* Left */}
          <div>

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.45em]
                text-neutral-400
                sm:text-xs
              "
            >
              GET IN TOUCH
            </p>

            <h2
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
              We&apos;d Love
              <br />
              to Hear
              <br />
              From You
            </h2>

            <p
              className="
                mt-7
                max-w-lg
                text-sm
                leading-7
                text-neutral-600
                sm:mt-10
                sm:text-base
                sm:leading-9
              "
            >
              Whether you have a product enquiry, need assistance
              selecting the perfect piece, or simply want to learn
              more about COMBINE, our team is always ready to assist you.
            </p>


            {/* Response Time */}
            <div
              className="
                mt-10
                rounded-[24px]
                border
                border-neutral-200
                bg-white
                p-6
                sm:mt-16
                sm:rounded-[28px]
                sm:p-8
              "
            >

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.35em]
                  text-neutral-400
                  sm:text-xs
                "
              >
                Average Response Time
              </p>

              <h3
                className="
                  mt-3
                  text-2xl
                  font-extralight
                  sm:mt-4
                  sm:text-3xl
                "
              >
                Within 24 Hours
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-neutral-600
                  sm:mt-4
                  sm:leading-8
                "
              >
                Every enquiry is reviewed carefully by our team
                to ensure timely assistance.
              </p>

            </div>

          </div>


          {/* Right */}
          <div>

            <form
              className="
                rounded-[26px]
                border
                border-neutral-200
                bg-white
                p-5
                shadow-sm
                sm:rounded-[32px]
                sm:p-8
                lg:p-10
              "
            >

              <div className="grid gap-4 sm:gap-6">

                <input
                  type="text"
                  placeholder="Full Name"
                  className="
                    h-13
                    rounded-2xl
                    border
                    border-neutral-300
                    px-5
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                  "
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="
                    h-13
                    rounded-2xl
                    border
                    border-neutral-300
                    px-5
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                  "
                />

                <input
                  type="text"
                  placeholder="WhatsApp Number"
                  className="
                    h-13
                    rounded-2xl
                    border
                    border-neutral-300
                    px-5
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                  "
                />

                <input
                  type="text"
                  placeholder="Subject"
                  className="
                    h-13
                    rounded-2xl
                    border
                    border-neutral-300
                    px-5
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                  "
                />

                <textarea
                  rows={6}
                  placeholder="Message"
                  className="
                    rounded-2xl
                    border
                    border-neutral-300
                    p-5
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                  "
                />

                <button
                  type="submit"
                  className="
                    mt-1
                    w-full
                    rounded-full
                    bg-black
                    px-8
                    py-4
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.3em]
                    text-white
                    transition-all
                    duration-300
                    hover:scale-[1.02]
                    hover:bg-neutral-800
                    sm:text-sm
                  "
                >
                  Send Message
                </button>

              </div>

            </form>

          </div>

        </div>
      </section>


      {/* =========================================================
          FAQ
      ========================================================= */}
      <section className="bg-white py-24 sm:py-32 lg:py-36">

        <div className="mx-auto max-w-5xl px-5 sm:px-8">

          {/* Header */}
          <div className="text-center">

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.45em]
                text-neutral-400
                sm:text-xs
              "
            >
              FAQ
            </p>

            <h2
              className="
                mt-5
                text-4xl
                font-extralight
                leading-tight
                tracking-[-0.04em]
                sm:text-5xl
                md:text-6xl
              "
            >
              Frequently Asked
              <br />
              Questions
            </h2>

            <p
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-sm
                leading-7
                text-neutral-600
                sm:mt-8
                sm:text-lg
                sm:leading-8
              "
            >
              Find answers to some of the most common questions
              about our products, ordering process and customer service.
            </p>

          </div>


          {/* FAQ Items */}
          <div className="mt-12 space-y-4 sm:mt-20 sm:space-y-6">

            <div
              className="
                rounded-[22px]
                border
                border-neutral-200
                p-5
                sm:rounded-[28px]
                sm:p-8
              "
            >
              <h3 className="text-lg font-light sm:text-2xl">
                How can I place an order?
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-neutral-600
                  sm:mt-4
                  sm:text-base
                  sm:leading-8
                "
              >
                Browse our collection, choose your preferred item
                and contact us via WhatsApp. Our team will guide you
                through the ordering process.
              </p>
            </div>


            <div
              className="
                rounded-[22px]
                border
                border-neutral-200
                p-5
                sm:rounded-[28px]
                sm:p-8
              "
            >
              <h3 className="text-lg font-light sm:text-2xl">
                How long does delivery take?
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-neutral-600
                  sm:mt-4
                  sm:text-base
                  sm:leading-8
                "
              >
                Delivery times may vary depending on the destination
                and product availability. Estimated delivery details
                will be provided before your order is confirmed.
              </p>
            </div>


            <div
              className="
                rounded-[22px]
                border
                border-neutral-200
                p-5
                sm:rounded-[28px]
                sm:p-8
              "
            >
              <h3 className="text-lg font-light sm:text-2xl">
                Can I enquire before placing an order?
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-neutral-600
                  sm:mt-4
                  sm:text-base
                  sm:leading-8
                "
              >
                Absolutely. We encourage customers to contact us
                if they have any questions about our products,
                sizes, colours or availability.
              </p>
            </div>


            <div
              className="
                rounded-[22px]
                border
                border-neutral-200
                p-5
                sm:rounded-[28px]
                sm:p-8
              "
            >
              <h3 className="text-lg font-light sm:text-2xl">
                Do you provide customer support?
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-neutral-600
                  sm:mt-4
                  sm:text-base
                  sm:leading-8
                "
              >
                Yes. Our team is available to assist you before,
                during and after your purchase to ensure a smooth
                shopping experience.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="bg-black text-white">

        <div
          className="
            mx-auto
            max-w-5xl
            px-5
            py-24
            text-center
            sm:px-8
            sm:py-32
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.5em]
              text-white/60
              sm:text-xs
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
              text-sm
              leading-7
              text-white/70
              sm:mt-8
              sm:text-lg
              sm:leading-8
            "
          >
            Browse our latest collection and discover timeless pieces
            curated for those who appreciate exceptional style.
          </p>

          <Link
            href="/shop"
            className="
              mt-9
              inline-flex
              rounded-full
              bg-white
              px-8
              py-3.5
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-black
              transition-all
              duration-300
              hover:scale-105
              hover:bg-neutral-100
              sm:mt-12
              sm:px-10
              sm:py-4
              sm:text-sm
            "
          >
            Browse Collection
          </Link>

        </div>

      </section>

    </main>
  );
}