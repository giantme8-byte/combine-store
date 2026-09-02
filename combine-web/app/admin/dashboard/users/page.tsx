import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";

import CreateUserButton from "./_components/CreateUserButton";
import UserTable from "./_components/UserTable";


export default async function UsersPage() {

  // ============================================================
  // CURRENT USER
  // ============================================================

  const currentUser =
    await requireRole([
      UserRole.OWNER,
      UserRole.ADMIN,
    ]);


  // ============================================================
  // LOAD USERS
  // ============================================================

  const users =
    await prisma.user.findMany({

      orderBy: {
        createdAt: "asc",
      },

    });


  // ============================================================
  // SORT USERS
  //
  // Role priority:
  // OWNER → ADMIN → MANAGER → STAFF → CUSTOMER
  //
  // Same role:
  // Earliest registration → Latest registration
  // ============================================================

  const rolePriority: Record<
    UserRole,
    number
  > = {

    [UserRole.OWNER]: 1,

    [UserRole.ADMIN]: 2,

    [UserRole.MANAGER]: 3,

    [UserRole.STAFF]: 4,

    [UserRole.CUSTOMER]: 5,

  };


  users.sort(
    (a, b) => {

      // ========================================================
      // ROLE PRIORITY
      // ========================================================

      const roleDifference =
        rolePriority[a.role] -
        rolePriority[b.role];


      // ========================================================
      // DIFFERENT ROLE
      // ========================================================

      if (
        roleDifference !== 0
      ) {

        return roleDifference;

      }


      // ========================================================
      // SAME ROLE
      //
      // EARLIEST → LATEST
      // ========================================================

      return (
        a.createdAt.getTime() -
        b.createdAt.getTime()
      );

    }
  );


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <main
      className="
        space-y-8
      "
    >

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div>

          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-gray-500
            "
          >
            COMBINE
          </p>


          <h1
            className="
              mt-2
              text-4xl
              font-light
            "
          >
            Users
          </h1>


          <p
            className="
              mt-2
              text-gray-500
            "
          >
            Manage system users and roles.
          </p>

        </div>


        <CreateUserButton
          currentUserRole={
            currentUser.role
          }
        />

      </div>


      {/* ====================================================== */}
      {/* USER TABLE */}
      {/* ====================================================== */}

      <UserTable
        users={users}
        currentUserRole={
          currentUser.role
        }
      />

    </main>

  );

}