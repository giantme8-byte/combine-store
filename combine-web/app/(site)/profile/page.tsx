import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

import LogoutButton from "./_components/LogoutButton";


export default async function ProfilePage() {

  const user =
    await getCurrentUser();


  if (!user) {
    redirect("/login");
  }


  // ==========================================================
  // ACCOUNT COUNTS
  // ==========================================================

  const [
    wishlistCount,
    inquiryCount,
    orderCount,
  ] = await Promise.all([

    prisma.wishlistItem.count({
      where: {
        userId:
          user.id,
      },
    }),


    prisma.inquiry.count({
      where: {
        userId:
          user.id,
      },
    }),


    prisma.order.count({
      where: {
        userId:
          user.id,
      },
    }),

  ]);


  return (

    <main
      className="
        mx-auto
        max-w-[1440px]
        px-6
        pb-32
        pt-32
        sm:px-8
        sm:pt-36
        lg:px-12
      "
    >


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mx-auto
          mb-16
          max-w-4xl
          text-center
          sm:mb-24
        "
      >

        <p
          className="
            text-xs
            uppercase
            tracking-[0.55em]
            text-neutral-400
          "
        >
          ACCOUNT
        </p>


        <h1
          className="
            mt-6
            text-5xl
            font-extralight
            tracking-[-0.04em]
            text-neutral-900
            sm:text-6xl
          "
        >
          My Profile
        </h1>


        <div
          className="
            mx-auto
            mt-8
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-[#C8A96A]
            to-transparent
          "
        />


        <p
          className="
            mx-auto
            mt-8
            max-w-3xl
            text-base
            leading-7
            text-neutral-500
            sm:text-lg
            sm:leading-8
          "
        >
          Manage your account, saved collections and
          enquiry history from one elegant dashboard.
        </p>

      </div>



      {/* ======================================================
          MAIN GRID
      ====================================================== */}

      <div
        className="
          grid
          gap-8
          lg:grid-cols-[360px_1fr]
          lg:gap-10
        "
      >


        {/* ====================================================
            LEFT — PROFILE CARD
        ==================================================== */}

        <section
          className="
            rounded-[32px]
            border
            border-neutral-200
            bg-white
            p-7
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
            sm:rounded-[36px]
            sm:p-10
          "
        >


          {/* ==================================================
              AVATAR
          ================================================== */}

          <div
            className="
              flex
              h-28
              w-28
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-gradient-to-b
              from-black
              to-neutral-700
              text-4xl
              text-white
              sm:h-32
              sm:w-32
              sm:text-5xl
            "
          >

            {user.image ? (

              <img
                src={user.image}
                alt={user.name}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />

            ) : (

              "👤"

            )}

          </div>


          {/* ==================================================
              NAME
          ================================================== */}

          <h2
            className="
              mt-7
              text-3xl
              font-extralight
              tracking-[-0.03em]
              sm:mt-8
            "
          >
            {user.name}
          </h2>


          {/* ==================================================
              EMAIL
          ================================================== */}

          <p
            className="
              mt-3
              break-all
              text-sm
              text-neutral-500
            "
          >
            {user.email}
          </p>


          {/* ==================================================
              PHONE
          ================================================== */}

          <p
            className="
              mt-2
              text-sm
              text-neutral-500
            "
          >
            {user.phone ||
              "Not added yet"}
          </p>


          {/* ==================================================
              DIVIDER
          ================================================== */}

          <div
            className="
              mt-8
              h-px
              w-16
              bg-gradient-to-r
              from-[#C8A96A]
              to-transparent
            "
          />


          {/* ==================================================
              MEMBER SINCE
          ================================================== */}

          <p
            className="
              mt-8
              text-[11px]
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
            Member Since
          </p>


          <p
            className="
              mt-3
              text-lg
              text-neutral-700
            "
          >
            {user.createdAt.toLocaleDateString()}
          </p>


          {/* ==================================================
              EDIT PROFILE
          ================================================== */}

          <Link
            href="/profile/edit"
            className="
              mt-8
              inline-flex
              w-full
              items-center
              justify-center
              rounded-full
              border
              border-neutral-200
              px-6
              py-4
              text-[11px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-neutral-700
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#C8A96A]
              hover:text-[#C8A96A]
              hover:shadow-lg
            "
          >
            Edit Profile
          </Link>

        </section>



        {/* ====================================================
            RIGHT
        ==================================================== */}

        <div
          className="
            space-y-8
            sm:space-y-10
          "
        >


          {/* ==================================================
              ACCOUNT OVERVIEW
          ================================================== */}

          <section
            className="
              rounded-[32px]
              border
              border-neutral-200
              bg-white
              p-7
              shadow-[0_20px_60px_rgba(0,0,0,.04)]
              sm:rounded-[36px]
              sm:p-10
            "
          >

            <h2
              className="
                text-3xl
                font-extralight
                tracking-[-0.03em]
              "
            >
              Account Overview
            </h2>


            <div
              className="
                mt-6
                h-px
                w-16
                bg-gradient-to-r
                from-[#C8A96A]
                to-transparent
              "
            />


            <div
              className="
                mt-8
                grid
                gap-5
                sm:mt-10
                sm:grid-cols-2
                xl:grid-cols-3
              "
            >


              {/* =================================================
                  WISHLIST
              ================================================= */}

              <Link
                href="/wishlist"
                className="
                  group
                  block
                  rounded-[26px]
                  border
                  border-neutral-200
                  bg-gradient-to-b
                  from-white
                  to-neutral-50
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A96A]
                  hover:shadow-lg
                "
              >

                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.35em]
                    text-neutral-400
                  "
                >
                  Wishlist
                </p>


                <div
                  className="
                    mt-5
                    flex
                    items-end
                    justify-between
                  "
                >

                  <p
                    className="
                      text-5xl
                      font-extralight
                      tracking-[-0.04em]
                      sm:text-6xl
                    "
                  >
                    {wishlistCount}
                  </p>


                  <span
                    className="
                      mb-2
                      text-neutral-300
                      transition-colors
                      duration-300
                      group-hover:text-[#C8A96A]
                    "
                  >
                    →
                  </span>

                </div>

              </Link>



              {/* =================================================
                  INQUIRY
              ================================================= */}

              <Link
                href="/inquiries"
                className="
                  group
                  block
                  rounded-[26px]
                  border
                  border-neutral-200
                  bg-gradient-to-b
                  from-white
                  to-neutral-50
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A96A]
                  hover:shadow-lg
                "
              >

                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.35em]
                    text-neutral-400
                  "
                >
                  Inquiry
                </p>


                <div
                  className="
                    mt-5
                    flex
                    items-end
                    justify-between
                  "
                >

                  <p
                    className="
                      text-5xl
                      font-extralight
                      tracking-[-0.04em]
                      sm:text-6xl
                    "
                  >
                    {inquiryCount}
                  </p>


                  <span
                    className="
                      mb-2
                      text-neutral-300
                      transition-colors
                      duration-300
                      group-hover:text-[#C8A96A]
                    "
                  >
                    →
                  </span>

                </div>

              </Link>



              {/* =================================================
                  ORDERS
              ================================================= */}

              <Link
                href="/profile/orders"
                className="
                  group
                  block
                  rounded-[26px]
                  border
                  border-neutral-200
                  bg-gradient-to-b
                  from-white
                  to-neutral-50
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A96A]
                  hover:shadow-lg
                "
              >

                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.35em]
                    text-neutral-400
                  "
                >
                  Orders
                </p>


                <div
                  className="
                    mt-5
                    flex
                    items-end
                    justify-between
                  "
                >

                  <p
                    className="
                      text-5xl
                      font-extralight
                      tracking-[-0.04em]
                      sm:text-6xl
                    "
                  >
                    {orderCount}
                  </p>


                  <span
                    className="
                      mb-2
                      text-neutral-300
                      transition-colors
                      duration-300
                      group-hover:text-[#C8A96A]
                    "
                  >
                    →
                  </span>

                </div>

              </Link>

            </div>

          </section>



          {/* ==================================================
              ACCOUNT SETTINGS
          ================================================== */}

          <section
            className="
              rounded-[32px]
              border
              border-neutral-200
              bg-white
              p-7
              shadow-[0_20px_60px_rgba(0,0,0,.04)]
              sm:rounded-[36px]
              sm:p-10
            "
          >

            <h2
              className="
                text-3xl
                font-extralight
                tracking-[-0.03em]
              "
            >
              Account Settings
            </h2>


            <div
              className="
                mt-6
                h-px
                w-16
                bg-gradient-to-r
                from-[#C8A96A]
                to-transparent
              "
            />


            <div
              className="
                mt-8
                space-y-4
                sm:mt-10
                sm:space-y-5
              "
            >


              {/* =================================================
                  EDIT PROFILE
              ================================================= */}

              <Link
                href="/profile/edit"
                className="
                  group
                  block
                  rounded-2xl
                  border
                  border-neutral-200
                  px-5
                  py-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A96A]
                  hover:shadow-lg
                  sm:px-6
                  sm:py-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-neutral-100
                      text-lg
                    "
                  >
                    ✏️
                  </div>


                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >

                    <p
                      className="
                        text-neutral-900
                      "
                    >
                      Edit Profile
                    </p>


                    <p
                      className="
                        mt-1
                        text-sm
                        leading-6
                        text-neutral-500
                      "
                    >
                      Update your name, phone number and profile photo.
                    </p>

                  </div>


                  <span
                    className="
                      shrink-0
                      text-neutral-300
                      transition-colors
                      duration-300
                      group-hover:text-[#C8A96A]
                    "
                  >
                    →
                  </span>

                </div>

              </Link>



              {/* =================================================
                  SECURITY
              ================================================= */}

              <Link
                href="/profile/password"
                className="
                  group
                  block
                  rounded-2xl
                  border
                  border-neutral-200
                  px-5
                  py-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A96A]
                  hover:shadow-lg
                  sm:px-6
                  sm:py-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-neutral-100
                      text-lg
                    "
                  >
                    🔐
                  </div>


                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >

                    <p
                      className="
                        text-neutral-900
                      "
                    >
                      Security
                    </p>


                    <p
                      className="
                        mt-1
                        text-sm
                        leading-6
                        text-neutral-500
                      "
                    >
                      Manage your password and account security.
                    </p>

                  </div>


                  <span
                    className="
                      shrink-0
                      text-neutral-300
                      transition-colors
                      duration-300
                      group-hover:text-[#C8A96A]
                    "
                  >
                    →
                  </span>

                </div>

              </Link>



              {/* =================================================
                  ORDER HISTORY
              ================================================= */}

              <Link
                href="/profile/orders"
                className="
                  group
                  block
                  rounded-2xl
                  border
                  border-neutral-200
                  px-5
                  py-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A96A]
                  hover:shadow-lg
                  sm:px-6
                  sm:py-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-neutral-100
                      text-lg
                    "
                  >
                    📦
                  </div>


                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >

                    <p
                      className="
                        text-neutral-900
                      "
                    >
                      Order History
                    </p>


                    <p
                      className="
                        mt-1
                        text-sm
                        leading-6
                        text-neutral-500
                      "
                    >
                      View your orders and shipment tracking.
                    </p>

                  </div>


                  <span
                    className="
                      shrink-0
                      text-neutral-300
                      transition-colors
                      duration-300
                      group-hover:text-[#C8A96A]
                    "
                  >
                    →
                  </span>

                </div>

              </Link>



              {/* =================================================
                  LOGOUT
              ================================================= */}

              <div
                className="
                  rounded-2xl
                  border
                  border-red-100
                  bg-red-50/40
                  p-5
                  sm:p-6
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-neutral-900
                      "
                    >
                      Sign Out
                    </p>


                    <p
                      className="
                        mt-1
                        text-sm
                        leading-6
                        text-neutral-500
                      "
                    >
                      Sign out of your COMBINE account on this device.
                    </p>

                  </div>


                  <div
                    className="
                      w-full
                      sm:w-auto
                    "
                  >
                    <LogoutButton />
                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>

      </div>

    </main>

  );

}