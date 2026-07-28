import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { getCurrentUser } from "@/lib/auth";
import { requireRole } from "@/lib/authorize";

import Sidebar from "./_components/Sidebar";
import AdminHeader from "./_components/AdminHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole([
    UserRole.STAFF,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.OWNER,
  ]);

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <Sidebar
          userRole={user.role}
        />

        {/* Main */}
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