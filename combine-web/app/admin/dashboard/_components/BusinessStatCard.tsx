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
            className={`
              mt-4
              text-3xl
              font-extralight
              tracking-tight
              lg:text-4xl
              ${color}
            `}
          >
            {value}
          </h2>


        </div>




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


      </div>

    </div>
  );
}