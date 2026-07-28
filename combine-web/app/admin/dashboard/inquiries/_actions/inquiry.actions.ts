"use server";

import { InquiryStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function updateInquiryStatus(
  id: number,
  status: InquiryStatus
) {
  await prisma.inquiry.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

export async function deleteInquiry(id: number) {
  await prisma.inquiry.delete({
    where: {
      id,
    },
  });

  redirect("/admin/dashboard/inquiries");
}