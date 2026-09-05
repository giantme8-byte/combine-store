import PageHeader from "../_components/PageHeader";
import Card from "../_components/Card";

import OrderView from "./_components/OrderView";

import { prisma } from "@/lib/prisma";

import type {
  Prisma,
} from "@prisma/client";


// ============================================================
// PROPS
// ============================================================

type OrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    orderStatus?: string;
    paymentStatus?: string;
  }>;
};


// ============================================================
// ORDER STATUSES
// ============================================================

const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAYMENT_REVIEW",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;


// ============================================================
// PAYMENT STATUSES
// ============================================================

const PAYMENT_STATUSES = [
  "PENDING",
  "SUBMITTED",
  "VERIFIED",
  "REJECTED",
] as const;


// ============================================================
// PAGE
// ============================================================

export default async function OrdersPage({
  searchParams,
}: OrdersPageProps) {

  const params =
    await searchParams;


  // ==========================================================
  // SEARCH
  // ==========================================================

  const search =
    params.search?.trim() ?? "";


  // ==========================================================
  // ORDER STATUS FILTER
  // ==========================================================

  const orderStatus =
    params.orderStatus &&
    ORDER_STATUSES.includes(
      params.orderStatus as
        (typeof ORDER_STATUSES)[number]
    )
      ? params.orderStatus
      : "";


  // ==========================================================
  // PAYMENT STATUS FILTER
  // ==========================================================

  const paymentStatus =
    params.paymentStatus &&
    PAYMENT_STATUSES.includes(
      params.paymentStatus as
        (typeof PAYMENT_STATUSES)[number]
    )
      ? params.paymentStatus
      : "";


  // ==========================================================
  // BUILD WHERE
  // ==========================================================

  const where:
    Prisma.OrderWhereInput = {};


  // ==========================================================
  // ORDER STATUS
  // ==========================================================

  if (orderStatus) {

    where.status =
      orderStatus as
        (typeof ORDER_STATUSES)[number];

  }


  // ==========================================================
  // PAYMENT STATUS
  // ==========================================================

  if (paymentStatus) {

    where.payment = {
      is: {
        status:
          paymentStatus as
            (typeof PAYMENT_STATUSES)[number],
      },
    };

  }


  // ==========================================================
  // SEARCH
  // ==========================================================

  if (search) {

    const numericOrderId =
      Number(search);


    const searchConditions:
      Prisma.OrderWhereInput[] = [


      // ------------------------------------------------------
      // CUSTOMER NAME
      // ------------------------------------------------------

      {
        customerName: {
          contains:
            search,

          mode:
            "insensitive",
        },
      },


      // ------------------------------------------------------
      // CUSTOMER PHONE
      // ------------------------------------------------------

      {
        customerPhone: {
          contains:
            search,

          mode:
            "insensitive",
        },
      },


      // ------------------------------------------------------
      // SHIPPING COURIER
      // ------------------------------------------------------

      {
        shippingCourier: {
          contains:
            search,

          mode:
            "insensitive",
        },
      },


      // ------------------------------------------------------
      // TRACKING NUMBER
      // ------------------------------------------------------

      {
        trackingNumber: {
          contains:
            search,

          mode:
            "insensitive",
        },
      },

    ];


    // --------------------------------------------------------
    // ORDER ID
    // --------------------------------------------------------

    if (
      Number.isInteger(
        numericOrderId
      ) &&
      numericOrderId > 0
    ) {

      searchConditions.push({
        id:
          numericOrderId,
      });

    }


    where.OR =
      searchConditions;

  }


  // ============================================================
  // LOAD ORDERS
  // ============================================================

  const orders =
    await prisma.order.findMany({

      where,

      orderBy: {
        createdAt:
          "desc",
      },

      include: {


        // ======================================================
        // ORDER ITEMS
        // ======================================================

        items: {

          select: {

            id: true,

            productName: true,

            quantity: true,

            unitPrice: true,

            totalPrice: true,

            unitCost: true,

            totalCost: true,

            profit: true,

          },

        },


        // ======================================================
        // PAYMENT
        // ======================================================

        payment: {

          select: {

            id: true,

            paymentMethodName:
              true,

            paymentMethodType:
              true,

            amount:
              true,

            status:
              true,

            // --------------------------------------------------
            // PAYMENT ACCOUNT DETAILS
            // --------------------------------------------------

            bankName:
              true,

            accountName:
              true,

            accountNumber:
              true,

            qrImageUrl:
              true,

            // --------------------------------------------------
            // PAYMENT PROOF
            // --------------------------------------------------

            proofUrl:
              true,

            proofPublicId:
              true,

            verifiedAt:
              true,

            verifiedBy:
              true,

            adminNote:
              true,

          },

        },

      },

    });


  // ============================================================
  // RETURN
  // ============================================================

  return (

    <main
      className="
        space-y-8
      "
    >


      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <PageHeader
        title="Orders"
        description="Manage customer orders."
      />


      {/* ====================================================== */}
      {/* ORDERS */}
      {/* ====================================================== */}

      <Card>

        <OrderView
          orders={
            orders
          }

          search={
            search
          }

          orderStatus={
            orderStatus
          }

          paymentStatus={
            paymentStatus
          }
        />

      </Card>


    </main>

  );

}