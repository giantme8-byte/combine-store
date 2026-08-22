import { createCategory } from "../_actions/category.actions";

import CategoryForm from "../_components/CategoryForm";


export default function NewCategoryPage() {

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
        Add Category
      </h1>


      <CategoryForm
        action={createCategory}
        submitText="Save Category"
      />

    </main>

  );

}