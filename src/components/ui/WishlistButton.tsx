"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { clsx } from "clsx";

interface WishlistButtonProps {
  onClick?: () => void;
  initialFavorited?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ onClick, initialFavorited = false }) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  const handleClick = () => {
    setIsFavorited(!isFavorited);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-red-500 transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
      title="علاقه‌مندی‌ها"
    >
      <Heart
        className={clsx(
          "w-5 h-5 stroke-1.5 transition-all duration-300",
          isFavorited ? "text-red-500 fill-red-500 scale-110" : "text-foreground/80"
        )}
      />
    </button>
  );
};

WishlistButton.displayName = "WishlistButton";
