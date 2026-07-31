import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getWhatsAppLink } from "@/lib/whatsapp";

import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const [user, settings, whatsappLink] = await Promise.all([
    getCurrentUser(),
    getSettings(),
    getWhatsAppLink(),
  ]);

  let wishlistCount = 0;

  if (user) {
    wishlistCount = await prisma.wishlistItem.count({
      where: {
        userId: user.id,
      },
    });
  }

  return (
    <NavbarClient
      user={user}
      wishlistCount={wishlistCount}
      inquiryCount={0}
      settings={settings}
      whatsappLink={whatsappLink}
    />
  );
}