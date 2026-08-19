import type { Prisma } from "@prisma/client";


// ============================================================
// PRODUCT WITH IMAGES + VARIANTS + COLOR
// ============================================================

export type ProductWithImages =
  Prisma.ProductGetPayload<{
    include: {
      images: true;

      variants: {
        include: {
          color: true;
        };
      };
    };
  }>;


// ============================================================
// PRODUCT IMAGE
// ============================================================

export interface ProductImage {
  id: number;

  url: string;

  sortOrder: number;
}


// ============================================================
// PRODUCT
// ============================================================

export interface Product {
  id: number;

  slug: string;

  sku: string | null;

  brand: string;

  category: string;

  subCategory: string | null;

  name: string;

  model: string | null;

  shortDescription: string | null;

  description: string | null;

  price: number;

  image: string;

  gallery?: ProductImage[];

  displayOrder: number;

  mainColor: string | null;

  availableColors: string[];

  dimensions: string | null;

  stock: number;

  featured: boolean;

  newArrival: boolean;

  bestSeller: boolean;

  limited: boolean;

  onSale: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}


// ============================================================
// PRODUCT CARD PROPS
// ============================================================

export type ProductCardProps = {
  id: number;

  slug: string;

  brand: string;

  name: string;

  model: string | null;

  image: string;

  secondImage?: string;

  createdAt: Date;

  featured: boolean;

  newArrival: boolean;

  bestSeller: boolean;

  limited: boolean;

  onSale: boolean;

  buttonSize?: "default" | "small";
};


// ============================================================
// PRODUCT SEARCH RESULT
// ============================================================

export type ProductSearchResult = {
  id: number;

  slug: string;

  brand: string;

  name: string;

  model: string | null;

  images: {
    url: string;
  }[];
};