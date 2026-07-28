// types/inquiry.ts

export interface InquiryItem {
  id: string;

  slug: string;

  brand: string;

  name: string;

  model?: string;

  image: string;

  quantity: number;

  notes?: string;
}