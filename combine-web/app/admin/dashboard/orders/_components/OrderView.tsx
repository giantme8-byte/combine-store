"use client";

import { useState } from "react";

import {
  LayoutGrid,
  Table,
} from "lucide-react";

import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderGrid from "./OrderGrid";


// ============================================================
// ORDER TYPE
// ============================================================

type Order = {
  id: number;

  customerName: string;

  customerPhone: string;

  customerEmail: string | null;

  finalAmount: number;

  status: string;

  createdAt: Date;

  shippingCourier: string | null;

  trackingNumber: string | null;

  trackingUrl: string | null;

  items: {

    id: number;

    productName: string;

    quantity: number;

    unitPrice: number;

    totalPrice: number;

    unitCost: number | null;

    totalCost: number | null;

    profit: number | null;

  }[];

  payment: {

    id: number;

    paymentMethodName: string;

    paymentMethodType:
      | "BANK_TRANSFER"
      | "QR";

    amount: number;

    status:
      | "PENDING"
      | "SUBMITTED"
      | "VERIFIED"
      | "REJECTED";

    proofUrl: string | null;

    proofPublicId: string | null;

    verifiedAt: Date | null;

    verifiedBy: number | null;

    adminNote: string | null;

  } | null;
};


// ============================================================
// PROPS
// ============================================================

type OrderViewProps = {
  orders: Order[];

  search: string;

  orderStatus: string;

  paymentStatus: string;
};


// ============================================================
// COMPONENT
// ============================================================

export default function OrderView({
  orders,
  search,
  orderStatus,
  paymentStatus,
}: OrderViewProps) {

  const [
    view,
    setView,
  ] = useState<
    "table" | "grid"
  >("table");


  return (

    <div
      className="
        space-y-5
      "
    >


      {/* ====================================================== */}
      {/* FILTERS */}
      {/* ====================================================== */}

      <OrderFilters
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


      {/* ====================================================== */}
      {/* VIEW SWITCHER */}
      {/* ====================================================== */}

      <div
        className="
          flex
          justify-end
        "
      >

        <div
          className="
            flex
            rounded-xl
            border
            border-neutral-200
            bg-white
            p-1
          "
        >


          {/* ================================================== */}
          {/* TABLE VIEW */}
          {/* ================================================== */}

          <button
            type="button"
            onClick={() =>
              setView(
                "table"
              )
            }
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              text-sm
              transition
              ${
                view === "table"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >

            <Table
              size={18}
            />

            Table

          </button>


          {/* ================================================== */}
          {/* GRID VIEW */}
          {/* ================================================== */}

          <button
            type="button"
            onClick={() =>
              setView(
                "grid"
              )
            }
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              text-sm
              transition
              ${
                view === "grid"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >

            <LayoutGrid
              size={18}
            />

            Grid

          </button>

        </div>

      </div>


      {/* ====================================================== */}
      {/* CONTENT */}
      {/* ====================================================== */}

      {view === "table" ? (

        <OrderTable
          orders={
            orders
          }
        />

      ) : (

        <OrderGrid
          orders={
            orders
          }
        />

      )}

    </div>

  );

}