import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { calculateVoucher } from "@/lib/checkout";

export type CustomerVoucherPrice = {
  price: number;
  discount: number;
  isNewCustomerVoucher: boolean;
};

export type CustomerVoucherPrices = Record<
  number,
  CustomerVoucherPrice
>;

/**
 * Calculate customer-specific voucher prices for products.
 *
 * This is the shared server-side source used by:
 * - Shop voucher prices API
 * - Home page product sections
 *
 * Anonymous customers receive no customer-specific pricing.
 */
export async function getCustomerVoucherPrices(
  productIds: number[]
): Promise<CustomerVoucherPrices> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {};
  }

  const normalizedProductIds = Array.from(
    new Set(
      productIds
        .map((value) => Number(value))
        .filter(
          (value) =>
            Number.isInteger(value) &&
            value > 0
        )
    )
  );

  if (normalizedProductIds.length === 0) {
    return {};
  }

  if (normalizedProductIds.length > 100) {
    throw new Error(
      "Too many product IDs."
    );
  }

  const userId = currentUser.id;

  /*
   * Load the real product data from Prisma.
   *
   * ProductCard uses the lowest valid variant
   * price when variants exist.
   */
  const products =
    await prisma.product.findMany({
      where: {
        id: {
          in: normalizedProductIds,
        },
      },

      select: {
        id: true,

        price: true,

        category: true,

        variants: {
          select: {
            price: true,
          },
        },
      },
    });

  /*
   * Every active Voucher is considered.
   *
   * calculateVoucher() remains the single
   * source of truth for voucher eligibility.
   */
  const vouchers =
    await prisma.voucher.findMany({
      where: {
        isActive: true,
      },

      select: {
        code: true,
        newCustomerOnly: true,
      },
    });

  const prices: CustomerVoucherPrices = {};

  await Promise.all(
    products.map(
      async (product) => {
        /*
         * Determine the same base display price
         * used by ProductCard.
         */
        const variantPrices =
          (product.variants ?? [])
            .map(
              (variant) =>
                typeof variant.price ===
                  "number" &&
                Number.isFinite(
                  variant.price
                ) &&
                variant.price > 0
                  ? variant.price
                  : null
            )
            .filter(
              (
                value
              ): value is number =>
                value !== null
            );

        const uniqueVariantPrices = [
          ...new Set(variantPrices),
        ].sort(
          (a, b) => a - b
        );

        const productPrice =
          uniqueVariantPrices.length > 0
            ? uniqueVariantPrices[0]
            : Number(product.price);

        /*
         * Invalid product price.
         */
        if (
          !Number.isFinite(
            productPrice
          ) ||
          productPrice <= 0
        ) {
          return;
        }

        /*
         * Check every active Voucher through
         * calculateVoucher().
         */
        const calculations =
          await Promise.all(
            vouchers.map(
              async (voucher) => {
                const calculation =
                  await calculateVoucher({
                    code: voucher.code,

                    subtotal:
                      productPrice,

                    userId,

                    productCategories: [
                      product.category,
                    ],
                  });

                return {
                  calculation,

                  isNewCustomerVoucher:
                    voucher.newCustomerOnly,
                };
              }
            )
          );

        /*
         * Only successful vouchers with
         * a real discount are considered.
         *
         * If multiple vouchers are valid,
         * use the largest discount.
         */
        const validDiscounts =
          calculations
            .filter(
              (item) =>
                !item.calculation.error &&
                item.calculation.discount >
                  0
            )
            .sort(
              (a, b) =>
                b.calculation.discount -
                a.calculation.discount
            );

        if (
          validDiscounts.length === 0
        ) {
          return;
        }

        const bestVoucher =
          validDiscounts[0];

        const discount =
          Math.min(
            bestVoucher.calculation
              .discount,
            productPrice
          );

        const customerPrice =
          Math.round(
            (
              productPrice -
              discount +
              Number.EPSILON
            ) *
              100
          ) / 100;

        /*
         * Safety check.
         */
        if (
          customerPrice >=
          productPrice
        ) {
          return;
        }

        prices[product.id] = {
          price: customerPrice,

          discount:
            Math.round(
              (
                discount +
                Number.EPSILON
              ) *
                100
            ) / 100,

          isNewCustomerVoucher:
            bestVoucher
              .isNewCustomerVoucher,
        };
      }
    )
  );

  return prices;
}