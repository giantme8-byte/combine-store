import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";

import { UserRole } from "@prisma/client";


const ALLOWED_ROLES: UserRole[] = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "STAFF",
];



export async function POST(
  request: Request
) {
  try {

    const body = await request.json();


    const email =
      body.email
        ?.trim()
        .toLowerCase();


    const password =
      body.password;



    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your email and password.",
        },
        {
          status: 400,
        }
      );
    }



    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });



    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }



    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );



    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }



    if (
      !ALLOWED_ROLES.includes(
        user.role
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You do not have permission to access the admin panel.",
        },
        {
          status: 403,
        }
      );
    }



    // Remove expired sessions
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });



    const token =
      randomBytes(32).toString("hex");



    const expiresAt =
      new Date(
        Date.now() +
          1000 *
          60 *
          60 *
          24 *
          30
      );



    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });



    const response =
      NextResponse.json({
        success: true,
        message:
          "Login successful.",
      });



    response.cookies.set(
      "combine_session",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          "lax",

        path: "/",

        expires:
          expiresAt,

        maxAge:
          60 *
          60 *
          24 *
          30,

        priority:
          "high",
      }
    );



    return response;



  } catch (error) {

    console.error(
      "Login failed:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}