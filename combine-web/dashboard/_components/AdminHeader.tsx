"use client";

import {
  Bell,
  Search,
  LogOut,
  Menu,
} from "lucide-react";

import { useMemo } from "react";
import { useRouter } from "next/navigation";


type Props = {
  user: {
    name: string | null;
    email: string;
    role: string;
  };
};


export default function AdminHeader({
  user,
}: Props) {

  const router = useRouter();


  const today = useMemo(
    () =>
      new Date().toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      ),
    []
  );


  async function handleLogout() {

    try {

      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );


      router.replace("/admin");

      router.refresh();


    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );

    }

  }


  function openMobileSidebar() {

    window.dispatchEvent(
      new Event(
        "combine-mobile-sidebar-open"
      )
    );

  }


  return (

    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-neutral-200
        bg-neutral-100/80
        backdrop-blur
      "
    >

      <div
        className="
          flex
          min-h-20
          w-full
          min-w-0
          items-center
          justify-between
          gap-2
          px-3
          py-3

          sm:gap-3
          sm:px-4

          lg:min-h-20
          lg:px-8
          lg:py-0
        "
      >

        {/* ================================================== */}
        {/* MOBILE MENU */}
        {/* ================================================== */}

        <button
          type="button"
          onClick={
            openMobileSidebar
          }
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-neutral-200
            bg-white
            text-neutral-700
            shadow-sm
            transition
            hover:bg-neutral-50
            active:scale-95

            lg:hidden
          "
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>


        {/* ================================================== */}
        {/* TITLE */}
        {/* ================================================== */}

        <div
          className="
            min-w-0
            flex-1
          "
        >

          <p
            className="
              hidden
              truncate
              text-sm
              text-neutral-500

              lg:block
            "
          >
            {today}
          </p>


          <h1
            className="
              truncate
              text-base
              font-light
              tracking-tight
              text-neutral-900

              sm:text-lg

              lg:mt-1
              lg:text-2xl
            "
          >
            Admin Dashboard
          </h1>

        </div>


        {/* ================================================== */}
        {/* RIGHT */}
        {/* ================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5

            sm:gap-2

            lg:gap-4
          "
        >

          {/* ================================================== */}
          {/* SEARCH */}
          {/* ================================================== */}

          <div
            className="
              hidden

              lg:flex
              lg:w-80
              lg:items-center
              lg:gap-3
              lg:rounded-xl
              lg:border
              lg:border-neutral-200
              lg:bg-white
              lg:px-4
              lg:py-3
            "
          >

            <Search
              size={18}
              className="text-neutral-400"
            />


            <input
              placeholder="Search products..."
              className="
                w-full
                bg-transparent
                text-sm
                outline-none
                placeholder:text-neutral-400
              "
            />

          </div>


          {/* ================================================== */}
          {/* NOTIFICATION */}
          {/* ================================================== */}

          <button
            type="button"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-neutral-200
              bg-white
              text-neutral-700
              shadow-sm
              transition
              hover:bg-neutral-50
              active:scale-95

              lg:h-auto
              lg:w-auto
              lg:p-3
            "
            aria-label="Notifications"
          >

            <Bell size={18} />

          </button>


          {/* ================================================== */}
          {/* USER */}
          {/* ================================================== */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-1.5
              py-1.5
              shadow-sm

              sm:gap-2
              sm:px-2
              sm:py-2

              lg:gap-3
              lg:px-4
            "
          >

            {/* Desktop User */}

            <div
              className="
                hidden

                sm:block
              "
            >

              <p
                className="
                  max-w-[120px]
                  truncate
                  text-sm
                  font-medium
                  text-neutral-900
                "
              >
                {user.name ??
                  "Admin"}
              </p>


              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-neutral-400
                "
              >
                {user.role}
              </p>

            </div>


            {/* Mobile User */}

            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-black
                text-[11px]
                font-medium
                text-white

                sm:hidden
              "
            >
              {(user.name ??
                "A")
                .charAt(0)
                .toUpperCase()}
            </div>


            {/* Logout */}

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-neutral-500
                transition
                hover:bg-neutral-100
                hover:text-black
                active:scale-95

                lg:h-auto
                lg:w-auto
                lg:p-2
              "
              aria-label="Logout"
            >

              <LogOut size={17} />

            </button>

          </div>

        </div>

      </div>

    </header>

  );
}