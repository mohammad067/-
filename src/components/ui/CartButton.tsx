"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCatalogStore } from "../../features/product-catalog/store";
import { CartDrawer } from "../../features/cart/components/CartDrawer";
import { CheckoutWizard } from "../../features/checkout/components/CheckoutWizard";

export const CartButton: React.FC = () => {
  const { cart, setIsCartOpen } = useCatalogStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);
  const itemsCount = mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2.5 rounded-full hover:bg-white text-primary"
        aria-label="سبد خرید"
      >
        <ShoppingBag className="w-5 h-5" />
        {itemsCount > 0 && (
          <span className="absolute top-1 right-1 bg-primary text-[10px] font-bold text-white h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
            {itemsCount.toLocaleString("fa-IR")}
          </span>
        )}
      </button>
      <CartDrawer />
      <CheckoutWizard />
    </>
  );
};

CartButton.displayName = "CartButton";
