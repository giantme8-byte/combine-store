import { prisma } from "@/lib/prisma";

import ProductForm from "../_components/ProductForm";
import { createProduct } from "../_actions/product.actions";

export default async function NewProductPage() {
  const [
    brands,
    categories,
    packagingProfiles,
    settings,
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
  ]);

  return (
    <ProductForm
      action={
        createProduct
      }

      submitText="Create Product"

      categories={
        categories
      }

      brands={
        brands
      }

      packagingProfiles={
        packagingProfiles
      }

      exchangeRate={
        settings?.exchangeRate ??
        0.59
      }
    />
  );
}