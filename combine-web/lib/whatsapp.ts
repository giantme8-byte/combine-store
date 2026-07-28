import { getSettings } from "@/lib/settings";

export async function getWhatsAppLink(message?: string) {
  const settings = await getSettings();

  const defaultMessage =
    message ??
    `Hi COMBINE,

I&apos;m interested in your products.

Could you please provide more information and the latest price?

Thank you.`;

  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;
}