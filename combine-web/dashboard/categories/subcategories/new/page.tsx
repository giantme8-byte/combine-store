import { prisma } from "@/lib/prisma";

import {
  createSubCategory,
} from "../../_actions/category.actions";

import SubCategoryForm from "../../_components/SubCategoryForm";


// ============================================================
// PAGE
// ============================================================

export default async function NewSubCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}) {

  // ==========================================================
  // SEARCH PARAMS
  // ==========================================================

  const params =
    await searchParams;


  const defaultCategoryId =
    params.categoryId
      ? Number(
          params.categoryId
        )
      : undefined;


  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  const categories =
    await prisma.category.findMany({

      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },

    });


  // ==========================================================
  // RENDER
  // ==========================================================

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

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <h1
        className="
          mb-2
          text-3xl
          font-light
          tracking-tight
          text-neutral-900

          sm:mb-3
          sm:text-4xl
        "
      >
        Add Sub-Category
      </h1>


      <p
        className="
          mb-6
          text-sm
          leading-6
          text-neutral-500

          sm:mb-10
          sm:leading-normal
        "
      >
        Create a sub-category and assign
        it to a parent category.
      </p>


      {/* ================================================== */}
      {/* FORM */}
      {/* ================================================== */}

      <SubCategoryForm
        action={
          createSubCategory
        }
        categories={
          categories
        }
        defaultCategoryId={
          defaultCategoryId
        }
        submitText="Save Sub-Category"
      />

    </main>

  );

}