"use client";

import Link from "next/link";
import {
  Menu,
  X,
  ClipboardList,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

import { useInquiry } from "@/components/providers/InquiryProvider";
import { useQuickView } from "@/components/providers/QuickViewProvider";

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

  const { close } = useQuickView();

  function handleInquiry() {
    close();
    openDrawer();
    setOpen(false);
  }

  return (
    <>
      {/* Header */}
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
          border-neutral-200/60
          bg-white/80
          px-5
          backdrop-blur-2xl
          md:hidden
        "
      >
        {/* Menu */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            transition
            hover:bg-neutral-100
          "
        >
          <Menu
            size={24}
            strokeWidth={1.6}
          />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="
            text-[24px]
            font-extralight
            tracking-[0.28em]
          "
        >
          COMBINE
        </Link>

        {/* Inquiry */}
        <button
          type="button"
          onClick={handleInquiry}
          className="
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            transition
            hover:bg-neutral-100
          "
        >
          <ClipboardList
            size={21}
            strokeWidth={1.6}
          />

          {totalItems > 0 && (
            <span
              className="
                absolute
                right-1
                top-1
                flex
                h-5
                min-w-5
                items-center
                justify-center
                rounded-full
                bg-black
                px-1
                text-[9px]
                font-medium
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
          bg-black/40
          backdrop-blur-sm
          transition-all
          duration-300
          md:hidden
          ${
            open
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-[60]
          flex
          h-screen
          w-[320px]
          flex-col
          bg-white
          px-8
          py-8
          shadow-[0_40px_80px_rgba(0,0,0,.18)]
          transition-transform
          duration-500
          md:hidden
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Top */}
        <div className="flex items-center justify-between">
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.4em]
              text-neutral-400
            "
          >
            COMBINE
          </p>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              hover:bg-neutral-100
            "
          >
            <X
              size={22}
              strokeWidth={1.6}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-14 space-y-7">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="
                block
                text-[15px]
                font-light
                uppercase
                tracking-[0.28em]
                text-neutral-800
                transition
                hover:text-[#B08D57]
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="mt-auto border-t border-neutral-200 pt-8">
          <div className="space-y-6">
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="
                flex
                items-center
                gap-3
                text-sm
                tracking-[0.18em]
                transition
                hover:text-[#B08D57]
              "
            >
              <Heart size={18} />
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
                tracking-[0.18em]
                transition
                hover:text-[#B08D57]
              "
            >
              <ClipboardList size={18} />
              Inquiry

              {totalItems > 0 && (
                <span className="text-neutral-500">
                  ({totalItems})
                </span>
              )}
            </button>

            <a
              href="https://wa.me/60168848453"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-black
                px-6
                py-3
                text-[11px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-white
                transition
                hover:bg-[#B08D57]
              "
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}