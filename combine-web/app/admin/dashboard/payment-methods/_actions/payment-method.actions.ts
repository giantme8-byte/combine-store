"use server";

import {
  PaymentMethodType,
  UserRole,
} from "@prisma/client";

import { redirect } from "next/navigation";

import { requireRole } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";


// ============================================================
// HELPERS
// ============================================================

function getString(
  formData: FormData,
  key: string
) {
  const value =
    formData.get(key);

  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value.trim();
}


// ============================================================
// VALIDATE PAYMENT METHOD TYPE
// ============================================================

function getPaymentMethodType(
  value: string
): PaymentMethodType {

  if (
    value ===
    PaymentMethodType.BANK_TRANSFER
  ) {
    return PaymentMethodType.BANK_TRANSFER;
  }

  if (
    value ===
    PaymentMethodType.QR
  ) {
    return PaymentMethodType.QR;
  }

  if (
    value ===
    PaymentMethodType.PAYPAL
  ) {
    return PaymentMethodType.PAYPAL;
  }

  if (
    value ===
    PaymentMethodType.WISE
  ) {
    return PaymentMethodType.WISE;
  }

  throw new Error(
    "Invalid payment method type."
  );
}


// ============================================================
// CREATE PAYMENT METHOD
// ============================================================

export async function createPaymentMethod(
  formData: FormData
) {

  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);


  // ==========================================================
  // FORM DATA
  // ==========================================================

  const name =
    getString(
      formData,
      "name"
    );


  const typeValue =
    getString(
      formData,
      "type"
    );


  const instructions =
    getString(
      formData,
      "instructions"
    );


  const bankName =
    getString(
      formData,
      "bankName"
    );


  const accountName =
    getString(
      formData,
      "accountName"
    );


  const accountNumber =
    getString(
      formData,
      "accountNumber"
    );


  const qrImageUrl =
    getString(
      formData,
      "qrImageUrl"
    );


  const qrPublicId =
    getString(
      formData,
      "qrPublicId"
    );


  const wiseName =
    getString(
      formData,
      "wiseName"
    );


  const wiseEmail =
    getString(
      formData,
      "wiseEmail"
    );


  const wiseAccount =
    getString(
      formData,
      "wiseAccount"
    );


  const sortOrderValue =
    getString(
      formData,
      "sortOrder"
    );


  const active =
    formData.get(
      "active"
    ) === "on";


  // ==========================================================
  // BASIC VALIDATION
  // ==========================================================

  if (!name) {

    throw new Error(
      "Payment method name is required."
    );

  }


  // ==========================================================
  // PAYMENT TYPE
  // ==========================================================

  const type =
    getPaymentMethodType(
      typeValue
    );


  // ==========================================================
  // SORT ORDER
  // ==========================================================

  const parsedSortOrder =
    Number(
      sortOrderValue
    );


  const sortOrder =
    Number.isFinite(
      parsedSortOrder
    )
      ? parsedSortOrder
      : 9999;


  // ==========================================================
  // PAYMENT-SPECIFIC DATA
  // ==========================================================

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
    type ===
    PaymentMethodType.QR
      ? qrImageUrl || null
      : null;


  const finalQrPublicId =
    type ===
    PaymentMethodType.QR
      ? qrPublicId || null
      : null;


  const finalWiseName =
    type ===
    PaymentMethodType.WISE
      ? wiseName || null
      : null;


  const finalWiseEmail =
    type ===
    PaymentMethodType.WISE
      ? wiseEmail || null
      : null;


  const finalWiseAccount =
    type ===
    PaymentMethodType.WISE
      ? wiseAccount || null
      : null;


  // ==========================================================
  // CREATE
  // ==========================================================

  await prisma.paymentMethod.create({

    data: {

      name,

      type,

      bankName:
        finalBankName,

      accountName:
        finalAccountName,

      accountNumber:
        finalAccountNumber,

      qrImageUrl:
        finalQrImageUrl,

      qrPublicId:
        finalQrPublicId,

      wiseName:
        finalWiseName,

      wiseEmail:
        finalWiseEmail,

      wiseAccount:
        finalWiseAccount,

      instructions:
        instructions || null,

      active,

      sortOrder,

    },

  });


  // ==========================================================
  // REDIRECT
  // ==========================================================

  redirect(
    "/admin/dashboard/payment-methods"
  );
}


// ============================================================
// UPDATE PAYMENT METHOD
// ============================================================

