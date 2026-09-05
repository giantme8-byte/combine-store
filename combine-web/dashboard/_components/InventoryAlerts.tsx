import Link from "next/link";
import { prisma } from "@/lib/prisma";


export default async function InventoryAlerts() {


  const [
    noImages,
    noCostPrice,
    noShortDescription,

  ] = await Promise.all([


    prisma.product.count({
      where:{
        images:{
          none:{},
        },
      },
    }),



    prisma.product.count({
      where:{
        costPriceCny:null,
      },
    }),



    prisma.product.count({
      where:{
        OR:[
          {
            shortDescription:null,
          },
          {
            shortDescription:"",
          },
        ],
      },
    }),


  ]);



  const alerts = [

    {
      label:"Missing Images",
      count:noImages,
    },

    {
      label:"Missing Cost Price",
      count:noCostPrice,
    },

    {
      label:"Missing Short Description",
      count:noShortDescription,
    },

  ];



  const totalIssues =
    alerts.reduce(
      (sum,item)=>
        sum + item.count,
      0
    );



  return (

    <div
      className="
        rounded-3xl
        border
        border-neutral-200
        bg-white
        p-6
        shadow-sm
      "
    >


      <div className="mb-6">


        <p
          className="
            text-xs
            uppercase
            tracking-[0.3em]
            text-neutral-400
          "
        >
          System Check
        </p>


        <h2
          className="
            mt-2
            text-2xl
            font-light
          "
        >
          Inventory Alerts
        </h2>


        <p
          className="
            mt-2
            text-sm
            text-neutral-500
          "
        >
          {totalIssues === 0
            ? "Everything looks good."
            : `${totalIssues} issue${
                totalIssues > 1 ? "s" : ""
              } require attention.`}
        </p>


      </div>





      <div className="space-y-4">


        {alerts.map((alert)=>(


          <div
            key={alert.label}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-neutral-200
              p-4
              transition
              hover:bg-neutral-50
            "
          >


            <span
              className="
                text-sm
                font-medium
                text-neutral-800
              "
            >
              {alert.label}
            </span>



            <span
              className={`
                rounded-full
                px-3
                py-1
                text-sm
                font-medium

                ${
                  alert.count > 0
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }
              `}
            >

              {alert.count > 0
                ? alert.count
                : "✓"}

            </span>


          </div>


        ))}


      </div>





      <Link
        href="/admin/dashboard/products"
        className="
          mt-6
          block
          text-sm
          text-neutral-500
          transition
          hover:text-black
        "
      >
        View Products →
      </Link>


    </div>

  );
}