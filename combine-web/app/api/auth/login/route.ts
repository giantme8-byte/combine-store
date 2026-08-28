import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";


// ============================================================
// ADMIN ROLES
// ============================================================
//
// These roles are allowed to access the Admin Panel.
//
// CUSTOMER is intentionally NOT included here.
//
// CUSTOMER users are still allowed to log in.
// They are simply redirected to /profile instead of /admin.
//

const ADMIN_ROLES = [
  "OWNER",
  "ADMIN",
  "MANAGER",
  "STAFF",
] as const;


// ============================================================
// POST /api/auth/login
// ============================================================

export async function POST(
  request: Request
) {
  try {
    // ========================================================
    // READ REQUEST
    // ========================================================

    const body =
      await request.json();

    // ========================================================
    // NORMALIZE EMAIL
    // ========================================================

    const email =
      typeof body.email === "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    // ========================================================
    // VALIDATION
    // ========================================================

    if (
      !email ||
      !password
    ) {
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

    // ========================================================
    // FIND USER
    // ========================================================

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

    // ========================================================
    // CHECK PASSWORD
    // ========================================================

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

    // ========================================================
    // REMOVE EXPIRED SESSIONS
    // ========================================================

    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // ========================================================
    // CREATE SESSION TOKEN
    // ========================================================

    const token =
      randomBytes(32).toString("hex");

    // ========================================================
    // SESSION EXPIRATION
    // ========================================================

    const expiresAt =
      new Date(
        Date.now() +
          1000 *
            60 *
            60 *
            24 *
            30
      );

    // ========================================================
    // CREATE SESSION
    // ========================================================

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // ========================================================
    // DETERMINE DESTINATION
    // ========================================================

    const isAdmin =
      ADMIN_ROLES.includes(
        user.role as
          (typeof ADMIN_ROLES)[number]
      );

    const redirectTo =
      isAdmin
        ? "/admin"
        : "/profile";

    // ========================================================
    // RESPONSE
    // ========================================================

    const response =
      NextResponse.json({
        success: true,

        message:
          "Login successful.",

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },

        redirectTo,
      });

    // ========================================================
    // SESSION COOKIE
    // ========================================================

    response.cookies.set(
      "combine_session",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        expires:
          expiresAt,

        maxAge:
          60 *
          60 *
          24 *
          30,

        priority: "high",
      }
    );

    // ========================================================
    // RETURN
    // ========================================================

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