import type { InquiryItem } from "@/types";

const STORAGE_KEY = "combine_inquiry";

export function getInquiryItems(): InquiryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as InquiryItem[];
  } catch {
    return [];
  }
}

export function saveInquiryItems(
  items: InquiryItem[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items)
  );
}