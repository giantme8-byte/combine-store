/**
 * Optimise a Cloudinary image for delivery.
 *
 * The original Cloudinary URL remains unchanged in the database.
 * This only changes the URL used when the image is delivered
 * to the customer.
 *
 * Uses Cloudinary automatic format and quality optimisation
 * without changing the original image dimensions or crop.
 */
export function optimizeCloudinaryImage(
  url: string,
  width: number
) {
  if (!url) {
    return url;
  }

  // Only transform Cloudinary image URLs.
  if (
    !url.includes("res.cloudinary.com") ||
    !url.includes("/image/upload/")
  ) {
    return url;
  }

  // Avoid adding the transformation twice.
  if (
    url.includes("/f_auto,q_auto/") ||
    url.includes("/q_auto,f_auto/")
  ) {
    return url;
  }

  /*
   * =========================================================
   * DELIVERY OPTIMISATION
   * =========================================================
   *
   * Important:
   *
   * - Do NOT crop the product.
   * - Do NOT force a fixed height.
   * - Do NOT use c_auto_pad.
   * - Do NOT use g_auto.
   *
   * The original product image should remain intact.
   *
   * Cloudinary will automatically optimise:
   *
   *   f_auto  → best supported image format
   *   q_auto  → automatic quality optimisation
   *
   * The width parameter is intentionally not used here.
   *
   * This keeps the original image dimensions and avoids
   * introducing a transformation that may break delivery.
   * =========================================================
   */

  return url.replace(
    "/image/upload/",
    "/image/upload/f_auto,q_auto/"
  );
}