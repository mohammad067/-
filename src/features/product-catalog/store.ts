"use client";

import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ProductCatalogState {
  cart: CartItem[];
  wishlist: string[]; // List of product IDs
  addToCart: (product: { id: string; name: string; price: number }) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
}

export const useCatalogStore = create<ProductCatalogState>((set) => ({
  cart: [],
  wishlist: [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
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
      return {
        wishlist: isWishlisted
          ? state.wishlist.filter((id) => id !== productId)
          : [...state.wishlist, productId],
      };
    }),
  clearCart: () => set({ cart: [] }),
}));
