"use server";

import {
  OrderStatus,
  PaymentStatus,
  UserRole,
} from "@prisma/client";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";
import { sendEmail } from "@/lib/email";


// ============================================================
// VERIFY PAYMENT
// ============================================================

export async function verifyPayment(
  orderId: number
) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  const user =
    await requireRole([
      UserRole.ADMIN,
      UserRole.OWNER,
    ]);


  // ==========================================================
  // VALIDATE ORDER ID
  // ==========================================================

  if (
    !Number.isInteger(orderId) ||
    orderId <= 0
  ) {
    throw new Error(
      "Invalid order ID."
    );
  }


  // ==========================================================
  // FIND ORDER
  // ==========================================================

  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        payment: true,
      },
    });


  if (!order) {
    throw new Error(
      "Order not found."
    );
  }


  if (!order.payment) {
    throw new Error(
      "Payment record not found."
    );
  }


  // ==========================================================
  // PAYMENT STATUS VALIDATION
  // ==========================================================

  if (
    order.payment.status ===
    PaymentStatus.VERIFIED
  ) {
    throw new Error(
      "Payment has already been verified."
    );
  }


  if (
    order.payment.status !==
    PaymentStatus.SUBMITTED
  ) {
    throw new Error(
      "Payment must be submitted before it can be verified."
    );
  }


  if (
    !order.payment.proofUrl
  ) {
    throw new Error(
      "Payment proof is required before verification."
    );
  }


  // ==========================================================
  // VERIFY PAYMENT + UPDATE ORDER
  // ==========================================================

  await prisma.$transaction(
    async (tx) => {

      await tx.payment.update({
        where: {
          id:
            order.payment!.id,
        },

        data: {

          status:
            PaymentStatus.VERIFIED,

          verifiedAt:
            new Date(),

          verifiedBy:
            user.id,

          adminNote:
            null,

        },
      });


      await tx.order.update({
        where: {
          id:
            order.id,
        },

        data: {

          status:
            OrderStatus.PAID,

        },
      });

    }
  );


  // ==========================================================
  // PAYMENT VERIFIED EMAIL
  // ==========================================================

  // The payment/order update above must remain successful even
  // if the email service is temporarily unavailable.
  if (order.customerEmail) {

    try {

      await sendEmail({

        to:
          order.customerEmail,

        subject:
          `🎉 Payment Verified — Order #${order.id}`,

        html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Payment Verified</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background: #f7f7f7;
                font-family: Arial, Helvetica, sans-serif;
                color: #171717;
              "
            >

              <div
                style="
                  max-width: 620px;
                  margin: 0 auto;
                  padding: 48px 20px;
                "
              >

                <div
                  style="
                    background: #ffffff;
                    border: 1px solid #e5e5e5;
                    border-radius: 18px;
                    padding: 40px 32px;
                  "
                >

                  <div
                    style="
                      text-align: center;
                      margin-bottom: 32px;
                    "
                  >

                    <div
                      style="
                        font-size: 12px;
                        letter-spacing: 4px;
                        color: #999999;
                        text-transform: uppercase;
                      "
                    >
                      COMBINE
                    </div>

                    <h1
                      style="
                        margin: 18px 0 0;
                        font-size: 28px;
                        font-weight: 500;
                        letter-spacing: -0.5px;
                      "
                    >
                      🎉 Payment Verified
                    </h1>

                  </div>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                    "
                  >
                    Hi ${order.customerName},
                  </p>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    Great news! 🎉 Your payment for
                    <strong style="color: #171717;">
                      Order #${order.id}
                    </strong>
                    has been successfully verified by our team.
                  </p>

                  <div
                    style="
                      margin: 28px 0;
                      padding: 20px;
                      border-radius: 14px;
                      background: #fafafa;
                      border: 1px solid #eeeeee;
                    "
                  >

                    <div
                      style="
                        font-size: 11px;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        color: #999999;
                        margin-bottom: 8px;
                      "
                    >
                      Order Status
                    </div>

                    <div
                      style="
                        font-size: 16px;
                        font-weight: 600;
                      "
                    >
                      Payment Verified ✅
                    </div>

                  </div>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    Your order is now confirmed and our team will
                    begin processing it shortly. 📦
                  </p>

                  <p
                    style="
                      margin: 0;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    We’ll keep you updated once your order has been
                    shipped and your tracking information is available. 🚚
                  </p>

                  <div
                    style="
                      margin-top: 36px;
                      padding-top: 24px;
                      border-top: 1px solid #eeeeee;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.8;
                        color: #737373;
                      "
                    >
                      Thank you for shopping with
                      <strong style="color: #171717;">
                        COMBINE
                      </strong>
                      . 🤍
                    </p>

                    <p
                      style="
                        margin: 8px 0 0;
                        font-size: 14px;
                        color: #737373;
                      "
                    >
                      COMBINE Team
                    </p>

                  </div>

                </div>

              </div>

            </body>
          </html>
        `,

      });

    } catch (emailError) {

      console.error(
        `Failed to send payment verification email for order #${order.id}:`,
        emailError
      );

    }

  }


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  revalidatePath(
    "/admin/dashboard/orders"
  );

  revalidatePath(
    `/admin/dashboard/orders/${order.id}`
  );


  return {
    success: true,
  };
}


