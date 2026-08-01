import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function generateProductSlug(
  name: string,
  model?: string | null,
  productId?: number
) {
  const baseSlug = slugify(
    model?.trim()
      ? `${name} ${model}`
      : name
  );

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,

        ...(productId
          ? {
              NOT: {
                id: productId,
              },
            }
          : {}),
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}