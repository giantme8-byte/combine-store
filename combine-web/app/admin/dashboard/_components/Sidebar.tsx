"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database,
  HardDrive,
  Menu,
  X,
} from "lucide-react";
import { UserRole } from "@prisma/client";

import {
  useEffect,
  useState,
} from "react";

import { sidebarSections } from "./sidebar-menu";
import LogoutButton from "./LogoutButton";


type SidebarProps = {
  userRole: UserRole;
};


export default function Sidebar({
  userRole,
}: SidebarProps) {

  const pathname = usePathname();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);


  /*
   * Mobile menu open event
   *
   * AdminHeader dispatches this event
   * when the hamburger button is clicked.
   */
  useEffect(() => {

    function handleOpen() {
      setMobileOpen(true);
    }

    window.addEventListener(
      "combine-mobile-sidebar-open",
      handleOpen
    );

    return () => {
      window.removeEventListener(
        "combine-mobile-sidebar-open",
        handleOpen
      );
    };

  }, []);


  /*
   * Close mobile sidebar whenever
   * the route changes.
   *
   * This is important because:
   *
   * Dashboard
   * → Products
   * → Orders
   * → Inquiries
   *
   * should automatically close
   * the mobile sidebar.
   */
  useEffect(() => {

    setMobileOpen(false);

  }, [pathname]);


  function closeMobileSidebar() {
    setMobileOpen(false);
  }


  return (
    <>

      {/* ================================================== */}
      {/* MOBILE BACKDROP */}
      {/* ================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-40
          bg-black/40
          backdrop-blur-[2px]
          transition-opacity
          duration-300

          lg:hidden

          ${
            mobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={
          closeMobileSidebar
        }
        aria-hidden="true"
      />



      {/* ================================================== */}
      {/* MOBILE SIDEBAR */}
      {/* ================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[82vw]
          max-w-[320px]
          flex-col
          border-r
          border-neutral-200
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ease-out

          lg:hidden

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Mobile Header */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-neutral-200
            px-5
            py-5
          "
        >

          <div>

            <Link
              href="/admin"
              onClick={
                closeMobileSidebar
              }
              className="
                block
                text-2xl
                font-light
                tracking-[0.28em]
                text-neutral-900
              "
            >
              COMBINE
            </Link>

            <p
              className="
                mt-1
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
              Luxury CMS
            </p>

          </div>


          <button
            type="button"
            onClick={
              closeMobileSidebar
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-neutral-200
              text-neutral-600
              transition
              hover:bg-neutral-100
            "
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>

        </div>



        {/* Mobile Navigation */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-5
          "
        >

          {sidebarSections.map(
            (section) => {

              const visibleItems =
                section.items.filter(
                  (item) =>
                    !item.roles ||
                    item.roles.includes(
                      userRole
                    )
                );


              if (
                visibleItems.length === 0
              ) {
                return null;
              }


              return (
                <div
                  key={section.title}
                  className="mb-6"
                >

                  <p
                    className="
                      mb-2
                      px-3
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.3em]
                      text-neutral-400
                    "
                  >
                    {section.title}
                  </p>


                  <div className="space-y-1">

                    {visibleItems.map(
                      (item) => {

                        const Icon =
                          item.icon;


                        if (
                          item.disabled
                        ) {

                          return (
                            <div
                              key={
                                item.title
                              }
                              className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-3
                                py-3
                                text-sm
                                text-neutral-400
                              "
                            >

                              <Icon
                                size={18}
                              />

                              <span>
                                {
                                  item.title
                                }
                              </span>

                            </div>
                          );
                        }


                        if (!item.href) {
                          return null;
                        }


                        const active =
                          pathname ===
                            item.href ||
                          pathname.startsWith(
                            `${item.href}/`
                          );


                        return (
                          <Link
                            key={
                              item.title
                            }
                            href={
                              item.href
                            }
                            onClick={
                              closeMobileSidebar
                            }
                            className={`
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-3
                              text-sm
                              transition-all
                              duration-200

                              ${
                                active
                                  ? "bg-black text-white shadow-sm"
                                  : "text-neutral-700 hover:bg-neutral-100"
                              }
                            `}
                          >

                            <Icon
                              size={18}
                            />

                            <span>
                              {
                                item.title
                              }
                            </span>

                          </Link>
                        );

                      }
                    )}

                  </div>

                </div>
              );
            }
          )}

        </nav>



        {/* Mobile Footer */}

        <div
          className="
            shrink-0
            border-t
            border-neutral-200
            p-4
          "
        >

          <div
            className="
              rounded-2xl
              bg-neutral-100
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
              "
            >
              <Database size={16} />

              Database
            </div>


            <p
              className="
                mt-2
                text-sm
                text-green-600
              "
            >
              ● Healthy
            </p>


            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                text-sm
                font-medium
              "
            >
              <HardDrive size={16} />

              Version
            </div>


            <p
              className="
                mt-2
                text-sm
                text-neutral-500
              "
            >
              v2.0.0
            </p>


            <div
              className="
                mt-5
                border-t
                border-neutral-200
                pt-4
              "
            >
              <LogoutButton />
            </div>

          </div>

        </div>

      </aside>



      {/* ================================================== */}
      {/* DESKTOP SIDEBAR */}
      {/* ================================================== */}

      <aside
        className="
          sticky
          top-0
          flex
          h-screen
          w-72
          shrink-0
          flex-col
          border-r
          border-neutral-200
          bg-white

          max-lg:hidden
        "
      >

        {/* Logo */}

        <div
          className="
            border-b
            border-neutral-200
            px-8
            py-8
          "
        >

          <Link
            href="/admin"
            className="
              block
              text-3xl
              font-light
              tracking-[0.28em]
              text-neutral-900
            "
          >
            COMBINE
          </Link>

          <p
            className="
              mt-2
              text-[11px]
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
            Luxury CMS
          </p>

        </div>



        {/* Navigation */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-4
            py-6
          "
        >

          {sidebarSections.map(
            (section) => {

              const visibleItems =
                section.items.filter(
                  (item) =>
                    !item.roles ||
                    item.roles.includes(
                      userRole
                    )
                );


              if (
                visibleItems.length === 0
              ) {
                return null;
              }


              return (
                <div
                  key={section.title}
                  className="mb-8"
                >

                  <p
                    className="
                      mb-3
                      px-4
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.3em]
                      text-neutral-400
                    "
                  >
                    {section.title}
                  </p>


                  <div className="space-y-1">

                    {visibleItems.map(
                      (item) => {

                        const Icon =
                          item.icon;


                        if (
                          item.disabled
                        ) {

                          return (
                            <div
                              key={
                                item.title
                              }
                              className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-neutral-400
                              "
                            >

                              <Icon
                                size={18}
                              />

                              <span>
                                {
                                  item.title
                                }
                              </span>

                            </div>
                          );
                        }


                        if (!item.href) {
                          return null;
                        }


                        const active =
                          pathname ===
                            item.href ||
                          pathname.startsWith(
                            `${item.href}/`
                          );


                        return (
                          <Link
                            key={
                              item.title
                            }
                            href={
                              item.href
                            }
                            className={`
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              px-4
                              py-3
                              transition-all
                              duration-200

                              ${
                                active
                                  ? "bg-black text-white shadow-sm"
                                  : "text-neutral-700 hover:bg-neutral-100"
                              }
                            `}
                          >

                            <Icon
                              size={18}
                            />

                            <span>
                              {
                                item.title
                              }
                            </span>

                          </Link>
                        );

                      }
                    )}

                  </div>

                </div>
              );
            }
          )}

        </nav>



        {/* Footer */}

        <div
          className="
            border-t
            border-neutral-200
            p-6
          "
        >

          <div
            className="
              rounded-2xl
              bg-neutral-100
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
              "
            >

              <Database size={16} />

              Database

            </div>


            <p
              className="
                mt-2
                text-sm
                text-green-600
              "
            >
              ● Healthy
            </p>


            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                text-sm
                font-medium
              "
            >

              <HardDrive size={16} />

              Version

            </div>


            <p
              className="
                mt-2
                text-sm
                text-neutral-500
              "
            >
              v2.0.0
            </p>


            <div
              className="
                mt-6
                border-t
                border-neutral-200
                pt-4
              "
            >
              <LogoutButton />
            </div>

          </div>

        </div>

      </aside>

    </>
  );
}