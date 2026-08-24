"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";


// ============================================================
// PRODUCT COLOR IMAGE
// ============================================================

export type ProductColorImage = {
  id: number;

  url: string;

  publicId: string;

  sortOrder: number;
};


// ============================================================
// PRODUCT COLOR
// ============================================================

export type ProductColor = {
  id: number;

  name: string;

  /*
   * Color-specific Model No.
   *
   * Example:
   *
   * Black → M12345
   * White → M67890
   *
   * null = this Color does not have
   * its own Model No.
   */
  model: string | null;

  imageUrl: string | null;

  images: ProductColorImage[];
};


// ============================================================
// PRODUCT VARIANT IMAGE
// ============================================================

export type ProductVariantImage = {
  id: number;

  url: string;

  publicId: string;

  altText: string | null;

  caption: string | null;

  sortOrder: number;
};


// ============================================================
// PRODUCT VARIANT
// ============================================================

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

  /**
   * Variant-specific Model No.
   *
   * Example:
   *
   * Black / Small → M12345
   * Black / Large → M12346
   *
   * null = use Color Model or
   * Product Model as fallback.
   */
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


// ============================================================
// PRODUCT GALLERY SELECTION
// ============================================================

export type ProductGallerySelection =
  | "color"
  | "variant";


// ============================================================
// PRODUCT CONTEXT TYPE
// ============================================================

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


// ============================================================
// CONTEXT
// ============================================================

const ProductContext =
  createContext<ProductContextType | null>(
    null
  );


// ============================================================
// PROVIDER PROPS
// ============================================================

type ProviderProps = {
  colors: ProductColor[];

  variants: ProductVariant[];

  children: ReactNode;
};


// ============================================================
// PROVIDER
// ============================================================

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


// ============================================================
// HOOK
// ============================================================

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