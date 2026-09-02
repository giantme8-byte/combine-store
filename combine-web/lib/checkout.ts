import { prisma } from "@/lib/prisma";

// ============================================================
// TYPES
// ============================================================

export type CheckoutItem = {
  productId: number;
  quantity: number;
  variantId?: number | null;
};

export type ShippingRegion =
  | "WEST"
  | "EAST";

export type VoucherCalculation = {
  code: string | null;
  discount: number;
  error: string | null;
  voucherId: number | null;
};

export type ShippingCalculation = {
  courier: "ABX" | "MANUAL";
  region: ShippingRegion | null;
  fee: number;
  isFree: boolean;
};

export type CheckoutCalculation = {
  subtotal: number;
  voucherDiscount: number;
  shippingFee: number;

  /*
   * PayPal payment processing fee.
   *
   * Store-side fee:
   *
   * 6% of the order amount
   * + RM2.00 fixed fee
   *
   * Only applied when payment method is PAYPAL.
   */
  paypalFee: number;

  finalAmount: number;

  voucher: VoucherCalculation;
  shipping: ShippingCalculation;
};


// ============================================================
// CONSTANTS
// ============================================================

const WEST_SHIPPING_FEE = 15;

const EAST_SHIPPING_FEE = 25;


// ============================================================
// PAYPAL FEE
// ============================================================

/*
 * Store-side PayPal fee:
 *
 * 6% + RM2.00
 *
 * Example:
 *
 * RM100
 * 6% = RM6.00
 * Fixed = RM2.00
 *
 * PayPal Fee = RM8.00
 *
 * Final = RM108.00
 */

const PAYPAL_FEE_RATE = 0.06;

const PAYPAL_FEE_FIXED = 2.00;


// ============================================================
// EAST MALAYSIA STATES
// ============================================================

const EAST_MALAYSIA_STATES = [
  "sabah",
  "sarawak",
];


// ============================================================
// NORMALIZE MONEY
// ============================================================

function roundMoney(
  amount: number
) {
  return Math.round(
    (
      amount +
      Number.EPSILON
    ) *
      100
  ) / 100;
}


// ============================================================
// SHIPPING REGION
// ============================================================

export function getShippingRegion(
  state: string
): ShippingRegion {

  const normalizedState =
    state
      .trim()
      .toLowerCase();

  if (
    EAST_MALAYSIA_STATES.includes(
      normalizedState
    )
  ) {
    return "EAST";
  }

  return "WEST";
}


// ============================================================
// CALCULATE SHIPPING
// ============================================================

export function calculateShipping({
  totalQuantity,
  state,
  country = "Malaysia",
  internationalShippingFee,
}: {
  totalQuantity: number;
  state?: string | null;
  country?: string | null;
  internationalShippingFee?: number | null;
}): ShippingCalculation {

  const normalizedCountry =
    (country ?? "Malaysia").trim();

  // ------------------------------------------------------------
  // INTERNATIONAL SHIPPING
  // ------------------------------------------------------------

  if (
    normalizedCountry &&
    normalizedCountry !== "Malaysia"
  ) {
    const fee =
      Math.max(
        Number(internationalShippingFee ?? 0),
        0
      );

    return {
      courier: "MANUAL",
      region: null,
      fee: roundMoney(fee),
      isFree: false,
    };
  }

  const region =
    getShippingRegion(
      state ?? ""
    );


  /*
   * Two or more items:
   *
   * FREE ABX SHIPPING
   */

  if (
    totalQuantity >= 2
  ) {

    return {
      courier: "ABX",
      region,
      fee: 0,
      isFree: true,
    };

  }


  /*
   * One item:
   *
   * West Malaysia = RM15
   * East Malaysia = RM25
   */

  const fee =
    region === "EAST"
      ? EAST_SHIPPING_FEE
      : WEST_SHIPPING_FEE;


  return {
    courier: "ABX",
    region,
    fee,
    isFree: false,
  };

}


// ============================================================
// CALCULATE VOUCHER
// ============================================================

