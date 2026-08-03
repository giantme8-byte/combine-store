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


export function addInquiryItem(
  productId: number
) {
  const items = getInquiryItems();

  const existing = items.find(
    (item) =>
      item.productId === productId
  );


  if (existing) {

    existing.quantity += 1;

  } else {

    items.push({
      productId,
      quantity: 1,
    });

  }


  saveInquiryItems(items);

  return items;
}


export function removeInquiryItem(
  productId: number
) {
  const items =
    getInquiryItems().filter(
      (item) =>
        item.productId !== productId
    );


  saveInquiryItems(items);

  return items;
}


export function updateInquiryQuantity(
  productId: number,
  quantity: number
) {
  const items =
    getInquiryItems().map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: Math.max(
              1,
              quantity
            ),
          }
        : item
    );


  saveInquiryItems(items);

  return items;
}


export function updateInquiryOptions(
  productId: number,
  data: {
    color?: string;
    variant?: string;
    dimensions?: string;
    packaging?: string;
    notes?: string;
  }
) {
  const items =
    getInquiryItems().map((item) =>
      item.productId === productId
        ? {
            ...item,
            ...data,
          }
        : item
    );


  saveInquiryItems(items);

  return items;
}


export function clearInquiry() {
  saveInquiryItems([]);
}