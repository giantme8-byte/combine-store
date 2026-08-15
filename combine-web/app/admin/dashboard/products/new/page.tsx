import { prisma } from "@/lib/prisma";

import ProductForm from "../_components/ProductForm";
import { createProduct } from "../_actions/product.actions";

export default async function NewProductPage() {
  const [
    brands,
    categories,
    packagingProfiles,
    settings,
    colors,
  ] = await Promise.all([
    /*
     * Active Brands
     */
    prisma.brand.findMany({
      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    }),

    /*
     * Active Categories
     */
    prisma.category.findMany({
      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    }),

    /*
     * Packaging Profiles
     *
     * Includes:
     * - Default Packaging
     * - Brand Packaging
     *
     * ProductForm will only show
     * active profiles.
     */
    prisma.packagingProfile.findMany({
      orderBy: [
        {
          brand: "asc",
        },

        {
          name: "asc",
        },
      ],
    }),

    /*
     * Website Settings
     */
    prisma.setting.findFirst(),

    /*
     * Active Global Colors
     *
     * These colors are the master color
     * options used by ProductColor and
     * ProductVariant.
     */
    prisma.color.findMany({
      where: {
        active: true,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },

        {
          name: "asc",
        },
      ],
    }),
  ]);

  return (
    <ProductForm
      action={createProduct}
      submitText="Create Product"
      categories={categories}
      brands={brands}
      packagingProfiles={packagingProfiles}
      exchangeRate={
        settings?.exchangeRate ?? 0.59
      }
      globalColors={colors}
    />
  );
}