import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";


export async function POST() {
  try {
    const cookieStore = await cookies();


    const sessionCookie =
      cookieStore.get(
        "combine_session"
      );



    if (sessionCookie?.value) {

      await prisma.session.deleteMany({
        where: {
          token: sessionCookie.value,
        },
      });

    }



    const response =
      NextResponse.json({
        success: true,
        message:
          "Logout successful.",
      });



    response.cookies.delete(
      "combine_session"
    );



    return response;



  } catch (error) {

    console.error(
      "Logout failed:",
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