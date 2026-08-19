import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";


// ============================================================
// CHANGE PASSWORD
// ============================================================

export async function PATCH(
  request: Request
) {

  try {

    // ========================================================
    // CURRENT SESSION
    // ========================================================

    const cookieStore =
      await cookies();


    const sessionCookie =
      cookieStore.get(
        "combine_session"
      );


    if (!sessionCookie) {

      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in to change your password.",
        },
        {
          status: 401,
        }
      );

    }


    // ========================================================
    // FIND CURRENT SESSION
    // ========================================================

    const session =
      await prisma.session.findUnique({

        where: {
          token:
            sessionCookie.value,
        },

        include: {
          user: {
            select: {
              id: true,
              password: true,
            },
          },
        },

      });


    if (!session) {

      cookieStore.delete(
        "combine_session"
      );


      return NextResponse.json(
        {
          success: false,
          message:
            "Your session is no longer valid. Please sign in again.",
        },
        {
          status: 401,
        }
      );

    }


    // ========================================================
    // SESSION EXPIRATION
    // ========================================================

    if (
      session.expiresAt <
      new Date()
    ) {

      await prisma.session.delete({
        where: {
          id:
            session.id,
        },
      });


      cookieStore.delete(
        "combine_session"
      );


      return NextResponse.json(
        {
          success: false,
          message:
            "Your session has expired. Please sign in again.",
        },
        {
          status: 401,
        }
      );

    }


    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body =
      await request.json();


    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";


    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";


    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";


    // ========================================================
    // REQUIRED FIELDS
    // ========================================================

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Please fill in all password fields.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // PASSWORD LENGTH
    // ========================================================

    if (
      newPassword.length < 8
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "New password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // CONFIRM PASSWORD
    // ========================================================

    if (
      newPassword !==
      confirmPassword
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "New passwords do not match.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // VERIFY CURRENT PASSWORD
    // ========================================================

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        session.user.password
      );


    if (!passwordMatch) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Current password is incorrect.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // PREVENT SAME PASSWORD
    // ========================================================

    const samePassword =
      await bcrypt.compare(
        newPassword,
        session.user.password
      );


    if (samePassword) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Your new password must be different from your current password.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // HASH NEW PASSWORD
    // ========================================================

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );


    // ========================================================
    // UPDATE PASSWORD
    // ========================================================

    await prisma.user.update({

      where: {
        id:
          session.user.id,
      },

      data: {
        password:
          hashedPassword,
      },

    });


    // ========================================================
    // DELETE OTHER SESSIONS
    //
    // Keep the current session active.
    // ========================================================

    await prisma.session.deleteMany({

      where: {

        userId:
          session.user.id,

        NOT: {
          id:
            session.id,
        },

      },

    });


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json({

      success: true,

      message:
        "Your password has been changed successfully.",

    });


  } catch (error) {

    console.error(
      "Password change failed:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while changing your password.",
      },
      {
        status: 500,
      }
    );

  }

}