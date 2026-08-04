import { Prisma } from "@prisma/client";

export function buildProductOrderBy(
  sort: string
): Prisma.ProductOrderByWithRelationInput {

  switch (sort) {

    case "featured":
      return {
        displayOrder: "asc",
      };


    case "latest":
      return {
        createdAt: "desc",
      };


    case "oldest":
      return {
        createdAt: "asc",
      };


    case "az":
    case "name_az":
      return {
        name: "asc",
      };


    case "za":
    case "name_za":
      return {
        name: "desc",
      };


    case "brand_az":
      return {
        brand: "asc",
      };


    case "brand_za":
      return {
        brand: "desc",
      };


    case "price_low":
      return {
        price: "asc",
      };


    case "price_high":
      return {
        price: "desc",
      };


    default:
      return {
        displayOrder: "asc",
      };

  }

}