import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("combine_session");

  if (sessionCookie) {
    await prisma.session.deleteMany({
      where: {
        token: sessionCookie.value,
      },
    });
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("combine_session", "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}