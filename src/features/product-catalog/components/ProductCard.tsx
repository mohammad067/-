"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Product } from "../types";
import { useCatalogStore } from "../store";
import { MOCK_PRODUCTS } from "../data/products";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useCatalogStore();
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState(product.id);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setActiveId(product.id);
  }, [product.id]);

  const weights = useMemo(() => {
    const siblings = MOCK_PRODUCTS.filter(
      (p) => p.variety === product.variety && p.region === product.region && p.name.replace(/۰-۹۵ کیلویی/g, "").slice(0, 12) === product.name.slice(0, 12)
    );
    const list = MOCK_PRODUCTS.filter((p) => p.variety === product.variety && p.region === product.region);
    const unique = list.length > 1 ? list : [product];
    return unique;
  }, [product]);

  const active = weights.find((p) => p.id === activeId) || product;
  const finalPrice = active.discountPercent
    ? active.price * (1 - active.discountPercent / 100)
    : active.price;

  return (
    <Card className="flex flex-col text-right overflow-hidden bg-white border border-[#E5E2DA] rounded-3xl">
      <div className="relative h-56 bg-[#EFE8DC]">
        <Link href={`/products/${active.slug}`} className="block h-full">
          <img src={active.imageUrl} alt={active.name} className="w-full h-full object-cover" />
        </Link>
        <Badge variant={active.inStock ? "success" : "warning"} className="absolute top-3 left-3 text-[10px]">
          {active.inStock ? "موجود" : "ناموجود"}
        </Badge>
        <button onClick={() => toggleWishlist(active.id)} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90" aria-label="علاقه‌مندی">
          <Heart className={`w-4 h-4 ${mounted && wishlist.includes(active.id) ? "fill-red-500 text-red-500" : "text-foreground/70"}`} />
        </button>
        <div className="absolute bottom-2 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 text-[10px] font-semibold">
          {active.rating.toLocaleString("fa-IR")}
          <Star className="w-3 h-3 text-primary fill-primary" />
        </div>
      </div>
      <div className="px-4 py-3 space-y-2">
        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {active.province}، {active.region}
        </p>
        <Link href={`/products/${active.slug}`} className="block font-bold text-[#1E2522] text-[15px] leading-snug line-clamp-1">
          {active.name}
        </Link>
        {weights.length > 1 && (
          <div className="flex gap-1 justify-end">
            {weights.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setActiveId(w.id)}
                className={`text-[10px] rounded-full border px-2 py-1 ${w.id === active.id ? "bg-primary text-white border-primary" : "bg-white border-[#E5E2DA]"}`}
              >
                {w.weight}
              </button>
            ))}
          </div>
        )}
        {weights.length === 1 && (
          <span className="text-[11px] text-muted-foreground">{active.weight}</span>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-primary">{finalPrice.toLocaleString("fa-IR")} تومان</span>
        </div>
        <Button
          variant="primary"
          size="sm"
          disabled={!active.inStock}
          className="w-full text-[11px] h-8"
          onClick={() => addToCart({ id: active.id, name: active.name, price: finalPrice, weight: active.weight, imageChar: active.imageChar })}
        >
          {active.inStock ? "خرید نقدی" : "ناموجود"}
        </Button>
      </div>
    </Card>
  );
};

ProductCard.displayName = "ProductCard";
