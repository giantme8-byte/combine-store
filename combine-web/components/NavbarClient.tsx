"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import UserMenu from "./UserMenu";
import MobileNavbar from "./MobileNavbar";

type User = {
  id: number;
  name: string;
  email: string;
};

type Settings = {
  companyLogo: string | null;
  companyName: string | null;
  whatsappNumber: string | null;
};

type Props = {
  user: User | null;
  wishlistCount: number;
  inquiryCount: number;
  settings: Settings | null;
  whatsappLink: string;
};

const navigation = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function NavbarClient({
  user,
  wishlistCount,
  inquiryCount,
  settings,
  whatsappLink,
}: Props) {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <MobileNavbar />
      </div>

      {/* Desktop */}
      <header
        className={`fixed inset-x-0 top-0 z-50 hidden transition-all duration-500 md:block ${
          scrolled
            ? "border-b border-neutral-200/70 bg-white/75 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[80px] max-w-[1500px] items-center justify-between px-8 lg:px-14">
          {/* Logo */}
          <Link
            href="/"
            aria-label="COMBINE Home"
            className="
              text-[32px]
              font-extralight
              tracking-[0.32em]
              text-black
              transition-opacity
              duration-300
              hover:opacity-90
            "
          >
            COMBINE
          </Link>

          {/* Navigation */}
          <nav
            aria-label="Main navigation"
            className="ml-8 hidden items-center gap-12 md:flex"
          >
            {navigation.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative text-[12px] font-medium uppercase tracking-[0.28em] transition-colors duration-300 ${
                    active
                      ? "text-black"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {item.label}

                  <span
                    className={`absolute -bottom-3 left-0 h-px bg-black transition-all duration-300 ${
                      active
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="ml-10 hidden items-center gap-7 md:flex">
            <UserMenu
              user={user}
              wishlistCount={wishlistCount}
              inquiryCount={inquiryCount}
              dark
            />

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                whitespace-nowrap
                rounded-full
                border
                border-black
                bg-black
                px-8
                py-3
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#B08D57]
                hover:bg-[#B08D57]
              "
            >
              Request Price
            </a>
          </div>
        </div>
      </header>
    </>
  );
}