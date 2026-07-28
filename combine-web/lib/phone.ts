export function formatWhatsAppNumber(number: string | null | undefined) {
  if (!number) {
    return "";
  }

  const digits = number.replace(/\D/g, "");

  if (!digits.startsWith("60")) {
    return digits;
  }

  const local = digits.slice(2);

  if (local.length >= 10) {
    return `+60 ${local.slice(0, 2)}-${local.slice(2, 5)} ${local.slice(5)}`;
  }

  if (local.length >= 9) {
    return `+60 ${local.slice(0, 2)}-${local.slice(2)}`;
  }

  return `+${digits}`;
}