import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { Badge } from "@/components/ui/badge";


const dateFormatter =
  new Intl.DateTimeFormat(
    "en-MY",
    {
      day:"2-digit",
      month:"short",
      year:"numeric",
    }
  );



export default async function RecentInquiries() {


  const inquiries =
    await prisma.inquiryItem.findMany({

      take:8,

      orderBy:{
        createdAt:"desc",
      },


      select:{

        id:true,

        createdAt:true,


        inquiry:{
          select:{
            id:true,
            name:true,
            whatsapp:true,
            status:true,
          },
        },


        product:{
          select:{
            brand:true,
            name:true,
          },
        },


      },

    });




  function getStatusVariant(status:string) {

    switch(status){

      case "PENDING":
        return "warning";

      case "CONTACTED":
        return "info";

      case "COMPLETED":
        return "success";

      case "CANCELLED":
        return "danger";

      default:
        return "default";

    }

  }




  return (

    <div
      className="
        rounded-3xl
        border
        border-neutral-200
        bg-white
        p-8
        shadow-sm
      "
    >



      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-neutral-400
            "
          >
            CRM
          </p>


          <h2
            className="
              mt-2
              text-2xl
              font-light
            "
          >
            Recent Inquiries
          </h2>

        </div>



        <Link
          href="/admin/dashboard/inquiries"
          className="
            text-sm
            text-neutral-500
            transition
            hover:text-black
          "
        >
          View All →
        </Link>


      </div>





      {inquiries.length === 0 ? (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-neutral-300
            py-10
            text-center
            text-neutral-500
          "
        >
          No inquiries yet.
        </div>


      ) : (


        <div className="space-y-4">


          {inquiries.map((item)=>(


            <Link

              key={item.id}

              href={
                `/admin/dashboard/inquiries/${item.inquiry.id}`
              }

              className="
                flex
                items-center
                justify-between
                gap-6
                rounded-2xl
                border
                border-neutral-200
                p-4
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-neutral-50
                hover:shadow-sm
              "

            >



              <div className="min-w-0">


                <p
                  className="
                    font-medium
                    text-neutral-900
                  "
                >
                  {item.inquiry.name}
                </p>



                <p
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  {item.inquiry.whatsapp}
                </p>



                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    text-neutral-500
                  "
                >
                  {item.product.brand}
                  {" · "}
                  {item.product.name}
                </p>


              </div>




              <div
                className="
                  flex
                  flex-col
                  items-end
                  gap-3
                "
              >


                <Badge
                  variant={
                    getStatusVariant(
                      item.inquiry.status
                    ) as any
                  }
                >
                  {item.inquiry.status}
                </Badge>



                <p
                  className="
                    text-sm
                    text-neutral-400
                  "
                >
                  {dateFormatter.format(
                    item.createdAt
                  )}
                </p>


              </div>



            </Link>


          ))}


        </div>


      )}


    </div>

  );
}