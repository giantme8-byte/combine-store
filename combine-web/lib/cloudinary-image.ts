/**
 * Cloudinary image delivery helper.
 *
 * Applies lightweight, automatic Cloudinary transformations
 * while keeping the original asset path and version intact.
 *
 * - f_auto: automatically serves the best supported image format
 * - q_auto: automatically optimizes image quality
 * - c_limit: prevents unnecessary upscaling
 * - w_<width>: limits the delivered image width
 */
export function optimizeCloudinaryImage(
  url: string,
  width: number
) {
  if (!url) return url;

  // Only optimize Cloudinary delivery URLs.
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // Keep width within sensible limits.
  const safeWidth = Math.max(
    320,
    Math.min(Math.round(width), 1600)
  );

  const transformation =
    `f_auto,q_auto,c_limit,w_${safeWidth}`;

  // Already transformed URL.
  if (url.includes("/image/upload/")) {
    return url.replace(
      "/image/upload/",
      `/image/upload/${transformation}/`
    );
  }

  return url;
}