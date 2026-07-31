import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  companyName: "COMBINE",
  whatsappNumber: "60166620448",
  exchangeRate: 0.59,
  email: null,
};

export async function getSettings() {
  let settings = await prisma.setting.findFirst();

  if (!settings) {
    settings = await prisma.setting.create({
      data: DEFAULT_SETTINGS,
    });
  }

  return settings;
}