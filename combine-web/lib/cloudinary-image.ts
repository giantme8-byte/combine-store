/**
 * Optimise a Cloudinary image for delivery.
 *
 * The original Cloudinary URL remains unchanged in the database.
 * This only changes the URL used when the image is delivered
 * to the customer.
 *
 * TEST VERSION
 *
 * Uses Cloudinary padding to create a more consistent
 * 4:5 visual canvas while keeping the original product
 * fully visible.
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
    url.includes("/f_auto,q_auto") ||
    url.includes("/q_auto,f_auto")
  ) {
    return url;
  }

  /*
   * =========================================================
   * TEST IMAGE TRANSFORMATION
   * =========================================================
   *
   * 4:5 product canvas
   * Keep the complete product visible
   * Add automatic padding when necessary
   *
   * width 800
   * height 1000
   *
   * The original image itself is NOT modified.
   * =========================================================
   */

  const height = Math.round(
    width * 1.25
  );

  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,c_auto_pad,g_auto,w_${width},h_${height}/`
  );
}