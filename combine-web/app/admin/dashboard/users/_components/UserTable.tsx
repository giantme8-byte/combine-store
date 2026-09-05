import {
  User,
  UserRole,
} from "@prisma/client";

import UserRow from "./UserRow";
import UserCard from "./UserCard";

type UserTableProps = {
  users: User[];

  currentUserRole: UserRole;
};

export default function UserTable({
  users,
  currentUserRole,
}: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">

      {/* ================================================== */}
      {/* DESKTOP TABLE */}
      {/* ================================================== */}

      <div className="hidden md:block overflow-x-auto">

        <table className="w-full">

          <thead className="border-b bg-neutral-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Email
              </th>

              <th className="px-6 py-4 text-left">
                Role
              </th>

              <th className="px-6 py-4 text-left">
                Created
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                currentUserRole={
                  currentUserRole
                }
              />
            ))}

          </tbody>

        </table>

      </div>


      {/* ================================================== */}
      {/* MOBILE CARDS */}
      {/* ================================================== */}

      <div className="divide-y md:hidden">

        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            currentUserRole={
              currentUserRole
            }
          />
        ))}

      </div>

    </div>
  );
}