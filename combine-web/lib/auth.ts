import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "./prisma";


// ============================================================
// GET CURRENT USER
// ============================================================

export async function getCurrentUser() {

  const cookieStore =
    await cookies();


  const sessionCookie =
    cookieStore.get(
      "combine_session"
    );


  // ==========================================================
  // NO SESSION
  // ==========================================================

  if (!sessionCookie) {
    return null;
  }


  // ==========================================================
  // FIND SESSION
  // ==========================================================

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

            name: true,

            email: true,

            // ------------------------------------------------
            // CUSTOMER PROFILE
            // ------------------------------------------------

            phone: true,

            image: true,

            // ------------------------------------------------
            // USER ROLE
            // ------------------------------------------------

            role: true,

            // ------------------------------------------------
            // TIMESTAMPS
            // ------------------------------------------------

            createdAt: true,

            updatedAt: true,

          },

        },

      },

    });


  // ==========================================================
  // INVALID SESSION
  // ==========================================================

  if (!session) {

    cookieStore.delete(
      "combine_session"
    );

    return null;
  }


  // ==========================================================
  // SESSION EXPIRED
  // ==========================================================

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


    return null;
  }


  // ==========================================================
  // RETURN CURRENT USER
  // ==========================================================

  return session.user;
}


// ============================================================
// REQUIRE USER
// ============================================================

export async function requireUser() {

  const user =
    await getCurrentUser();


  if (!user) {

    redirect(
      "/login"
    );

  }


  return user;
}