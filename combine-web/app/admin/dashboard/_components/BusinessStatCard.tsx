type BusinessStatCardProps = {
  title: string;
  value: string;
  icon: string;

  color?:
    | "text-green-600"
    | "text-red-600"
    | "text-yellow-600"
    | "text-neutral-900";
};

export default function BusinessStatCard({
  title,
  value,
  icon,
  color = "text-neutral-900",
}: BusinessStatCardProps) {
  return (
    <div
      className="
        group
        min-w-0
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl

        sm:rounded-3xl
        sm:p-6
      "
    >
      {/* ==================================================== */}
      {/* TOP ROW */}
      {/* ==================================================== */}

      <div
        className="
          flex
          min-w-0
          items-start
          justify-between
          gap-3
        "
      >
        {/* Title */}

        <p
          className="
            min-w-0
            flex-1
            text-[9px]
            font-medium
            uppercase
            leading-3
            tracking-[0.12em]
            text-neutral-400

            sm:text-xs
            sm:leading-4
            sm:tracking-[0.28em]
          "
        >
          {title}
        </p>

        {/* Icon */}

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-neutral-100
            text-base
            transition-all
            duration-300
            group-hover:scale-105

            sm:h-14
            sm:w-14
            sm:rounded-2xl
            sm:text-2xl
          "
        >
          {icon}
        </div>
      </div>

      {/* ==================================================== */}
      {/* VALUE */}
      {/* ==================================================== */}

      <h2
        className={`
          mt-4
          min-w-0
          whitespace-nowrap
          text-xl
          font-extralight
          leading-none
          tracking-[-0.035em]
          ${color}

          sm:mt-5
          sm:text-3xl
          sm:tracking-tight

          lg:text-4xl
        `}
      >
        {value}
      </h2>
    </div>
  );
}