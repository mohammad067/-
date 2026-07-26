"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useStore } from "@/stores/store";

interface CartButtonProps {
  onClick?: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const { cart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const totalItems = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      alert(`سبد خرید شما شامل ${totalItems.toLocaleString("fa-IR")} کیسه برنج ممتاز می‌باشد.`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-accent transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
      title="سبد خرید شما"
    >
      <ShoppingBag className="w-5 h-5 stroke-1.5" />
      {mounted && totalItems > 0 && (
        <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-accent text-[9px] text-accent-foreground font-sans font-bold flex items-center justify-center px-1 animate-pulse">
          {totalItems}
        </span>
      )}
    </button>
  );
};

CartButton.displayName = "CartButton";