export async function calculateVoucher({
  code,
  subtotal,
  userId,
  productCategories,
}: {
  code?: string | null;
  subtotal: number;
  userId?: number | null;
  productCategories: string[];
}): Promise<VoucherCalculation> {

  const normalizedCode =
    code
      ?.trim()
      .toUpperCase();


  /*
   * No voucher entered.
   */

  if (
    !normalizedCode
  ) {

    return {
      code: null,
      discount: 0,
      error: null,
      voucherId: null,
    };

  }


  // ==========================================================
  // FIND VOUCHER
  // ==========================================================

  const voucher =
    await prisma.voucher.findUnique({
      where: {
        code:
          normalizedCode,
      },
    });


  if (!voucher) {

    return {
      code: normalizedCode,
      discount: 0,
      error:
        "Invalid voucher code.",
      voucherId: null,
    };

  }


  // ==========================================================
  // ACTIVE
  // ==========================================================

  if (
    !voucher.isActive
  ) {

    return {
      code: normalizedCode,
      discount: 0,
      error:
        "This voucher is no longer available.",
      voucherId: voucher.id,
    };

  }


  // ==========================================================
  // START DATE
  // ==========================================================

  const now =
    new Date();


  if (
    now < voucher.startAt
  ) {

    return {
      code: normalizedCode,
      discount: 0,
      error:
        "This voucher is not available yet.",
      voucherId: voucher.id,
    };

  }


  // ==========================================================
  // EXPIRY
  // ==========================================================

  if (
    voucher.expiresAt &&
    now > voucher.expiresAt
  ) {

    return {
      code: normalizedCode,
      discount: 0,
      error:
        "This voucher has expired.",
      voucherId: voucher.id,
    };

  }


  // ==========================================================
  // TOTAL USAGE LIMIT
  // ==========================================================

  if (
    voucher.usageLimit !== null &&
    voucher.usageCount >=
      voucher.usageLimit
  ) {

    return {
      code: normalizedCode,
      discount: 0,
      error:
        "This voucher has reached its usage limit.",
      voucherId: voucher.id,
    };

  }


  // ==========================================================
  // MINIMUM SPEND
  // ==========================================================

  if (
    subtotal <
    voucher.minSpend
  ) {

    return {
      code: normalizedCode,
      discount: 0,
      error:
        `Minimum spend of RM${voucher.minSpend.toFixed(
          2
        )} is required.`,
      voucherId: voucher.id,
    };

  }


  // ==========================================================
  // CATEGORY
  // ==========================================================

  if (
    voucher.category
  ) {

    const requiredCategory =
      voucher.category
        .trim()
        .toLowerCase();


    const eligible =
      productCategories.some(
        (category) =>
          category
            .trim()
            .toLowerCase() ===
          requiredCategory
      );


    if (!eligible) {

      return {
        code: normalizedCode,
        discount: 0,
        error:
          `This voucher is only valid for ${voucher.category}.`,
        voucherId: voucher.id,
      };

    }

  }


  // ==========================================================
  // NEW CUSTOMER ONLY
  // ==========================================================

  if (
    voucher.newCustomerOnly
  ) {

    /*
     * If the customer is not logged in,
     * we cannot safely confirm that they
     * are a new customer.
     *
     * Therefore this voucher requires
     * a logged-in customer.
     */

    if (!userId) {

      return {
        code: normalizedCode,
        discount: 0,
        error:
          "Please log in to use this voucher.",
        voucherId: voucher.id,
      };

    }


    const existingOrder =
      await prisma.order.findFirst({
        where: {
          userId,
        },
        select: {
          id: true,
        },
      });


    if (existingOrder) {

      return {
        code: normalizedCode,
        discount: 0,
        error:
          "This voucher is only available to new customers.",
        voucherId: voucher.id,
      };

    }

  }


  // ==========================================================
  // PER CUSTOMER LIMIT
  // ==========================================================

  if (
    voucher.usagePerCustomer !== null
  ) {

    if (!userId) {

      return {
        code: normalizedCode,
        discount: 0,
        error:
          "Please log in to use this voucher.",
        voucherId: voucher.id,
      };

    }


    const customerUsageCount =
      await prisma.voucherUsage.count({
        where: {
          voucherId:
            voucher.id,
          userId,
        },
      });


    if (
      customerUsageCount >=
      voucher.usagePerCustomer
    ) {

      return {
        code: normalizedCode,
        discount: 0,
        error:
          "You have already reached the usage limit for this voucher.",
        voucherId: voucher.id,
      };

    }

  }


  // ==========================================================
  // CALCULATE DISCOUNT
  // ==========================================================

  let discount = 0;


  if (
    voucher.type ===
    "FIXED"
  ) {

    discount =
      voucher.value;

  }


  if (
    voucher.type ===
    "PERCENTAGE"
  ) {

    discount =
      subtotal *
      (
        voucher.value /
        100
      );

  }


  // ==========================================================
  // MAX DISCOUNT
  // ==========================================================

  if (
    voucher.maxDiscount !== null &&
    discount >
      voucher.maxDiscount
  ) {

    discount =
      voucher.maxDiscount;

  }


  // ==========================================================
  // NEVER DISCOUNT MORE THAN SUBTOTAL
  // ==========================================================

  if (
    discount >
    subtotal
  ) {

    discount =
      subtotal;

  }


  discount =
    roundMoney(
      Math.max(
        discount,
        0
      )
    );


  // ==========================================================
  // SUCCESS
  // ==========================================================

  return {
    code:
      normalizedCode,

    discount,

    error:
      null,

    voucherId:
      voucher.id,
  };

}


