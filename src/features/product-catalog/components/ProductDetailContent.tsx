"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, ShoppingBag, ArrowRight, ShieldCheck, Flame, Info, Check, Heart } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Glass } from "@/components/ui/Glass";
import { Product } from "../types";
import { useCatalogStore } from "../store";
import { MOCK_PRODUCTS } from "../data/products";
import { ProductCard } from "./ProductCard";
import Link from "next/link";

interface ProductDetailContentProps {
  product: Product;
}

export const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product }) => {
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
    description,
    aromaScore,
    lengthScore,
    region,
  } = product;

  const { wishlist, toggleWishlist, addToCart } = useCatalogStore();
  const [mounted, setMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isFavorited = mounted && wishlist.includes(id);

  const finalPrice = discountPercent ? price * (1 - discountPercent / 100) : price;
  const formattedPrice = finalPrice.toLocaleString("fa-IR") + " تومان";
  const formattedOldPrice = price.toLocaleString("fa-IR") + " تومان";

  const handleAddToCart = () => {
    if (!inStock || isAdding) return;
    setIsAdding(true);
    setTimeout(() => {
      addToCart({ id, name, price: finalPrice, weight, imageChar });
      setIsAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 600);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(id);
  };

  // Get related products (same variety or same province, excluding current)
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== id && (p.variety === variety || p.province === province)
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 text-right relative">
      {/* Back Link */}
      <div className="mb-8 flex items-center justify-start">
        <Link href="/products" className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1.5 transition-colors">
          <ArrowRight className="w-4 h-4" />
          بازگشت به گالری محصولات ممتاز
        </Link>
      </div>

      {/* Main product display segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Visual Calligraphic Artwork */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[450px] md:h-[550px] rounded-3xl bg-gradient-to-tr from-primary/15 via-background to-background dark:from-[#0E1412] dark:via-[#111A16]/90 dark:to-[#0E1412] flex items-center justify-center border border-border/40 overflow-hidden shadow-xl group"
        >
          {/* Ambient soft glow backdrop meshes */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#C8A75D]/10 rounded-full blur-[90px] mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[80px] mix-blend-screen" />

          {/* Luxury Floating Emblem */}
          <div className="relative w-48 h-48 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md border border-white/50 dark:border-white/10 flex flex-col items-center justify-center shadow-2xl scale-110 group-hover:scale-115 group-hover:rotate-3 transition-all duration-700">
            <span className="text-primary dark:text-accent font-serif text-5xl font-extrabold tracking-tight">{imageChar}</span>
            <span className="text-[11px] text-muted-foreground/80 tracking-widest mt-1 font-light">بسته‌بندی خلاقانه</span>
          </div>

          {/* Top Badges */}
          {discountPercent && (
            <Badge variant="accent" className="absolute top-6 right-6 text-xs font-bold px-4 py-1.5 shadow-lg">
              ویژه برداشت: {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
            </Badge>
          )}

          <Badge variant={inStock ? "success" : "warning"} className="absolute top-6 left-6 text-xs font-medium px-4 py-1.5 shadow-lg">
            {inStock ? "موجود در شالیزار شمال" : "پیش‌فروش فصل بعد"}
          </Badge>
        </motion.div>

        {/* Right Column: Premium Specifications and Interactions */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 justify-start text-xs text-accent font-semibold">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                استان {province}، {region}
              </span>
              <span>•</span>
              <span>رقم سنتی ممتاز {variety}</span>
            </div>

            <Typography variant="serif-title" className="text-3xl md:text-4xl font-extrabold mt-2 leading-tight">
              {name}
            </Typography>

            <div className="flex items-center gap-4 justify-start mt-3">
              <div className="flex items-center gap-1 bg-accent/15 px-3 py-1 rounded-md text-xs font-bold text-[#B79650] shadow-sm">
                <span>{rating.toLocaleString("fa-IR")}</span>
                <Star className="w-3.5 h-3.5 fill-accent stroke-none" />
              </div>
              <span className="text-xs text-muted-foreground font-light">({rating.toLocaleString("fa-IR")} امتیاز خریداران شالیزار)</span>

              <button
                onClick={handleToggleWishlist}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors duration-300 cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? "text-red-500 fill-red-500" : ""}`} />
                <span>{isFavorited ? "علاقه‌مند شده" : "افزودن به علاقه‌مندی‌ها"}</span>
              </button>
            </div>
          </div>

          <hr className="border-border/30" />

          {/* Description Copy */}
          <div className="flex flex-col gap-3">
            <Typography variant="h4" className="font-bold text-lg text-primary dark:text-accent">شناسنامه محصول ممتاز</Typography>
            <Typography variant="body" className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </Typography>
          </div>

          {/* Quality Score Bar Charts */}
          <div className="flex flex-col gap-4 bg-primary/5 dark:bg-black/10 p-6 rounded-3xl border border-border/30 shadow-inner">
            <Typography variant="h4" className="text-sm font-bold flex items-center gap-1.5 text-primary dark:text-accent">
              <Info className="w-4 h-4 stroke-1.5" />
              آنالیز کیفیت آزمایشگاهی (موسسه تحقیقات برنج)
            </Typography>

            {/* Aroma Score */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-accent">عالی (۵ از ۵)</span>
                <span className="text-foreground/80">شاخص میزان عطر طبیعی شالیزار</span>
              </div>
              <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${(aromaScore / 5) * 100}%` }} />
              </div>
            </div>

            {/* Elongation Score */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-accent">{lengthScore} از ۵</span>
                <span className="text-foreground/80">میزان قد کشیدگی و ری‌دهی دانه</span>
              </div>
              <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${(lengthScore / 5) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
            <Glass rounded="sm" className="p-3.5 flex flex-col gap-1 border border-border/10 shadow-sm">
              <span className="text-muted-foreground">سال برداشت</span>
              <span className="font-bold">{harvestYear}</span>
            </Glass>
            <Glass rounded="sm" className="p-3.5 flex flex-col gap-1 border border-border/10 shadow-sm">
              <span className="text-muted-foreground">کیسه بسته‌بندی</span>
              <span className="font-bold">{weight}</span>
            </Glass>
            <Glass rounded="sm" className="p-3.5 flex flex-col gap-1 border border-border/10 shadow-sm">
              <span className="text-muted-foreground">روش بوجاری</span>
              <span className="font-bold">۳ مرحله بوجار لوکس</span>
            </Glass>
            <Glass rounded="sm" className="p-3.5 flex flex-col gap-1 border border-border/10 shadow-sm">
              <span className="text-muted-foreground">آبیاری مزارع</span>
              <span className="font-bold">۱۰۰٪ آب شیرین رود</span>
            </Glass>
          </div>

          <hr className="border-border/30" />

          {/* Purchase Action Block */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/20 dark:bg-black/5 p-6 rounded-3xl border border-border/40 shadow-md">
            <div className="flex flex-col text-right">
              {discountPercent && (
                <span className="text-xs text-muted-foreground/60 line-through mb-1">
                  {formattedOldPrice}
                </span>
              )}
              <span className="text-xs text-muted-foreground font-light mb-0.5">مبلغ قابل پرداخت برای هر کیسه:</span>
              <span className="text-2xl font-black text-primary dark:text-accent">{formattedPrice}</span>
            </div>

            <Button
              variant={added ? "primary" : "accent"}
              size="lg"
              disabled={!inStock || isAdding}
              onClick={handleAddToCart}
              className="w-full sm:w-auto shadow-xl hover:scale-105 font-bold gap-2 text-sm px-8 py-4 transition-all duration-300"
            >
              {isAdding ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : added ? (
                <>
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span>به سبد اضافه شد</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 stroke-1.5" />
                  <span>{inStock ? "افزودن به سبد خرید لوکس" : "پیش‌فروش محصول"}</span>
                </>
              )}
            </Button>
          </div>

          {/* Quality Seals */}
          <div className="flex items-center justify-start gap-4 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              ضمانت خلوص ۱۰۰٪ مزارع شمال
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-accent" />
              تست عطر و پخت فیزیکی تضمین شده
            </span>
          </div>
        </div>
      </div>

      {/* Related Products Grid Block */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-border/20 pt-16">
          <div className="flex flex-col gap-2 mb-10 text-right">
            <Badge variant="primary" className="w-fit self-end gap-1 px-3 py-1 bg-primary/10 text-primary">
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
              پیشنهادات برگزیده مشابه
            </Badge>
            <Typography variant="serif-title" className="text-2xl md:text-3xl font-bold mt-2">
              سایر ارقام لوکس پیشنهادی شالیزار
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions Bar on Scroll */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed bottom-6 left-4 right-4 md:left-8 md:right-8 z-40 max-w-4xl mx-auto glass-premium border border-accent/20 rounded-full px-6 py-4 flex items-center justify-between shadow-2xl text-right gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center shrink-0 border border-primary/20">
                <span className="text-primary dark:text-accent font-serif font-bold text-xs">{imageChar}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground line-clamp-1">{name}</span>
                <span className="text-[10px] text-muted-foreground">{weight} • {province}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col text-left">
                {discountPercent && (
                  <span className="text-[10px] text-muted-foreground/60 line-through leading-none mb-1">
                    {formattedOldPrice}
                  </span>
                )}
                <span className="text-sm font-extrabold text-primary dark:text-accent leading-none">{formattedPrice}</span>
              </div>

              <Button
                variant={added ? "primary" : "accent"}
                size="sm"
                disabled={!inStock || isAdding}
                onClick={handleAddToCart}
                className="px-6 py-2.5 text-xs font-bold gap-1.5 shadow-lg"
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
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{inStock ? "خرید سریع" : "پیش‌فروش"}</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ProductDetailContent.displayName = "ProductDetailContent";
