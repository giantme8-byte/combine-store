"use server";

import {
  InquiryStatus,
  UserRole,
} from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";

export async function updateInquiryStatus(
  id: number,
  status: InquiryStatus
) {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);

  await prisma.inquiry.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  revalidatePath("/admin/dashboard/inquiries");
}

export async function deleteInquiry(
  id: number
) {
  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);

  await prisma.inquiry.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/dashboard/inquiries");

  redirect("/admin/dashboard/inquiries");
}