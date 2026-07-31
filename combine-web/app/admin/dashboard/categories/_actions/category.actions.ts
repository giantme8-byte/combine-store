"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function getCategoryData(
  formData: FormData
) {
  const name =
    formData.get("name")?.toString().trim() ?? "";

  const slug =
    formData.get("slug")?.toString().trim() ?? "";

  const active =
    formData.get("active") === "on";

  if (!name || !slug) {
    throw new Error(
      "Category name and slug are required."
    );
  }

  return {
    name,
    slug,
    active,
  };
}

export async function createCategory(
  formData: FormData
) {
  const data = getCategoryData(formData);

  const existingCategory =
    await prisma.category.findFirst({
      where: {
        OR: [
          { name: data.name },
          { slug: data.slug },
        ],
      },
    });

  if (existingCategory) {
    throw new Error(
      "A category with the same name or slug already exists."
    );
  }

  await prisma.category.create({
    data,
  });

  redirect("/admin/dashboard/categories");
}

export async function updateCategory(
  id: number,
  formData: FormData
) {
  const data = getCategoryData(formData);

  const existingCategory =
    await prisma.category.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          { name: data.name },
          { slug: data.slug },
        ],
      },
    });

  if (existingCategory) {
    throw new Error(
      "A category with the same name or slug already exists."
    );
  }

  await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  redirect("/admin/dashboard/categories");
}

export async function deleteCategory(
  id: number
) {
  await prisma.category.delete({
    where: {
      id,
    },
  });

  redirect("/admin/dashboard/categories");
}