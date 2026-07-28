import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/authorize";

import CreateUserButton from "./_components/CreateUserButton";
import UserTable from "./_components/UserTable";

export default async function UsersPage() {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            COMBINE
          </p>

          <h1 className="mt-2 text-4xl font-light">
            Users
          </h1>

          <p className="mt-2 text-gray-500">
            Manage system users and roles.
          </p>
        </div>

        <CreateUserButton />
      </div>

      <UserTable users={users} />
    </main>
  );
}