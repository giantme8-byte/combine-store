"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ProductCardProps } from "@/types";

type QuickViewContextType = {
  product: ProductCardProps | null;
  open: (product: ProductCardProps) => void;
  close: () => void;
};

const QuickViewContext =
  createContext<QuickViewContextType | null>(null);

export function QuickViewProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [product, setProduct] =
    useState<ProductCardProps | null>(null);

  function open(product: ProductCardProps) {
    setProduct(product);
  }

  function close() {
    setProduct(null);
  }

  const value = useMemo(
    () => ({
      product,
      open,
      close,
    }),
    [product]
  );

  return (
    <QuickViewContext.Provider value={value}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);

  if (!context) {
    throw new Error(
      "useQuickView must be used inside QuickViewProvider."
    );
  }

  return context;
}