import { Prisma } from "@prisma/client";

export function buildProductOrderBy(
  sort: string
): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    /*
     * =========================================================
     * MANUAL ORDER
     * =========================================================
     *
     * This is the drag & drop order.
     *
     * ProductTable updates Product.displayOrder.
     *
     * IMPORTANT:
     * Always use displayOrder as the primary sorting field.
     * id is used as a stable fallback.
     */
    case "manual":
    case "featured":
      return [
        {
          displayOrder: "asc",
        },
        {
          id: "asc",
        },
      ];

    /*
     * =========================================================
     * LATEST
     * =========================================================
     */
    case "latest":
      return [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ];

    /*
     * =========================================================
     * OLDEST
     * =========================================================
     */
    case "oldest":
      return [
        {
          createdAt: "asc",
        },
        {
          id: "asc",
        },
      ];

    /*
     * =========================================================
     * NAME A-Z
     * =========================================================
     */
    case "az":
    case "name_az":
      return [
        {
          name: "asc",
        },
        {
          id: "asc",
        },
      ];

    /*
     * =========================================================
     * NAME Z-A
     * =========================================================
     */
    case "za":
    case "name_za":
      return [
        {
          name: "desc",
        },
        {
          id: "desc",
        },
      ];

    /*
     * =========================================================
     * BRAND A-Z
     * =========================================================
     */
    case "brand_az":
      return [
        {
          brand: "asc",
        },
        {
          id: "asc",
        },
      ];

    /*
     * =========================================================
     * BRAND Z-A
     * =========================================================
     */
    case "brand_za":
      return [
        {
          brand: "desc",
        },
        {
          id: "desc",
        },
      ];

    /*
     * =========================================================
     * PRICE LOW → HIGH
     * =========================================================
     */
    case "price_low":
      return [
        {
          price: "asc",
        },
        {
          id: "asc",
        },
      ];

    /*
     * =========================================================
     * PRICE HIGH → LOW
     * =========================================================
     */
    case "price_high":
      return [
        {
          price: "desc",
        },
        {
          id: "desc",
        },
      ];

    /*
     * =========================================================
     * DEFAULT
     * =========================================================
     *
     * Manual order is the safest default for the Admin Product
     * management screen because it matches drag & drop.
     */
    default:
      return [
        {
          displayOrder: "asc",
        },
        {
          id: "asc",
        },
      ];
  }
}