"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  type ReactNode,
} from "react";

import {
  getInquiryItems,
  saveInquiryItems,
} from "@/lib/inquiry-storage";

import type { InquiryItem } from "@/types";

/*
 * ============================================================
 * Inquiry Options
 * ============================================================
 */

type InquiryOptions = {
  color?: string;
  variant?: string;
  dimensions?: string;
  packaging?: string;
  notes?: string;
};

type AddInquiryOptions =
  InquiryOptions & {
    quantity?: number;
  };

/*
 * ============================================================
 * Variant Key
 * ============================================================
 *
 * One Inquiry Item is identified by:
 *
 * Product
 * + Colour
 * + Variant / Size
 * + Dimensions
 *
 * Example:
 *
 * 123|black|small|20 x 15 x 8 cm
 * 123|black|large|25 x 18 x 10 cm
 * 123|brown|small|20 x 15 x 8 cm
 *
 * These are three different Inquiry Items.
 */

function createVariantKey(
  productId: number,
  options?: InquiryOptions
) {
  return [
    productId,
    options?.color ?? "",
    options?.variant ?? "",
    options?.dimensions ?? "",
  ]
    .map((value) =>
      String(value)
        .trim()
        .toLowerCase()
    )
    .join("|");
}

/*
 * ============================================================
 * Existing Item Key
 * ============================================================
 *
 * Supports older localStorage items that do not yet have
 * variantKey.
 */

function getItemVariantKey(
  item: InquiryItem
) {
  return (
    item.variantKey ??
    createVariantKey(
      item.productId,
      {
        color: item.color,
        variant: item.variant,
        dimensions:
          item.dimensions,
      }
    )
  );
}

/*
 * ============================================================
 * Inquiry Context Type
 * ============================================================
 */

type InquiryContextType = {
  items: InquiryItem[];

  totalItems: number;

  addItem: (
    productId: number,
    options?: AddInquiryOptions
  ) => void;

  removeItem: (
    productId: number,
    options?: InquiryOptions
  ) => void;

  updateQuantity: (
    productId: number,
    quantity: number,
    options?: InquiryOptions
  ) => void;

  clearInquiry: () => void;

  isInInquiry: (
    productId: number,
    options?: InquiryOptions
  ) => boolean;

  getQuantity: (
    productId: number,
    options?: InquiryOptions
  ) => number;

  /*
   * Drawer
   */

  isDrawerOpen: boolean;

  openDrawer: () => void;

  closeDrawer: () => void;

  toggleDrawer: () => void;
};

/*
 * ============================================================
 * Context
 * ============================================================
 */

const InquiryContext =
  createContext<InquiryContextType | null>(
    null
  );

/*
 * ============================================================
 * Provider
 * ============================================================
 */

