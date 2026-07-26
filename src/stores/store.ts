"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  cart: { id: string; name: string; price: number; quantity: number }[];
  wishlist: string[]; // list of product IDs/slugs
  addToCart: (product: { id: string; name: string; price: number }) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            const updated = state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            return { cart: updated };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      toggleWishlist: (productId) =>
        set((state) => {
          const isWishlisted = state.wishlist.includes(productId);
          if (isWishlisted) {
            return { wishlist: state.wishlist.filter((id) => id !== productId) };
          }
          return { wishlist: [...state.wishlist, productId] };
        }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "talaye-shalizar-store-v1",
    }
  )
);
