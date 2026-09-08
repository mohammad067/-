"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MapPin, Heart, Eye } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
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
    <Card className="flex flex-col h-full text-right overflow-hidden bg-white border border-[#E5E2DA] rounded-3xl">
      <div className="relative h-56 bg-[#EFE8DC]">
        <Link href={`/products/${product.slug}`} className="block h-full">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </Link>
        <Badge variant={product.inStock ? "success" : "warning"} className="absolute top-4 left-4 text-[10px]">
          {product.inStock ? "موجود" : "ناموجود"}
        </Badge>
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-sm"
          aria-label="علاقه‌مندی"
        >
          <Heart className={`w-4 h-4 ${mounted && wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-foreground/70"}`} />
        </button>
        <div className="absolute bottom-3 right-4 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 text-[11px] font-semibold">
          <span>{product.rating.toLocaleString("fa-IR")}</span>
          <Star className="w-3 h-3 text-[#C8A75D] fill-[#C8A75D]" />
        </div>
      </div>

      <CardHeader className="p-5 pb-2">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {product.province}، {product.region}
        </span>
        <Link href={`/products/${product.slug}`}>
          <Typography variant="h3" className="text-lg font-bold text-[#1E2522] mt-1 line-clamp-1">
            {product.name}
          </Typography>
        </Link>
      </CardHeader>
      <CardBody className="px-5 py-1 flex-grow">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{product.summary}</p>
      </CardBody>
      <CardFooter className="p-5 pt-3 flex flex-col gap-3 border-t border-[#E5E2DA]">
        <div className="flex justify-between items-center w-full">
          <span className="text-[10px] text-muted-foreground">بسته‌بندی {product.weight}</span>
          <span className="text-sm font-bold text-[#C8A75D]">{finalPrice.toLocaleString("fa-IR")} تومان</span>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Link href={`/products/${product.slug}`}>
            <Button variant="outline" size="sm" className="w-full text-[11px] gap-1">
              <Eye className="w-3 h-3" />
              پیش‌نمایش
            </Button>
          </Link>
          <Button
            variant="accent"
            size="sm"
            disabled={!product.inStock}
            className="w-full text-[11px]"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: finalPrice,
                weight: product.weight,
                imageChar: product.imageChar,
              })
            }
          >
            {product.inStock ? "خرید نقدی" : "ناموجود"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

ProductCard.displayName = "ProductCard";
