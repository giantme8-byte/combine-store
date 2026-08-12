export type ColorImage = {
  id: string;
  url: string;
  publicId: string | null;
  file?: File;

  isNew: boolean;
  deleted?: boolean;

  sortOrder: number;
};

export type ColorImageItem = {
  id: string;

  name: string;
  model: string;

  /*
   * Legacy single image fields.
   *
   * Keep these for backward compatibility
   * with existing Color records.
   */
  url: string;
  publicId: string | null;

  /*
   * New Color Gallery.
   *
   * One color can now contain multiple images.
   */
  images: ColorImage[];

  isNew: boolean;
  sortOrder: number;
  deleted?: boolean;
};