"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getInquiryItems,
  saveInquiryItems,
} from "@/lib/inquiry-storage";

import type { InquiryItem } from "@/types";

type InquiryContextType = {
  items: InquiryItem[];

  totalItems: number;

  addItem: (
  productId: number,
  options?: {
    color?: string;
    variant?: string;
    dimensions?: string;
    packaging?: string;
  }
) => void;

  removeItem: (productId: number) => void;

  updateQuantity: (
    productId: number,
    quantity: number
  ) => void;

  clearInquiry: () => void;

  isInInquiry: (productId: number) => boolean;

  getQuantity: (productId: number) => number;


  // Drawer

  isDrawerOpen: boolean;

  openDrawer: () => void;

  closeDrawer: () => void;

  toggleDrawer: () => void;
};


const InquiryContext =
  createContext<InquiryContextType | null>(null);


export function InquiryProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [items, setItems] = useState<InquiryItem[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] =
    useState(false);


  useEffect(() => {
    setItems(getInquiryItems());
  }, []);


  useEffect(() => {
    saveInquiryItems(items);
  }, [items]);



const addItem = useCallback(
  (
    productId: number,
    options?: {
      color?: string;
      variant?: string;
      dimensions?: string;
      packaging?: string;
    }
  ) => {

      setItems((prev) => {

        const existing = prev.find(
          (item) =>
            item.productId === productId
        );


        if (existing) {

          return prev.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
          );

        }


return [
  ...prev,
  {
    productId,
    quantity: 1,

    color: options?.color,
    variant: options?.variant,
    dimensions: options?.dimensions,
    packaging: options?.packaging,
  },
];

      });

    },
    []
  );



  const removeItem = useCallback(
    (productId: number) => {

      setItems((prev) =>
        prev.filter(
          (item) =>
            item.productId !== productId
        )
      );

    },
    []
  );



  const updateQuantity = useCallback(
    (
      productId: number,
      quantity: number
    ) => {

      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity:
                  Math.max(1, quantity),
              }
            : item
        )
      );

    },
    []
  );



  const clearInquiry = useCallback(() => {

    setItems([]);

  }, []);




  const isInInquiry = useCallback(
    (productId: number) =>
      items.some(
        (item) =>
          item.productId === productId
      ),

    [items]
  );



  const getQuantity = useCallback(
    (productId: number) =>
      items.find(
        (item) =>
          item.productId === productId
      )?.quantity ?? 0,

    [items]
  );



  // Drawer Controls

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);


  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);


  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);




  const value = useMemo(
    () => ({

      items,

      totalItems:
        items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        ),


      addItem,

      removeItem,

      updateQuantity,

      clearInquiry,


      isInInquiry,

      getQuantity,


      isDrawerOpen,

      openDrawer,

      closeDrawer,

      toggleDrawer,

    }),

    [
      items,

      addItem,

      removeItem,

      updateQuantity,

      clearInquiry,

      isInInquiry,

      getQuantity,

      isDrawerOpen,

      openDrawer,

      closeDrawer,

      toggleDrawer,
    ]
  );



  return (
    <InquiryContext.Provider
      value={value}
    >
      {children}
    </InquiryContext.Provider>
  );

}



export function useInquiry() {

  const context =
    useContext(InquiryContext);


  if (!context) {

    throw new Error(
      "useInquiry must be used within InquiryProvider."
    );

  }


  return context;

}