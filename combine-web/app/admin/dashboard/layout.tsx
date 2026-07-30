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


        <main className="flex-1 overflow-x-hidden">

          <AdminHeader />


          <div className="mx-auto max-w-[1600px] px-8 py-8">
            {children}
          </div>


        </main>

      </div>

    </div>
  );
}