"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "@headlessui/react";
import { useState } from "react";

import {
  Heart,
  ClipboardList,
  User,
  LogOut,
} from "lucide-react";

import { useInquiry } from "@/components/providers/InquiryProvider";

type User = {
  id: number;
  name: string;
  email: string;
};

type UserMenuProps = {
  user: User | null;
  wishlistCount: number;
  inquiryCount: number;
  dark?: boolean;
};

export default function UserMenu({
  user,
  wishlistCount,
  inquiryCount,
  dark = true,
}: UserMenuProps) {
  const router = useRouter();

const {
  openDrawer,
  totalItems,
} = useInquiry();

  const [loading, setLoading] = useState(false);


  async function handleLogout() {
    if (loading) return;

    try {
      setLoading(true);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.refresh();

    } catch (error) {
      console.error(
        "Failed to logout:",
        error
      );

    } finally {
      setLoading(false);
    }
  }


  const textClass = dark
    ? "text-neutral-700 hover:text-black"
    : "text-white hover:text-white/80";


  if (!user) {
    return (
      <div className="flex items-center gap-6">

        <Link
          href="/login"
          className={`text-[12px] font-medium uppercase tracking-[0.24em] transition-colors duration-300 ${textClass}`}
        >
          Login
        </Link>


        <Link
          href="/register"
          className={`text-[12px] font-medium uppercase tracking-[0.24em] transition-colors duration-300 ${textClass}`}
        >
          Register
        </Link>

      </div>
    );
  }


  return (
    <div className="flex items-center gap-7">


      {/* Wishlist */}
      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className={`relative transition-colors duration-300 ${textClass}`}
      >
        <Heart
          size={18}
          strokeWidth={1.8}
        />


        {wishlistCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-medium text-white">
            {wishlistCount}
          </span>
        )}

      </Link>



      {/* Inquiry */}
      <button
        type="button"
        aria-label="Inquiry"
        onClick={openDrawer}
        className={`relative transition-colors duration-300 ${textClass}`}
      >
        <ClipboardList
          size={18}
          strokeWidth={1.8}
        />


{totalItems > 0 && (
  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-medium text-white">
    {totalItems}
  </span>
)}

      </button>



      {/* User Dropdown */}
      <Menu
        as="div"
        className="relative"
      >

        <Menu.Button
          aria-label="Account"
          className={`transition-colors duration-300 ${textClass}`}
        >
          <User
            size={18}
            strokeWidth={1.8}
          />
        </Menu.Button>


        <Menu.Items
          transition
          className="absolute right-0 mt-4 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none"
        >


          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-neutral-100"
                    : ""
                }`}
              >

                <User
                  size={16}
                  strokeWidth={1.8}
                />

                <span>
                  My Profile
                </span>

              </Link>
            )}
          </Menu.Item>



          <Menu.Item>
            {({ active }) => (
              <Link
                href="/wishlist"
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-neutral-100"
                    : ""
                }`}
              >

                <div className="flex items-center gap-3">

                  <Heart
                    size={16}
                    strokeWidth={1.8}
                  />

                  <span>
                    Wishlist
                  </span>

                </div>


                {wishlistCount > 0 && (
                  <span className="rounded-full bg-black px-2 py-1 text-[10px] text-white">
                    {wishlistCount}
                  </span>
                )}

              </Link>
            )}
          </Menu.Item>



          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={openDrawer}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-neutral-100"
                    : ""
                }`}
              >

                <div className="flex items-center gap-3">

                  <ClipboardList
                    size={16}
                    strokeWidth={1.8}
                  />

                  <span>
                    Inquiry List
                  </span>

                </div>


{totalItems > 0 && (
  <span className="rounded-full bg-black px-2 py-1 text-[10px] text-white">
    {totalItems}
  </span>
)}

              </button>
            )}
          </Menu.Item>



          <div className="my-2 border-t border-neutral-200" />



          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-500 transition ${
                  active
                    ? "bg-red-50"
                    : ""
                } ${
                  loading
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >

                <LogOut
                  size={16}
                  strokeWidth={1.8}
                />

                {loading
                  ? "Logging out..."
                  : "Logout"}

              </button>
            )}
          </Menu.Item>


        </Menu.Items>

      </Menu>

    </div>
  );
}