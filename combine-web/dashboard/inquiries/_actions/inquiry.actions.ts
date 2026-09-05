"use server";

import {
  InquiryStatus,
  UserRole,
} from "@prisma/client";

import {
  revalidatePath,
} from "next/cache";

import {
  requireRole,
} from "@/lib/authorize";

import {
  prisma,
} from "@/lib/prisma";


// ============================================================
// UPDATE INQUIRY STATUS
// ============================================================

export async function updateInquiryStatus(
  id: number,
  status: InquiryStatus
) {

  // ==========================================================
  // PERMISSION
  // ==========================================================

  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);


  // ==========================================================
  // UPDATE
  // ==========================================================

  await prisma.inquiry.update({

    where: {
      id,
    },

    data: {
      status,
    },

  });


  // ==========================================================
  // REFRESH INQUIRY PAGE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/inquiries"
  );

}


// ============================================================
// DELETE INQUIRY
// ============================================================

export async function deleteInquiry(
  id: number
) {

  // ==========================================================
  // PERMISSION
  // ==========================================================

  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
  ]);


  // ==========================================================
  // DELETE INQUIRY
  // ==========================================================
  //
  // InquiryItem has:
  //
  // inquiry Inquiry
  //
  // with onDelete: Cascade
  //
  // Therefore deleting the Inquiry will also
  // delete all related InquiryItems automatically.
  //

  await prisma.inquiry.delete({

    where: {
      id,
    },

  });


  // ==========================================================
  // REFRESH INQUIRY PAGE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/inquiries"
  );

}