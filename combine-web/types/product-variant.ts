export type ProductVariantImageItem = {
  id: string;

  url: string;

  publicId: string;

  /**
   * Image order inside the Variant gallery.
   *
   * 1 = first image
   * 2 = second image
   * 3 = third image
   * ...
   */
  sortOrder: number;

  /**
   * Optional local file.
   *
   * Used when the image is newly selected
   * from the computer and has not been uploaded yet.
   */
  file?: File;

  /**
   * Marks a newly added image.
   */
  isNew?: boolean;

  /**
   * Marks an existing image for deletion.
   */
  deleted?: boolean;

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


export type ProductVariantItem = {
  id: string;

  size: string;

  /**
   * Variant-specific cost price in CNY.
   *
   * Example:
   *
   * Small -> 530
   * Large -> 650
   *
   * null = cost price not set.
   */
  costPriceCny: number | null;

  /**
   * Variant-specific CNY -> MYR exchange rate.
   *
   * Example:
   *
   * 0.60
   *
   * null = use the system/default exchange rate.
   */
  exchangeRate: number | null;

  /**
   * Variant-specific selling price.
   *
   * Example:
   *
   * Small -> 899
   * Large -> 1099
   *
   * null = use Product price as fallback.
   */
  price: number | null;

  model: string;

  dimensions: string;

  /**
   * Global Color relation.
   *
   * This connects the Variant to the
   * global Color table.
   *
   * Example:
   *
   * Black -> colorId: 1
   * Grey  -> colorId: 2
   */
  colorId: number | null;

  /**
   * Legacy single Variant image.
   *
   * Keep these fields for existing products
   * and backward compatibility.
   */
  imageUrl?: string;

  publicId?: string;

  /**
   * New Variant gallery.
   *
   * One Variant can now contain multiple images.
   *
   * Example:
   *
   * Variant: Black / M
   *
   * images:
   * 01 Front
   * 02 Back
   * 03 Side
   * 04 Detail
   */
  images: ProductVariantImageItem[];

  /**
   * Legacy single-file upload.
   *
   * Kept temporarily for compatibility
   * with the existing upload flow.
   */
  file?: File;

  isNew: boolean;

  deleted: boolean;
};