// ============================================================
// REJECT PAYMENT
// ============================================================

export async function rejectPayment(
  orderId: number,
  adminNote?: string
) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);


  // ==========================================================
  // VALIDATE ORDER ID
  // ==========================================================

  if (
    !Number.isInteger(orderId) ||
    orderId <= 0
  ) {
    throw new Error(
      "Invalid order ID."
    );
  }


  // ==========================================================
  // FIND ORDER
  // ==========================================================

  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        payment: true,
      },
    });


  if (!order) {
    throw new Error(
      "Order not found."
    );
  }


  if (!order.payment) {
    throw new Error(
      "Payment record not found."
    );
  }


  // ==========================================================
  // PAYMENT STATUS VALIDATION
  // ==========================================================

  if (
    order.payment.status ===
    PaymentStatus.VERIFIED
  ) {
    throw new Error(
      "A verified payment cannot be rejected."
    );
  }


  // Only SUBMITTED payments can be rejected.
  //
  // PENDING means the customer has not submitted
  // payment proof yet.
  //
  // REJECTED means the payment has already been rejected
  // and the customer must submit a new proof.

  if (
    order.payment.status !==
    PaymentStatus.SUBMITTED
  ) {
    throw new Error(
      "Payment must be submitted before it can be rejected."
    );
  }


  // ==========================================================
  // ADMIN NOTE
  // ==========================================================

  const note =
    adminNote
      ?.trim() || null;


  if (!note) {
    throw new Error(
      "A rejection reason is required."
    );
  }


  // ==========================================================
  // REJECT PAYMENT + UPDATE ORDER
  // ==========================================================

  await prisma.$transaction(
    async (tx) => {

      await tx.payment.update({
        where: {
          id:
            order.payment!.id,
        },

        data: {

          status:
            PaymentStatus.REJECTED,

          verifiedAt:
            null,

          verifiedBy:
            null,

          adminNote:
            note,

        },
      });


      await tx.order.update({
        where: {
          id:
            order.id,
        },

        data: {

          status:
            OrderStatus.PENDING_PAYMENT,

        },
      });

    }
  );


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  // ==========================================================
  // PAYMENT REJECTED EMAIL
  // ==========================================================

  // The payment/order update above must remain successful even
  // if the email service is temporarily unavailable.
  if (order.customerEmail) {

    try {

      await sendEmail({

        to:
          order.customerEmail,

        subject:
          `⚠️ Payment Rejected — Order #${order.id}`,

        html: `
          <!DOCTYPE html>
          <html lang="en">

            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>Payment Rejected</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background: #f7f7f7;
                font-family: Arial, Helvetica, sans-serif;
                color: #171717;
              "
            >

              <div
                style="
                  max-width: 620px;
                  margin: 0 auto;
                  padding: 48px 20px;
                "
              >

                <div
                  style="
                    background: #ffffff;
                    border: 1px solid #e5e5e5;
                    border-radius: 18px;
                    padding: 40px 32px;
                  "
                >

                  <div
                    style="
                      text-align: center;
                      margin-bottom: 32px;
                    "
                  >

                    <div
                      style="
                        font-size: 12px;
                        letter-spacing: 4px;
                        color: #999999;
                        text-transform: uppercase;
                      "
                    >
                      COMBINE
                    </div>

                    <h1
                      style="
                        margin: 18px 0 0;
                        font-size: 28px;
                        font-weight: 500;
                        letter-spacing: -0.5px;
                      "
                    >
                      ⚠️ Payment Rejected
                    </h1>

                  </div>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                    "
                  >
                    Hi ${order.customerName},
                  </p>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    We’re sorry, but your payment proof for
                    <strong style="color: #171717;">
                      Order #${order.id}
                    </strong>
                    could not be verified.
                  </p>

                  <div
                    style="
                      margin: 28px 0;
                      padding: 20px;
                      border-radius: 14px;
                      background: #fff7f7;
                      border: 1px solid #f1d5d5;
                    "
                  >

                    <div
                      style="
                        font-size: 11px;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        color: #999999;
                        margin-bottom: 8px;
                      "
                    >
                      Reason
                    </div>

                    <div
                      style="
                        font-size: 15px;
                        line-height: 1.8;
                        color: #525252;
                        white-space: pre-line;
                      "
                    >
                      ${note}
                    </div>

                  </div>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    Please review the payment details and submit a new
                    payment proof for this order.
                  </p>

                  <p
                    style="
                      margin: 0;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    Once your new payment proof is submitted, our team
                    will review it again.
                  </p>

                  <div
                    style="
                      margin-top: 36px;
                      padding-top: 24px;
                      border-top: 1px solid #eeeeee;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.8;
                        color: #737373;
                      "
                    >
                      Thank you for shopping with
                      <strong style="color: #171717;">
                        COMBINE
                      </strong>
                      . 🤍
                    </p>

                    <p
                      style="
                        margin: 8px 0 0;
                        font-size: 14px;
                        color: #737373;
                      "
                    >
                      COMBINE Team
                    </p>

                  </div>

                </div>

              </div>

            </body>

          </html>
        `,

      });

    } catch (emailError) {

      console.error(
        `Failed to send payment rejection email for order #${order.id}:`,
        emailError
      );

    }

  }


  revalidatePath(
    "/admin/dashboard/orders"
  );

  revalidatePath(
    `/admin/dashboard/orders/${order.id}`
  );


  return {
    success: true,
  };
}


