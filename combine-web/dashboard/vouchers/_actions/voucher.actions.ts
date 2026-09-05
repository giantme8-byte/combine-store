"use server";

import {
  UserRole,
  VoucherType,
} from "@prisma/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";


// ============================================================
// TYPES
// ============================================================

type VoucherFormData = {
  code: string;
  type: VoucherType;
  value: number;
  minSpend: number;
  maxDiscount: number | null;
  category: string | null;
  startAt: string;
  expiresAt: string | null;
  usageLimit: number | null;
  usagePerCustomer: number | null;
  newCustomerOnly: boolean;
  isActive: boolean;
};


// ============================================================
// HELPERS
// ============================================================

function cleanCode(
  code: string
) {

  return code
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");

}


function parseOptionalNumber(
  value: string | null
) {

  if (
    value === null ||
    value.trim() === ""
  ) {
    return null;
  }

  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return null;
  }

  return number;

}


function parseBoolean(
  value: FormDataEntryValue | null
) {

  if (
    typeof value !== "string"
  ) {
    return false;
  }

  return (
    value === "true" ||
    value === "on" ||
    value === "1"
  );

}


function parseDate(
  value: string,
  fieldName: string
) {

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      `Invalid ${fieldName}.`
    );
  }

  return date;

}


// ============================================================
// VALIDATE VOUCHER
// ============================================================

function validateVoucher(
  data: VoucherFormData
) {

  // ==========================================================
  // CODE
  // ==========================================================

  if (
    !data.code
  ) {
    throw new Error(
      "Voucher code is required."
    );
  }

  if (
    data.code.length < 3
  ) {
    throw new Error(
      "Voucher code must be at least 3 characters."
    );
  }

  if (
    data.code.length > 50
  ) {
    throw new Error(
      "Voucher code cannot exceed 50 characters."
    );
  }


  // ==========================================================
  // VALUE
  // ==========================================================

  if (
    !Number.isFinite(
      data.value
    ) ||
    data.value <= 0
  ) {
    throw new Error(
      "Discount value must be greater than 0."
    );
  }


  // ==========================================================
  // PERCENTAGE
  // ==========================================================

  if (
    data.type ===
    VoucherType.PERCENTAGE
  ) {

    if (
      data.value > 100
    ) {
      throw new Error(
        "Percentage discount cannot exceed 100%."
      );
    }

  }


  // ==========================================================
  // FIXED DISCOUNT
  // ==========================================================

  if (
    data.type ===
    VoucherType.FIXED
  ) {

    if (
      data.value > 1000000
    ) {
      throw new Error(
        "Fixed discount value is too large."
      );
    }

  }


  // ==========================================================
  // MIN SPEND
  // ==========================================================

  if (
    !Number.isFinite(
      data.minSpend
    ) ||
    data.minSpend < 0
  ) {
    throw new Error(
      "Minimum spend cannot be negative."
    );
  }


  // ==========================================================
  // MAX DISCOUNT
  // ==========================================================

  if (
    data.maxDiscount !== null
  ) {

    if (
      !Number.isFinite(
        data.maxDiscount
      ) ||
      data.maxDiscount <= 0
    ) {
      throw new Error(
        "Maximum discount must be greater than 0."
      );
    }

  }


  // ==========================================================
  // USAGE LIMIT
  // ==========================================================

  if (
    data.usageLimit !== null
  ) {

    if (
      !Number.isInteger(
        data.usageLimit
      ) ||
      data.usageLimit <= 0
    ) {
      throw new Error(
        "Usage limit must be a positive whole number."
      );
    }

  }


  // ==========================================================
  // USAGE PER CUSTOMER
  // ==========================================================

  if (
    data.usagePerCustomer !== null
  ) {

    if (
      !Number.isInteger(
        data.usagePerCustomer
      ) ||
      data.usagePerCustomer <= 0
    ) {
      throw new Error(
        "Usage per customer must be a positive whole number."
      );
    }

  }


  // ==========================================================
  // DATE
  // ==========================================================

  const startAt =
    parseDate(
      data.startAt,
      "start date"
    );


  if (
    data.expiresAt
  ) {

    const expiresAt =
      parseDate(
        data.expiresAt,
        "expiry date"
      );

    if (
      expiresAt <=
      startAt
    ) {
      throw new Error(
        "Expiry date must be later than the start date."
      );
    }

  }

}


