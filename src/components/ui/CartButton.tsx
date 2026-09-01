"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCatalogStore } from "../../features/product-catalog/store";
import { CartDrawer } from "../../features/cart/components/CartDrawer";
import { CheckoutWizard } from "../../features/checkout/components/CheckoutWizard";

interface CartButtonProps {
  itemCount?: number;
}

export const CartButton: React.FC<CartButtonProps> = ({ itemCount }) => {
  const { cart, setIsCartOpen } = useCatalogStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Compute live cart items count from Zustand, fallback to prop on server-side
  const liveCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const itemsCount = mounted ? liveCount : (itemCount ?? 0);

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-accent transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
        title="سبد خرید شما"
        aria-label={`سبد خرید شما؛ ${itemsCount.toLocaleString("fa-IR")} کالا`}
      >
        <ShoppingBag className="w-5 h-5 stroke-1.5" />
        {itemsCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-accent text-[8px] font-bold text-black h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-background animate-fade-in animate-pulse">
            {itemsCount.toLocaleString("fa-IR")}
          </span>
        )}
      </button>

      {/* Global Cart Slide Drawer portal */}
      <CartDrawer />

      {/* Global Checkout Wizard portal */}
      <CheckoutWizard />
    </>

  );
};

CartButton.displayName = "CartButton";
