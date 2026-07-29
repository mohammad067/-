"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

interface CartButtonProps {
  onClick?: () => void;
  itemCount?: number;
}

import { useCartStore } from "@/features/cart/store";

export const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const items = useCartStore((state) => state.items);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={onClick}
      className="relative p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-accent transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
      title="سبد خرید شما"
    >
      <ShoppingBag className="w-5 h-5 stroke-1.5" />
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-[10px] text-accent-foreground font-bold flex items-center justify-center animate-scale-up">
          {totalCount.toLocaleString("fa-IR")}
        </span>
      )}
    </button>
  );
};

CartButton.displayName = "CartButton";
