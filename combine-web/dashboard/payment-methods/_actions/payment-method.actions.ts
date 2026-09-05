"use server";

import {
  PaymentMethodType,
  UserRole,
} from "@prisma/client";

import { redirect } from "next/navigation";

import { requireRole } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

function getString(
  formData: FormData,
  key: string
) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

/**
 * Create Payment Method
 */
export async function createPaymentMethod(
  formData: FormData
) {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);

  const name =
    getString(formData, "name");

  const typeValue =
    getString(formData, "type");

  const instructions =
    getString(formData, "instructions");

  const bankName =
    getString(formData, "bankName");

  const accountName =
    getString(formData, "accountName");

  const accountNumber =
    getString(formData, "accountNumber");

  const qrImageUrl =
    getString(formData, "qrImageUrl");

  const qrPublicId =
    getString(formData, "qrPublicId");

  const sortOrderValue =
    getString(formData, "sortOrder");

  const active =
    formData.get("active") === "on";

  if (!name) {
    throw new Error(
      "Payment method name is required."
    );
  }

  if (
    typeValue !==
      PaymentMethodType.BANK_TRANSFER &&
    typeValue !==
      PaymentMethodType.QR
  ) {
    throw new Error(
      "Invalid payment method type."
    );
  }

  const type =
    typeValue as PaymentMethodType;

  const parsedSortOrder =
    Number(sortOrderValue);

  const sortOrder =
    Number.isFinite(parsedSortOrder)
      ? parsedSortOrder
      : 9999;

  const finalBankName =
    type ===
    PaymentMethodType.BANK_TRANSFER
      ? bankName || null
      : null;

  const finalAccountName =
    type ===
    PaymentMethodType.BANK_TRANSFER
      ? accountName || null
      : null;

  const finalAccountNumber =
    type ===
    PaymentMethodType.BANK_TRANSFER
      ? accountNumber || null
      : null;

  const finalQrImageUrl =
    type === PaymentMethodType.QR
      ? qrImageUrl || null
      : null;

  const finalQrPublicId =
    type === PaymentMethodType.QR
      ? qrPublicId || null
      : null;

  await prisma.paymentMethod.create({
    data: {
      name,
      type,

      bankName: finalBankName,
      accountName: finalAccountName,
      accountNumber: finalAccountNumber,

      qrImageUrl: finalQrImageUrl,
      qrPublicId: finalQrPublicId,

      instructions:
        instructions || null,

      active,
      sortOrder,
    },
  });

  redirect(
    "/admin/dashboard/payment-methods"
  );
}

/**
 * Update Payment Method
 */
export async function updatePaymentMethod(
  id: number,
  formData: FormData
) {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);

  const existing =
    await prisma.paymentMethod.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
    throw new Error(
      "Payment method not found."
    );
  }

  const name =
    getString(formData, "name");

  const typeValue =
    getString(formData, "type");

  const instructions =
    getString(formData, "instructions");

  const bankName =
    getString(formData, "bankName");

  const accountName =
    getString(formData, "accountName");

  const accountNumber =
    getString(formData, "accountNumber");

  const qrImageUrl =
    getString(formData, "qrImageUrl");

  const qrPublicId =
    getString(formData, "qrPublicId");

  const sortOrderValue =
    getString(formData, "sortOrder");

  const active =
    formData.get("active") === "on";

  if (!name) {
    throw new Error(
      "Payment method name is required."
    );
  }

  if (
    typeValue !==
      PaymentMethodType.BANK_TRANSFER &&
    typeValue !==
      PaymentMethodType.QR
  ) {
    throw new Error(
      "Invalid payment method type."
    );
  }

  const type =
    typeValue as PaymentMethodType;

  const parsedSortOrder =
    Number(sortOrderValue);

  const sortOrder =
    Number.isFinite(parsedSortOrder)
      ? parsedSortOrder
      : 9999;

  const finalBankName =
    type ===
    PaymentMethodType.BANK_TRANSFER
      ? bankName || null
      : null;

  const finalAccountName =
    type ===
    PaymentMethodType.BANK_TRANSFER
      ? accountName || null
      : null;

  const finalAccountNumber =
    type ===
    PaymentMethodType.BANK_TRANSFER
      ? accountNumber || null
      : null;

  const finalQrImageUrl =
    type === PaymentMethodType.QR
      ? qrImageUrl || null
      : null;

  const finalQrPublicId =
    type === PaymentMethodType.QR
      ? qrPublicId || null
      : null;

  /*
   * If the QR image was replaced,
   * remove the old Cloudinary image.
   *
   * We only remove it when:
   *
   * 1. The old record has a publicId.
   * 2. The new publicId is different.
   */
  const qrWasReplaced =
    existing.qrPublicId &&
    existing.qrPublicId !==
      finalQrPublicId;

  await prisma.paymentMethod.update({
    where: {
      id,
    },

    data: {
      name,
      type,

      bankName: finalBankName,
      accountName: finalAccountName,
      accountNumber: finalAccountNumber,

      qrImageUrl: finalQrImageUrl,
      qrPublicId: finalQrPublicId,

      instructions:
        instructions || null,

      active,
      sortOrder,
    },
  });

  /*
   * Delete the old QR from Cloudinary
   * only after the database update succeeds.
   */
  if (qrWasReplaced) {
    try {
      await cloudinary.uploader.destroy(
        existing.qrPublicId!,
        {
          resource_type: "image",
        }
      );
    } catch (error) {
      /*
       * Do not fail the payment method update
       * just because Cloudinary cleanup failed.
       *
       * The database already contains the new QR.
       */
      console.error(
        "Failed to delete old payment QR from Cloudinary:",
        error
      );
    }
  }

  redirect(
    "/admin/dashboard/payment-methods"
  );
}

/**
 * Delete Payment Method
 */
export async function deletePaymentMethod(
  id: number
) {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);

  const existing =
    await prisma.paymentMethod.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
    throw new Error(
      "Payment method not found."
    );
  }

  /*
   * Delete database record first.
   */
  await prisma.paymentMethod.delete({
    where: {
      id,
    },
  });

  /*
   * Then remove the QR image from Cloudinary.
   *
   * If Cloudinary cleanup fails,
   * the payment method is still successfully
   * deleted from the database.
   */
  if (existing.qrPublicId) {
    try {
      await cloudinary.uploader.destroy(
        existing.qrPublicId,
        {
          resource_type: "image",
        }
      );
    } catch (error) {
      console.error(
        "Failed to delete payment QR from Cloudinary:",
        error
      );
    }
  }

  redirect(
    "/admin/dashboard/payment-methods"
  );
}