"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        console.error("Logout failed.");
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
        inline-flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-red-200
        bg-white
        px-5
        py-3
        text-sm
        font-medium
        text-red-600
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-red-300
        hover:bg-red-50
        hover:shadow-md
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:w-auto
      "
    >
      <LogOut size={17} />

      {loading
        ? "Signing Out..."
        : "Sign Out"}
    </button>
  );
}