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
        p-3
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

      <div
        className="
          flex
          min-w-0
          items-start
          justify-between
          gap-1.5
          sm:gap-4
        "
      >
        <div className="min-w-0 flex-1">
          <p
            className="
              min-w-0
              truncate
              text-[8px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-neutral-400

              sm:text-xs
              sm:tracking-[0.28em]
            "
          >
            {title}
          </p>

          <h2
            className="
              mt-1.5
              min-w-0
              truncate
              text-2xl
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

          {description && (
            <p
              className="
                mt-1.5
                line-clamp-2
                text-[9px]
                leading-3.5
                text-neutral-500

                sm:mt-3
                sm:text-sm
                sm:leading-6
              "
            >
              {description}
            </p>
          )}

          {trend && (
            <p
              className={`
                mt-1.5
                truncate
                text-[9px]
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

        {icon && (
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-neutral-200
              bg-gradient-to-br
              from-neutral-50
              to-neutral-100
              text-sm
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
