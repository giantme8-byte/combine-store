import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import ProductForm from "../../_components/ProductForm";
import { updateProduct } from "../../_actions/product.actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [
    product,
    brands,
    categories,
    subCategories,
    packagingProfiles,
    settings,
    colors,
  ] = await Promise.all([
    /*
     * Product
     */
    prisma.product.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        colors: {
          orderBy: {
            sortOrder: "asc",
          },

          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },

        variants: {
          orderBy: {
            sortOrder: "asc",
          },

          include: {
            images: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        },
      },
    }),

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
     * Active Sub Categories
     *
     * Loaded from database.
     *
     * CategorySelect will automatically
     * filter these according to the
     * selected Category.
     */
    prisma.subCategory.findMany({
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

    /*
     * Packaging Profiles
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

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      action={updateProduct.bind(
        null,
        product.id
      )}
      product={product}
      submitText="Update Product"
      categories={categories}
      subCategories={subCategories}
      brands={brands}
      packagingProfiles={packagingProfiles}
      exchangeRate={
        settings?.exchangeRate ?? 0.59
      }
      globalColors={colors}
    />
  );
}