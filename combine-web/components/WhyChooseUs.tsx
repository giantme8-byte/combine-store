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
    <section
      className="
        bg-[#fafafa]
        py-20
        sm:py-28
        lg:py-32
      "
    >
      <div
        className="
          mx-auto
          max-w-[1440px]
          px-5
          sm:px-8
          lg:px-12
        "
      >
        {/* Header */}
        <div
          className="
            mx-auto
            mb-14
            max-w-4xl
            text-center
            sm:mb-20
            lg:mb-24
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
            WHY COMBINE
          </p>

          <h2
            className="
              mt-5
              text-4xl
              font-extralight
              leading-[1.05]
              tracking-[-0.04em]
              text-neutral-900
              sm:mt-6
              sm:text-5xl
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
              mt-7
              h-px
              w-20
              bg-gradient-to-r
              from-transparent
              via-[#C8A96A]
              to-transparent
              sm:mt-8
            "
          />

          <p
            className="
              mx-auto
              mt-7
              max-w-3xl
              text-[14px]
              leading-7
              text-neutral-500
              sm:mt-8
              sm:text-lg
              sm:leading-8
            "
          >
            Every detail is thoughtfully curated to deliver an elevated
            luxury shopping experience, combining timeless elegance,
            exceptional quality and personalised service.
          </p>
        </div>

        {/* Features */}
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-6
            lg:grid-cols-4
            lg:gap-8
          "
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                group
                rounded-[22px]
                border
                border-neutral-200
                bg-white
                p-4
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-[#C8A96A]
                hover:shadow-[0_30px_80px_rgba(0,0,0,.10)]
                sm:rounded-[28px]
                sm:p-7
                lg:rounded-[32px]
                lg:p-10
              "
            >
              <div
                className="
                  text-3xl
                  font-extralight
                  text-[#C8A96A]
                  transition-transform
                  duration-500
                  group-hover:scale-110
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {feature.icon}
              </div>

              <h3
                className="
                  mt-5
                  text-[16px]
                  font-light
                  leading-tight
                  tracking-[-0.02em]
                  text-neutral-900
                  sm:mt-7
                  sm:text-xl
                  lg:mt-10
                  lg:text-2xl
                "
              >
                {feature.title}
              </h3>

              <div
                className="
                  mt-4
                  h-px
                  w-8
                  bg-[#C8A96A]
                  sm:mt-5
                  sm:w-10
                "
              />

              <p
                className="
                  mt-4
                  text-[12px]
                  leading-5
                  text-neutral-500
                  sm:mt-5
                  sm:text-[14px]
                  sm:leading-7
                  lg:mt-6
                  lg:text-base
                  lg:leading-8
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
            mt-16
            grid
            grid-cols-3
            gap-3
            border-t
            border-neutral-200
            pt-10
            text-center
            sm:mt-24
            sm:gap-8
            sm:pt-14
            lg:mt-28
            lg:gap-12
            lg:pt-16
          "
        >
          <div>
            <p
              className="
                text-2xl
                font-extralight
                text-neutral-900
                sm:text-4xl
                lg:text-5xl
              "
            >
              2000+
            </p>

            <p
              className="
                mt-2
                text-[8px]
                uppercase
                leading-4
                tracking-[0.2em]
                text-neutral-400
                sm:mt-3
                sm:text-[10px]
                sm:tracking-[0.3em]
                lg:text-xs
                lg:tracking-[0.4em]
              "
            >
              Luxury Products
            </p>
          </div>

          <div>
            <p
              className="
                text-2xl
                font-extralight
                text-neutral-900
                sm:text-4xl
                lg:text-5xl
              "
            >
              99%
            </p>

            <p
              className="
                mt-2
                text-[8px]
                uppercase
                leading-4
                tracking-[0.2em]
                text-neutral-400
                sm:mt-3
                sm:text-[10px]
                sm:tracking-[0.3em]
                lg:text-xs
                lg:tracking-[0.4em]
              "
            >
              Premium Quality
            </p>
          </div>

          <div>
            <p
              className="
                text-2xl
                font-extralight
                text-neutral-900
                sm:text-4xl
                lg:text-5xl
              "
            >
              Global
            </p>

            <p
              className="
                mt-2
                text-[8px]
                uppercase
                leading-4
                tracking-[0.2em]
                text-neutral-400
                sm:mt-3
                sm:text-[10px]
                sm:tracking-[0.3em]
                lg:text-xs
                lg:tracking-[0.4em]
              "
            >
              Shipping
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}