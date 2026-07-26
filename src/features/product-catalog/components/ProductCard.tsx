"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Weight, ShoppingCart, Heart, Eye } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { Product } from "../types";
import { useStore } from "@/stores/store";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    id,
    slug,
    name,
    variety,
    province,
    harvestYear,
    weight,
    price,
    discountPercent,
    inStock,
    rating,
    imageChar,
    summary,
    region,
  } = product;

  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isWishlisted = mounted && wishlist.includes(id);

  // Format Persian currency
  const finalPrice = discountPercent ? price * (1 - discountPercent / 100) : price;
  const formattedPrice = finalPrice.toLocaleString("fa-IR") + " تومان";
  const formattedOldPrice = price.toLocaleString("fa-IR") + " تومان";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart({ id, name, price: finalPrice });
    alert(`کیسه ${name} با موفقیت به سبد خرید اضافه گردید.`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card variant="glass-premium" className="flex flex-col h-full text-right hover:shadow-2xl transition-all duration-500 group relative">
          {/* Simulated Luxury Art Backdrop */}
          <div className="relative h-64 bg-gradient-to-b from-[#2F5D50]/12 to-transparent flex items-center justify-center border-b border-border/20 overflow-hidden">
            <div className="absolute inset-0 bg-primary/2 group-hover:scale-105 transition-transform duration-700" />

            <div className="z-10 w-24 h-24 rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/40 flex flex-col items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-700">
              <span className="text-primary dark:text-accent font-serif text-2xl font-bold">{imageChar}</span>
              <span className="text-[9px] text-muted-foreground/80 tracking-tight mt-0.5 font-light">۱۰۰٪ خالص</span>
            </div>

            {/* Interactive Wishlist Heart Button inside Product Card */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 p-2.5 rounded-full glass hover:bg-muted/30 text-foreground transition-all duration-300 z-20 cursor-pointer flex items-center justify-center"
              title="افزودن به علاقه‌مندی‌ها"
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isWishlisted ? "text-red-500 fill-red-500 scale-110" : "text-foreground"
                }`}
              />
            </button>

            {/* Discount Tag */}
            {discountPercent && !isWishlisted && (
              <Badge variant="accent" className="absolute top-4 right-4 text-[10px] font-bold z-10">
                {discountPercent.toLocaleString("fa-IR")}٪ تخفیف برداشت
              </Badge>
            )}

            {/* Stock Tag */}
            <Badge
              variant={inStock ? "success" : "warning"}
              className="absolute top-4 left-4 text-[10px] font-medium"
            >
              {inStock ? "موجود در شالیزار" : "پیش‌فروش فصل بعد"}
            </Badge>

            {/* Rating */}
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md glass text-xs font-semibold">
              <span>{rating.toLocaleString("fa-IR")}</span>
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            </div>
          </div>

          {/* Product Details Header */}
          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                {province}، {region}
              </span>
              <span className="font-semibold text-primary/80 dark:text-accent/80">رقم {variety}</span>
            </div>

            <Link href={`/products/${slug}`} className="hover:text-accent transition-colors duration-300">
              <Typography variant="h3" className="text-xl font-bold text-primary dark:text-foreground mt-1 line-clamp-1">
                {name}
              </Typography>
            </Link>
          </CardHeader>

          {/* Product Summary */}
          <CardBody className="p-6 py-2 flex-grow">
            <Typography variant="body-sm" className="text-muted-foreground leading-relaxed text-sm line-clamp-2">
              {summary}
            </Typography>

            {/* Additional details grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/20 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>برداشت سال {harvestYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-accent" />
                <span>وزن {weight}</span>
              </div>
            </div>
          </CardBody>

          {/* Pricing & CTA */}
          <CardFooter className="p-6 pt-4 flex flex-col gap-3 border-t border-border/20">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col text-right">
                {discountPercent && (
                  <span className="text-[11px] text-muted-foreground/60 line-through leading-none mb-1">
                    {formattedOldPrice}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground font-light leading-none mb-0.5">قیمت ممتاز:</span>
                <span className="text-lg font-extrabold text-primary dark:text-accent">{formattedPrice}</span>
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[10px] text-muted-foreground font-light leading-none">بسته‌بندی:</span>
                <span className="text-xs font-semibold mt-1">{weight}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProduct(product)}
                className="py-2.5 text-xs font-semibold flex items-center justify-center gap-1 border-border/50 hover:bg-muted/10 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                پیش‌نمایش
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="py-2.5 text-xs font-bold w-full flex items-center justify-center gap-1"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                خرید لوکس
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* QUICK VIEW DYNAMIC MODAL inside ProductCard for absolute self-containment */}
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
};

ProductCard.displayName = "ProductCard";
