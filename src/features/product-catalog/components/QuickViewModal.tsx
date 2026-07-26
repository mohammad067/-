"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, Calendar, Weight, ShoppingBag, Heart } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Product } from "../types";
import { useStore } from "@/stores/store";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!product) return null;

  const {
    id,
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

  const finalPrice = discountPercent ? price * (1 - discountPercent / 100) : price;
  const formattedPrice = finalPrice.toLocaleString("fa-IR") + " تومان";
  const formattedOldPrice = price.toLocaleString("fa-IR") + " تومان";

  const isWishlisted = mounted && wishlist.includes(id);

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart({ id, name, price: finalPrice });
    alert(`کیسه ${name} با موفقیت به سبد خرید اضافه گردید.`);
    onClose();
  };

  const handleToggleWishlist = () => {
    toggleWishlist(id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-3xl bg-background/95 dark:bg-[#0E1412]/95 border border-border/40 rounded-3xl overflow-hidden shadow-2xl z-10 text-right"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted/20 text-foreground transition-all z-20 cursor-pointer"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Visual Calligraphic Left Card */}
            <div className="relative h-72 md:h-full min-h-[300px] bg-gradient-to-tr from-[#2F5D50]/15 to-transparent flex items-center justify-center border-l border-border/20 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-[#C8A75D]/10 rounded-full blur-[70px]" />
              <div className="z-10 w-24 h-24 rounded-full bg-white/45 dark:bg-black/30 backdrop-blur-md border border-white/40 flex flex-col items-center justify-center shadow-lg">
                <span className="text-primary dark:text-accent font-serif text-3xl font-bold">{imageChar}</span>
                <span className="text-[10px] text-muted-foreground/80 tracking-tight mt-0.5">۱۰۰٪ اصل</span>
              </div>
              {discountPercent && (
                <Badge variant="accent" className="absolute top-4 right-4 text-[10px] font-bold">
                  تخفیف برداشت {discountPercent.toLocaleString("fa-IR")}٪
                </Badge>
              )}
            </div>

            {/* Details Right Block */}
            <div className="p-6 md:p-8 flex flex-col gap-5 justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 justify-start text-[11px] text-accent font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    استان {province}، {region}
                  </span>
                  <span>•</span>
                  <span>رقم {variety}</span>
                </div>
                <Typography variant="h3" className="text-xl md:text-2xl font-bold text-primary dark:text-foreground mt-1 line-clamp-1">
                  {name}
                </Typography>

                <div className="flex items-center gap-4 mt-1 justify-start">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <span className="text-xs font-semibold">{rating.toLocaleString("fa-IR")}</span>
                    <span className="text-xs text-muted-foreground font-light">امتیاز خریداران</span>
                  </div>

                  {/* Quick-view Wishlist Action */}
                  <button
                    onClick={handleToggleWishlist}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
                    <span>{isWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
                  </button>
                </div>
              </div>

              <Typography variant="body-sm" className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                {summary}
              </Typography>

              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 justify-start">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>برداشت سال {harvestYear}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-start">
                  <Weight className="w-4 h-4 text-accent" />
                  <span>وزن {weight}</span>
                </div>
              </div>

              <hr className="border-border/30" />

              {/* Price and CTA */}
              <div className="flex items-center justify-between gap-4 mt-2">
                <div className="flex flex-col text-right">
                  {discountPercent && (
                    <span className="text-xs text-muted-foreground/60 line-through leading-none mb-1">
                      {formattedOldPrice}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground font-light leading-none mb-0.5">قیمت:</span>
                  <span className="text-lg font-bold text-primary dark:text-accent">{formattedPrice}</span>
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="px-6 py-2.5 text-xs font-bold gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 stroke-1.5" />
                  {inStock ? "خرید سریع" : "پیش‌فروش"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

QuickViewModal.displayName = "QuickViewModal";