// ============================================================
// CALCULATE PAYPAL FEE
// ============================================================

export function calculatePaypalFee({
  amount,
  paymentMethodType,
}: {
  amount: number;
  paymentMethodType?:
    | "BANK_TRANSFER"
    | "QR"
    | "PAYPAL"
    | "WISE"
    | null;
}): number {

  /*
   * Only PAYPAL receives
   * the additional processing fee.
   */

  if (
    paymentMethodType !==
    "PAYPAL"
  ) {
    return 0;
  }


  if (
    amount <= 0
  ) {
    return 0;
  }


  const percentageFee =
    amount *
    PAYPAL_FEE_RATE;


  const paypalFee =
    percentageFee +
    PAYPAL_FEE_FIXED;


  return roundMoney(
    paypalFee
  );

}


// ============================================================
// COMPLETE CHECKOUT CALCULATION
// ============================================================

export async function calculateCheckout({
  subtotal,
  totalQuantity,
  state,
  country = "Malaysia",
  internationalShippingFee,
  voucherCode,
  userId,
  productCategories,
  paymentMethodType,
}: {
  subtotal: number;

  totalQuantity: number;

  state?: string | null;

  country?: string | null;

  internationalShippingFee?: number | null;

  voucherCode?: string | null;

  userId?: number | null;

  productCategories: string[];

  paymentMethodType?:
    | "BANK_TRANSFER"
    | "QR"
    | "PAYPAL"
    | "WISE"
    | null;
}): Promise<CheckoutCalculation> {


  // ==========================================================
  // VOUCHER
  // ==========================================================

  const voucher =
    await calculateVoucher({
      code:
        voucherCode,

      subtotal,

      userId,

      productCategories,
    });


  // ==========================================================
  // SHIPPING
  // ==========================================================

  const shipping =
    calculateShipping({
      totalQuantity,

      state,
    });


  // ==========================================================
  // BASE AMOUNT
  // ==========================================================

  /*
   * Base amount before PayPal fee:
   *
   * Subtotal
   * - Voucher Discount
   * + Shipping
   */

  const baseAmount =
    roundMoney(
      Math.max(
        subtotal -
          voucher.discount +
          shipping.fee,
        0
      )
    );


  // ==========================================================
  // PAYPAL FEE
  // ==========================================================

  /*
   * PayPal fee is calculated
   * from the amount customer
   * would otherwise pay.
   *
   * Example:
   *
   * Subtotal = RM100
   * Shipping = RM15
   * Voucher = RM0
   *
   * Base = RM115
   *
   * PayPal fee:
   * RM115 × 6% + RM2.00
   * = RM8.90
   *
   * Final:
   * RM123.90
   */

  const paypalFee =
    calculatePaypalFee({
      amount:
        baseAmount,

      paymentMethodType,
    });


  // ==========================================================
  // FINAL
  // ==========================================================

  const finalAmount =
    roundMoney(
      Math.max(
        baseAmount +
          paypalFee,
        0
      )
    );


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    subtotal:
      roundMoney(
        subtotal
      ),

    voucherDiscount:
      voucher.discount,

    shippingFee:
      shipping.fee,

    paypalFee,

    finalAmount,

    voucher,

    shipping,

  };

}