// ============================================================
// PARSE FORM DATA
// ============================================================

function parseVoucherFormData(
  formData: FormData
): VoucherFormData {

  const code =
    cleanCode(
      String(
        formData.get("code") ??
        ""
      )
    );


  const typeValue =
    String(
      formData.get("type") ??
      ""
    );


  const type =
    typeValue ===
    VoucherType.PERCENTAGE

      ? VoucherType.PERCENTAGE

      : VoucherType.FIXED;


  const value =
    Number(
      formData.get("value") ??
      0
    );


  const minSpend =
    Number(
      formData.get("minSpend") ??
      0
    );


  const maxDiscount =
    parseOptionalNumber(
      formData.get(
        "maxDiscount"
      )?.toString() ??
        null
    );


  const categoryValue =
    String(
      formData.get("category") ??
      ""
    ).trim();


  const category =
    categoryValue
      ? categoryValue
      : null;


  const startAt =
    String(
      formData.get("startAt") ??
      ""
    );


  const expiresAtValue =
    String(
      formData.get("expiresAt") ??
      ""
    ).trim();


  const expiresAt =
    expiresAtValue
      ? expiresAtValue
      : null;


  const usageLimit =
    parseOptionalNumber(
      formData.get(
        "usageLimit"
      )?.toString() ??
        null
    );


  const usagePerCustomer =
    parseOptionalNumber(
      formData.get(
        "usagePerCustomer"
      )?.toString() ??
        null
    );


  const newCustomerOnly =
    parseBoolean(
      formData.get(
        "newCustomerOnly"
      )
    );


  const isActiveValue =
    formData.get(
      "isActive"
    );


  const isActive =
    isActiveValue === null
      ? true
      : parseBoolean(
          isActiveValue
        );


  return {
    code,
    type,
    value,
    minSpend,
    maxDiscount,
    category,
    startAt,
    expiresAt,
    usageLimit,
    usagePerCustomer,
    newCustomerOnly,
    isActive,
  };

}


// ============================================================
// CREATE VOUCHER
// ============================================================

export async function createVoucher(
  formData: FormData
) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);


  // ==========================================================
  // PARSE
  // ==========================================================

  const data =
    parseVoucherFormData(
      formData
    );


  // ==========================================================
  // VALIDATE
  // ==========================================================

  validateVoucher(
    data
  );


  // ==========================================================
  // CHECK DUPLICATE CODE
  // ==========================================================

  const existing =
    await prisma.voucher.findUnique({
      where: {
        code: data.code,
      },
    });


  if (
    existing
  ) {
    throw new Error(
      "A voucher with this code already exists."
    );
  }


  // ==========================================================
  // CREATE
  // ==========================================================

  await prisma.voucher.create({

    data: {

      code:
        data.code,

      type:
        data.type,

      value:
        data.value,

      minSpend:
        data.minSpend,

      maxDiscount:
        data.maxDiscount,

      category:
        data.category,

      startAt:
        parseDate(
          data.startAt,
          "start date"
        ),

      expiresAt:
        data.expiresAt
          ? parseDate(
              data.expiresAt,
              "expiry date"
            )
          : null,

      usageLimit:
        data.usageLimit,

      usagePerCustomer:
        data.usagePerCustomer,

      newCustomerOnly:
        data.newCustomerOnly,

      isActive:
        data.isActive,

    },

  });


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/vouchers"
  );


  // ==========================================================
  // REDIRECT
  // ==========================================================

  redirect(
    "/admin/dashboard/vouchers"
  );

}


// ============================================================
// UPDATE VOUCHER
// ============================================================

