import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

import { prisma } from "@/lib/prisma";

import { sendAdminEmail } from "@/lib/email";


// ============================================================
// CONFIG
// ============================================================

const MAX_FILE_SIZE =
  10 * 1024 * 1024;


const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


// ============================================================
// POST
// ============================================================

export async function POST(
  request: Request
) {

  let uploadedPublicId:
    | string
    | null = null;


  try {

    // ==========================================================
    // FORM DATA
    // ==========================================================

    const formData =
      await request.formData();


    const tokenValue =
      formData.get("token");


    const fileValue =
      formData.get("file");


    const token =
      typeof tokenValue === "string"
        ? tokenValue.trim()
        : "";


    const file =
      fileValue instanceof File
        ? fileValue
        : null;


    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!token) {

      return NextResponse.json(
        {
          error:
            "Invalid payment link.",
        },
        {
          status: 400,
        }
      );

    }


    if (!file) {

      return NextResponse.json(
        {
          error:
            "Please select a payment proof image.",
        },
        {
          status: 400,
        }
      );

    }


    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, and WebP images are allowed.",
        },
        {
          status: 400,
        }
      );

    }


    if (
      file.size >
      MAX_FILE_SIZE
    ) {

      return NextResponse.json(
        {
          error:
            "Payment proof must be smaller than 10MB.",
        },
        {
          status: 400,
        }
      );

    }


    // ==========================================================
    // FIND ORDER
    // ==========================================================

    const order =
      await prisma.order.findUnique({

        where: {
          publicToken:
            token,
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
            "Order not found.",
        },
        {
          status: 404,
        }
      );

    }


    // ==========================================================
    // PAYMENT
    // ==========================================================

    if (!order.payment) {

      return NextResponse.json(
        {
          error:
            "Payment information could not be found.",
        },
        {
          status: 404,
        }
      );

    }


    // ==========================================================
    // PAYMENT STATUS VALIDATION
    //
    // PENDING   → allowed
    // REJECTED  → allowed
    // SUBMITTED → blocked
    // VERIFIED  → blocked
    // ==========================================================

    if (
      order.payment.status ===
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


    if (
      order.payment.status ===
      "SUBMITTED"
    ) {

      return NextResponse.json(
        {
          error:
            "Payment proof has already been submitted and is currently under review.",
        },
        {
          status: 400,
        }
      );

    }


    // ==========================================================
    // SAVE OLD PAYMENT PROOF
    // ==========================================================

    const oldProofPublicId =
      order.payment.proofPublicId;


    // ==========================================================
    // CONVERT FILE
    // ==========================================================

    const bytes =
      await file.arrayBuffer();


    const buffer =
      Buffer.from(bytes);


    // ==========================================================
    // UPLOAD TO CLOUDINARY
    // ==========================================================

    const result =
      await new Promise<UploadApiResponse>(
        (
          resolve,
          reject
        ) => {

          cloudinary.uploader.upload_stream(
            {

              folder:
                "combine-store/payment-proofs",

              resource_type:
                "image",

              context: {

                uploaded_by:
                  "combine",

                order_id:
                  String(order.id),

              },

            },

            (
              error,
              uploadResult
            ) => {

              if (error) {

                reject(error);

                return;

              }


              if (
                uploadResult
              ) {

                resolve(
                  uploadResult
                );

                return;

              }


              reject(
                new Error(
                  "Cloudinary upload returned no result."
                )
              );

            }

          ).end(buffer);

        }
      );


    uploadedPublicId =
      result.public_id;


    // ==========================================================
    // UPDATE PAYMENT + ORDER
    // ==========================================================

    const updatedData =
      await prisma.$transaction(
        async (tx) => {

          const payment =
            await tx.payment.update({

              where: {
                id:
                  order.payment!.id,
              },

              data: {

                proofUrl:
                  result.secure_url,

                proofPublicId:
                  result.public_id,

                status:
                  "SUBMITTED",

                verifiedAt:
                  null,

                verifiedBy:
                  null,

                adminNote:
                  null,

              },

            });


          const updatedOrder =
            await tx.order.update({

              where: {
                id:
                  order.id,
              },

              data: {

                status:
                  "PAYMENT_REVIEW",

              },

            });


          return {
            payment,
            order:
              updatedOrder,
          };

        }
      );


    // ==========================================================
    // DELETE OLD PAYMENT PROOF
    // ==========================================================

    if (
      oldProofPublicId &&
      oldProofPublicId !==
        result.public_id
    ) {

      try {

        await cloudinary.uploader.destroy(
          oldProofPublicId,
          {
            resource_type:
              "image",
          }
        );

      } catch (
        deleteError
      ) {

        /*
         * Do not fail the customer's
         * successful upload just because
         * the old Cloudinary image could
         * not be deleted.
         */

        console.error(
          "Failed to delete old payment proof:",
          deleteError
        );

      }

    }


    // ==========================================================
    // SEND ADMIN EMAIL
    // ==========================================================

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

              <!-- HEADER -->

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
                  A customer has submitted a payment receipt
                  for an order.
                </p>

              </div>


              <!-- ORDER -->

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
                      style="color:#171717;"
                    >
                      PAYMENT REVIEW
                    </strong>
                  </div>

                </div>


                <!-- CUSTOMER -->

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


                <!-- PAYMENT -->

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


                <!-- RECEIPT -->

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
                    href="${result.secure_url}"
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


                <!-- FOOTER -->

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
       * IMPORTANT:
       *
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


    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        success: true,

        payment: {

          id:
            updatedData.payment.id,

          status:
            updatedData.payment.status,

          proofUrl:
            updatedData.payment.proofUrl,

        },

        order: {

          id:
            updatedData.order.id,

          publicToken:
            updatedData.order.publicToken,

          status:
            updatedData.order.status,

        },

      },
      {
        status: 200,
      }
    );


  } catch (error) {

    // ==========================================================
    // CLEAN UP NEW CLOUDINARY IMAGE
    // ==========================================================

    if (uploadedPublicId) {

      try {

        await cloudinary.uploader.destroy(
          uploadedPublicId,
          {
            resource_type:
              "image",
          }
        );

      } catch (
        cleanupError
      ) {

        console.error(
          "Failed to clean up uploaded payment proof:",
          cleanupError
        );

      }

    }


    // ==========================================================
    // ERROR
    // ==========================================================

    console.error(
      "Payment proof upload error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to upload payment proof.",
      },
      {
        status: 500,
      }
    );

  }

}