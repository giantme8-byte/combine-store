import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";


// ============================================================
// POST — FORGOT PASSWORD
// ============================================================

export async function POST(
  request: Request
) {

  try {

    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body =
      await request.json();


    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";


    // ========================================================
    // VALIDATE EMAIL
    // ========================================================

    if (!email) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your email address.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // FIND CUSTOMER
    // ========================================================

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });


    /*
     * IMPORTANT:
     *
     * Do not tell the customer whether
     * the email exists in the database.
     *
     * This prevents account enumeration.
     */

    if (!user) {

      return NextResponse.json({
        success: true,
        message:
          "If an account exists for this email address, a password reset link has been sent.",
      });

    }


    // ========================================================
    // REMOVE EXISTING RESET TOKENS
    // ========================================================

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId:
          user.id,
      },
    });


    // ========================================================
    // GENERATE SECURE TOKEN
    // ========================================================

    const token =
      randomBytes(32).toString("hex");


    // ========================================================
    // TOKEN EXPIRATION
    // ========================================================
    //
    // Reset links are valid for 30 minutes.
    //

    const expiresAt =
      new Date(
        Date.now() +
          1000 *
          60 *
          30
      );


    // ========================================================
    // SAVE TOKEN
    // ========================================================

    await prisma.passwordResetToken.create({
      data: {

        token,

        userId:
          user.id,

        expiresAt,

      },
    });


    // ========================================================
    // RESET URL
    // ========================================================

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://combineluxe.com";


    const resetUrl =
      `${baseUrl}/reset-password?token=${token}`;


    // ========================================================
    // EMAIL
    // ========================================================

    await sendEmail({

      to:
        user.email,

      subject:
        "Reset Your COMBINE Password",

      html: `

        <!DOCTYPE html>

        <html>

          <head>

            <meta
              charset="UTF-8"
            />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <title>
              Reset Your COMBINE Password
            </title>

          </head>


          <body
            style="
              margin:0;
              padding:0;
              background:#f7f7f7;
              font-family:Arial,Helvetica,sans-serif;
              color:#171717;
            "
          >

            <div
              style="
                max-width:600px;
                margin:0 auto;
                padding:48px 24px;
              "
            >

              <div
                style="
                  background:#ffffff;
                  border:1px solid #e5e5e5;
                  padding:48px 40px;
                "
              >

                <div
                  style="
                    text-align:center;
                  "
                >

                  <div
                    style="
                      font-size:12px;
                      letter-spacing:5px;
                      color:#a3a3a3;
                      margin-bottom:24px;
                    "
                  >
                    COMBINE
                  </div>


                  <h1
                    style="
                      margin:0;
                      font-size:32px;
                      font-weight:300;
                      letter-spacing:-1px;
                    "
                  >
                    Reset Your Password
                  </h1>


                  <div
                    style="
                      width:60px;
                      height:1px;
                      margin:24px auto;
                      background:#c8a96a;
                    "
                  />

                </div>


                <p
                  style="
                    margin:0 0 20px;
                    font-size:16px;
                    line-height:1.7;
                    color:#525252;
                  "
                >
                  Hello ${escapeHtml(user.name)},
                </p>


                <p
                  style="
                    margin:0 0 20px;
                    font-size:16px;
                    line-height:1.7;
                    color:#525252;
                  "
                >
                  We received a request to reset the
                  password for your COMBINE account.
                </p>


                <p
                  style="
                    margin:0 0 32px;
                    font-size:16px;
                    line-height:1.7;
                    color:#525252;
                  "
                >
                  Click the button below to create
                  a new password.
                </p>


                <div
                  style="
                    text-align:center;
                    margin:32px 0;
                  "
                >

                  <a
                    href="${resetUrl}"
                    style="
                      display:inline-block;
                      padding:16px 32px;
                      background:#171717;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:999px;
                      font-size:12px;
                      font-weight:500;
                      letter-spacing:3px;
                      text-transform:uppercase;
                    "
                  >
                    Reset Password
                  </a>

                </div>


                <p
                  style="
                    margin:32px 0 0;
                    font-size:13px;
                    line-height:1.7;
                    color:#a3a3a3;
                  "
                >
                  This password reset link will expire
                  in 30 minutes.
                </p>


                <p
                  style="
                    margin:16px 0 0;
                    font-size:13px;
                    line-height:1.7;
                    color:#a3a3a3;
                  "
                >
                  If you did not request a password
                  reset, you can safely ignore this email.
                </p>


                <div
                  style="
                    margin-top:40px;
                    padding-top:24px;
                    border-top:1px solid #eeeeee;
                    text-align:center;
                  "
                >

                  <p
                    style="
                      margin:0;
                      font-size:11px;
                      letter-spacing:2px;
                      color:#a3a3a3;
                    "
                  >
                    COMBINE
                  </p>

                </div>

              </div>

            </div>

          </body>

        </html>

      `,
    });


    // ========================================================
    // SUCCESS
    // ========================================================

    return NextResponse.json({

      success: true,

      message:
        "If an account exists for this email address, a password reset link has been sent.",

    });


  } catch (error) {

    console.error(
      "Forgot password failed:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );

  }

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(
  value: string
) {

  return value
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}