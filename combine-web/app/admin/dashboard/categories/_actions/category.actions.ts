"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function createCategory(
  formData: FormData
) {
  const name = (
    formData.get("name") as string
  ).trim();

  const slug = (
    formData.get("slug") as string
  ).trim();

  const active =
    formData.get("active") === "on";

  if (!name || !slug) {
    throw new Error(
      "Category name and slug are required."
    );
  }

  const existingCategory =
    await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

  if (existingCategory) {
    throw new Error(
      "A category with the same name or slug already exists."
    );
  }

  await prisma.category.create({
    data: {
      name,
      slug,
      active,
    },
  });

  redirect("/admin/dashboard/categories");
}

export async function updateCategory(
  id: number,
  formData: FormData
) {
  const name = (
    formData.get("name") as string
  ).trim();

  const slug = (
    formData.get("slug") as string
  ).trim();

  const active =
    formData.get("active") === "on";

  if (!name || !slug) {
    throw new Error(
      "Category name and slug are required."
    );
  }

  const existingCategory =
    await prisma.category.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          { name },
          { slug },
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
    data: {
      name,
      slug,
      active,
    },
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