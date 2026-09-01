import type { CartItem } from "@/features/product-catalog/store";

export interface StoredOrder {
  orderId: string;
  mobile: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  deliveryMethod: "standard" | "tipax" | "vip";
  status: "registered";
  createdAt: string;
}

const STORAGE_KEY = "talaye-shalizar-orders";

export function createOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SHALI-${timestamp}-${suffix}`;
}

export function saveOrder(order: StoredOrder): void {
  if (typeof window === "undefined") return;
  const orders = getOrders();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...orders].slice(0, 50)));
}

export function getOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function findOrder(orderId: string, mobile: string): StoredOrder | null {
  const normalizedId = orderId.trim().toUpperCase();
  const normalizedMobile = mobile.replace(/\D/g, "");
  return getOrders().find(
    (order) => order.orderId === normalizedId && order.mobile.replace(/\D/g, "") === normalizedMobile,
  ) ?? null;
}
