"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
  imageChar?: string;
}

interface ProductCatalogState {
  cart: CartItem[];
  wishlist: string[]; // List of product IDs
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  addToCart: (product: { id: string; name: string; price: number; weight?: string; imageChar?: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
}

export const useCatalogStore = create<ProductCatalogState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
              isCartOpen: true, // Automatically slide drawer open on add-to-cart for a seamless visual flow!
            };
          }
          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
            isCartOpen: true,
          };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
            )
            .filter((item) => item.quantity > 0),
        })),
      toggleWishlist: (productId) =>
        set((state) => {
          const isWishlisted = state.wishlist.includes(productId);
          return {
            wishlist: isWishlisted
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        }),
      clearCart: () => set({ cart: [] }),
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
    }),
    {
      name: "talaye-shalizar-cart-store", // Persian premium storage namespace
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);
