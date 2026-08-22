type StatCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon?: string;
  trend?: string;
  trendColor?: "green" | "red" | "yellow" | "blue";
};


const trendColors: Record<
  NonNullable<StatCardProps["trendColor"]>,
  string
> = {
  green: "text-green-600",
  red: "text-red-600",
  yellow: "text-yellow-600",
  blue: "text-blue-600",
};


export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendColor = "blue",
}: StatCardProps) {

  return (

    <div
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-neutral-300
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]

        sm:rounded-3xl
        sm:p-6
      "
    >

      {/* ====================================================== */}
      {/* TOP ACCENT LINE */}
      {/* ====================================================== */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-0.5
          origin-left
          scale-x-0
          rounded-t-2xl
          bg-gradient-to-r
          from-black
          via-neutral-600
          to-neutral-300
          transition-transform
          duration-500
          group-hover:scale-x-100

          sm:h-1
          sm:rounded-t-3xl
        "
      />


      {/* ====================================================== */}
      {/* CONTENT */}
      {/* ====================================================== */}

      <div
        className="
          flex
          min-w-0
          items-start
          justify-between
          gap-2

          sm:gap-4
        "
      >

        {/* ==================================================== */}
        {/* LEFT CONTENT */}
        {/* ==================================================== */}

        <div
          className="
            min-w-0
            flex-1
          "
        >

          {/* Title */}

          <p
            className="
              min-w-0
              truncate
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-neutral-400

              sm:text-xs
              sm:tracking-[0.28em]
            "
          >
            {title}
          </p>


          {/* Value */}

          <h2
            className="
              mt-2
              min-w-0
              truncate
              text-3xl
              font-extralight
              leading-none
              tracking-[-0.045em]
              text-neutral-900
              transition-all
              duration-300
              group-hover:scale-[1.03]
              group-hover:origin-left

              sm:mt-4
              sm:text-5xl

              lg:text-6xl
            "
          >
            {value}
          </h2>


          {/* Description */}

          {description && (

            <p
              className="
                mt-2
                line-clamp-2
                text-[10px]
                leading-4
                text-neutral-500

                sm:mt-3
                sm:text-sm
                sm:leading-6
              "
            >
              {description}
            </p>

          )}


          {/* Trend */}

          {trend && (

            <p
              className={`
                mt-2
                truncate
                text-[10px]
                font-medium
                ${trendColors[trendColor]}

                sm:mt-3
                sm:text-sm
              `}
            >
              {trend}
            </p>

          )}

        </div>


        {/* ==================================================== */}
        {/* ICON */}
        {/* ==================================================== */}

        {icon && (

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-neutral-200
              bg-gradient-to-br
              from-neutral-50
              to-neutral-100
              text-base
              shadow-sm
              transition-all
              duration-300
              group-hover:-translate-y-1
              group-hover:scale-105
              group-hover:shadow-md

              sm:h-16
              sm:w-16
              sm:rounded-3xl
              sm:text-2xl
            "
          >
            {icon}
          </div>

        )}

      </div>

    </div>

  );
}