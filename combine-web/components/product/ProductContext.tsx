"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ProductColorImage = {
  id: number;
  url: string;
  publicId: string;
  sortOrder: number;
};

export type ProductColor = {
  id: number;
  name: string;
  imageUrl: string | null;

  images: ProductColorImage[];
};

export type ProductVariantImage = {
  id: number;
  url: string;
  publicId: string;
  altText: string | null;
  caption: string | null;
  sortOrder: number;
};

export type ProductVariant = {
  id: number;

  /**
   * Global Color relation.
   *
   * This identifies which Product Color
   * this Variant belongs to.
   *
   * Example:
   *
   * Black / Small
   * colorId = 1
   */
  colorId: number | null;

  /**
   * Variant size.
   *
   * Example:
   *
   * Small
   * Medium
   * Large
   */
  size: string;

  /**
   * Variant-specific selling price.
   *
   * This is the ONLY pricing field
   * required by the customer-facing page.
   *
   * Cost price, exchange rate and profit
   * are intentionally NOT exposed here.
   *
   * null = use Product price as fallback.
   */
  price: number | null;

  model: string | null;
  dimensions: string | null;
  imageUrl: string | null;

  /**
   * Variant gallery.
   *
   * The gallery belongs to the exact
   * Color + Size Variant.
   */
  images: ProductVariantImage[];
};

export type ProductGallerySelection =
  | "color"
  | "variant";

type ProductContextType = {
  colors: ProductColor[];

  variants: ProductVariant[];

  selectedColor: ProductColor | null;

  setSelectedColor: (
    color: ProductColor | null
  ) => void;

  selectedVariant: ProductVariant | null;

  setSelectedVariant: (
    variant: ProductVariant | null
  ) => void;

  selectionSource: ProductGallerySelection;

  setSelectionSource: (
    source: ProductGallerySelection
  ) => void;

  quantity: number;

  setQuantity: (
    quantity: number
  ) => void;
};

const ProductContext =
  createContext<ProductContextType | null>(
    null
  );

type ProviderProps = {
  colors: ProductColor[];

  variants: ProductVariant[];

  children: ReactNode;
};

export function ProductProvider({
  colors,
  variants,
  children,
}: ProviderProps) {
  const [
    selectedColor,
    setSelectedColor,
  ] =
    useState<ProductColor | null>(
      colors[0] ?? null
    );

  const [
    selectedVariant,
    setSelectedVariant,
  ] =
    useState<ProductVariant | null>(
      variants[0] ?? null
    );

  const [
    selectionSource,
    setSelectionSource,
  ] =
    useState<ProductGallerySelection>(
      "color"
    );

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const value =
    useMemo(
      () => ({
        colors,

        variants,

        selectedColor,

        setSelectedColor,

        selectedVariant,

        setSelectedVariant,

        selectionSource,

        setSelectionSource,

        quantity,

        setQuantity,
      }),
      [
        colors,

        variants,

        selectedColor,

        selectedVariant,

        selectionSource,

        quantity,
      ]
    );

  return (
    <ProductContext.Provider
      value={value}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context =
    useContext(
      ProductContext
    );

  if (!context) {
    throw new Error(
      "useProduct must be used inside ProductProvider."
    );
  }

  return context;
}