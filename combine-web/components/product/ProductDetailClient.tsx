"use client";

import type { ReactNode } from "react";

import {
  ProductProvider,
  type ProductColor,
  type ProductVariant,
} from "./ProductContext";


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