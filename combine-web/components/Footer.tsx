import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default async function Footer() {
  const settings = await prisma.setting.findFirst({
    select: {
      companyName: true,
      companyDescription: true,
      instagram: true,
      facebook: true,
    },
  });

  const whatsappLink = await getWhatsAppLink();

  return (
    <footer className="relative mt-40 overflow-hidden border-t border-white/10 bg-[#111111] text-white">
      {/* Watermark */}
      <div
        className="
          pointer-events-none
          absolute
          right-10
          bottom-0
          hidden
          select-none
          text-[180px]
          font-extralight
          tracking-[-0.08em]
          text-white/[0.03]
          lg:block
        "
      >
        COMBINE
      </div>

      <div className="mx-auto max-w-[1440px] px-8 py-24 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-[0.55em]
                text-[#C8A96A]
              "
            >
              {settings?.companyName ?? "COMBINE"}
            </p>

            <h2
              className="
                mt-7
                text-5xl
                font-extralight
                leading-[1]
                tracking-[-0.05em]
                lg:text-7xl
              "
            >
              Luxury
              <br />
              Redefined.
            </h2>

            <div
              className="
                mt-8
                h-px
                w-28
                bg-gradient-to-r
                from-[#C8A96A]
                to-transparent
              "
            />

            <p
              className="
                mt-8
                max-w-xl
                leading-8
                text-white/65
              "
            >
              {settings?.companyDescription ??
                "Curated luxury handbags, watches and jewellery crafted with exceptional attention to detail. Designed for those who appreciate timeless elegance and premium craftsmanship."}
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-10
                inline-flex
                items-center
                rounded-full
                border
                border-[#C8A96A]
                px-8
                py-4
                text-[11px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-[#C8A96A]
                transition-all
                duration-500
                hover:-translate-y-1
                hover:bg-[#C8A96A]
                hover:text-black
                hover:shadow-xl
              "
            >
              Contact Us

              <span className="ml-3 transition-transform duration-300 hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          {/* Explore */}
          <div>
            <h3
              className="
                text-[11px]
                uppercase
                tracking-[0.45em]
                text-white
              "
            >
              Explore
            </h3>

            <div className="mt-8 flex flex-col gap-5">
              <Link
                href="/"
                className="text-white/60 transition-all duration-300 hover:text-[#C8A96A]"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="text-white/60 transition-all duration-300 hover:text-[#C8A96A]"
              >
                Collection
              </Link>

              <Link
                href="/about"
                className="text-white/60 transition-all duration-300 hover:text-[#C8A96A]"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="text-white/60 transition-all duration-300 hover:text-[#C8A96A]"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="
                text-[11px]
                uppercase
                tracking-[0.45em]
                text-white
              "
            >
              Contact
            </h3>

            <div className="mt-8 flex flex-col gap-5">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-all duration-300 hover:text-[#C8A96A]"
              >
                WhatsApp
              </a>

              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-all duration-300 hover:text-[#C8A96A]"
                >
                  Instagram
                </a>
              )}

              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-all duration-300 hover:text-[#C8A96A]"
                >
                  Facebook
                </a>
              )}

              <span className="text-white/60">
                Daily · 10:00 AM – 10:00 PM
              </span>

              <Link
                href="/wishlist"
                className="text-white/60 transition-all duration-300 hover:text-[#C8A96A]"
              >
                Wishlist
              </Link>

              <Link
                href="/inquiry"
                className="text-white/60 transition-all duration-300 hover:text-[#C8A96A]"
              >
                Inquiry
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()}{" "}
              {settings?.companyName ?? "COMBINE"}.
              All Rights Reserved.
            </p>

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.45em]
                text-white/30
              "
            >
              Luxury • Craftsmanship • Worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}