import { prisma } from "@/lib/prisma";
import { updateCategory } from "../_actions/category.actions";
import CategoryForm from "../_components/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!category) {
    return <h1>Category Not Found</h1>;
  }

  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="mb-10 text-4xl font-light">
        Edit Category
      </h1>

      <CategoryForm
        action={updateCategory.bind(null, category.id)}
        category={category}
        submitText="Save Changes"
      />
    </main>
  );
}