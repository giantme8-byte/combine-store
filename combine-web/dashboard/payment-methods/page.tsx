import Link from "next/link";

import {
  CreditCard,
  Pencil,
  Plus,
  QrCode,
  ArrowLeftRight,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/authorize";

import DeletePaymentMethodButton from "./_components/DeletePaymentMethodButton";


export const dynamic = "force-dynamic";


// ============================================================
// PAGE
// ============================================================

export default async function PaymentMethodsPage() {

  // ==========================================================
  // AUTHORIZATION
  // ==========================================================

  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);


  // ==========================================================
  // LOAD PAYMENT METHODS
  // ==========================================================

  const paymentMethods =
    await prisma.paymentMethod.findMany({

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],

    });


  // ==========================================================
  // RETURN
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

      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >

        <div
          className="
            min-w-0
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
            Payment Methods
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
            Manage the payment methods displayed
            to customers during checkout.
          </p>

        </div>


        <Link
          href="/admin/dashboard/payment-methods/new"
          className="
            inline-flex
            min-h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-black
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-neutral-800

            sm:w-auto
          "
        >

          <Plus
            className="
              h-4
              w-4
            "
          />

          Add Payment Method

        </Link>

      </div>


      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      {paymentMethods.length === 0 ? (

        /* ==================================================
           EMPTY STATE
           ================================================== */

        <div
          className="
            rounded-2xl
            border
            border-neutral-200
            bg-white
            px-5
            py-12
            text-center
            shadow-sm

            sm:px-6
            sm:py-16
          "
        >

          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-neutral-100

              sm:h-14
              sm:w-14
            "
          >

            <CreditCard
              className="
                h-5
                w-5
                text-neutral-500

                sm:h-6
                sm:w-6
              "
            />

          </div>


          <h2
            className="
              mt-4
              text-lg
              font-semibold
              text-neutral-900

              sm:mt-5
            "
          >
            No Payment Methods
          </h2>


          <p
            className="
              mx-auto
              mt-2
              max-w-md
              text-sm
              leading-6
              text-neutral-500
            "
          >
            Add a bank transfer or QR payment
            method so customers can choose how
            they want to pay.
          </p>


          <Link
            href="/admin/dashboard/payment-methods/new"
            className="
              mt-5
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-black
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-neutral-800

              sm:mt-6
            "
          >

            <Plus
              className="
                h-4
                w-4
              "
            />

            Add Payment Method

          </Link>

        </div>

      ) : (

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-neutral-200
            bg-white
            shadow-sm
          "
        >

          {/* ==================================================
              DESKTOP TABLE
              ================================================== */}

          <div
            className="
              hidden
              overflow-x-auto

              md:block
            "
          >

            <table
              className="
                w-full
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    border-neutral-200
                    bg-neutral-50/70
                  "
                >

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-neutral-500

                      lg:px-6
                    "
                  >
                    Payment Method
                  </th>


                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-neutral-500

                      lg:px-6
                    "
                  >
                    Type
                  </th>


                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-neutral-500

                      lg:px-6
                    "
                  >
                    Details
                  </th>


                  <th
                    className="
                      px-5
                      py-4
                      text-center
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-neutral-500

                      lg:px-6
                    "
                  >
                    Status
                  </th>


                  <th
                    className="
                      px-5
                      py-4
                      text-center
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-neutral-500

                      lg:px-6
                    "
                  >
                    Order
                  </th>


                  <th
                    className="
                      px-5
                      py-4
                      text-right
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-neutral-500

                      lg:px-6
                    "
                  >
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {paymentMethods.map(
                  (paymentMethod) => {

                    const isQr =
                      paymentMethod.type ===
                      "QR";


                    return (

                      <tr
                        key={
                          paymentMethod.id
                        }
                        className="
                          border-b
                          border-neutral-100
                          transition
                          last:border-0
                          hover:bg-neutral-50
                        "
                      >

                        {/* ==================================
                            PAYMENT METHOD
                            ================================== */}

                        <td
                          className="
                            px-5
                            py-4

                            lg:px-6
                            lg:py-5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-neutral-100

                                lg:h-11
                                lg:w-11
                              "
                            >

                              {isQr ? (

                                <QrCode
                                  className="
                                    h-5
                                    w-5
                                    text-neutral-600
                                  "
                                />

                              ) : (

                                <ArrowLeftRight
                                  className="
                                    h-5
                                    w-5
                                    text-neutral-600
                                  "
                                />

                              )}

                            </div>


                            <div
                              className="
                                min-w-0
                              "
                            >

                              <p
                                className="
                                  font-medium
                                  text-neutral-900
                                "
                              >
                                {
                                  paymentMethod.name
                                }
                              </p>


                              {paymentMethod.instructions && (

                                <p
                                  className="
                                    mt-1
                                    max-w-xs
                                    truncate
                                    text-xs
                                    text-neutral-400
                                  "
                                >
                                  {
                                    paymentMethod.instructions
                                  }
                                </p>

                              )}

                            </div>

                          </div>

                        </td>


                        {/* ==================================
                            TYPE
                            ================================== */}

                        <td
                          className="
                            px-5
                            py-4

                            lg:px-6
                            lg:py-5
                          "
                        >

                          <span
                            className="
                              inline-flex
                              items-center
                              rounded-full
                              bg-neutral-100
                              px-3
                              py-1
                              text-xs
                              font-medium
                              text-neutral-700
                            "
                          >
                            {
                              isQr
                                ? "QR Payment"
                                : "Bank Transfer"
                            }
                          </span>

                        </td>


                        {/* ==================================
                            DETAILS
                            ================================== */}

                        <td
                          className="
                            px-5
                            py-4

                            lg:px-6
                            lg:py-5
                          "
                        >

                          {isQr ? (

                            <div
                              className="
                                text-sm
                                text-neutral-600
                              "
                            >
                              {
                                paymentMethod.qrImageUrl
                                  ? "QR Code uploaded"
                                  : "No QR Code"
                              }
                            </div>

                          ) : (

                            <div
                              className="
                                space-y-1
                                text-sm
                              "
                            >

                              {paymentMethod.bankName && (

                                <p
                                  className="
                                    font-medium
                                    text-neutral-800
                                  "
                                >
                                  {
                                    paymentMethod.bankName
                                  }
                                </p>

                              )}


                              {paymentMethod.accountName && (

                                <p
                                  className="
                                    text-neutral-500
                                  "
                                >
                                  {
                                    paymentMethod.accountName
                                  }
                                </p>

                              )}


                              {paymentMethod.accountNumber && (

                                <p
                                  className="
                                    font-mono
                                    text-xs
                                    text-neutral-500
                                  "
                                >
                                  {
                                    paymentMethod.accountNumber
                                  }
                                </p>

                              )}


                              {!paymentMethod.bankName &&
                                !paymentMethod.accountName &&
                                !paymentMethod.accountNumber && (

                                  <p
                                    className="
                                      text-neutral-400
                                    "
                                  >
                                    No bank details
                                  </p>

                                )}

                            </div>

                          )}

                        </td>


                        {/* ==================================
                            STATUS
                            ================================== */}

                        <td
                          className="
                            px-5
                            py-4
                            text-center

                            lg:px-6
                            lg:py-5
                          "
                        >

                          {paymentMethod.active ? (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-emerald-50
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-emerald-700
                              "
                            >

                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  bg-emerald-500
                                "
                              />

                              Active

                            </span>

                          ) : (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-neutral-100
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-neutral-500
                              "
                            >

                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  bg-neutral-400
                                "
                              />

                              Inactive

                            </span>

                          )}

                        </td>


                        {/* ==================================
                            SORT ORDER
                            ================================== */}

                        <td
                          className="
                            px-5
                            py-4
                            text-center
                            text-sm
                            text-neutral-500

                            lg:px-6
                            lg:py-5
                          "
                        >
                          {
                            paymentMethod.sortOrder
                          }
                        </td>


                        {/* ==================================
                            ACTIONS
                            ================================== */}

                        <td
                          className="
                            px-5
                            py-4
                            text-right

                            lg:px-6
                            lg:py-5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-end
                              gap-2
                            "
                          >

                            <Link
                              href={`/admin/dashboard/payment-methods/${paymentMethod.id}/edit`}
                              className="
                                inline-flex
                                min-h-9
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-neutral-200
                                px-3
                                py-2
                                text-sm
                                font-medium
                                text-neutral-700
                                transition
                                hover:bg-neutral-50
                              "
                            >

                              <Pencil
                                className="
                                  h-4
                                  w-4
                                "
                              />

                              Edit

                            </Link>


                            <DeletePaymentMethodButton
                              id={
                                paymentMethod.id
                              }
                              name={
                                paymentMethod.name
                              }
                            />

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>


          {/* ==================================================
              MOBILE CARDS
              ================================================== */}

          <div
            className="
              divide-y
              divide-neutral-100

              md:hidden
            "
          >

            {paymentMethods.map(
              (paymentMethod) => {

                const isQr =
                  paymentMethod.type ===
                  "QR";


                return (

                  <div
                    key={
                      paymentMethod.id
                    }
                    className="
                      p-4

                      sm:p-5
                    "
                  >

                    {/* ========================================
                        HEADER
                        ======================================== */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-neutral-100
                          "
                        >

                          {isQr ? (

                            <QrCode
                              className="
                                h-5
                                w-5
                                text-neutral-600
                              "
                            />

                          ) : (

                            <ArrowLeftRight
                              className="
                                h-5
                                w-5
                                text-neutral-600
                              "
                            />

                          )}

                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className="
                              truncate
                              text-sm
                              font-medium
                              text-neutral-900
                            "
                          >
                            {
                              paymentMethod.name
                            }
                          </p>


                          <p
                            className="
                              mt-1
                              text-xs
                              text-neutral-400
                            "
                          >
                            {
                              isQr
                                ? "QR Payment"
                                : "Bank Transfer"
                            }
                          </p>

                        </div>

                      </div>


                      {/* STATUS */}

                      {paymentMethod.active ? (

                        <span
                          className="
                            shrink-0
                            rounded-full
                            bg-emerald-50
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            text-emerald-700
                          "
                        >
                          Active
                        </span>

                      ) : (

                        <span
                          className="
                            shrink-0
                            rounded-full
                            bg-neutral-100
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            text-neutral-500
                          "
                        >
                          Inactive
                        </span>

                      )}

                    </div>


                    {/* ========================================
                        DETAILS
                        ======================================== */}

                    <div
                      className="
                        mt-4
                        rounded-xl
                        bg-neutral-50
                        p-3

                        sm:p-4
                      "
                    >

                      {isQr ? (

                        <p
                          className="
                            text-sm
                            text-neutral-600
                          "
                        >
                          {
                            paymentMethod.qrImageUrl
                              ? "QR Code uploaded"
                              : "No QR Code"
                          }
                        </p>

                      ) : (

                        <div
                          className="
                            space-y-1
                            text-sm
                          "
                        >

                          {paymentMethod.bankName && (

                            <p
                              className="
                                font-medium
                                text-neutral-800
                              "
                            >
                              {
                                paymentMethod.bankName
                              }
                            </p>

                          )}


                          {paymentMethod.accountName && (

                            <p
                              className="
                                text-neutral-500
                              "
                            >
                              {
                                paymentMethod.accountName
                              }
                            </p>

                          )}


                          {paymentMethod.accountNumber && (

                            <p
                              className="
                                font-mono
                                text-xs
                                text-neutral-500
                              "
                            >
                              {
                                paymentMethod.accountNumber
                              }
                            </p>

                          )}


                          {!paymentMethod.bankName &&
                            !paymentMethod.accountName &&
                            !paymentMethod.accountNumber && (

                              <p
                                className="
                                  text-neutral-400
                                "
                              >
                                No bank details
                              </p>

                            )}

                        </div>

                      )}

                    </div>


                    {/* ========================================
                        FOOTER
                        ======================================== */}

                    <div
                      className="
                        mt-4
                        flex
                        flex-col
                        gap-3

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <p
                        className="
                          text-xs
                          text-neutral-400
                        "
                      >
                        Sort Order:{" "}
                        {
                          paymentMethod.sortOrder
                        }
                      </p>


                      <div
                        className="
                          flex
                          w-full
                          gap-2

                          sm:w-auto
                        "
                      >

                        <Link
                          href={`/admin/dashboard/payment-methods/${paymentMethod.id}/edit`}
                          className="
                            inline-flex
                            min-h-10
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-neutral-200
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-neutral-700
                            transition
                            hover:bg-neutral-50

                            sm:flex-none
                          "
                        >

                          <Pencil
                            className="
                              h-4
                              w-4
                            "
                          />

                          Edit

                        </Link>


                        <div
                          className="
                            flex-1

                            sm:flex-none
                          "
                        >

                          <DeletePaymentMethodButton
                            id={
                              paymentMethod.id
                            }
                            name={
                              paymentMethod.name
                            }
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>

      )}

    </main>

  );

}