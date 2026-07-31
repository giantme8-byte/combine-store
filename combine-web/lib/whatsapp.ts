import { getSettings } from "@/lib/settings";

const DEFAULT_MESSAGE = `Hi COMBINE,

I'm interested in your products.

Could you please provide more information and the latest price?

Thank you.`;

export async function getWhatsAppLink(
  message?: string
) {
  const settings = await getSettings();

  const whatsappNumber =
    settings.whatsappNumber.replace(/\D/g, "");

  const text =
    message ?? DEFAULT_MESSAGE;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    text
  )}`;
}