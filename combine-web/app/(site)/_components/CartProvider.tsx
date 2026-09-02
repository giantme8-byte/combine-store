"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


// ============================================================
// CART ITEM
// ============================================================

export type CartItem = {
  cartItemId: string;

  productId: number;

  /*
   * Product slug.
   *
   * Used by the Cart page to navigate back
   * to the correct Product Detail page.
   *
   * Example:
   *
   * /shop/louis-vuitton-boulogne-pm
   */
  slug: string;

  /*
   * Exact ProductVariant ID.
   *
   * This identifies the exact:
   *
   * Color × Size
   *
   * combination selected by the customer.
   */
  variantId: number | null;

  name: string;

  brand: string;

  /*
   * Selling price of the exact selected Variant.
   *
   * selectedVariant.price takes priority.
   *
   * Product.price is only the fallback.
   */
  price: number;

  image: string;

  sku: string | null;

  model: string | null;

  color: string | null;

  /*
   * Selected Size.
   */
  variant: string | null;

  dimensions: string | null;

  quantity: number;
};


// ============================================================
// CART PRODUCT INPUT
// ============================================================

type CartProduct = Omit<
  CartItem,
  "cartItemId" | "quantity"
>;


// ============================================================
// CART CONTEXT
// ============================================================

type CartContextValue = {
  items: CartItem[];

  itemCount: number;

  subtotal: number;

  addToCart: (
    product: CartProduct,
    quantity?: number
  ) => void;

  updateQuantity: (
    cartItemId: string,
    quantity: number
  ) => void;

  removeFromCart: (
    cartItemId: string
  ) => void;

  clearCart: () => void;

  /**
   * Selected Cart items are the only items that should proceed to Checkout.
   * Unselected items remain safely inside the Cart.
   */
  selectedCartItemIds: string[];
  selectedItems: CartItem[];
  selectedItemCount: number;
  selectedSubtotal: number;
  isItemSelected: (cartItemId: string) => boolean;
  toggleItemSelection: (cartItemId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
};


// ============================================================
// CONTEXT
// ============================================================

const CartContext =
  createContext<CartContextValue | null>(
    null
  );


// ============================================================
// STORAGE
// ============================================================

const CART_STORAGE_KEY =
  "combine-cart";

const CART_SELECTED_STORAGE_KEY =
  "combine-cart-selected";


// ============================================================
// CART ITEM ID
// ============================================================

function createCartItemId(
  product: CartProduct
) {

  /*
   * Prefer the exact Variant ID.
   *
   * This guarantees that each ProductVariant
   * is treated as an independent Cart item.
   */

  if (
    product.variantId !== null &&
    product.variantId !== undefined
  ) {

    return [
      product.productId,
      "variant",
      product.variantId,
    ].join("::");

  }


  /*
   * Legacy fallback.
   *
   * Products without Variants continue
   * using Product + Color + Size.
   */

  return [
    product.productId,
    product.color ?? "",
    product.variant ?? "",
  ].join("::");

}


// ============================================================
// PROVIDER
// ============================================================

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    items,
    setItems,
  ] = useState<CartItem[]>([]);

  const [
    hydrated,
    setHydrated,
  ] = useState(false);

  const [
    selectedCartItemIds,
    setSelectedCartItemIds,
  ] = useState<string[]>([]);


  // ==========================================================
  // LOAD CART
  // ==========================================================

  useEffect(() => {

    try {

      const stored =
        window.localStorage.getItem(
          CART_STORAGE_KEY
        );

      let loadedItems: CartItem[] = [];

      if (stored) {

        const parsed =
          JSON.parse(stored);

        if (
          Array.isArray(parsed)
        ) {

          /*
           * ----------------------------------------------------
           * Backward Compatibility
           * ----------------------------------------------------
           *
           * Existing Cart items may have been
           * created before slug was added.
           *
           * We cannot safely invent a slug.
           *
           * Therefore:
           *
           * - valid slug → keep it
           * - missing slug → empty string
           *
           * New Cart items will always receive
           * the correct Product slug.
           */

          const normalizedItems =
            parsed
              .filter(
                (item) =>
                  item &&
                  typeof item ===
                    "object"
              )
              .map(
                (item) => ({
                  ...item,

                  slug:
                    typeof item.slug ===
                    "string"
                      ? item.slug
                      : "",

                  variantId:
                    typeof item.variantId ===
                    "number"
                      ? item.variantId
                      : null,
                })
              );

          loadedItems = normalizedItems;
          setItems(normalizedItems);

        }

      }

      const selectedStored =
        window.localStorage.getItem(
          CART_SELECTED_STORAGE_KEY
        );

      if (selectedStored) {
        try {
          const parsedSelected =
            JSON.parse(selectedStored);

          if (Array.isArray(parsedSelected)) {
            const validIds = new Set(
              loadedItems.map(
                (item) => item.cartItemId
              )
            );

            setSelectedCartItemIds(
              parsedSelected.filter(
                (id): id is string =>
                  typeof id === "string" &&
                  validIds.has(id)
              )
            );
          } else {
            setSelectedCartItemIds(
              loadedItems.map(
                (item) => item.cartItemId
              )
            );
          }
        } catch (error) {
          console.error(
            "Failed to load selected cart items:",
            error
          );
          setSelectedCartItemIds(
            loadedItems.map(
              (item) => item.cartItemId
            )
          );
        }
      } else {
        // Existing carts are selected by default so the new
        // selection feature does not unexpectedly block checkout.
        setSelectedCartItemIds(
          loadedItems.map(
            (item) => item.cartItemId
          )
        );
      }

    } catch (error) {

      console.error(
        "Failed to load cart:",
        error
      );

    } finally {

      setHydrated(true);

    }

  }, []);


  // ==========================================================
  // SAVE CART
  // ==========================================================

  useEffect(() => {

    if (!hydrated) {
      return;
    }

    try {

      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );

    } catch (error) {

      console.error(
        "Failed to save cart:",
        error
      );

    }

  }, [
    items,
    hydrated,
  ]);


  // ==========================================================
  // SAVE SELECTED ITEMS
  // ==========================================================

  useEffect(() => {

    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        CART_SELECTED_STORAGE_KEY,
        JSON.stringify(selectedCartItemIds)
      );
    } catch (error) {
      console.error(
        "Failed to save selected cart items:",
        error
      );
    }

  }, [
    selectedCartItemIds,
    hydrated,
  ]);


  // ==========================================================
  // SELECTION
  // ==========================================================

  function isItemSelected(
    cartItemId: string
  ) {
    return selectedCartItemIds.includes(
      cartItemId
    );
  }


  function toggleItemSelection(
    cartItemId: string
  ) {
    setSelectedCartItemIds(
      (currentIds) =>
        currentIds.includes(cartItemId)
          ? currentIds.filter(
              (id) => id !== cartItemId
            )
          : [...currentIds, cartItemId]
    );
  }


  function selectAll() {
    setSelectedCartItemIds(
      items.map(
        (item) => item.cartItemId
      )
    );
  }


  function deselectAll() {
    setSelectedCartItemIds([]);
  }


  // ==========================================================
  // ADD TO CART
  // ==========================================================

  function addToCart(
    product: CartProduct,
    quantity = 1
  ) {

    const cartItemId =
      createCartItemId(
        product
      );


    setItems(
      (currentItems) => {

        const existingItem =
          currentItems.find(
            (item) =>
              item.cartItemId ===
              cartItemId
          );


        if (existingItem) {

          /*
           * Same exact Variant:
           *
           * increase quantity.
           *
           * Keep the latest Product information
           * such as slug, price, image and dimensions.
           */

          setSelectedCartItemIds(
            (currentIds) =>
              currentIds.includes(cartItemId)
                ? currentIds
                : [...currentIds, cartItemId]
          );

          return currentItems.map(
            (item) =>
              item.cartItemId ===
              cartItemId
                ? {
                    ...item,
                    ...product,
                    cartItemId,
                    quantity:
                      item.quantity +
                      quantity,
                  }
                : item
          );

        }


        /*
         * New Variant:
         *
         * create a separate Cart item.
         */

        setSelectedCartItemIds(
          (currentIds) =>
            currentIds.includes(cartItemId)
              ? currentIds
              : [...currentIds, cartItemId]
        );

        return [
          ...currentItems,
          {
            ...product,
            cartItemId,
            quantity,
          },
        ];

      }
    );

  }


  // ==========================================================
  // UPDATE QUANTITY
  // ==========================================================

  function updateQuantity(
    cartItemId: string,
    quantity: number
  ) {

    if (
      quantity <= 0
    ) {

      removeFromCart(
        cartItemId
      );

      return;

    }


    setItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.cartItemId ===
            cartItemId
              ? {
                  ...item,
                  quantity,
                }
              : item
        )
    );

  }


  // ==========================================================
  // REMOVE
  // ==========================================================

  function removeFromCart(
    cartItemId: string
  ) {

    setItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.cartItemId !==
            cartItemId
        )
    );

    setSelectedCartItemIds(
      (currentIds) =>
        currentIds.filter(
          (id) => id !== cartItemId
        )
    );

  }


  // ==========================================================
  // CLEAR
  // ==========================================================

  function clearCart() {

    setItems([]);
    setSelectedCartItemIds([]);

  }


  // ==========================================================
  // ITEM COUNT
  // ==========================================================

  const itemCount =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item
          ) =>
            total +
            item.quantity,
          0
        ),
      [items]
    );


  // ==========================================================
  // SUBTOTAL
  // ==========================================================

  const subtotal =
    useMemo(
      () =>
        items.reduce(
          (
            total,
            item
          ) =>
            total +
            item.price *
              item.quantity,
          0
        ),
      [items]
    );


  // ==========================================================
  // SELECTED ITEMS
  // ==========================================================

  const selectedItems =
    useMemo(
      () =>
        items.filter((item) =>
          selectedCartItemIds.includes(
            item.cartItemId
          )
        ),
      [
        items,
        selectedCartItemIds,
      ]
    );


  const selectedItemCount =
    useMemo(
      () =>
        selectedItems.reduce(
          (total, item) =>
            total + item.quantity,
          0
        ),
      [selectedItems]
    );


  const selectedSubtotal =
    useMemo(
      () =>
        selectedItems.reduce(
          (total, item) =>
            total +
            item.price *
              item.quantity,
          0
        ),
      [selectedItems]
    );


  // ==========================================================
  // VALUE
  // ==========================================================

  const value =
    useMemo(
      () => ({
        items,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        selectedCartItemIds,
        selectedItems,
        selectedItemCount,
        selectedSubtotal,
        isItemSelected,
        toggleItemSelection,
        selectAll,
        deselectAll,
      }),
      [
        items,
        itemCount,
        subtotal,
        selectedCartItemIds,
        selectedItems,
        selectedItemCount,
        selectedSubtotal,
      ]
    );


  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );

}


// ============================================================
// HOOK
// ============================================================

export function useCart() {

  const context =
    useContext(
      CartContext
    );


  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider."
    );

  }


  return context;

}