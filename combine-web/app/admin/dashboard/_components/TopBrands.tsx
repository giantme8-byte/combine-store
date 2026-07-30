import { prisma } from "@/lib/prisma";


export default async function TopBrands() {


  const products =
    await prisma.product.findMany({
      select:{
        brand:true,
      },
    });



  const brands =
    Object.values(
      products.reduce(
        (acc, product)=>{


          if(!acc[product.brand]){

            acc[product.brand]={
              name:product.brand,
              value:0,
            };

          }


          acc[product.brand].value++;


          return acc;


        },
        {} as Record<
          string,
          {
            name:string;
            value:number;
          }
        >
      )
    )
    .sort(
      (a,b)=>
        b.value-a.value
    )
    .slice(0,5);



  const max =
    brands[0]?.value ?? 1;




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
          Analytics
        </p>


        <h2
          className="
            mt-2
            text-2xl
            font-light
          "
        >
          Top Brands
        </h2>


      </div>





      {brands.length === 0 ? (

        <p className="
          py-10
          text-center
          text-neutral-500
        ">
          No brand data available.
        </p>


      ) : (


        <div className="space-y-5">


          {brands.map((brand)=>(


            <div
              key={brand.name}
            >


              <div className="
                mb-2
                flex
                items-center
                justify-between
              ">


                <span
                  className="
                    font-medium
                    text-neutral-900
                  "
                >
                  {brand.name}
                </span>



                <span
                  className="
                    text-sm
                    text-neutral-500
                  "
                >
                  {brand.value}
                </span>


              </div>




              <div
                className="
                  h-2
                  overflow-hidden
                  rounded-full
                  bg-neutral-200
                "
              >

                <div
                  className="
                    h-full
                    rounded-full
                    bg-black
                    transition-all
                    duration-500
                  "
                  style={{
                    width:
                      `${(brand.value / max) * 100}%`,
                  }}
                />


              </div>


            </div>


          ))}


        </div>


      )}



    </div>

  );
}