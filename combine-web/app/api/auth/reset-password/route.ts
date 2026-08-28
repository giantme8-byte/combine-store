import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";


// ============================================================
// POST — RESET PASSWORD
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


    const token =
      typeof body.token === "string"
        ? body.token.trim()
        : "";


    const password =
      typeof body.password === "string"
        ? body.password
        : "";


    // ========================================================
    // VALIDATE TOKEN
    // ========================================================

    if (!token) {

      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // VALIDATE PASSWORD
    // ========================================================

    if (password.length < 8) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // FIND RESET TOKEN
    // ========================================================

    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          token,
        },
      });


    // ========================================================
    // INVALID TOKEN
    // ========================================================

    if (!resetToken) {

      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid or has already been used.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // EXPIRED TOKEN
    // ========================================================

    if (
      resetToken.expiresAt <
      new Date()
    ) {

      await prisma.passwordResetToken.delete({
        where: {
          id:
            resetToken.id,
        },
      });


      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link has expired. Please request a new one.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // HASH PASSWORD
    // ========================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );


    // ========================================================
    // UPDATE PASSWORD + DELETE TOKEN
    // ========================================================

    await prisma.$transaction([

      prisma.user.update({

        where: {
          id:
            resetToken.userId,
        },

        data: {
          password:
            hashedPassword,
        },

      }),


      prisma.passwordResetToken.delete({

        where: {
          id:
            resetToken.id,
        },

      }),

    ]);


    // ========================================================
    // SUCCESS
    // ========================================================

    return NextResponse.json({

      success: true,

      message:
        "Password updated successfully.",

    });


  } catch (error) {

    console.error(
      "Reset password failed:",
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