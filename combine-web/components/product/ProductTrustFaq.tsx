"use client";

import {
  ChevronDown,
  MessageCircle,
  Package,
  CreditCard,
  Truck,
  Clock3,
  RefreshCcw,
  ShieldCheck,
  Headphones,
} from "lucide-react";

import { useState } from "react";


// ============================================================
// FAQ DATA
// ============================================================

const faqItems = [
  {
    icon: Package,
    question: "How to Order?",
    answer:
      "Select your preferred product options and contact us through WhatsApp. Our team will assist you with the latest price, availability, and order details.",
  },

  {
    icon: CreditCard,
    question: "Payment Methods",
    answer:
      "Payment details will be provided by our team after your order is confirmed. Please contact us through WhatsApp for the available payment options.",
  },

  {
    icon: Truck,
    question: "Shipping",
    answer:
      "Orders are carefully prepared and shipped to your delivery address. Shipping arrangements and estimated delivery details will be confirmed before your order is completed.",
  },

  {
    icon: Clock3,
    question: "Pre-order / Ready Stock",
    answer:
      "Product availability may vary. Some items are available for ready stock while selected items are offered on a pre-order basis. Please contact us to confirm current availability.",
  },

  {
    icon: Clock3,
    question: "Estimated Delivery",
    answer:
      "Estimated delivery time depends on product availability and shipping arrangements. Our team will provide you with the latest estimated delivery timeline before your order is confirmed.",
  },

  {
    icon: RefreshCcw,
    question: "Exchange / Return",
    answer:
      "Exchange and return requests are subject to our store policy and product condition. Please contact our team as soon as possible if you experience any issue with your order.",
  },

  {
    icon: ShieldCheck,
    question: "Product Quality",
    answer:
      "Every item is carefully selected and checked before being prepared for delivery. Product specifications, condition, and available options will be confirmed with you before your order is completed.",
  },

  {
    icon: Headphones,
    question: "Customer Support",
    answer:
      "Our team is available to assist you with product information, availability, ordering, payment, and shipping enquiries. Simply contact us through WhatsApp.",
  },
];


// ============================================================
// COMPONENT
// ============================================================

export default function ProductTrustFaq() {

  const [
    openIndex,
    setOpenIndex,
  ] = useState<number | null>(
    null
  );


  return (
    <section
      className="
        mt-20
        border-t
        border-neutral-200
        pt-16
        sm:mt-24
        sm:pt-20
        lg:mt-28
        lg:pt-24
      "
    >

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div
        className="
          mx-auto
          max-w-3xl
          text-center
        "
      >

        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.45em]
            text-neutral-400
            sm:text-xs
            sm:tracking-[0.55em]
          "
        >
          THE COMBINE EXPERIENCE
        </p>


        <h2
          className="
            mt-5
            text-3xl
            font-extralight
            leading-tight
            tracking-[-0.045em]
            text-neutral-900
            sm:text-4xl
            lg:text-5xl
          "
        >
          Everything You Need to Know
        </h2>


        <div
          className="
            mx-auto
            mt-7
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
          "
        />


        <p
          className="
            mx-auto
            mt-7
            max-w-2xl
            text-[13px]
            leading-7
            text-neutral-500
            sm:mt-8
            sm:text-base
            sm:leading-8
          "
        >
          From ordering and payment to shipping and
          after-sales support, our team is here to make
          your COMBINE experience simple and seamless.
        </p>

      </div>


      {/* ===================================================== */}
      {/* FAQ */}
      {/* ===================================================== */}

      <div
        className="
          mx-auto
          mt-12
          max-w-4xl
          border-t
          border-neutral-200
          sm:mt-16
        "
      >

        {faqItems.map(
          (
            item,
            index
          ) => {

            const Icon =
              item.icon;

            const isOpen =
              openIndex ===
              index;


            return (
              <div
                key={
                  item.question
                }
                className="
                  border-b
                  border-neutral-200
                "
              >

                {/* ================================================= */}
                {/* QUESTION */}
                {/* ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(
                      isOpen
                        ? null
                        : index
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-6
                    py-6
                    text-left
                    sm:py-7
                  "
                >

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-4
                      sm:gap-5
                    "
                  >

                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-neutral-200
                        text-[#A88755]
                        sm:h-10
                        sm:w-10
                      "
                    >

                      <Icon
                        className="
                          h-4
                          w-4
                        "
                        strokeWidth={
                          1.5
                        }
                      />

                    </span>


                    <span
                      className="
                        text-sm
                        font-light
                        tracking-[-0.01em]
                        text-neutral-900
                        sm:text-base
                      "
                    >
                      {item.question}
                    </span>

                  </div>


                  <ChevronDown
                    className={`
                      h-4
                      w-4
                      shrink-0
                      text-neutral-400
                      transition-transform
                      duration-300
                      ${
                        isOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                    strokeWidth={
                      1.5
                    }
                  />

                </button>


                {/* ================================================= */}
                {/* ANSWER */}
                {/* ================================================= */}

                <div
                  className={`
                    grid
                    transition-all
                    duration-300
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >

                  <div
                    className="
                      overflow-hidden
                    "
                  >

                    <div
                      className="
                        pb-7
                        pl-14
                        pr-8
                        sm:pl-[60px]
                        sm:pr-12
                      "
                    >

                      <p
                        className="
                          max-w-3xl
                          text-[13px]
                          leading-7
                          text-neutral-500
                          sm:text-sm
                          sm:leading-7
                        "
                      >
                        {item.answer}
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>


      {/* ===================================================== */}
      {/* WHATSAPP CTA */}
      {/* ===================================================== */}

      <div
        className="
          mx-auto
          mt-12
          max-w-4xl
          rounded-3xl
          border
          border-neutral-200
          bg-neutral-50
          px-6
          py-8
          text-center
          sm:mt-16
          sm:px-10
          sm:py-10
        "
      >

        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.4em]
            text-neutral-400
          "
        >
          NEED ASSISTANCE?
        </p>


        <h3
          className="
            mt-3
            text-xl
            font-extralight
            tracking-[-0.02em]
            text-neutral-900
            sm:text-2xl
          "
        >
          Our Concierge Team Is Here to Help
        </h3>


        <p
          className="
            mx-auto
            mt-3
            max-w-xl
            text-[13px]
            leading-6
            text-neutral-500
          "
        >
          Have a question about this product,
          availability, or ordering?
          Contact us directly through WhatsApp.
        </p>


        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-6
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            bg-black
            px-7
            py-3.5
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.25em]
            text-white
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-neutral-800
            sm:px-8
            sm:text-xs
          "
        >

          <MessageCircle
            className="
              h-4
              w-4
            "
            strokeWidth={
              1.5
            }
          />

          Contact Us

        </a>

      </div>

    </section>
  );
}