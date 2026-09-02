"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import {
  UserRole,
} from "@prisma/client";

import {
  prisma,
} from "@/lib/prisma";

import {
  requireRole,
} from "@/lib/authorize";


// ============================================================
// CREATE USER
// ============================================================

export async function createUser(
  formData: FormData
) {

  const currentUser =
    await requireRole([
      UserRole.ADMIN,
      UserRole.OWNER,
    ]);


  // ==========================================================
  // FORM DATA
  // ==========================================================

  const name =
    String(
      formData.get("name") ?? ""
    ).trim();


  const email =
    String(
      formData.get("email") ?? ""
    )
      .trim()
      .toLowerCase();


  const password =
    String(
      formData.get("password") ?? ""
    );


  const roleValue =
    String(
      formData.get("role") ??
        UserRole.STAFF
    );


  // ==========================================================
  // ROLE VALIDATION
  // ==========================================================

  const isValidRole =
    Object.values(
      UserRole
    ).includes(
      roleValue as UserRole
    );


  const role =
    isValidRole
      ? (
          roleValue as UserRole
        )
      : UserRole.STAFF;


  // ==========================================================
  // REQUIRED FIELDS
  // ==========================================================

  if (
    !name ||
    !email ||
    !password
  ) {

    throw new Error(
      "Missing required fields."
    );

  }


  // ==========================================================
  // PASSWORD
  // ==========================================================

  if (
    password.length < 8
  ) {

    throw new Error(
      "Password must be at least 8 characters."
    );

  }


  // ==========================================================
  // OWNER ROLE PROTECTION
  // ==========================================================

  if (
    currentUser.role !==
      UserRole.OWNER &&
    role === UserRole.OWNER
  ) {

    throw new Error(
      "Only the owner can assign the Owner role."
    );

  }


  // ==========================================================
  // DUPLICATE EMAIL
  // ==========================================================

  const existingUser =
    await prisma.user.findUnique({

      where: {
        email,
      },

    });


  if (
    existingUser
  ) {

    throw new Error(
      "Email already exists."
    );

  }


  // ==========================================================
  // HASH PASSWORD
  // ==========================================================

  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );


  // ==========================================================
  // CREATE
  // ==========================================================

  await prisma.user.create({

    data: {

      name,

      email,

      password:
        hashedPassword,

      role,

    },

  });


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/users"
  );

}


// ============================================================
// UPDATE USER
// ============================================================

export async function updateUser(
  formData: FormData
) {

  const currentUser =
    await requireRole([
      UserRole.ADMIN,
      UserRole.OWNER,
    ]);


  // ==========================================================
  // FORM DATA
  // ==========================================================

  const id =
    Number(
      formData.get("id")
    );


  const name =
    String(
      formData.get("name") ?? ""
    ).trim();


  const email =
    String(
      formData.get("email") ?? ""
    )
      .trim()
      .toLowerCase();


  const roleValue =
    String(
      formData.get("role") ??
        UserRole.STAFF
    );


  // ==========================================================
  // ROLE VALIDATION
  // ==========================================================

  const isValidRole =
    Object.values(
      UserRole
    ).includes(
      roleValue as UserRole
    );


  const role =
    isValidRole
      ? (
          roleValue as UserRole
        )
      : UserRole.STAFF;


  // ==========================================================
  // REQUIRED FIELDS
  // ==========================================================

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    !name ||
    !email
  ) {

    throw new Error(
      "Missing required fields."
    );

  }


  // ==========================================================
  // LOAD TARGET USER
  // ==========================================================

  const targetUser =
    await prisma.user.findUnique({

      where: {
        id,
      },

      select: {
        id: true,
        role: true,
      },

    });


  if (
    !targetUser
  ) {

    throw new Error(
      "User not found."
    );

  }


  // ==========================================================
  // OWNER PROTECTION
  // ==========================================================

  if (
    currentUser.role !==
      UserRole.OWNER &&
    targetUser.role ===
      UserRole.OWNER
  ) {

    throw new Error(
      "Only the owner can modify an Owner account."
    );

  }


  // ==========================================================
  // OWNER ROLE PROTECTION
  // ==========================================================

  if (
    currentUser.role !==
      UserRole.OWNER &&
    role === UserRole.OWNER
  ) {

    throw new Error(
      "Only the owner can assign the Owner role."
    );

  }


  // ==========================================================
  // OWN ROLE PROTECTION
  // ==========================================================

  if (
    currentUser.id === id &&
    role !== currentUser.role
  ) {

    throw new Error(
      "You cannot change your own role."
    );

  }


  // ==========================================================
  // DUPLICATE EMAIL
  // ==========================================================

  const existingUser =
    await prisma.user.findFirst({

      where: {

        email,

        NOT: {
          id,
        },

      },

    });


  if (
    existingUser
  ) {

    throw new Error(
      "Email already exists."
    );

  }


  // ==========================================================
  // UPDATE
  // ==========================================================

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


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/users"
  );

}


// ============================================================
// DELETE USER
// ============================================================

export async function deleteUser(
  formData: FormData
) {

  const currentUser =
    await requireRole([
      UserRole.ADMIN,
      UserRole.OWNER,
    ]);


  // ==========================================================
  // USER ID
  // ==========================================================

  const id =
    Number(
      formData.get("id")
    );


  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {

    throw new Error(
      "Invalid user ID."
    );

  }


  // ==========================================================
  // LOAD TARGET USER
  // ==========================================================

  const targetUser =
    await prisma.user.findUnique({

      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        role: true,
      },

    });


  if (
    !targetUser
  ) {

    throw new Error(
      "User not found."
    );

  }


  // ==========================================================
  // CANNOT DELETE YOURSELF
  // ==========================================================

  if (
    currentUser.id ===
    targetUser.id
  ) {

    throw new Error(
      "You cannot delete your own account."
    );

  }


  // ==========================================================
  // OWNER PROTECTION
  // ==========================================================

  if (
    currentUser.role !==
      UserRole.OWNER &&
    targetUser.role ===
      UserRole.OWNER
  ) {

    throw new Error(
      "Only the owner can delete an Owner account."
    );

  }


  // ==========================================================
  // DELETE
  // ==========================================================

  await prisma.user.delete({

    where: {
      id,
    },

  });


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/users"
  );

}