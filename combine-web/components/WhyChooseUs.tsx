const features = [
  {
    title: "Premium Quality",
    description:
      "Every piece is carefully selected with exceptional craftsmanship and premium finishing.",
    icon: "✨",
  },
  {
    title: "Luxury Experience",
    description:
      "Designed to deliver an elegant shopping experience from browsing to delivery.",
    icon: "👜",
  },
  {
    title: "Worldwide Shipping",
    description:
      "Fast, secure and reliable international shipping with careful packaging.",
    icon: "🌍",
  },
  {
    title: "Dedicated Support",
    description:
      "Professional customer service ready to assist you before and after your purchase.",
    icon: "💬",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#fafafa] py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-20 max-w-3xl text-center">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-400">
            WHY CHOOSE COMBINE
          </p>

          <h2 className="mt-5 text-5xl font-extralight tracking-tight md:text-6xl">
            Crafted For Those Who
            <br />
            Appreciate Luxury
          </h2>

          <p className="mt-8 text-lg leading-8 text-gray-500">
            Every detail is thoughtfully curated to deliver an elevated
            luxury shopping experience.
          </p>

        </div>

        {/* Features */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[32px] border border-gray-100 bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl">
                {feature.icon}
              </div>

              <h3 className="mt-8 text-2xl font-light">
                {feature.title}
              </h3>

              <p className="mt-5 leading-8 text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}