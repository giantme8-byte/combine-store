import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "./prisma";


export async function getCurrentUser() {
  const cookieStore = await cookies();


  const sessionCookie =
    cookieStore.get(
      "combine_session"
    );


  if (!sessionCookie) {
    return null;
  }



  const session =
    await prisma.session.findUnique({
      where: {
        token: sessionCookie.value,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });



  if (!session) {

    cookieStore.delete(
      "combine_session"
    );

    return null;
  }



  // Session expired
  if (
    session.expiresAt <
    new Date()
  ) {

    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });


    cookieStore.delete(
      "combine_session"
    );


    return null;
  }



  return session.user;
}




export async function requireUser() {
  const user =
    await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  return user;
}