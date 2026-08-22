import { prisma } from "@/lib/prisma";

import { updateCategory } from "../_actions/category.actions";

import CategoryForm from "../_components/CategoryForm";


export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const {
    id,
  } = await params;


  const category =
    await prisma.category.findUnique({

      where: {
        id:
          Number(id),
      },

    });


  if (!category) {

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
            tracking-tight
            text-neutral-900

            sm:text-3xl
          "
        >
          Category Not Found
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
        Edit Category
      </h1>


      <CategoryForm
        action={
          updateCategory.bind(
            null,
            category.id
          )
        }
        category={
          category
        }
        submitText="Save Changes"
      />

    </main>

  );

}