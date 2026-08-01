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
    overflow-hidden
    rounded-3xl
    border
    border-neutral-200
    bg-white
    p-6
    shadow-sm
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-neutral-300
    hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]
  "
>
  {/* Top Accent Line */}
  <div
    className="
      absolute
      inset-x-0
      top-0
      h-1
      origin-left
      scale-x-0
      rounded-t-3xl
      bg-gradient-to-r
      from-black
      via-neutral-600
      to-neutral-300
      transition-transform
      duration-500
      group-hover:scale-x-100
    "
  />

      <div className="flex items-start justify-between">


        <div className="flex-1">


          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.28em]
              text-neutral-400
            "
          >
            {title}
          </p>

<h2
  className="
    mt-4
    text-5xl
    font-extralight
    tracking-[-0.04em]
    text-neutral-900
    transition-all
    duration-300
    group-hover:scale-[1.03]
    lg:text-6xl
  "
>
            {value}
          </h2>



          {description && (
            <p
              className="
                mt-3
                text-sm
                leading-6
                text-neutral-500
              "
            >
              {description}
            </p>
          )}



          {trend && (
            <p
              className={`
                mt-3
                text-sm
                font-medium
                ${trendColors[trendColor]}
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
    h-16
    w-16
    items-center
    justify-center
    rounded-3xl
    border
    border-neutral-200
    bg-gradient-to-br
    from-neutral-50
    to-neutral-100
    text-2xl
    shadow-sm
    transition-all
    duration-300
    group-hover:-translate-y-1
    group-hover:scale-105
    group-hover:shadow-md
  "
>
            {icon}
          </div>
        )}


      </div>

    </div>
  );
}