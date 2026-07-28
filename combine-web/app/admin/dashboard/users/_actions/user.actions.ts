"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";

export async function createUser(
  formData: FormData
) {
  await requireRole([
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const email = String(
    formData.get("email") ?? ""
  )
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? ""
  );

  const roleValue = String(
    formData.get("role") ?? "STAFF"
  );

  const role = Object.values(UserRole).includes(
    roleValue as UserRole
  )
    ? (roleValue as UserRole)
    : UserRole.STAFF;

  if (!name || !email || !password) {
    throw new Error(
      "Missing required fields."
    );
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error(
      "Email already exists."
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath(
    "/admin/dashboard/users"
  );
}

export async function updateUser(
  formData: FormData
) {
  await requireRole([
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);

  const id = Number(
    formData.get("id")
  );

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const email = String(
    formData.get("email") ?? ""
  )
    .trim()
    .toLowerCase();

  const roleValue = String(
    formData.get("role") ?? "STAFF"
  );

  const role = Object.values(UserRole).includes(
    roleValue as UserRole
  )
    ? (roleValue as UserRole)
    : UserRole.STAFF;

  if (!id || !name || !email) {
    throw new Error(
      "Missing required fields."
    );
  }

  const existingUser =
    await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id,
        },
      },
    });

  if (existingUser) {
    throw new Error(
      "Email already exists."
    );
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      role,
    },
  });

  revalidatePath(
    "/admin/dashboard/users"
  );
}