"use client";

import React from "react";
import { Heart } from "lucide-react";
import { clsx } from "clsx";

interface WishlistButtonProps {
  onClick?: () => void;
  initialFavorited?: boolean;
}

import { useWishlistStore } from "@/features/wishlist/store";

export const WishlistButton: React.FC<WishlistButtonProps> = ({ onClick }) => {
  const items = useWishlistStore((state) => state.items);
  const totalCount = items.length;

  return (
    <button
      onClick={onClick}
      className="relative p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-red-500 transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
      title="علاقه‌مندی‌ها"
    >
      <Heart
        className={clsx(
          "w-5 h-5 stroke-1.5 transition-all duration-300",
          totalCount > 0 ? "text-red-500 fill-red-500 scale-105" : "text-foreground/80"
        )}
      />
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-[10px] text-white font-bold flex items-center justify-center animate-scale-up">
          {totalCount.toLocaleString("fa-IR")}
        </span>
      )}
    </button>
  );
};

WishlistButton.displayName = "WishlistButton";
