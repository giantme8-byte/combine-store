"use client";

import type { ReactNode } from "react";

import { ProductProvider } from "./ProductContext";

type ProductColor = {
  id: number;
  name: string;
  imageUrl: string;
};

type ProductVariantImage = {
  id: number;
  url: string;
  publicId: string;
  altText: string | null;
  caption: string | null;
  sortOrder: number;
};

type ProductVariant = {
  id: number;
  size: string;
  model: string | null;
  dimensions: string | null;
  imageUrl: string | null;

  images: ProductVariantImage[];
};

type ProductDetailClientProps = {
  colors: ProductColor[];
  variants: ProductVariant[];
  children: ReactNode;
};

export default function ProductDetailClient({
  colors,
  variants,
  children,
}: ProductDetailClientProps) {
  return (
    <ProductProvider
      colors={colors}
      variants={variants}
    >
      {children}
    </ProductProvider>
  );
}