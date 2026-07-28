export interface ProductImageItem {
  id: string;

  url: string;

  publicId: string | null;

  file?: File;

  isNew: boolean;

  name?: string;
}