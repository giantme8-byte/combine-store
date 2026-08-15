import { prisma } from "@/lib/prisma";

import {
  createSubCategory,
} from "../../_actions/category.actions";

import SubCategoryForm from "../../_components/SubCategoryForm";

export default async function NewSubCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}) {
  const params =
    await searchParams;

  const defaultCategoryId =
    params.categoryId
      ? Number(params.categoryId)
      : undefined;

  const [
    categories,
  ] = await Promise.all([
    prisma.category.findMany({
      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="mb-3 text-4xl font-light">
        Add Sub-Category
      </h1>

      <p className="mb-10 text-sm text-neutral-500">
        Create a sub-category and assign
        it to a parent category.
      </p>

      <SubCategoryForm
        action={createSubCategory}
        categories={categories}
        defaultCategoryId={
          defaultCategoryId
        }
        submitText="Save Sub-Category"
      />
    </main>
  );
}