"use client";

import React, { useState } from "react";
import { MapPin, ShoppingBag, ArrowRight, Check, Heart } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Product } from "../types";
import { useCatalogStore } from "../store";
import { MOCK_PRODUCTS } from "../data/products";
import { ProductCard } from "./ProductCard";
import Link from "next/link";

export const ProductDetailContent: React.FC<{ product: Product }> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useCatalogStore();
  const [added, setAdded] = useState(false);
  const finalPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;
  const related = MOCK_PRODUCTS.filter((p) => p.id !== product.id && (p.variety === product.variety || p.province === product.province)).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-10 text-right">
      <Link href="/products" className="text-xs text-muted-foreground flex items-center gap-1.5 mb-6">
        <ArrowRight className="w-4 h-4" />
        بازگشت به فروشگاه
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="relative h-[380px] md:h-[480px] rounded-3xl overflow-hidden bg-[#EFE8DC] border border-[#E5E2DA]">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          <Badge variant={product.inStock ? "success" : "warning"} className="absolute top-4 left-4">
            {product.inStock ? "موجود" : "ناموجود"}
          </Badge>
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {product.province}، {product.region} • رقم {product.variety}
          </p>
          <Typography variant="serif-title" className="text-3xl font-bold leading-tight">{product.name}</Typography>
          <button onClick={() => toggleWishlist(product.id)} className="flex items-center gap-1.5 text-xs text-muted-foreground w-fit">
            <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "text-red-500 fill-red-500" : ""}`} />
            علاقه‌مندی
          </button>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white border border-[#E5E2DA] rounded-xl p-3">
              <span className="text-muted-foreground block">سال برداشت</span>
              <span className="font-bold">{product.harvestYear}</span>
            </div>
            <div className="bg-white border border-[#E5E2DA] rounded-xl p-3">
              <span className="text-muted-foreground block">وزن</span>
              <span className="font-bold">{product.weight}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 bg-white border border-[#E5E2DA] rounded-2xl p-4">
            <span className="text-xl font-bold text-primary">{finalPrice.toLocaleString("fa-IR")} تومان</span>
            <Button
              variant="primary"
              size="lg"
              disabled={!product.inStock}
              onClick={() => {
                addToCart({ id: product.id, name: product.name, price: finalPrice, weight: product.weight, imageChar: product.imageChar });
                setAdded(true);
              }}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {added ? "اضافه شد" : "افزودن به سبد"}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[#E5E2DA]">
          <Typography variant="serif-title" className="text-2xl font-bold mb-8">ارقام نزدیک</Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ProductDetailContent.displayName = "ProductDetailContent";
