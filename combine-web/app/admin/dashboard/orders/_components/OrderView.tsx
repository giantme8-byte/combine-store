"use client";

import { useEffect, useState } from "react";

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

  orderNumber: string | null;

  customerName: string;

  customerPhone: string;

  customerEmail: string | null;

  finalAmount: number;

  paypalFee: number;

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
  | "QR"
  | "PAYPAL"
  | "WISE";

    amount: number;

    status:
      | "PENDING"
      | "SUBMITTED"
      | "VERIFIED"
      | "REJECTED";

    bankName: string | null;

    accountName: string | null;

    accountNumber: string | null;

    qrImageUrl: string | null;

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

  // ==========================================================
  // VIEW STATE
  // ==========================================================

  const [
    view,
    setView,
  ] = useState<
    "table" | "grid"
  >("table");


  const [
    mounted,
    setMounted,
  ] = useState(false);


  // ==========================================================
  // HYDRATION
  // ==========================================================

  useEffect(() => {

    setMounted(true);


    const savedView =
      localStorage.getItem(
        "order-view"
      );


    if (
      savedView === "table" ||
      savedView === "grid"
    ) {

      setView(
        savedView
      );

    }

  }, []);


  // ==========================================================
  // SAVE VIEW PREFERENCE
  // ==========================================================

  useEffect(() => {

    if (!mounted) {
      return;
    }


    localStorage.setItem(
      "order-view",
      view
    );

  }, [
    view,
    mounted,
  ]);


  // ==========================================================
  // DESKTOP VIEW
  //
  // Mobile is always Grid.
  // Desktop remembers selected view.
  // ==========================================================

  const desktopView =
    mounted
      ? view
      : "table";


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        min-w-0
        space-y-5
      "
    >

      {/* ==================================================== */}
      {/* FILTERS */}
      {/* ==================================================== */}

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


      {/* ==================================================== */}
      {/* VIEW SWITCHER */}
      {/* ==================================================== */}

      <div
        className="
          flex
          justify-end
        "
      >

        <div
          className="
            flex
            shrink-0
            rounded-xl
            border
            border-neutral-200
            bg-white
            p-1
          "
        >

          {/* ================================================= */}
          {/* TABLE */}
          {/* Desktop only */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={() =>
              setView("table")
            }
            className={`
              hidden
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-sm
              transition

              sm:flex
              sm:px-4

              ${
                desktopView ===
                "table"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >

            <Table
              size={17}
            />

            Table

          </button>


          {/* ================================================= */}
          {/* GRID */}
          {/* Mobile + Desktop */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={() =>
              setView("grid")
            }
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              px-3
              py-2
              text-sm
              transition

              sm:px-4

              ${
                desktopView ===
                "grid"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
          >

            <LayoutGrid
              size={17}
            />

            <span
              className="
                hidden
                sm:inline
              "
            >
              Grid
            </span>

          </button>

        </div>

      </div>


      {/* ==================================================== */}
      {/* MOBILE */}
      {/* Always Grid */}
      {/* ==================================================== */}

      <div
        className="
          block
          min-w-0
          sm:hidden
        "
      >

        <OrderGrid
          orders={
            orders
          }
        />

      </div>


      {/* ==================================================== */}
      {/* DESKTOP */}
      {/* Table / Grid */}
      {/* ==================================================== */}

      <div
        className="
          hidden
          min-w-0
          sm:block
        "
      >

        {desktopView ===
        "table" ? (

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

    </div>
  );
}