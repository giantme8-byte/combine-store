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
        rounded-3xl
        border
        border-neutral-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >

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
              text-4xl
              font-extralight
              tracking-tight
              text-neutral-900
              lg:text-5xl
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
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-neutral-100
              text-2xl
              transition-all
              duration-300
              group-hover:scale-105
            "
          >
            {icon}
          </div>
        )}


      </div>

    </div>
  );
}