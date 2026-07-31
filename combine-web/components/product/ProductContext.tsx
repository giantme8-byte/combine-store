"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ProductColor = {
  id: number;
  name: string;
  imageUrl: string;
};

export type ProductVariant = {
  id: number;
  size: string;
  model: string | null;
  dimensions: string |null;

  imageUrl: string | null;
};

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
  const [selectedColor, setSelectedColor] =
    useState<ProductColor | null>(
      colors[0] ?? null
    );

  const [
    selectedVariant,
    setSelectedVariant,
  ] = useState<ProductVariant | null>(
    variants[0] ?? null
  );

  const [quantity, setQuantity] =
    useState(1);

  const value = useMemo(
    () => ({
      colors,
      variants,

      selectedColor,
      setSelectedColor,

      selectedVariant,
      setSelectedVariant,

      quantity,
      setQuantity,
    }),
    [
      colors,
      variants,

      selectedColor,
      selectedVariant,

      quantity,
    ]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context =
    useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProduct must be used inside ProductProvider."
    );
  }

  return context;
}