export async function updateVoucher(
  id: number,
  formData: FormData
) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);


  // ==========================================================
  // VALIDATE ID
  // ==========================================================

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      "Invalid voucher ID."
    );
  }


  // ==========================================================
  // FIND VOUCHER
  // ==========================================================

  const existing =
    await prisma.voucher.findUnique({
      where: {
        id,
      },
    });


  if (
    !existing
  ) {
    throw new Error(
      "Voucher not found."
    );
  }


  // ==========================================================
  // PARSE
  // ==========================================================

  const data =
    parseVoucherFormData(
      formData
    );


  // ==========================================================
  // VALIDATE
  // ==========================================================

  validateVoucher(
    data
  );


  // ==========================================================
  // CHECK DUPLICATE CODE
  // ==========================================================

  const duplicate =
    await prisma.voucher.findFirst({

      where: {

        code:
          data.code,

        NOT: {
          id,
        },

      },

    });


  if (
    duplicate
  ) {
    throw new Error(
      "A voucher with this code already exists."
    );
  }


  // ==========================================================
  // PROTECT HISTORICAL VOUCHER USAGE
  // ==========================================================
  //
  // Once a voucher has been used, changing its discount
  // rules could create confusion when reviewing historical
  // orders.
  //
  // Therefore:
  // - Code cannot be changed after usage.
  // - Discount rules can still be edited intentionally.
  //
  // ==========================================================

  if (
    existing.usageCount > 0 &&
    data.code !== existing.code
  ) {

    throw new Error(
      "Voucher code cannot be changed after the voucher has been used."
    );

  }


  // ==========================================================
  // UPDATE
  // ==========================================================

  await prisma.voucher.update({

    where: {
      id,
    },

    data: {

      code:
        data.code,

      type:
        data.type,

      value:
        data.value,

      minSpend:
        data.minSpend,

      maxDiscount:
        data.maxDiscount,

      category:
        data.category,

      startAt:
        parseDate(
          data.startAt,
          "start date"
        ),

      expiresAt:
        data.expiresAt
          ? parseDate(
              data.expiresAt,
              "expiry date"
            )
          : null,

      usageLimit:
        data.usageLimit,

      usagePerCustomer:
        data.usagePerCustomer,

      newCustomerOnly:
        data.newCustomerOnly,

      isActive:
        data.isActive,

    },

  });


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/vouchers"
  );

  revalidatePath(
    `/admin/dashboard/vouchers/${id}`
  );


  // ==========================================================
  // REDIRECT
  // ==========================================================

  redirect(
    `/admin/dashboard/vouchers/${id}`
  );

}


// ============================================================
// TOGGLE VOUCHER STATUS
// ============================================================

export async function toggleVoucherStatus(
  id: number
) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);


  // ==========================================================
  // VALIDATE ID
  // ==========================================================

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      "Invalid voucher ID."
    );
  }


  // ==========================================================
  // FIND VOUCHER
  // ==========================================================

  const voucher =
    await prisma.voucher.findUnique({
      where: {
        id,
      },
    });


  if (
    !voucher
  ) {
    throw new Error(
      "Voucher not found."
    );
  }


  // ==========================================================
  // TOGGLE
  // ==========================================================

  await prisma.voucher.update({

    where: {
      id,
    },

    data: {
      isActive:
        !voucher.isActive,
    },

  });


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/vouchers"
  );

  revalidatePath(
    `/admin/dashboard/vouchers/${id}`
  );


  return {
    success: true,
    isActive:
      !voucher.isActive,
  };

}


// ============================================================
// DELETE VOUCHER
// ============================================================

export async function deleteVoucher(
  id: number
) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);


  // ==========================================================
  // VALIDATE ID
  // ==========================================================

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      "Invalid voucher ID."
    );
  }


  // ==========================================================
  // FIND VOUCHER
  // ==========================================================

  const voucher =
    await prisma.voucher.findUnique({

      where: {
        id,
      },

      include: {

        _count: {
          select: {
            usage: true,
          },
        },

      },

    });


  if (
    !voucher
  ) {
    throw new Error(
      "Voucher not found."
    );
  }


  // ==========================================================
  // PROTECT USED VOUCHERS
  // ==========================================================
  //
  // VoucherUsage has onDelete: Restrict.
  // Used vouchers are historical business records.
  //
  // Therefore we do NOT allow deleting a voucher that has
  // already been used.
  //
  // ==========================================================

  if (
    voucher._count.usage >
    0
  ) {

    throw new Error(
      "This voucher has already been used and cannot be deleted. Deactivate it instead."
    );

  }


  // ==========================================================
  // DELETE
  // ==========================================================

  await prisma.voucher.delete({
    where: {
      id,
    },
  });


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/vouchers"
  );


  // ==========================================================
  // REDIRECT
  // ==========================================================

  redirect(
    "/admin/dashboard/vouchers"
  );

}