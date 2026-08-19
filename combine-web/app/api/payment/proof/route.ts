import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { sendAdminEmail } from "@/lib/email";


// ============================================================
// SUBMIT PAYMENT PROOF
// ============================================================

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();


    // ========================================================
    // INPUT
    // ========================================================

    const publicToken =
      typeof body.publicToken === "string"
        ? body.publicToken.trim()
        : "";


    const proofUrl =
      typeof body.proofUrl === "string"
        ? body.proofUrl.trim()
        : "";


    const proofPublicId =
      typeof body.proofPublicId === "string"
        ? body.proofPublicId.trim()
        : "";


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!publicToken) {

      return NextResponse.json(
        {
          error:
            "Order reference is required.",
        },
        {
          status: 400,
        }
      );

    }


    if (!proofUrl) {

      return NextResponse.json(
        {
          error:
            "Payment proof is required.",
        },
        {
          status: 400,
        }
      );

    }


    if (!proofPublicId) {

      return NextResponse.json(
        {
          error:
            "Payment proof information is incomplete.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // CLOUDINARY VALIDATION
    // ========================================================

    const isCloudinaryUrl =
      proofUrl.startsWith(
        "https://res.cloudinary.com/"
      );


    if (!isCloudinaryUrl) {

      return NextResponse.json(
        {
          error:
            "Invalid payment proof image.",
        },
        {
          status: 400,
        }
      );

    }


    const isPaymentProof =
      proofPublicId.startsWith(
        "combine-store/payment-proofs/"
      );


    if (!isPaymentProof) {

      return NextResponse.json(
        {
          error:
            "Invalid payment proof information.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // FIND ORDER
    // ========================================================

    const order =
      await prisma.order.findUnique({

        where: {
          publicToken,
        },

        include: {

          payment: true,

          items: {
            orderBy: {
              id: "asc",
            },
          },

        },

      });


    if (!order) {

      return NextResponse.json(
        {
          error:
            "Order could not be found.",
        },
        {
          status: 404,
        }
      );

    }


    // ========================================================
    // PAYMENT CHECK
    // ========================================================

    if (!order.payment) {

      return NextResponse.json(
        {
          error:
            "Payment information could not be found.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // PAYMENT STATUS CHECK
    //
    // Only PENDING and REJECTED payments can
    // receive a new payment proof.
    // ========================================================

    const currentPaymentStatus =
      order.payment.status;


    if (
      currentPaymentStatus !== "PENDING" &&
      currentPaymentStatus !== "REJECTED"
    ) {

      if (
        currentPaymentStatus ===
        "SUBMITTED"
      ) {

        return NextResponse.json(
          {
            error:
              "Your payment proof is already under review.",
          },
          {
            status: 400,
          }
        );

      }


      if (
        currentPaymentStatus ===
        "VERIFIED"
      ) {

        return NextResponse.json(
          {
            error:
              "This payment has already been verified.",
          },
          {
            status: 400,
          }
        );

      }


      return NextResponse.json(
        {
          error:
            "This payment cannot accept a new payment proof.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // UPDATE PAYMENT
    // ========================================================

    const payment =
      await prisma.payment.update({

        where: {
          id:
            order.payment.id,
        },

        data: {

          proofUrl,

          proofPublicId,

          status:
            "SUBMITTED",

          /*
           * If a previously rejected payment
           * is submitted again, clear the old
           * verification information.
           */

          verifiedAt:
            null,

          verifiedBy:
            null,

          adminNote:
            null,

        },

      });


    // ========================================================
    // UPDATE ORDER STATUS
    // ========================================================

    const updatedOrder =
      await prisma.order.update({

        where: {
          id:
            order.id,
        },

        data: {

          status:
            "PAYMENT_REVIEW",

        },

      });


    // ========================================================
    // SEND ADMIN EMAIL
    // ========================================================

    try {

      const submittedAt =
        new Date().toLocaleString(
          "en-MY",
          {
            timeZone:
              "Asia/Kuala_Lumpur",

            dateStyle:
              "medium",

            timeStyle:
              "short",
          }
        );


      const paymentMethod =
        order.payment
          .paymentMethodName ||
        order.payment
          .paymentMethodType;


      const itemsHtml =
        order.items
          .map(
            (item) => `
              <tr>

                <td
                  style="
                    padding:10px 0;
                    border-bottom:1px solid #eeeeee;
                    font-size:14px;
                    color:#171717;
                  "
                >
                  ${item.productName}
                </td>

                <td
                  style="
                    padding:10px 0;
                    border-bottom:1px solid #eeeeee;
                    font-size:14px;
                    text-align:center;
                    color:#666666;
                  "
                >
                  ${item.quantity}
                </td>

                <td
                  style="
                    padding:10px 0;
                    border-bottom:1px solid #eeeeee;
                    font-size:14px;
                    text-align:right;
                    color:#171717;
                  "
                >
                  RM ${Number(
                    item.totalPrice
                  ).toFixed(2)}
                </td>

              </tr>
            `
          )
          .join("");


      await sendAdminEmail({

        subject:
          `Payment Receipt Submitted - Order #${order.id}`,

        html: `

          <div
            style="
              margin:0;
              padding:40px 20px;
              background:#f7f7f7;
              font-family:Arial,Helvetica,sans-serif;
              color:#171717;
            "
          >

            <div
              style="
                max-width:680px;
                margin:0 auto;
                background:#ffffff;
                border:1px solid #e5e5e5;
                border-radius:24px;
                overflow:hidden;
              "
            >

              <!-- ==================================================
                   HEADER
              =================================================== -->

              <div
                style="
                  padding:32px;
                  border-bottom:1px solid #eeeeee;
                "
              >

                <div
                  style="
                    font-size:12px;
                    letter-spacing:4px;
                    text-transform:uppercase;
                    color:#999999;
                  "
                >
                  COMBINE
                </div>


                <h1
                  style="
                    margin:14px 0 0;
                    font-size:28px;
                    font-weight:500;
                    letter-spacing:-0.5px;
                  "
                >
                  Payment Receipt Submitted
                </h1>


                <p
                  style="
                    margin:10px 0 0;
                    font-size:14px;
                    line-height:1.7;
                    color:#777777;
                  "
                >
                  A customer has submitted a payment
                  receipt for an order.
                </p>

              </div>


              <!-- ==================================================
                   ORDER
              =================================================== -->

              <div
                style="
                  padding:32px;
                "
              >

                <div
                  style="
                    padding:22px;
                    background:#fafafa;
                    border-radius:16px;
                  "
                >

                  <div
                    style="
                      font-size:11px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                      color:#999999;
                    "
                  >
                    ORDER
                  </div>


                  <div
                    style="
                      margin-top:8px;
                      font-size:24px;
                      font-weight:600;
                    "
                  >
                    #${order.id}
                  </div>


                  <div
                    style="
                      margin-top:12px;
                      font-size:14px;
                      color:#666666;
                    "
                  >
                    Status:
                    <strong
                      style="
                        color:#171717;
                      "
                    >
                      PAYMENT REVIEW
                    </strong>
                  </div>

                </div>


                <!-- ==================================================
                     CUSTOMER
                =================================================== -->

                <div
                  style="
                    margin-top:28px;
                  "
                >

                  <div
                    style="
                      font-size:11px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                      color:#999999;
                    "
                  >
                    CUSTOMER
                  </div>


                  <table
                    style="
                      width:100%;
                      margin-top:12px;
                      border-collapse:collapse;
                    "
                  >

                    <tr>

                      <td
                        style="
                          padding:8px 0;
                          color:#888888;
                          width:150px;
                          font-size:14px;
                        "
                      >
                        Name
                      </td>

                      <td
                        style="
                          padding:8px 0;
                          font-size:14px;
                          font-weight:500;
                        "
                      >
                        ${order.customerName}
                      </td>

                    </tr>


                    <tr>

                      <td
                        style="
                          padding:8px 0;
                          color:#888888;
                          font-size:14px;
                        "
                      >
                        Email
                      </td>

                      <td
                        style="
                          padding:8px 0;
                          font-size:14px;
                        "
                      >
                        ${order.customerEmail || "-"}
                      </td>

                    </tr>


                    <tr>

                      <td
                        style="
                          padding:8px 0;
                          color:#888888;
                          font-size:14px;
                        "
                      >
                        Phone
                      </td>

                      <td
                        style="
                          padding:8px 0;
                          font-size:14px;
                        "
                      >
                        ${order.customerPhone}
                      </td>

                    </tr>

                  </table>

                </div>


                <!-- ==================================================
                     PAYMENT
                =================================================== -->

                <div
                  style="
                    margin-top:28px;
                  "
                >

                  <div
                    style="
                      font-size:11px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                      color:#999999;
                    "
                  >
                    PAYMENT
                  </div>


                  <table
                    style="
                      width:100%;
                      margin-top:12px;
                      border-collapse:collapse;
                    "
                  >

                    <tr>

                      <td
                        style="
                          padding:8px 0;
                          color:#888888;
                          width:150px;
                          font-size:14px;
                        "
                      >
                        Method
                      </td>

                      <td
                        style="
                          padding:8px 0;
                          font-size:14px;
                          font-weight:500;
                        "
                      >
                        ${paymentMethod}
                      </td>

                    </tr>


                    <tr>

                      <td
                        style="
                          padding:8px 0;
                          color:#888888;
                          font-size:14px;
                        "
                      >
                        Amount
                      </td>

                      <td
                        style="
                          padding:8px 0;
                          font-size:18px;
                          font-weight:600;
                        "
                      >
                        RM ${Number(
                          order.finalAmount
                        ).toFixed(2)}
                      </td>

                    </tr>


                    <tr>

                      <td
                        style="
                          padding:8px 0;
                          color:#888888;
                          font-size:14px;
                        "
                      >
                        Submitted
                      </td>

                      <td
                        style="
                          padding:8px 0;
                          font-size:14px;
                        "
                      >
                        ${submittedAt}
                      </td>

                    </tr>

                  </table>

                </div>


                <!-- ==================================================
                     ORDER ITEMS
                =================================================== -->

                <div
                  style="
                    margin-top:28px;
                  "
                >

                  <div
                    style="
                      font-size:11px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                      color:#999999;
                    "
                  >
                    ORDER ITEMS
                  </div>


                  <table
                    style="
                      width:100%;
                      margin-top:12px;
                      border-collapse:collapse;
                    "
                  >

                    <thead>

                      <tr>

                        <th
                          style="
                            padding:10px 0;
                            border-bottom:1px solid #dddddd;
                            text-align:left;
                            font-size:11px;
                            letter-spacing:1px;
                            text-transform:uppercase;
                            color:#999999;
                          "
                        >
                          Product
                        </th>

                        <th
                          style="
                            padding:10px 0;
                            border-bottom:1px solid #dddddd;
                            text-align:center;
                            font-size:11px;
                            letter-spacing:1px;
                            text-transform:uppercase;
                            color:#999999;
                          "
                        >
                          Qty
                        </th>

                        <th
                          style="
                            padding:10px 0;
                            border-bottom:1px solid #dddddd;
                            text-align:right;
                            font-size:11px;
                            letter-spacing:1px;
                            text-transform:uppercase;
                            color:#999999;
                          "
                        >
                          Total
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      ${itemsHtml}

                    </tbody>

                  </table>

                </div>


                <!-- ==================================================
                     RECEIPT
                =================================================== -->

                <div
                  style="
                    margin-top:32px;
                    padding-top:28px;
                    border-top:1px solid #eeeeee;
                  "
                >

                  <div
                    style="
                      font-size:11px;
                      letter-spacing:2px;
                      text-transform:uppercase;
                      color:#999999;
                    "
                  >
                    PAYMENT RECEIPT
                  </div>


                  <p
                    style="
                      margin:12px 0 18px;
                      font-size:14px;
                      line-height:1.7;
                      color:#666666;
                    "
                  >
                    The payment receipt has been uploaded
                    successfully and is ready for review.
                  </p>


                  <a
                    href="${proofUrl}"
                    target="_blank"
                    style="
                      display:inline-block;
                      padding:14px 22px;
                      background:#171717;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:999px;
                      font-size:12px;
                      letter-spacing:1px;
                      text-transform:uppercase;
                    "
                  >
                    View Payment Receipt
                  </a>

                </div>


                <!-- ==================================================
                     FOOTER
                =================================================== -->

                <div
                  style="
                    margin-top:36px;
                    padding-top:24px;
                    border-top:1px solid #eeeeee;
                    font-size:12px;
                    line-height:1.7;
                    color:#999999;
                  "
                >

                  This is an automated notification from
                  COMBINE.

                </div>

              </div>

            </div>

          </div>

        `,

      });


    } catch (
      emailError
    ) {

      /*
       * The payment proof has already been
       * successfully saved.
       *
       * Therefore an email failure must NOT
       * make the customer's upload fail.
       */

      console.error(
        "Payment receipt admin email failed:",
        emailError
      );

    }


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {

        success: true,

        payment: {

          id:
            payment.id,

          status:
            payment.status,

          proofUrl:
            payment.proofUrl,

        },

        order: {

          id:
            updatedOrder.id,

          status:
            updatedOrder.status,

        },

      },

      {
        status: 200,
      }
    );


  } catch (error) {

    console.error(
      "Submit payment proof error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to submit payment proof.",
      },
      {
        status: 500,
      }
    );

  }

}