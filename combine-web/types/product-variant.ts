export type ProductVariantItem = {
  id: string;

  size: string;

  model: string;

  dimensions: string;

  imageUrl?: string;

  publicId?: string;

  file?: File;

  isNew: boolean;

  deleted: boolean;
};