const features = [
  {
    title: "Exceptional Quality",
    description:
      "Every luxury piece is carefully selected with exceptional craftsmanship, refined materials and meticulous attention to detail.",
    icon: "✦",
  },
  {
    title: "Luxury Experience",
    description:
      "From product discovery to delivery, every step is thoughtfully designed to provide a seamless luxury shopping experience.",
    icon: "◈",
  },
  {
    title: "Worldwide Shipping",
    description:
      "Secure worldwide delivery with careful packaging, ensuring every item arrives in pristine condition.",
    icon: "◎",
  },
  {
    title: "Dedicated Concierge",
    description:
      "Our team is ready to assist you with personalised recommendations before and after every purchase.",
    icon: "✧",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#fafafa] py-32">
      <div className="mx-auto max-w-[1440px] px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-24 max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
            WHY COMBINE
          </p>

          <h2
            className="
              mt-6
              text-5xl
              font-extralight
              tracking-[-0.04em]
              text-neutral-900
              md:text-6xl
            "
          >
            Crafted For
            <br />
            Modern Luxury
          </h2>

          <div
            className="
              mx-auto
              mt-8
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
              mt-8
              max-w-3xl
              text-lg
              leading-8
              text-neutral-500
            "
          >
            Every detail is thoughtfully curated to deliver an elevated
            luxury shopping experience, combining timeless elegance,
            exceptional quality and personalised service.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                group
                rounded-[32px]
                border
                border-neutral-200
                bg-white
                p-10
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-[#C8A96A]
                hover:shadow-[0_30px_80px_rgba(0,0,0,.10)]
              "
            >
              <div
                className="
                  text-5xl
                  font-extralight
                  text-[#C8A96A]
                  transition-transform
                  duration-500
                  group-hover:scale-110
                "
              >
                {feature.icon}
              </div>

              <h3
                className="
                  mt-10
                  text-2xl
                  font-light
                  tracking-[-0.02em]
                  text-neutral-900
                "
              >
                {feature.title}
              </h3>

              <div className="mt-5 h-px w-10 bg-[#C8A96A]" />

              <p
                className="
                  mt-6
                  leading-8
                  text-neutral-500
                "
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div
          className="
            mt-28
            grid
            gap-12
            border-t
            border-neutral-200
            pt-16
            text-center
            md:grid-cols-3
          "
        >
          <div>
            <p className="text-5xl font-extralight text-neutral-900">
              2000+
            </p>

            <p className="mt-3 text-xs uppercase tracking-[0.4em] text-neutral-400">
              Luxury Products
            </p>
          </div>

          <div>
            <p className="text-5xl font-extralight text-neutral-900">
              99%
            </p>

            <p className="mt-3 text-xs uppercase tracking-[0.4em] text-neutral-400">
              Premium Quality
            </p>
          </div>

          <div>
            <p className="text-5xl font-extralight text-neutral-900">
              Worldwide
            </p>

            <p className="mt-3 text-xs uppercase tracking-[0.4em] text-neutral-400">
              Shipping
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}