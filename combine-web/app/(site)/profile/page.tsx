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
  <main className="mx-auto max-w-[1440px] px-8 pb-32 pt-36 lg:px-12">

    {/* Header */}
    <div className="mx-auto mb-24 max-w-4xl text-center">

      <p className="text-xs uppercase tracking-[0.55em] text-neutral-400">
        ACCOUNT
      </p>

      <h1
        className="
          mt-6
          text-5xl
          font-extralight
          tracking-[-0.04em]
          text-neutral-900
          md:text-6xl
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
          text-lg
          leading-8
          text-neutral-500
        "
      >
        Manage your account, saved collections and enquiry
        history from one elegant dashboard.
      </p>

    </div>



    <div className="grid gap-10 lg:grid-cols-[360px_1fr]">

      {/* Left */}
      <section
        className="
          rounded-[36px]
          border
          border-neutral-200
          bg-white
          p-10
          shadow-[0_20px_60px_rgba(0,0,0,.04)]
        "
      >

        <div
          className="
            flex
            h-32
            w-32
            items-center
            justify-center
            rounded-full
            bg-gradient-to-b
            from-black
            to-neutral-700
            text-5xl
            text-white
          "
        >
          👤
        </div>

        <h2
          className="
            mt-8
            text-3xl
            font-extralight
            tracking-[-0.03em]
          "
        >
          {user.name}
        </h2>

        <p className="mt-3 text-neutral-500">
          {user.email}
        </p>

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

        <p className="mt-3 text-lg text-neutral-700">
          {user.createdAt.toLocaleDateString()}
        </p>

      </section>



      {/* Right */}

      <div className="space-y-10">

        <section
          className="
            rounded-[36px]
            border
            border-neutral-200
            bg-white
            p-10
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
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

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <div
              className="
                rounded-[28px]
                border
                border-neutral-200
                bg-gradient-to-b
                from-white
                to-neutral-50
                p-8
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

              <p
                className="
                  mt-5
                  text-6xl
                  font-extralight
                  tracking-[-0.04em]
                "
              >
                {wishlistCount}
              </p>

            </div>



            <div
              className="
                rounded-[28px]
                border
                border-neutral-200
                bg-gradient-to-b
                from-white
                to-neutral-50
                p-8
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

              <p
                className="
                  mt-5
                  text-6xl
                  font-extralight
                  tracking-[-0.04em]
                "
              >
                {inquiryCount}
              </p>

            </div>

          </div>

        </section>



        <section
          className="
            rounded-[36px]
            border
            border-neutral-200
            bg-white
            p-10
            shadow-[0_20px_60px_rgba(0,0,0,.04)]
          "
        >

          <h2
            className="
              text-3xl
              font-extralight
              tracking-[-0.03em]
            "
          >
            Coming Soon
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

          <div className="mt-10 space-y-5">

            {[
              "Edit Profile",
              "Change Password",
              "Upload Avatar",
              "Order History",
            ].map((item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-neutral-200
                  px-6
                  py-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C8A96A]
                  hover:shadow-lg
                "
              >

                <span className="text-neutral-700">
                  {item}
                </span>

                <span className="text-neutral-300">
                  →
                </span>

              </div>
            ))}

          </div>

        </section>

      </div>

    </div>

  </main>
);
}