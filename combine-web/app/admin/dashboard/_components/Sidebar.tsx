"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database,
  HardDrive,
} from "lucide-react";
import { UserRole } from "@prisma/client";

import { sidebarSections } from "./sidebar-menu";
import LogoutButton from "./LogoutButton";


type SidebarProps = {
  userRole: UserRole;
};


export default function Sidebar({
  userRole,
}: SidebarProps) {
  const pathname = usePathname();


  return (
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
                  item.roles.includes(userRole)
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

                      const Icon = item.icon;



                      if (item.disabled) {
                        return (
                          <div
                            key={item.title}
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
                            <Icon size={18} />

                            <span>
                              {item.title}
                            </span>
                          </div>
                        );
                      }



                      if (!item.href) {
                        return null;
                      }



                      const active =
                        pathname === item.href ||
                        pathname.startsWith(
                          `${item.href}/`
                        );



                      return (
                        <Link
                          key={item.title}
                          href={item.href}
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

                          <Icon size={18} />

                          <span>
                            {item.title}
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
  );
}