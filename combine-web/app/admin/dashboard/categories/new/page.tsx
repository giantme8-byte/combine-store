import { createCategory } from "../_actions/category.actions";
import CategoryForm from "../_components/CategoryForm";

export default function NewCategoryPage() {
  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="mb-10 text-4xl font-light">
        Add Category
      </h1>

      <CategoryForm
        action={createCategory}
        submitText="Save Category"
      />
    </main>
  );
}