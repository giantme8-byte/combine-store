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
    packagingProfiles,
    settings,
  ] = await Promise.all([
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
        },

        variants: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),

    prisma.brand.findMany({
      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    }),

    prisma.category.findMany({
      where: {
        active: true,
      },

      orderBy: {
        name: "asc",
      },
    }),

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

    prisma.setting.findFirst(),
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
      brands={brands}
      packagingProfiles={
        packagingProfiles
      }
      exchangeRate={
        settings?.exchangeRate ?? 0.59
      }
    />
  );
}