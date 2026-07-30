"use client";

import {
  Bell,
  Search,
  LogOut,
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






  return (

    <header
      className="
        sticky
        top-0
        z-20
        border-b
        border-neutral-200
        bg-neutral-100/80
        backdrop-blur
      "
    >


      <div
        className="
          flex
          h-20
          items-center
          justify-between
          px-8
        "
      >



        {/* Left */}

        <div>

          <p
            className="
              text-sm
              text-neutral-500
            "
          >
            {today}
          </p>



          <h1
            className="
              mt-1
              text-2xl
              font-light
              tracking-tight
              text-neutral-900
            "
          >
            Admin Dashboard
          </h1>


        </div>







        {/* Right */}


        <div
          className="
            flex
            items-center
            gap-4
          "
        >




          {/* Search */}


          <div
            className="
              flex
              w-80
              items-center
              gap-3
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-4
              py-3
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







          {/* Notification */}


          <button
            type="button"
            className="
              rounded-xl
              border
              border-neutral-200
              bg-white
              p-3
              transition
              hover:bg-neutral-50
            "
          >

            <Bell size={18}/>

          </button>







          {/* User */}


          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-neutral-200
              bg-white
              px-4
              py-2
            "
          >


            <div>


              <p
                className="
                  text-sm
                  font-medium
                  text-neutral-900
                "
              >

                {user.name ?? "Admin"}

              </p>



              <p
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-neutral-400
                "
              >

                {user.role}

              </p>


            </div>





            <button
              type="button"
              onClick={handleLogout}
              className="
                rounded-lg
                p-2
                text-neutral-500
                transition
                hover:bg-neutral-100
                hover:text-black
              "
              aria-label="Logout"
            >

              <LogOut size={17}/>

            </button>



          </div>



        </div>



      </div>


    </header>

  );

}