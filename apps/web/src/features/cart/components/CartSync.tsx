"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/features/product-catalog/store";

export function CartSync() {
  const cart = useCatalogStore((state) => state.cart);
  const hasHydrated = useCatalogStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      void fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ variantId, quantity }) => ({ variantId, quantity })),
        }),
        signal: controller.signal,
      });
    }, 500);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [cart, hasHydrated]);

  return null;
}
