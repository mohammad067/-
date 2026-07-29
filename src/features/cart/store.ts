import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  imageChar: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: { id: string; name: string; price: number; weight: string; imageChar: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }],
      };
    });
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  updateQuantity: (id, qty) => {
    set((state) => ({
      items: state.items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, qty) } : item))
        .filter((item) => item.quantity > 0),
    }));
  },
  clearCart: () => set({ items: [] }),
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  getCartCount: () => {
    return get().items.reduce((count, item) => totalCount(count, item), 0);
  },
}));

function totalCount(count: number, item: CartItem) {
  return count + item.quantity;
}