// ============================================================
// UPDATE ORDER FULFILLMENT STATUS
// ============================================================

export async function updateOrderFulfillmentStatus(
  orderId: number,
  nextStatus: OrderStatus
) {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);


  // ==========================================================
  // VALIDATE ORDER ID
  // ==========================================================

  if (
    !Number.isInteger(orderId) ||
    orderId <= 0
  ) {
    throw new Error(
      "Invalid order ID."
    );
  }


  // ==========================================================
  // ALLOWED FULFILLMENT STATUSES
  // ==========================================================

  const allowedStatuses:
    OrderStatus[] = [
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
    ];


  if (
    !allowedStatuses.includes(
      nextStatus
    )
  ) {
    throw new Error(
      "Invalid fulfillment status."
    );
  }


  // ==========================================================
  // FIND ORDER
  // ==========================================================

  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      select: {
        id: true,
        status: true,

        customerName: true,
        customerEmail: true,

        shippingCourier: true,
        trackingNumber: true,
      },
    });


  if (!order) {
    throw new Error(
      "Order not found."
    );
  }


  // ==========================================================
  // CURRENT STATUS
  // ==========================================================

  const currentStatus =
    order.status;


  // ==========================================================
  // PAID → PROCESSING
  // ==========================================================

  if (
    nextStatus ===
    OrderStatus.PROCESSING
  ) {

    if (
      currentStatus !==
      OrderStatus.PAID
    ) {
      throw new Error(
        "Only paid orders can be moved to processing."
      );
    }

  }


  // ==========================================================
  // PROCESSING → SHIPPED
  // ==========================================================

  if (
    nextStatus ===
    OrderStatus.SHIPPED
  ) {

    // --------------------------------------------------------
    // STATUS VALIDATION
    // --------------------------------------------------------

    if (
      currentStatus !==
      OrderStatus.PROCESSING
    ) {
      throw new Error(
        "Only processing orders can be marked as shipped."
      );
    }


    // --------------------------------------------------------
    // SHIPPING COURIER REQUIRED
    // --------------------------------------------------------

    if (
      !order.shippingCourier?.trim()
    ) {
      throw new Error(
        "Shipping courier is required before the order can be marked as shipped."
      );
    }


    // --------------------------------------------------------
    // TRACKING NUMBER REQUIRED
    // --------------------------------------------------------

    if (
      !order.trackingNumber?.trim()
    ) {
      throw new Error(
        "Tracking number is required before the order can be marked as shipped."
      );
    }

  }


  // ==========================================================
  // SHIPPED → COMPLETED
  // ==========================================================

  if (
    nextStatus ===
    OrderStatus.COMPLETED
  ) {

    if (
      currentStatus !==
      OrderStatus.SHIPPED
    ) {
      throw new Error(
        "Only shipped orders can be completed."
      );
    }

  }


  // ==========================================================
  // CANCEL ORDER
  // ==========================================================

  if (
    nextStatus ===
    OrderStatus.CANCELLED
  ) {

    if (
      currentStatus ===
      OrderStatus.COMPLETED
    ) {
      throw new Error(
        "Completed orders cannot be cancelled."
      );
    }


    if (
      currentStatus ===
      OrderStatus.CANCELLED
    ) {
      throw new Error(
        "Order has already been cancelled."
      );
    }

  }


  // ==========================================================
  // UPDATE ORDER
  // ==========================================================

  await prisma.order.update({
    where: {
      id:
        order.id,
    },

    data: {

      status:
        nextStatus,

    },
  });


  // ==========================================================
  // REVALIDATE
  // ==========================================================

  // ==========================================================
  // ORDER COMPLETED EMAIL
  // ==========================================================

  // Only send the completion email when the order is actually
  // moved from SHIPPED to COMPLETED.
  if (
    nextStatus === OrderStatus.COMPLETED &&
    currentStatus === OrderStatus.SHIPPED &&
    order.customerEmail
  ) {

    try {

      await sendEmail({

        to:
          order.customerEmail,

        subject:
          `🎉 Order Completed — Order #${order.id}`,

        html: `
          <!DOCTYPE html>
          <html lang="en">

            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>Order Completed</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background: #f7f7f7;
                font-family: Arial, Helvetica, sans-serif;
                color: #171717;
              "
            >

              <div
                style="
                  max-width: 620px;
                  margin: 0 auto;
                  padding: 48px 20px;
                "
              >

                <div
                  style="
                    background: #ffffff;
                    border: 1px solid #e5e5e5;
                    border-radius: 18px;
                    padding: 40px 32px;
                  "
                >

                  <div
                    style="
                      text-align: center;
                      margin-bottom: 32px;
                    "
                  >

                    <div
                      style="
                        font-size: 12px;
                        letter-spacing: 4px;
                        color: #999999;
                        text-transform: uppercase;
                      "
                    >
                      COMBINE
                    </div>

                    <h1
                      style="
                        margin: 18px 0 0;
                        font-size: 28px;
                        font-weight: 500;
                        letter-spacing: -0.5px;
                      "
                    >
                      🎉 Order Completed
                    </h1>

                  </div>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                    "
                  >
                    Hi ${order.customerName},
                  </p>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    Your order
                    <strong style="color: #171717;">
                      #${order.id}
                    </strong>
                    has been marked as completed. 🎉
                  </p>

                  <div
                    style="
                      margin: 28px 0;
                      padding: 20px;
                      border-radius: 14px;
                      background: #fafafa;
                      border: 1px solid #eeeeee;
                    "
                  >

                    <div
                      style="
                        font-size: 11px;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        color: #999999;
                        margin-bottom: 8px;
                      "
                    >
                      Order Status
                    </div>

                    <div
                      style="
                        font-size: 16px;
                        font-weight: 600;
                      "
                    >
                      Completed ✅
                    </div>

                  </div>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    We hope you enjoy your purchase and thank you for
                    choosing COMBINE.
                  </p>

                  <p
                    style="
                      margin: 0;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    We truly appreciate your support. 🤍
                  </p>

                  <div
                    style="
                      margin-top: 36px;
                      padding-top: 24px;
                      border-top: 1px solid #eeeeee;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.8;
                        color: #737373;
                      "
                    >
                      Thank you for shopping with
                      <strong style="color: #171717;">
                        COMBINE
                      </strong>
                      .
                    </p>

                    <p
                      style="
                        margin: 8px 0 0;
                        font-size: 14px;
                        color: #737373;
                      "
                    >
                      COMBINE Team
                    </p>

                  </div>

                </div>

              </div>

            </body>

          </html>
        `,

      });

    } catch (emailError) {

      console.error(
        `Failed to send completion email for order #${order.id}:`,
        emailError
      );

    }

  }



  revalidatePath(
    "/admin/dashboard/orders"
  );

  revalidatePath(
    `/admin/dashboard/orders/${order.id}`
  );


  return {
    success: true,
  };
}


