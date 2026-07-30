"use server";

import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/authorize";
import { prisma } from "@/lib/prisma";

export async function saveSettings(
  formData: FormData
) {
  await requireRole([
    UserRole.OWNER,
    UserRole.ADMIN,
  ]);

  const companyName =
    (formData.get("companyName") as string)?.trim() ||
    "COMBINE";

  const companyDescription =
    (formData.get("companyDescription") as string)?.trim() ||
    null;

  const companyLogo =
    (formData.get("companyLogo") as string)?.trim() ||
    null;

  // WhatsApp Number
  let whatsappNumber =
    (formData.get("whatsappNumber") as string)?.trim() ||
    "60166620448";

  // Remove everything except numbers
  whatsappNumber = whatsappNumber.replace(/\D/g, "");

  // Convert Malaysian local number to international format
  // Example: 0166620448 -> 60166620448
  if (whatsappNumber.startsWith("0")) {
    whatsappNumber = "6" + whatsappNumber;
  }

  const phone =
    (formData.get("phone") as string)?.trim() ||
    null;

  const email =
    (formData.get("email") as string)?.trim() ||
    null;

  const website =
    (formData.get("website") as string)?.trim() ||
    null;

  const address =
    (formData.get("address") as string)?.trim() ||
    null;

  // Social
  const facebook =
    (formData.get("facebook") as string)?.trim() ||
    null;

  const instagram =
    (formData.get("instagram") as string)?.trim() ||
    null;

  const tiktok =
    (formData.get("tiktok") as string)?.trim() ||
    null;

  const youtube =
    (formData.get("youtube") as string)?.trim() ||
    null;

  const maintenanceMode =
    formData.get("maintenanceMode") === "on";

  const parsedExchangeRate = Number(
    formData.get("exchangeRate")
  );

  const exchangeRate = Number.isFinite(
    parsedExchangeRate
  )
    ? parsedExchangeRate
    : 0.59;

  const siteTitle =
    (formData.get("siteTitle") as string)?.trim() ||
    null;

  const metaDescription =
    (formData.get("metaDescription") as string)?.trim() ||
    null;

  const existing =
    await prisma.setting.findFirst();

  if (existing) {
    await prisma.setting.update({
      where: {
        id: existing.id,
      },
      data: {
        companyName,
        companyLogo,
        companyDescription,
        whatsappNumber,
        phone,
        email,
        website,
        address,
        facebook,
        instagram,
        tiktok,
        youtube,
        exchangeRate,
        maintenanceMode,
        siteTitle,
        metaDescription,
      },
    });
  } else {
    await prisma.setting.create({
      data: {
        companyName,
        companyLogo,
        companyDescription,
        whatsappNumber,
        phone,
        email,
        website,
        address,
        facebook,
        instagram,
        tiktok,
        youtube,
        exchangeRate,
        maintenanceMode,
        siteTitle,
        metaDescription,
      },
    });
  }

  redirect("/admin/dashboard/settings");
}