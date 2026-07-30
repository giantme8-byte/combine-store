"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";


export default function LogoutButton() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);



  async function handleLogout() {

    if (loading) return;


    try {

      setLoading(true);


      const res =
        await fetch(
          "/api/auth/logout",
          {
            method: "POST",
          }
        );


      if (!res.ok) {

        console.error(
          "Logout failed."
        );

        return;
      }



      router.replace("/login");

      router.refresh();



    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );


    } finally {

      setLoading(false);

    }

  }



  return (
    <button
      type="button"
      aria-label="Logout"
      onClick={handleLogout}
      disabled={loading}
      className="
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-neutral-200
        px-4
        py-3
        text-sm
        font-medium
        text-neutral-700
        transition-colors
        hover:bg-neutral-200
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >

      <LogOut size={18} />

      {loading
        ? "Signing Out..."
        : "Logout"}

    </button>
  );
}