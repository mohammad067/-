"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Product } from "../types";
import { useCatalogStore } from "../store";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useCatalogStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const finalPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;

  return (
    <Card className="flex flex-col text-right overflow-hidden bg-white border border-[#E5E2DA] rounded-3xl min-w-0 w-full">
      <div className="relative h-36 md:h-56 bg-[#EFE8DC]">
        <Link href={`/products/${product.slug}`} className="block h-full">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </Link>
        <Badge variant={product.inStock ? "success" : "warning"} className="absolute top-2 left-2 text-[10px]">
          {product.inStock ? "موجود" : "ناموجود"}
        </Badge>
        <button type="button" onClick={() => toggleWishlist(product.id)} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90" aria-label="علاقه‌مندی">
          <Heart className={`w-4 h-4 ${mounted && wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-foreground/70"}`} />
        </button>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 text-[10px] font-semibold">
          {product.rating.toLocaleString("fa-IR")}
          <Star className="w-3 h-3 text-primary fill-primary" />
        </div>
      </div>
      <div className="px-2.5 md:px-4 py-2.5 space-y-1.5">
        <p className="text-[10px] md:text-[11px] text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="line-clamp-1">{product.province}، {product.region}</span>
        </p>
        <Link href={`/products/${product.slug}`} className="block font-bold text-[#1E2522] text-xs md:text-[15px] leading-snug line-clamp-2">
          {product.name}
        </Link>
        <p className="text-[11px] text-muted-foreground">{product.weight}</p>
        <p className="text-xs md:text-sm font-bold text-primary">{finalPrice.toLocaleString("fa-IR")} تومان</p>
        <Button
          variant="primary"
          size="sm"
          disabled={!product.inStock}
          className="w-full text-[11px] h-8"
          onClick={() => addToCart({ id: product.id, name: product.name, price: finalPrice, weight: product.weight, imageChar: product.imageChar })}
        >
          {product.inStock ? "خرید نقدی" : "ناموجود"}
        </Button>
      </div>
    </Card>
  );
};

ProductCard.displayName = "ProductCard";
