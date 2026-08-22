import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/authorize";

import {
  createPaymentMethod,
} from "../_actions/payment-method.actions";

import PaymentMethodForm from "../_components/PaymentMethodForm";


export const dynamic =
  "force-dynamic";


// ============================================================
// PAGE
// ============================================================

export default async function NewPaymentMethodPage() {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main
      className="
        space-y-6

        sm:space-y-8
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div>

        <Link
          href="/admin/dashboard/payment-methods"
          className="
            inline-flex
            min-h-9
            items-center
            gap-2
            text-sm
            font-medium
            text-neutral-500
            transition
            hover:text-neutral-900
          "
        >

          <ArrowLeft
            className="
              h-4
              w-4
            "
          />

          Payment Methods

        </Link>


        <div
          className="
            mt-4

            sm:mt-5
          "
        >

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.25em]
              text-neutral-400

              sm:text-xs
            "
          >
            SYSTEM
          </p>


          <h1
            className="
              mt-1.5
              text-3xl
              font-semibold
              tracking-tight
              text-neutral-900

              sm:mt-2
            "
          >
            Add Payment Method
          </h1>


          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-neutral-500
            "
          >
            Add a bank transfer or QR payment
            method for customers to use during
            checkout.
          </p>

        </div>

      </div>


      {/* ================================================== */}
      {/* FORM */}
      {/* ================================================== */}

      <PaymentMethodForm
        action={
          createPaymentMethod
        }
      />

    </main>

  );

}