"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const LEGACY_VARIANTS: Record<string, string> = {
  "prod-1": "01M4GP3QG0AZHCMGHHMH4HP6DD",
  "prod-2": "01M4GP3QG0AZHCMGHHMH4HP6DE",
  "prod-3": "01M4GP3QG0AZHCMGHHMH4HP6DF",
  "prod-4": "01M4GP3QG0AZHCMGHHMH4HP6DG",
  "prod-5": "01M4GP3QG0AZHCMGHHMH4HP6DH",
  "prod-6": "01M4GP3QG0AZHCMGHHMH4HP6DJ",
  "prod-7": "01M4GP3QG0AZHCMGHHMH4HP6DK",
  "prod-8": "01M4GP3QG0AZHCMGHHMH4HP6DM",
};

export interface CartItem {
  id: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
  imageChar?: string;
}

interface ProductCatalogState {
  cart: CartItem[];
  wishlist: string[];
  toast: string | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  hasHydrated: boolean;
  addToCart: (product: { id: string; variantId: string; name: string; price: number; weight?: string; imageChar?: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearToast: () => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useCatalogStore = create<ProductCatalogState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      toast: null,
      isCartOpen: false,
      isCheckoutOpen: false,
      hasHydrated: false,
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
              isCartOpen: true,
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
            toast: isWishlisted ? "از علاقه‌مندی حذف شد" : "به علاقه‌مندی اضافه شد",
          };
        }),
      clearToast: () => set({ toast: null }),
      clearCart: () => set({ cart: [] }),
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "talaye-shalizar-cart-store",
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<ProductCatalogState>;
        return {
          ...state,
          cart: (state.cart ?? [])
            .map((item) => ({ ...item, variantId: item.variantId || LEGACY_VARIANTS[item.id] || "" }))
            .filter((item) => item.variantId),
        } as ProductCatalogState;
      },
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);