export async function updatePaymentMethod(
  id: number,
  formData: FormData
) {

  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);


  // ==========================================================
  // LOAD EXISTING
  // ==========================================================

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


  // ==========================================================
  // FORM DATA
  // ==========================================================

  const name =
    getString(
      formData,
      "name"
    );


  const typeValue =
    getString(
      formData,
      "type"
    );


  const instructions =
    getString(
      formData,
      "instructions"
    );


  const bankName =
    getString(
      formData,
      "bankName"
    );


  const accountName =
    getString(
      formData,
      "accountName"
    );


  const accountNumber =
    getString(
      formData,
      "accountNumber"
    );


  const qrImageUrl =
    getString(
      formData,
      "qrImageUrl"
    );


  const qrPublicId =
    getString(
      formData,
      "qrPublicId"
    );


  const wiseName =
    getString(
      formData,
      "wiseName"
    );


  const wiseEmail =
    getString(
      formData,
      "wiseEmail"
    );


  const wiseAccount =
    getString(
      formData,
      "wiseAccount"
    );


  const sortOrderValue =
    getString(
      formData,
      "sortOrder"
    );


  const active =
    formData.get(
      "active"
    ) === "on";


  // ==========================================================
  // BASIC VALIDATION
  // ==========================================================

  if (!name) {

    throw new Error(
      "Payment method name is required."
    );

  }


  // ==========================================================
  // PAYMENT TYPE
  // ==========================================================

  const type =
    getPaymentMethodType(
      typeValue
    );


  // ==========================================================
  // SORT ORDER
  // ==========================================================

  const parsedSortOrder =
    Number(
      sortOrderValue
    );


  const sortOrder =
    Number.isFinite(
      parsedSortOrder
    )
      ? parsedSortOrder
      : 9999;


  // ==========================================================
  // PAYMENT-SPECIFIC DATA
  // ==========================================================

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
    type ===
    PaymentMethodType.QR
      ? qrImageUrl || null
      : null;


  const finalQrPublicId =
    type ===
    PaymentMethodType.QR
      ? qrPublicId || null
      : null;


  const finalWiseName =
    type ===
    PaymentMethodType.WISE
      ? wiseName || null
      : null;


  const finalWiseEmail =
    type ===
    PaymentMethodType.WISE
      ? wiseEmail || null
      : null;


  const finalWiseAccount =
    type ===
    PaymentMethodType.WISE
      ? wiseAccount || null
      : null;


  // ==========================================================
  // QR REPLACEMENT CHECK
  // ==========================================================

  const qrWasReplaced =
    Boolean(
      existing.qrPublicId
    ) &&
    existing.qrPublicId !==
      finalQrPublicId;


  // ==========================================================
  // UPDATE
  // ==========================================================

  await prisma.paymentMethod.update({

    where: {
      id,
    },

    data: {

      name,

      type,

      bankName:
        finalBankName,

      accountName:
        finalAccountName,

      accountNumber:
        finalAccountNumber,

      qrImageUrl:
        finalQrImageUrl,

      qrPublicId:
        finalQrPublicId,

      wiseName:
        finalWiseName,

      wiseEmail:
        finalWiseEmail,

      wiseAccount:
        finalWiseAccount,

      instructions:
        instructions || null,

      active,

      sortOrder,

    },

  });


  // ==========================================================
  // DELETE OLD QR
  // ==========================================================

  if (
    qrWasReplaced
  ) {

    try {

      await cloudinary.uploader.destroy(
        existing.qrPublicId!,
        {
          resource_type:
            "image",
        }
      );

    } catch (error) {

      console.error(
        "Failed to delete old payment QR from Cloudinary:",
        error
      );

    }

  }


  // ==========================================================
  // REDIRECT
  // ==========================================================

  redirect(
    "/admin/dashboard/payment-methods"
  );
}


// ============================================================
// DELETE PAYMENT METHOD
// ============================================================

export async function deletePaymentMethod(
  id: number
) {

  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);


  // ==========================================================
  // LOAD EXISTING
  // ==========================================================

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


  // ==========================================================
  // DELETE DATABASE RECORD
  // ==========================================================

  await prisma.paymentMethod.delete({

    where: {
      id,
    },

  });


  // ==========================================================
  // DELETE QR FROM CLOUDINARY
  // ==========================================================

  if (
    existing.qrPublicId
  ) {

    try {

      await cloudinary.uploader.destroy(
        existing.qrPublicId,
        {
          resource_type:
            "image",
        }
      );

    } catch (error) {

      console.error(
        "Failed to delete payment QR from Cloudinary:",
        error
      );

    }

  }


  // ==========================================================
  // REDIRECT
  // ==========================================================

  redirect(
    "/admin/dashboard/payment-methods"
  );
}