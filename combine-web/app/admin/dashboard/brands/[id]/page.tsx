import { prisma } from "@/lib/prisma";
import BrandForm from "../_components/BrandForm";
import { updateBrand } from "../_actions/brand.actions";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const brand = await prisma.brand.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!brand) {
    return <h1>Brand Not Found</h1>;
  }

  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="mb-10 text-4xl font-light">
        Edit Brand
      </h1>

      <BrandForm
        action={updateBrand.bind(null, brand.id)}
        brand={brand}
        submitText="Save Changes"
      />
    </main>
  );
}