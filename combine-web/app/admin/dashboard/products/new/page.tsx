import { prisma } from "@/lib/prisma";
import { createProduct } from "../_actions/product.actions";
import ProductForm from "../_components/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const brands = await prisma.brand.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const settings = await prisma.setting.findFirst();

const exchangeRate =
  settings?.exchangeRate ?? 0.60;

  return (
    <main className="mx-auto w-full max-w-[1500px] px-10 py-10">
      <h1 className="mb-10 text-4xl font-light">
        Add New Product
      </h1>

<ProductForm
  action={createProduct}
  submitText="Create Product"
  categories={categories}
  brands={brands}
  exchangeRate={exchangeRate}
/>
    </main>
  );
}