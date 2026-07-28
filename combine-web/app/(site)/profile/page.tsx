import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [wishlistCount, inquiryCount] =
    await Promise.all([
      prisma.wishlistItem.count({
        where: {
          userId: user.id,
        },
      }),

      prisma.inquiry.count(),
    ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
          COMBINE
        </p>

        <h1 className="mt-3 text-5xl font-light">
          My Profile
        </h1>

        <p className="mt-4 text-gray-500">
          Manage your account information.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left */}
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black text-4xl text-white">
            👤
          </div>

          <h2 className="mt-6 text-2xl font-light">
            {user.name}
          </h2>

          <p className="mt-2 text-gray-500">
            {user.email}
          </p>

          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-gray-400">
            Member Since
          </p>

          <p className="mt-2">
            {user.createdAt.toLocaleDateString()}
          </p>
        </div>

        {/* Right */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="mb-8 text-2xl font-light">
              Account Overview
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
                  Wishlist
                </p>

                <p className="mt-3 text-4xl font-light">
                  {wishlistCount}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
                  Inquiry
                </p>

                <p className="mt-3 text-4xl font-light">
                  {inquiryCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-light">
              Coming Soon
            </h2>

            <ul className="space-y-3 text-gray-600">
              <li>• Edit Profile</li>
              <li>• Change Password</li>
              <li>• Upload Avatar</li>
              <li>• Order History</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}