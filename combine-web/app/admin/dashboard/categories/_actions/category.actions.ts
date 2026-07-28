"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createCategory(
  formData: FormData
) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  const active =
    formData.get("active") === "on";

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
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  const active =
    formData.get("active") === "on";

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