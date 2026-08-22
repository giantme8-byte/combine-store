import { prisma } from "@/lib/prisma";

import BrandForm from "../_components/BrandForm";

import { updateBrand } from "../_actions/brand.actions";


export default async function EditBrandPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const {
    id,
  } = await params;


  const brand =
    await prisma.brand.findUnique({

      where: {
        id:
          Number(id),
      },

    });


  if (!brand) {

    return (

      <main
        className="
          mx-auto
          w-full
          max-w-3xl
          p-4
          sm:p-6
          lg:p-10
        "
      >

        <h1
          className="
            text-2xl
            font-light
            text-neutral-900

            sm:text-3xl
          "
        >
          Brand Not Found
        </h1>

      </main>

    );

  }


  return (

    <main
      className="
        mx-auto
        w-full
        max-w-3xl
        p-4
        sm:p-6
        lg:p-10
      "
    >

      <h1
        className="
          mb-6
          text-3xl
          font-light
          tracking-tight
          text-neutral-900

          sm:mb-10
          sm:text-4xl
        "
      >
        Edit Brand
      </h1>


      <BrandForm
        action={
          updateBrand.bind(
            null,
            brand.id
          )
        }
        brand={
          brand
        }
        submitText="Save Changes"
      />

    </main>

  );

}