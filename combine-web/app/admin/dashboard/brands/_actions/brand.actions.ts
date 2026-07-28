"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createBrand(
  formData: FormData
) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  const active =
    formData.get("active") === "on";

  await prisma.brand.create({
    data: {
      name,
      slug,
      active,
    },
  });

  redirect("/admin/dashboard/brands");
}

export async function updateBrand(
  id: number,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  const active =
    formData.get("active") === "on";

  await prisma.brand.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
      active,
    },
  });

  redirect("/admin/dashboard/brands");
}

export async function deleteBrand(
  id: number
) {
  await prisma.brand.delete({
    where: {
      id,
    },
  });

  redirect("/admin/dashboard/brands");
}