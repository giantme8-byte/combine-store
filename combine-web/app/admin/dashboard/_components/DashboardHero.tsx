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

  return (
    <section className="mb-10 rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
      <p className="text-sm uppercase tracking-[0.35em] text-neutral-400">
        {companyName ?? "COMBINE"}
      </p>

      <h2 className="mt-4 text-5xl font-extralight">
        {greeting}
      </h2>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-500">
        Welcome back to your luxury management system.
        Here&apos;s today&apos;s overview of your products,
        inventory and customer inquiries.
      </p>
    </section>
  );
}