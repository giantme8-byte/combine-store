"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";

export async function createUser(
  formData: FormData
) {
  const currentUser = await requireRole([
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);

  const name = String(formData.get("name") ?? "").trim();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  const roleValue = String(
    formData.get("role") ?? UserRole.STAFF
  );

  const isValidRole = Object.values(UserRole).includes(
    roleValue as UserRole
  );

  const role = isValidRole
    ? (roleValue as UserRole)
    : UserRole.STAFF;

  if (!name || !email || !password) {
    throw new Error("Missing required fields.");
  }

  if (password.length < 8) {
    throw new Error(
      "Password must be at least 8 characters."
    );
  }

  if (
    currentUser.role !== UserRole.OWNER &&
    role === UserRole.OWNER
  ) {
    throw new Error(
      "Only the owner can assign the Owner role."
    );
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath("/admin/dashboard/users");
}

export async function updateUser(
  formData: FormData
) {
  const currentUser = await requireRole([
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);

  const id = Number(formData.get("id"));

  const name = String(formData.get("name") ?? "").trim();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const roleValue = String(
    formData.get("role") ?? UserRole.STAFF
  );

  const isValidRole = Object.values(UserRole).includes(
    roleValue as UserRole
  );

  const role = isValidRole
    ? (roleValue as UserRole)
    : UserRole.STAFF;

  if (!id || !name || !email) {
    throw new Error("Missing required fields.");
  }

  if (
    currentUser.role !== UserRole.OWNER &&
    role === UserRole.OWNER
  ) {
    throw new Error(
      "Only the owner can assign the Owner role."
    );
  }

  if (currentUser.id === id) {
    throw new Error(
      "You cannot change your own role."
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
    throw new Error("Email already exists.");
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

  revalidatePath("/admin/dashboard/users");
}