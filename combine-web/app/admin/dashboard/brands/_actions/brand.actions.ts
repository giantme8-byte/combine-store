"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function createBrand(
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
      "Brand name and slug are required."
    );
  }

  const existingBrand =
    await prisma.brand.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

  if (existingBrand) {
    throw new Error(
      "A brand with the same name or slug already exists."
    );
  }

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
      "Brand name and slug are required."
    );
  }

  const existingBrand =
    await prisma.brand.findFirst({
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

  if (existingBrand) {
    throw new Error(
      "A brand with the same name or slug already exists."
    );
  }

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