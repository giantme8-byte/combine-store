import { Prisma } from "@prisma/client";

export function buildProductOrderBy(
  sort: string
): Prisma.ProductOrderByWithRelationInput {

  switch (sort) {

    case "featured":
      return {
        displayOrder: "asc",
      };

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
        displayOrder: "asc",
      };

  }

}