import BrandForm from "../_components/BrandForm";
import { createBrand } from "../_actions/brand.actions";


export default function NewBrandPage() {

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
        Add Brand
      </h1>


      <BrandForm
        action={createBrand}
        submitText="Save Brand"
      />

    </main>

  );

}