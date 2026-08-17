export interface InquiryItem {
  productId: number;

  quantity: number;

  /*
   * Unique identity for this product selection.
   *
   * The same product with different colour / variant
   * should be treated as separate inquiry items.
   *
   * Example:
   *
   * 123|Black|Small|20 x 15 x 8 cm
   * 123|Black|Large|25 x 18 x 10 cm
   */
  variantKey?: string;

  color?: string;

  variant?: string;

  dimensions?: string;

  packaging?: string;

  notes?: string;
}