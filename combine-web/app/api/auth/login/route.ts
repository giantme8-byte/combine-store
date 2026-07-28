import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your email and password.",
        },
        {
          status: 400,
        }
      );
    }

    console.log("========== LOGIN ==========");
    console.log("Email:", email);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log("User:", user);

    if (!user) {
      console.log("Result: User not found");

      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password Correct:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log("Result: Wrong password");

      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }
console.log("Result: Login success");

// Generate session token
const token = randomBytes(32).toString("hex");

// Session expires in 30 days
const expiresAt = new Date(
  Date.now() + 1000 * 60 * 60 * 24 * 30
);

// Save session
await prisma.session.create({
  data: {
    token,
    userId: user.id,
    expiresAt,
  },
});

const response = NextResponse.json({
  success: true,
  message: "Login successful.",
});

response.cookies.set("combine_session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  expires: expiresAt,
  priority: "high",
});

return response;

  } catch (error) {
    console.error("Login failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}