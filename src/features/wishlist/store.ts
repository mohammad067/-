import { create } from "zustand";

interface WishlistState {
  items: string[]; // List of product IDs
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  toggleItem: (id) => {
    set((state) => {
      const exists = state.items.includes(id);
      if (exists) {
        return { items: state.items.filter((item) => item !== id) };
      }
      return { items: [...state.items, id] };
    });
  },
  hasItem: (id) => {
    return get().items.includes(id);
  },
}));
