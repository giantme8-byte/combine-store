import { prisma } from "@/lib/prisma";

export async function getSettings() {
  let settings = await prisma.setting.findFirst();

  if (!settings) {
    settings = await prisma.setting.create({
      data: {
        companyName: "COMBINE",
        whatsappNumber: "60166620448",
        exchangeRate: 0.59,
        email: null,
      },
    });
  }

  return settings;
}