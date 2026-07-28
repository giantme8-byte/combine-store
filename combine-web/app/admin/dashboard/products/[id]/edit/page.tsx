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
},
    }),

    prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
    }),

    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),

    prisma.setting.findFirst(),
  ]);

  if (!product) {
    notFound();
  }

  console.log(product);

  return (
    <main className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-4xl font-light">
          Edit Product
        </h1>

        <p className="mt-2 text-gray-500">
          Update product information.
        </p>
      </div>

<ProductForm
  product={product}
  submitText="Update Product"
  brands={brands}
  categories={categories}
  exchangeRate={settings?.exchangeRate ?? 0.6}
  action={updateProduct.bind(
    null,
    product.id
  )}
/>
    </main>
  );
}