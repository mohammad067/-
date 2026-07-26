"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

interface CartButtonProps {
  onClick?: () => void;
  itemCount?: number;
}

export const CartButton: React.FC<CartButtonProps> = ({ onClick, itemCount = 1 }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-accent transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
      title="سبد خرید شما"
    >
      <ShoppingBag className="w-5 h-5 stroke-1.5" />
      {itemCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
      )}
    </button>
  );
};

CartButton.displayName = "CartButton";
