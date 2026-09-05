"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function getBrandData(formData: FormData) {
  const name =
    formData.get("name")?.toString().trim() ?? "";

  const slug =
    formData.get("slug")?.toString().trim() ?? "";

  const active =
    formData.get("active") === "on";

  if (!name || !slug) {
    throw new Error(
      "Brand name and slug are required."
    );
  }

  return {
    name,
    slug,
    active,
  };
}

export async function createBrand(
  formData: FormData
) {
  const data = getBrandData(formData);

  const existingBrand =
    await prisma.brand.findFirst({
      where: {
        OR: [
          { name: data.name },
          { slug: data.slug },
        ],
      },
    });

  if (existingBrand) {
    throw new Error(
      "A brand with the same name or slug already exists."
    );
  }

  await prisma.brand.create({
    data,
  });

  redirect("/admin/dashboard/brands");
}

export async function updateBrand(
  id: number,
  formData: FormData
) {
  const data = getBrandData(formData);

  const existingBrand =
    await prisma.brand.findFirst({
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

  if (existingBrand) {
    throw new Error(
      "A brand with the same name or slug already exists."
    );
  }

  await prisma.brand.update({
    where: {
      id,
    },
    data,
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