// ============================================================
// UPDATE SHIPPING INFORMATION
// ============================================================

export async function updateShippingInformation(
  orderId: number,
  trackingNumber: string,
  trackingUrl?: string
) {

  await requireRole([
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    throw new Error("Invalid order ID.");
  }

  const shippingCourier = "ABX Express";
  const tracking = trackingNumber.trim();
  const url = trackingUrl?.trim() || null;

  if (!tracking) {
    throw new Error("Tracking number is required.");
  }

  if (url) {
    try {
      new URL(url);
    } catch {
      throw new Error("Please enter a valid tracking URL.");
    }
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      customerName: true,
      customerEmail: true,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const previousStatus =
    order.status;

  if (
    order.status !== OrderStatus.PROCESSING &&
    order.status !== OrderStatus.SHIPPED
  ) {
    throw new Error(
      "Shipping information can only be updated for processing or shipped orders."
    );
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      shippingCourier,
      trackingNumber: tracking,
      trackingUrl: url,
      status: OrderStatus.SHIPPED,
    },
  });


  // ==========================================================
  // SHIPPED EMAIL
  // ==========================================================

  // Only send this email when the order is first moved
  // from PROCESSING to SHIPPED. Updating an existing
  // tracking number will not send another email.
  if (
    previousStatus === OrderStatus.PROCESSING &&
    order.customerEmail
  ) {

    try {

      const trackingButton =
        url
          ? `
            <div
              style="
                margin: 30px 0;
                text-align: center;
              "
            >
              <a
                href="${url}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  display: inline-block;
                  padding: 13px 22px;
                  border-radius: 10px;
                  background: #171717;
                  color: #ffffff;
                  font-size: 14px;
                  font-weight: 600;
                  text-decoration: none;
                "
              >
                Track Shipment ↗
              </a>
            </div>
          `
          : "";

      await sendEmail({

        to:
          order.customerEmail,

        subject:
          `🚚 Your Order Has Shipped — Order #${order.id}`,

        html: `
          <!DOCTYPE html>
          <html lang="en">

            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>Your Order Has Shipped</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background: #f7f7f7;
                font-family: Arial, Helvetica, sans-serif;
                color: #171717;
              "
            >

              <div
                style="
                  max-width: 620px;
                  margin: 0 auto;
                  padding: 48px 20px;
                "
              >

                <div
                  style="
                    background: #ffffff;
                    border: 1px solid #e5e5e5;
                    border-radius: 18px;
                    padding: 40px 32px;
                  "
                >

                  <div
                    style="
                      text-align: center;
                      margin-bottom: 32px;
                    "
                  >

                    <div
                      style="
                        font-size: 12px;
                        letter-spacing: 4px;
                        color: #999999;
                        text-transform: uppercase;
                      "
                    >
                      COMBINE
                    </div>

                    <h1
                      style="
                        margin: 18px 0 0;
                        font-size: 28px;
                        font-weight: 500;
                        letter-spacing: -0.5px;
                      "
                    >
                      🚚 Your Order Has Shipped
                    </h1>

                  </div>

                  <p
                    style="
                      margin: 0 0 18px;
                      font-size: 15px;
                      line-height: 1.8;
                    "
                  >
                    Hi ${order.customerName},
                  </p>

                  <p
                    style="
                      margin: 0 0 24px;
                      font-size: 15px;
                      line-height: 1.8;
                      color: #525252;
                    "
                  >
                    Great news! 🎉 Your order
                    <strong style="color: #171717;">
                      #${order.id}
                    </strong>
                    has been shipped.
                  </p>

                  <div
                    style="
                      margin: 28px 0;
                      padding: 20px;
                      border-radius: 14px;
                      background: #fafafa;
                      border: 1px solid #eeeeee;
                    "
                  >

                    <div
                      style="
                        font-size: 11px;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        color: #999999;
                        margin-bottom: 8px;
                      "
                    >
                      Shipping Method
                    </div>

                    <div
                      style="
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 20px;
                      "
                    >
                      ABX Express
                    </div>

                    <div
                      style="
                        font-size: 11px;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        color: #999999;
                        margin-bottom: 8px;
                      "
                    >
                      Tracking Number
                    </div>

                    <div
                      style="
                        font-size: 16px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        word-break: break-all;
                      "
                    >
                      ${tracking}
                    </div>

                  </div>

                  ${trackingButton}

                  <p
                    style="
                      margin: 0;
                      font-size: 14px;
                      line-height: 1.8;
                      color: #737373;
                    "
                  >
                    Your tracking information is now available.
                    You can use the tracking number above to follow
                    your shipment. 📦
                  </p>

                  <div
                    style="
                      margin-top: 36px;
                      padding-top: 24px;
                      border-top: 1px solid #eeeeee;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.8;
                        color: #737373;
                      "
                    >
                      Thank you for shopping with
                      <strong style="color: #171717;">
                        COMBINE
                      </strong>
                      . 🤍
                    </p>

                    <p
                      style="
                        margin: 8px 0 0;
                        font-size: 14px;
                        color: #737373;
                      "
                    >
                      COMBINE Team
                    </p>

                  </div>

                </div>

              </div>

            </body>

          </html>
        `,

      });

    } catch (emailError) {

      console.error(
        `Failed to send shipped email for order #${order.id}:`,
        emailError
      );

    }

  }


  revalidatePath("/admin/dashboard/orders");
  revalidatePath(`/admin/dashboard/orders/${order.id}`);

  return {
    success: true,
    shippingCourier,
    trackingNumber: tracking,
  };
}