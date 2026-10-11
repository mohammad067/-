"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "../types";
import { useCatalogStore } from "../store";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { wishlist, toggleWishlist } = useCatalogStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const finalPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;

  return (
    <article className="min-w-0 w-full text-right bg-white border border-[#E5E2DA] rounded-2xl overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-[#EFE8DC]">
          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
          {product.discountPercent ? (
            <span className="absolute top-2 right-2 text-[10px] bg-[#C45C26] text-white rounded-md px-1.5 py-0.5">
              {product.discountPercent.toLocaleString("fa-IR")}٪
            </span>
          ) : null}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
            aria-label="علاقه‌مندی"
          >
            <Heart className={`w-4 h-4 ${mounted && wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-[#1E2522]"}`} />
          </button>
        </div>
        <div className="p-3 space-y-1">
          <h3 className="font-bold text-[13px] md:text-sm leading-6 line-clamp-2 min-h-[3rem]">{product.name}</h3>
          <p className="text-[11px] text-muted-foreground line-clamp-1">{product.summary}</p>
          <p className="text-sm md:text-base font-bold text-[#1E2522] pt-1">
            {finalPrice.toLocaleString("fa-IR")} تومان
          </p>
        </div>
      </Link>
    </article>
  );
};

ProductCard.displayName = "ProductCard";
