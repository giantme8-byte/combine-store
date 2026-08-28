import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


// ============================================================
// PATCH — UPDATE CUSTOMER PROFILE
// ============================================================

export async function PATCH(
  request: Request
) {

  try {

    // ========================================================
    // CURRENT USER
    // ========================================================

    const currentUser =
      await getCurrentUser();


    if (!currentUser) {

      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in to update your profile.",
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


    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";


    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";


    const image =
      typeof body.image === "string"
        ? body.image.trim()
        : "";


    const dateOfBirth =
      typeof body.dateOfBirth === "string"
        ? body.dateOfBirth.trim()
        : "";


    // ========================================================
    // VALIDATE NAME
    // ========================================================

    if (!name) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Name is required.",
        },
        {
          status: 400,
        }
      );

    }


    if (name.length < 2) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Name must be at least 2 characters.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // VALIDATE PHONE
    // ========================================================

    if (
      phone.length > 0 &&
      phone.length < 6
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid phone number.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // VALIDATE DATE OF BIRTH
    // ========================================================

    let parsedDateOfBirth:
      Date | null = null;


    if (dateOfBirth) {

      parsedDateOfBirth =
        new Date(
          `${dateOfBirth}T00:00:00.000Z`
        );


      // ------------------------------------------------------
      // INVALID DATE
      // ------------------------------------------------------

      if (
        Number.isNaN(
          parsedDateOfBirth.getTime()
        )
      ) {

        return NextResponse.json(
          {
            success: false,
            message:
              "Please enter a valid date of birth.",
          },
          {
            status: 400,
          }
        );

      }


      // ------------------------------------------------------
      // FUTURE DATE
      // ------------------------------------------------------

      const today =
        new Date();

      today.setUTCHours(
        0,
        0,
        0,
        0
      );


      if (
        parsedDateOfBirth >
        today
      ) {

        return NextResponse.json(
          {
            success: false,
            message:
              "Date of birth cannot be in the future.",
          },
          {
            status: 400,
          }
        );

      }

    }


    // ========================================================
    // UPDATE CURRENT USER
    // ========================================================

    const updatedUser =
      await prisma.user.update({

        where: {
          id:
            currentUser.id,
        },

        data: {

          name,

          phone:
            phone || null,

          dateOfBirth:
            parsedDateOfBirth,

          image:
            image || null,

        },

        select: {

          id: true,

          name: true,

          email: true,

          phone: true,

          dateOfBirth: true,

          image: true,

          role: true,

          createdAt: true,

        },

      });


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json({

      success: true,

      message:
        "Profile updated successfully.",

      user:
        updatedUser,

    });


  } catch (error) {

    console.error(
      "Profile update failed:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while updating your profile.",
      },
      {
        status: 500,
      }
    );

  }

}