import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { prisma } from "@/lib/prisma";

import "./globals.css";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import InquiryDrawer from "@/components/inquiry/InquiryDrawer";
import { InquiryProvider } from "@/components/providers/InquiryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.setting.findFirst();

  const title =
    settings?.siteTitle ||
    "COMBINE | Luxury Bags, Watches & Jewelry";

  const description =
    settings?.metaDescription ||
    "Discover premium luxury handbags, designer watches, fine jewellery and timeless accessories at COMBINE.";

  return {
    metadataBase: new URL("https://combine.com"),

    title: {
      default: title,
      template: "%s | COMBINE",
    },

    description,

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

    applicationName: "COMBINE",

    authors: [
      {
        name: "COMBINE",
      },
    ],

    creator: "COMBINE",

    publisher: "COMBINE",

    category: "Luxury Fashion",

    robots: {
      index: false,
      follow: false,

      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },

    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "COMBINE",
    },

    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },

    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://combine.com",
      siteName: "COMBINE",

      title,

      description,

      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "COMBINE Luxury Collection",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

      images: ["/og-image.jpg"],
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
          {children}

          <InquiryDrawer />

          <FloatingWhatsApp />

          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3000}
            expand
          />
        </InquiryProvider>
      </body>
    </html>
  );
}