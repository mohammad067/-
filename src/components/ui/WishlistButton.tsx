"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useStore } from "@/stores/store";
import { clsx } from "clsx";

interface WishlistButtonProps {
  productId?: string;
  onClick?: () => void;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, onClick }) => {
  const { wishlist, toggleWishlist } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isFavorited = productId && wishlist.includes(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (productId) {
      toggleWishlist(productId);
    }
    if (onClick) {
      onClick();
    }
  };

  const totalCount = wishlist.length;

  return (
    <button
      onClick={handleClick}
      className="p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-red-500 transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent relative"
      title="علاقه‌مندی‌ها"
    >
      <Heart
        className={clsx(
          "w-5 h-5 stroke-1.5 transition-all duration-300",
          mounted && isFavorited ? "text-red-500 fill-red-500 scale-110" : "text-foreground/80"
        )}
      />
      {mounted && totalCount > 0 && !productId && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent text-[9px] text-accent-foreground flex items-center justify-center font-bold font-sans">
          {totalCount}
        </span>
      )}
    </button>
  );
};

WishlistButton.displayName = "WishlistButton";
