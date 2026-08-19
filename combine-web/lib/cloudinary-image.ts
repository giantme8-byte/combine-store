/**
 * Cloudinary image delivery helper.
 *
 * The original Cloudinary URL is returned unchanged.
 *
 * We intentionally do not apply any Cloudinary transformation
 * here so product images always use the original uploaded URL.
 */
export function optimizeCloudinaryImage(
  url: string,
  _width: number
) {
  return url;
}