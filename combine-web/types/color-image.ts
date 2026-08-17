export type ColorImage = {
  id: string;

  url: string;

  publicId: string | null;

  file?: File;

  isNew: boolean;

  deleted?: boolean;

  sortOrder: number;

  /**
   * Current Cloudinary upload status.
   *
   * idle      = not uploading
   * uploading = currently uploading
   * uploaded  = successfully uploaded
   * error     = upload failed
   */
  uploadStatus?:
    | "idle"
    | "uploading"
    | "uploaded"
    | "error";
};

export type ColorImageItem = {
  id: string;

  /*
   * Global Color Master ID.
   *
   * Example:
   * Black = 1
   * White = 2
   * Brown = 3
   */
  colorId: number | null;

  /*
   * Display name.
   *
   * Keep this field for backward compatibility
   * with existing ProductColor records.
   *
   * New records should normally get their name
   * from the selected Global Color.
   */
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
   * One Product Color can contain
   * multiple gallery images.
   */
  images: ColorImage[];

  isNew: boolean;

  sortOrder: number;

  deleted?: boolean;
};