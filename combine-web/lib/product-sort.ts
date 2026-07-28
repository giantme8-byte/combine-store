import { Prisma } from "@prisma/client";

export function buildProductOrderBy(
  sort: string
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return {
        id: "asc",
      };

    case "az":
      return {
        name: "asc",
      };

    case "za":
      return {
        name: "desc",
      };

    default:
      return {
        id: "desc",
      };
  }
}