export function InquiryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] =
    useState<InquiryItem[]>([]);

  const [
    isDrawerOpen,
    setIsDrawerOpen,
  ] = useState(false);

  /*
   * ==========================================================
   * Load localStorage
   * ==========================================================
   */

  useEffect(() => {
    const storedItems =
      getInquiryItems();

    /*
     * Upgrade old items so every item has
     * a variantKey.
     */

    const normalizedItems =
      storedItems.map(
        (item) => ({
          ...item,

          variantKey:
            getItemVariantKey(
              item
            ),
        })
      );

    setItems(
      normalizedItems
    );
  }, []);

  /*
   * ==========================================================
   * Save localStorage
   * ==========================================================
   */

  useEffect(() => {
    saveInquiryItems(items);
  }, [items]);

  /*
   * ==========================================================
   * Add Item
   * ==========================================================
   */

  const addItem = useCallback(
    (
      productId: number,
      options?: AddInquiryOptions
    ) => {
      const variantKey =
        createVariantKey(
          productId,
          options
        );

      const quantityToAdd =
        Math.max(
          1,
          options?.quantity ?? 1
        );

      setItems((prev) => {
        const existing =
          prev.find(
            (item) =>
              getItemVariantKey(
                item
              ) === variantKey
          );

        /*
         * Same Product + Colour + Variant + Dimensions
         *
         * Increase quantity.
         */

        if (existing) {
          return prev.map(
            (item) =>
              getItemVariantKey(
                item
              ) === variantKey
                ? {
                    ...item,

                    variantKey,

                    quantity:
                      item.quantity +
                      quantityToAdd,

                    /*
                     * Keep the latest optional
                     * information if provided.
                     */

                    packaging:
                      options?.packaging ??
                      item.packaging,

                    notes:
                      options?.notes ??
                      item.notes,
                  }
                : item
          );
        }

        /*
         * Different Colour / Variant / Dimensions
         *
         * Create a separate Inquiry Item.
         */

        return [
          ...prev,

          {
            productId,

            quantity:
              quantityToAdd,

            variantKey,

            color:
              options?.color,

            variant:
              options?.variant,

            dimensions:
              options?.dimensions,

            packaging:
              options?.packaging,

            notes:
              options?.notes,
          },
        ];
      });
    },
    []
  );

  /*
   * ==========================================================
   * Remove Item
   * ==========================================================
   *
   * Remove only the selected Product + Variant combination.
   */

  const removeItem = useCallback(
    (
      productId: number,
      options?: InquiryOptions
    ) => {
      const variantKey =
        createVariantKey(
          productId,
          options
        );

      setItems((prev) =>
        prev.filter(
          (item) =>
            getItemVariantKey(
              item
            ) !== variantKey
        )
      );
    },
    []
  );

  /*
   * ==========================================================
   * Update Quantity
   * ==========================================================
   *
   * Update only the selected Product + Variant combination.
   */

  const updateQuantity =
    useCallback(
      (
        productId: number,
        quantity: number,
        options?: InquiryOptions
      ) => {
        const variantKey =
          createVariantKey(
            productId,
            options
          );

        setItems((prev) =>
          prev.map((item) =>
            getItemVariantKey(
              item
            ) === variantKey
              ? {
                  ...item,

                  variantKey,

                  quantity:
                    Math.max(
                      1,
                      quantity
                    ),
                }
              : item
          )
        );
      },
      []
    );

  /*
   * ==========================================================
   * Clear Inquiry
   * ==========================================================
   */

  const clearInquiry =
    useCallback(() => {
      setItems([]);
    }, []);

  /*
   * ==========================================================
   * Is In Inquiry
   * ==========================================================
   *
   * Checks the exact Product + Variant combination.
   */

  const isInInquiry =
    useCallback(
      (
        productId: number,
        options?: InquiryOptions
      ) => {
        const variantKey =
          createVariantKey(
            productId,
            options
          );

        return items.some(
          (item) =>
            getItemVariantKey(
              item
            ) === variantKey
        );
      },
      [items]
    );

  /*
   * ==========================================================
   * Get Quantity
   * ==========================================================
   *
   * Gets quantity for the exact Product + Variant combination.
   */

  const getQuantity =
    useCallback(
      (
        productId: number,
        options?: InquiryOptions
      ) => {
        const variantKey =
          createVariantKey(
            productId,
            options
          );

        return (
          items.find(
            (item) =>
              getItemVariantKey(
                item
              ) === variantKey
          )?.quantity ?? 0
        );
      },
      [items]
    );

  /*
   * ==========================================================
   * Drawer Controls
   * ==========================================================
   */

  const openDrawer =
    useCallback(() => {
      setIsDrawerOpen(true);
    }, []);

  const closeDrawer =
    useCallback(() => {
      setIsDrawerOpen(false);
    }, []);

  const toggleDrawer =
    useCallback(() => {
      setIsDrawerOpen(
        (prev) => !prev
      );
    }, []);

  /*
   * ==========================================================
   * Context Value
   * ==========================================================
   */

  const value = useMemo(
    () => ({
      items,

      totalItems:
        items.reduce(
          (total, item) =>
            total +
            item.quantity,
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

  /*
   * ==========================================================
   * Provider
   * ==========================================================
   */

  return (
    <InquiryContext.Provider
      value={value}
    >
      {children}
    </InquiryContext.Provider>
  );
}

/*
 * ============================================================
 * Hook
 * ============================================================
 */

export function useInquiry() {
  const context =
    useContext(
      InquiryContext
    );

  if (!context) {
    throw new Error(
      "useInquiry must be used within InquiryProvider."
    );
  }

  return context;
}