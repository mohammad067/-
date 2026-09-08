"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCatalogStore } from "@/features/product-catalog/store";

export const WishlistButton: React.FC = () => {
  const router = useRouter();
  const totalCount = useCatalogStore((state) => state.wishlist.length);

  return (
    <button
      onClick={() => router.push("/wishlist")}
      className="relative p-2.5 rounded-full hover:bg-white text-foreground/80 hover:text-red-500"
      aria-label="علاقه‌مندی"
    >
      <Heart className={`w-5 h-5 ${totalCount > 0 ? "text-red-500 fill-red-500" : ""}`} />
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-[10px] text-white flex items-center justify-center">
          {totalCount.toLocaleString("fa-IR")}
        </span>
      )}
    </button>
  );
};

WishlistButton.displayName = "WishlistButton";
