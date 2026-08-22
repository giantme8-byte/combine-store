import { UserRole } from "@prisma/client";

import { requireRole } from "@/lib/authorize";

import Sidebar from "./_components/Sidebar";
import AdminHeader from "./_components/AdminHeader";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await requireRole([
    UserRole.STAFF,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);


  return (
    <div className="min-h-screen bg-neutral-100">

      <div className="flex min-h-screen">

        <Sidebar
          userRole={user.role}
        />

        <main
          className="
            min-w-0
            flex-1
            overflow-x-hidden
          "
        >

          <AdminHeader
            user={user}
          />

          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              min-w-0
              px-4
              py-5

              sm:px-6
              sm:py-6

              lg:px-8
              lg:py-8
            "
          >
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}