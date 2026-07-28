"use client";

import Link from "next/link";
import { Menu, X, ClipboardList, Heart } from "lucide-react";
import { useState } from "react";

import { useInquiry } from "@/components/providers/InquiryProvider";


const navigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Collection",
    href: "/shop",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];


export default function MobileNavbar() {

  const [open, setOpen] = useState(false);


  const {
    totalItems,
    openDrawer,
  } = useInquiry();



  function handleInquiry() {

    setOpen(false);

    openDrawer();

  }



  return (
    <>


      {/* Mobile Header */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-[60]
          flex
          h-[72px]
          items-center
          justify-between
          border-b
          border-neutral-200/70
          bg-white/90
          px-6
          backdrop-blur-xl
          md:hidden
        "
      >


        {/* Menu Button */}

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
          "
        >
          <Menu
            size={24}
            strokeWidth={1.5}
          />
        </button>



        {/* Logo */}

        <Link
          href="/"
          className="
            text-2xl
            font-extralight
            tracking-[0.35em]
          "
        >
          COMBINE
        </Link>



        {/* Inquiry */}

        <button
          type="button"
          onClick={handleInquiry}
          aria-label="Inquiry"
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
          "
        >

          <ClipboardList
            size={22}
            strokeWidth={1.5}
          />


          {totalItems > 0 && (

            <span
              className="
                absolute
                right-0
                top-0
                flex
                h-4
                min-w-4
                items-center
                justify-center
                rounded-full
                bg-black
                px-1
                text-[9px]
                text-white
              "
            >
              {totalItems}
            </span>

          )}

        </button>


      </header>





      {/* Overlay */}

      <div
        onClick={() => setOpen(false)}
        className={`
          fixed
          inset-0
          z-50
          bg-black/30
          backdrop-blur-sm
          transition-opacity
          md:hidden

          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />





      {/* Side Menu */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-[60]
          h-screen
          w-[300px]
          bg-white
          px-8
          py-8
          shadow-2xl
          transition-transform
          duration-300
          md:hidden

          ${
            open
              ? "translate-x-0"
              : " -translate-x-full"
          }
        `}
      >


        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
            COMBINE
          </p>


          <button
            type="button"
            onClick={() => setOpen(false)}
          >

            <X
              size={22}
              strokeWidth={1.5}
            />

          </button>


        </div>




        <nav
          className="
            mt-12
            space-y-6
          "
        >

          {navigation.map((item) => (

            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="
                block
                text-sm
                uppercase
                tracking-[0.3em]
                text-neutral-700
              "
            >
              {item.label}
            </Link>

          ))}


        </nav>





        <div
          className="
            mt-12
            space-y-5
            border-t
            border-neutral-200
            pt-8
          "
        >


          <Link
            href="/wishlist"
            onClick={() => setOpen(false)}
            className="
              flex
              items-center
              gap-3
              text-sm
              uppercase
              tracking-[0.25em]
            "
          >

            <Heart
              size={18}
              strokeWidth={1.5}
            />

            Wishlist

          </Link>




          <button
            type="button"
            onClick={handleInquiry}
            className="
              flex
              items-center
              gap-3
              text-sm
              uppercase
              tracking-[0.25em]
            "
          >

            <ClipboardList
              size={18}
              strokeWidth={1.5}
            />

            Inquiry

            {totalItems > 0 && (
              <span>
                ({totalItems})
              </span>
            )}

          </button>


        </div>


      </aside>


    </>
  );
}