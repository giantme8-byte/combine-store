type DashboardHeroProps = {
  companyName?: string | null;
};


export default function DashboardHero({
  companyName,
}: DashboardHeroProps) {


  const hour =
    new Date().getHours();



  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";



  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-neutral-200
        bg-gradient-to-br
        from-white
        to-neutral-50
        p-10
        shadow-sm
      "
    >

      <div
        className="
          absolute
          right-0
          top-0
          h-40
          w-40
          rounded-full
          bg-neutral-100
          blur-3xl
        "
      />


      <div className="relative">


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



        <h2
          className="
            mt-5
            text-5xl
            font-extralight
            tracking-tight
            text-neutral-900
            lg:text-6xl
          "
        >
          {greeting}
        </h2>



        <p
          className="
            mt-6
            max-w-2xl
            text-lg
            leading-8
            text-neutral-500
          "
        >
          Welcome back to your luxury management system.
          Here&apos;s today&apos;s overview of your products,
          inventory and customer inquiries.
        </p>



      </div>


    </section>
  );
}