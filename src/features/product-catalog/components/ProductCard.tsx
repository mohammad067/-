"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Weight, ShoppingCart, Heart, Eye, Check } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { Product } from "../types";
import { useCatalogStore } from "../store";
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

  const { wishlist, toggleWishlist, addToCart } = useCatalogStore();
  const [mounted, setMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isFavorited = mounted && wishlist.includes(id);

  // Format Persian currency
  const finalPrice = discountPercent ? price * (1 - discountPercent / 100) : price;
  const formattedPrice = finalPrice.toLocaleString("fa-IR") + " تومان";
  const formattedOldPrice = price.toLocaleString("fa-IR") + " تومان";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || isAdding) return;

    setIsAdding(true);
    // Simulate real premium delay
    setTimeout(() => {
      addToCart({ id, name, price: finalPrice, weight, imageChar });
      setIsAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full flex"
      >
        <Card
          variant="glass-premium"
          className="flex flex-col h-full text-right transition-shadow duration-500 hover:shadow-[0_15px_45px_-10px_rgba(200,167,93,0.12)] border border-border/20 hover:border-accent/30 w-full overflow-hidden"
        >
          {/* Simulated Luxury Art Backdrop */}
          <div className="relative h-64 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent flex items-center justify-center border-b border-border/10 overflow-hidden group">
            {/* Ambient golden soft glow on hover */}
            <div className="absolute inset-0 bg-primary/2 group-hover:bg-[#C8A75D]/4 transition-colors duration-700" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#C8A75D]/5 rounded-full blur-[40px] group-hover:bg-[#C8A75D]/10 transition-colors duration-700" />

            {/* Central calligraphic roundel */}
            <div className="z-10 w-24 h-24 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md border border-white/50 dark:border-white/10 flex flex-col items-center justify-center shadow-md group-hover:rotate-6 group-hover:scale-105 transition-all duration-700">
              <span className="text-primary dark:text-accent font-serif text-2xl font-bold tracking-tight">{imageChar}</span>
              <span className="text-[9px] text-muted-foreground/80 mt-1 font-light tracking-wide">۱۰۰٪ اصل</span>
            </div>

            {/* Interactive Wishlist Button on card top right */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/40 dark:hover:bg-black/40 text-foreground/80 hover:text-red-500 transition-all duration-300 z-20 cursor-pointer flex items-center justify-center shadow-sm"
              title="افزودن به علاقه‌مندی‌ها"
            >
              <Heart
                className={`w-4.5 h-4.5 transition-all duration-300 ${
                  isFavorited ? "text-red-500 fill-red-500 scale-110" : "text-foreground/80"
                }`}
              />
            </button>

            {/* Discount Badge */}
            {discountPercent && !isFavorited && (
              <Badge variant="accent" className="absolute top-4 right-4 text-[10px] font-bold z-10 px-2.5 py-1">
                تخفیف ویژه {discountPercent.toLocaleString("fa-IR")}٪
              </Badge>
            )}

            {/* Availability Stock Tag */}
            <Badge
              variant={inStock ? "success" : "warning"}
              className="absolute top-4 left-4 text-[10px] font-medium px-2.5 py-1"
            >
              {inStock ? "موجود در شالیزار" : "پیش‌فروش فصل"}
            </Badge>

            {/* Floating Quick view & rating elements */}
            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md glass text-xs font-semibold shadow-sm">
              <span>{rating.toLocaleString("fa-IR")}</span>
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            </div>

            <button
              onClick={handleQuickView}
              className="absolute bottom-3 left-4 flex items-center gap-1 px-3 py-1 rounded-md glass text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm cursor-pointer hover:bg-white/40 dark:hover:bg-black/40"
              title="پیش‌نمایش سریع رقم"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>نمایش سریع</span>
            </button>
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

            {/* Additional details specs grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/10 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>برداشت سال {harvestYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-accent" />
                <span>کیسه {weight}</span>
              </div>
            </div>
          </CardBody>

          {/* Pricing & Premium Cart Actions */}
          <CardFooter className="p-6 pt-4 flex items-center justify-between border-t border-border/10 bg-primary/2">
            <div className="flex flex-col text-right">
              {discountPercent && (
                <span className="text-[11px] text-muted-foreground/60 line-through leading-none mb-1">
                  {formattedOldPrice}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground font-light leading-none mb-0.5">قیمت ممتاز:</span>
              <span className="text-base md:text-lg font-extrabold text-primary dark:text-accent">{formattedPrice}</span>
            </div>

            <Button
              variant={added ? "primary" : "accent"}
              size="sm"
              disabled={!inStock || isAdding}
              onClick={handleAddToCart}
              className="px-4 py-2.5 text-xs gap-1.5 hover:scale-105 active:scale-97 shadow-md select-none"
            >
              {isAdding ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : added ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>اضافه شد</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>خرید لوکس</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Quick View Modal integration */}
      <QuickViewModal product={isModalOpen ? product : null} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

ProductCard.displayName = "ProductCard";
