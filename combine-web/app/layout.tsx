import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { prisma } from "@/lib/prisma";

import "./globals.css";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import QuickViewModal from "@/components/quick-view/QuickViewModal";
import InquiryDrawer from "@/components/inquiry/InquiryDrawer";

import { InquiryProvider } from "@/components/providers/InquiryProvider";
import { QuickViewProvider } from "@/components/providers/QuickViewProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await prisma.setting.findFirst();

  const siteUrl =
    "https://www.combineluxe.com";

  const title =
    settings?.siteTitle ||
    "COMBINE | Premium Luxury Collection";

  const description =
    settings?.metaDescription ||
    "Premium luxury handbags, watches, jewellery and accessories.";

  return {
    /*
     * =========================================================
     * SITE URL
     * =========================================================
     */

    metadataBase:
      new URL(siteUrl),

    /*
     * =========================================================
     * CANONICAL
     * =========================================================
     */

    alternates: {
      canonical: siteUrl,
    },

    /*
     * =========================================================
     * TITLE
     * =========================================================
     */

    title: {
      default: title,
      template: "%s | COMBINE",
    },

    description,

    /*
     * =========================================================
     * KEYWORDS
     * =========================================================
     */

    keywords: [
      "Luxury Bags",
      "Luxury Watches",
      "Designer Jewelry",
      "Luxury Accessories",
      "Luxury Fashion",
      "Premium Handbags",
      "Luxury Collection",
      "COMBINE",
    ],

    /*
     * =========================================================
     * APPLICATION
     * =========================================================
     */

    applicationName:
      "COMBINE",

    authors: [
      {
        name: "COMBINE",
      },
    ],

    creator:
      "COMBINE",

    publisher:
      "COMBINE",

    category:
      "Luxury Fashion",

    /*
     * =========================================================
     * SEARCH ENGINE INDEXING
     * =========================================================
     */

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
      },
    },

    /*
     * =========================================================
     * ICONS
     * =========================================================
     */

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },

    /*
     * =========================================================
     * APPLE WEB APP
     * =========================================================
     */

    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "COMBINE",
    },

    /*
     * =========================================================
     * FORMAT DETECTION
     * =========================================================
     */

    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },

    /*
     * =========================================================
     * OPEN GRAPH
     * =========================================================
     */

    openGraph: {
      type: "website",

      locale: "en_US",

      url: siteUrl,

      siteName:
        "COMBINE",

      title,

      description,

      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt:
            "COMBINE Luxury Collection",
        },
      ],
    },

    /*
     * =========================================================
     * TWITTER / X
     * =========================================================
     */

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images: [
        "/og-image.jpg",
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <InquiryProvider>
          <QuickViewProvider>

            {children}

            <InquiryDrawer />

            <QuickViewModal />

            <FloatingWhatsApp />

            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={3000}
              expand
            />

          </QuickViewProvider>
        </InquiryProvider>
      </body>
    </html>
  );
}