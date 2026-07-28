import { Prisma, Availability } from "@prisma/client";

type FilterOptions = {
  search?: string;
  brand?: string;
  category?: string;
  availability?: string;
};

export function buildProductWhere({
  search,
  brand,
  category,
  availability,
}: FilterOptions): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (search) {
where.OR = [
  {
    name: {
      contains: search,
      mode: "insensitive",
    },
  },
  {
    brand: {
      contains: search,
      mode: "insensitive",
    },
  },
  {
    sku: {
      contains: search,
      mode: "insensitive",
    },
  },
  {
    model: {
      contains: search,
      mode: "insensitive",
    },
  },
  {
    category: {
      contains: search,
      mode: "insensitive",
    },
  },
  {
    subCategory: {
      contains: search,
      mode: "insensitive",
    },
  },
  {
    shortDescription: {
      contains: search,
      mode: "insensitive",
    },
  },
  {
    description: {
      contains: search,
      mode: "insensitive",
    },
  },
  {
    mainColor: {
      contains: search,
      mode: "insensitive",
    },
  },
];
  }

  if (brand) {
    where.brand = brand;
  }

  if (category) {
    where.category = category;
  }

  if (availability) {
where.availability =
  availability as Availability;
  }

  return where;
}