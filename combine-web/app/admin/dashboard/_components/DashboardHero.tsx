type DashboardHeroProps = {
  companyName?: string | null;
};

export default function DashboardHero({
  companyName,
}: DashboardHeroProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const today = new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date());

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-neutral-200
        bg-gradient-to-br
        from-white
        via-neutral-50
        to-neutral-100
        px-10
        py-12
        shadow-sm
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          -right-16
          -top-16
          h-72
          w-72
          rounded-full
          bg-neutral-200/60
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -bottom-24
          -left-24
          h-72
          w-72
          rounded-full
          bg-neutral-100
          blur-3xl
        "
      />

      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        {/* Left */}
        <div>
          <p
            className="
              text-xs
              uppercase
              tracking-[0.45em]
              text-neutral-400
            "
          >
            {companyName ?? "COMBINE"}
          </p>

          <h1
            className="
              mt-5
              text-5xl
              font-extralight
              tracking-[-0.04em]
              text-neutral-900
              lg:text-6xl
            "
          >
            {greeting}
          </h1>

          <p
            className="
              mt-3
              text-base
              text-neutral-500
            "
          >
            {today}
          </p>

          <p
            className="
              mt-8
              max-w-2xl
              text-lg
              leading-8
              text-neutral-600
            "
          >
            Welcome back to your luxury management
            dashboard. Monitor products, inventory,
            inquiries and business performance from
            one place.
          </p>
        </div>

        {/* Right */}
        <div
          className="
            grid
            grid-cols-2
            gap-4
            lg:w-[360px]
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-white/60
              bg-white/80
              p-5
              backdrop-blur
            "
          >
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              Status
            </p>

            <p className="mt-3 text-lg font-semibold text-green-600">
              ● System Online
            </p>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-white/60
              bg-white/80
              p-5
              backdrop-blur
            "
          >
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              Workspace
            </p>

            <p className="mt-3 text-lg font-semibold">
              Ready
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}