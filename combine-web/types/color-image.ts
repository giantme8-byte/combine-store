export type ColorImageItem = {
  id: string;

  name: string;

  model: string;

  url: string;

  publicId: string | null;

  file?: File;

  isNew: boolean;

  sortOrder: number;

  deleted?: boolean;
};