"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MapPin, Heart, ShoppingCart, Check } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { Product } from "../types";
import { useCatalogStore } from "../store";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useCatalogStore();
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  const finalPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;

  return (
    <Card className="flex flex-col h-full text-right overflow-hidden bg-white border border-[#E5E2DA] rounded-2xl">
      <Link href={`/products/${product.slug}`} className="relative block h-52 bg-[#EFE8DC] overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90"
          aria-label="علاقه‌مندی"
        >
          <Heart className={`w-4 h-4 ${mounted && wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        {product.discountPercent ? (
          <Badge variant="accent" className="absolute top-3 left-3 text-[10px]">
            {product.discountPercent.toLocaleString("fa-IR")}%
          </Badge>
        ) : null}
      </Link>
      <CardHeader className="p-4 pb-1">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {product.province}، {product.region}
        </span>
        <Link href={`/products/${product.slug}`}>
          <Typography variant="h3" className="text-base font-bold text-primary mt-1 line-clamp-1">
            {product.name}
          </Typography>
        </Link>
      </CardHeader>
      <CardBody className="px-4 py-1 flex-grow">
        <p className="text-xs text-muted-foreground line-clamp-2">{product.summary}</p>
        <p className="text-[11px] text-muted-foreground mt-2">کیسه {product.weight}</p>
      </CardBody>
      <CardFooter className="p-4 pt-2 flex items-center justify-between gap-2 border-t border-[#E5E2DA]">
        <span className="text-sm font-bold text-primary">{finalPrice.toLocaleString("fa-IR")} تومان</span>
        <Button
          variant="primary"
          size="sm"
          disabled={!product.inStock}
          onClick={() => {
            addToCart({ id: product.id, name: product.name, price: finalPrice, weight: product.weight, imageChar: product.imageChar });
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="text-xs"
        >
          {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          {product.inStock ? (added ? "اضافه شد" : "سبد") : "ناموجود"}
        </Button>
      </CardFooter>
    </Card>
  );
};

ProductCard.displayName = "ProductCard";
