import { prisma } from "@/lib/prisma";

import PackagingForm from "../_components/PackagingForm";
import { updatePackaging } from "../_actions/packaging.actions";

export default async function EditPackagingPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const packagingId = Number(id);

  if (
    !Number.isInteger(packagingId) ||
    packagingId <= 0
  ) {
    return <h1>Packaging Not Found</h1>;
  }

  const [
    packaging,
    brands,
  ] = await Promise.all([
    prisma.packagingProfile.findUnique({
      where: {
        id: packagingId,
      },

      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        items: {
          orderBy: {
            sortOrder: "asc",
          },
        },

        brandRecord: {
          select: {
            id: true,
            name: true,
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

      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  if (!packaging) {
    return <h1>Packaging Not Found</h1>;
  }

  return (
    <main className="mx-auto max-w-3xl p-10">
      <h1 className="mb-10 text-4xl font-light">
        Edit Packaging
      </h1>

      <PackagingForm
        action={updatePackaging.bind(
          null,
          packaging.id
        )}
        packaging={packaging}
        brands={brands}
        submitText="Save Changes"
      />
    </main>
  );
}