"use client";

import type { ReactNode } from "react";

import { ProductProvider } from "./ProductContext";

type ProductColor = {
  id: number;
  name: string;
  imageUrl: string;
};

type ProductVariant = {
  id: number;
  size: string;
  model: string | null;
  dimensions: string | null;
  imageUrl: string | null;
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