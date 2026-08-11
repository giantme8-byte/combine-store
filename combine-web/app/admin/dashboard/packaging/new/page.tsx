import { prisma } from "@/lib/prisma";

import PackagingForm from "../_components/PackagingForm";
import { createPackaging } from "../_actions/packaging.actions";

export default async function NewPackagingPage() {
  const brands =
    await prisma.brand.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="mb-3 text-4xl font-light">
        Add Packaging
      </h1>

      <p className="mb-10 text-sm text-neutral-500">
        Create default packaging or
        brand-specific packaging.
      </p>

      <PackagingForm
        action={createPackaging}
        brands={brands}
        submitText="Save Packaging"
      />
    </main>
  );
}