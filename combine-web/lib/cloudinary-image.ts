/**
 * Optimise a Cloudinary image for delivery.
 *
 * The original Cloudinary URL remains unchanged in the database.
 * This only changes the URL used when the image is delivered
 * to the customer.
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

  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,c_limit,w_${width}/`
  );
}