import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default async function Footer() {
  const settings = await prisma.setting.findFirst();
  const whatsappLink = await getWhatsAppLink();

  return (
    <footer className="mt-32 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">
              {settings?.companyName || "COMBINE"}
            </p>

            <h2 className="mt-6 text-4xl font-extralight leading-tight tracking-[-0.03em] lg:text-5xl">
              Timeless Luxury.
            </h2>

            <p className="mt-8 max-w-lg leading-8 text-neutral-600">
              {settings?.companyDescription ||
                "Curated luxury handbags, premium watches and refined jewellery for those who appreciate exceptional craftsmanship and timeless elegance."}
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center rounded-full bg-black px-8 py-4 text-sm uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:bg-neutral-800"
            >
              Contact Us
              <span className="ml-2">→</span>
            </a>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              Explore
            </h3>

            <div className="mt-8 flex flex-col gap-5 text-neutral-600">
              <Link
                href="/"
                className="transition-colors duration-300 hover:text-black"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="transition-colors duration-300 hover:text-black"
              >
                Collection
              </Link>

              <Link
                href="/about"
                className="transition-colors duration-300 hover:text-black"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="transition-colors duration-300 hover:text-black"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              Contact
            </h3>

            <div className="mt-8 flex flex-col gap-5 text-neutral-600">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-black"
              >
                WhatsApp
              </a>

              <a
                href={settings?.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-black"
              >
                Instagram
              </a>

              <a
                href={settings?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-black"
              >
                Facebook
              </a>

              <span>Daily · 10:00 AM – 10:00 PM</span>

              <Link
                href="/wishlist"
                className="transition-colors duration-300 hover:text-black"
              >
                Wishlist
              </Link>

              <Link
                href="/inquiry"
                className="transition-colors duration-300 hover:text-black"
              >
                Inquiry
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-neutral-200 pt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()}{" "}
              {settings?.companyName || "COMBINE"}. All Rights Reserved.
            </p>

            <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
              Exceptional Craftsmanship • Timeless Elegance
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}