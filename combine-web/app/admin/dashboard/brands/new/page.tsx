import BrandForm from "../_components/BrandForm";
import { createBrand } from "../_actions/brand.actions";

export default function NewBrandPage() {
  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="mb-10 text-4xl font-light">
        Add Brand
      </h1>

      <BrandForm
        action={createBrand}
        submitText="Save Brand"
      />
    </main>
  );
}