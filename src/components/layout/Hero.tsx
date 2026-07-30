"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Glass } from "@/components/ui/Glass";
import { Sparkles, ArrowDown } from "lucide-react";

// HERO BACKGROUND IMAGE CONFIGURATION
// To change the Hero background, simply replace this string with your image path (e.g., "/hero-bg.avif").
// If empty (""), the pure CSS luxury animated gradient and floating orbs are displayed.
const HERO_BACKGROUND_IMAGE = "";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 py-20 text-center">
      {/* Cinematic Luxury Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2F5D50]/55 via-[#0E1412]/80 to-[#0E1412]/95" />
        {/* Soft, beautiful floating golden and green blurred orbs for organic feel */}
        <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-[#C8A75D]/15 rounded-full blur-[140px] mix-blend-screen animate-pulse duration-5000" />
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-[#2F5D50]/25 rounded-full blur-[160px] mix-blend-screen animate-pulse duration-7000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-8 px-4 md:px-0">
        {/* Organic Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Badge
            variant="accent"
            className="gap-2 px-4 py-2 bg-accent/15 text-[#C8A75D] border border-accent/40 text-sm shadow-[0_0_15px_rgba(200,167,93,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-accent fill-accent" />
            برداشت جدید ارگانیک ۱۴۰۳
          </Badge>
        </motion.div>

        {/* Captivating Cinematic Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 text-center"
        >
          <Typography
            variant="h1"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#C8A75D] font-serif leading-tight max-w-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            عطر شالیزار شمال، <br className="hidden sm:inline" />
            <span className="text-white font-medium">تجلی اصیل سفره ایرانی</span>
          </Typography>

          <Typography
            variant="serif-subtitle"
            className="text-lg md:text-2xl text-slate-100 max-w-2xl mx-auto font-light leading-relaxed mt-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          >
            تجربه خرید مستقیم مرغوب‌ترین برنج گیلان و مازندران، دست‌چین شده از مزارع
            ارگانیک با عطر و طعم ماندگار نسل‌ها.
          </Typography>
        </motion.div>

        {/* Elegant Action Triggers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-4 justify-center items-center mt-6"
        >
          <Button
            variant="accent"
            size="lg"
            className="shadow-lg hover:scale-105 active:scale-97 font-bold border border-accent/30 hover:shadow-[0_0_25px_rgba(200,167,93,0.45)]"
          >
            مشاهده ارقام ممتاز
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            داستان طلای شالیزار
          </Button>
        </motion.div>

        {/* Feature Highlights Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-right"
        >
          <Glass intensity="high" rounded="lg" className="p-6 flex flex-col gap-2">
            <Typography variant="h4" className="font-semibold text-primary dark:text-accent">
              کیفیت ارگانیک اصیل
            </Typography>
            <Typography variant="body-sm" className="text-muted-foreground leading-relaxed">
              تضمین ۱۰۰٪ خلوص بدون افزودنی یا برنج‌های ترکیبی، دست‌چین شده مستقیماً از
              شالیزارهای گیلان.
            </Typography>
          </Glass>

          <Glass intensity="high" rounded="lg" className="p-6 flex flex-col gap-2">
            <Typography variant="h4" className="font-semibold text-primary dark:text-accent">
              بسته‌بندی خلاقانه نفیس
            </Typography>
            <Typography variant="body-sm" className="text-muted-foreground leading-relaxed">
              ارائه شده در کیسه‌های پارچه‌ای نفیس ضد رطوبت برای حفظ عطر ناب شالیزار تا
              زمان پخت.
            </Typography>
          </Glass>

          <Glass intensity="high" rounded="lg" className="p-6 flex flex-col gap-2">
            <Typography variant="h4" className="font-semibold text-primary dark:text-accent">
              ارسال لوکس اختصاصی
            </Typography>
            <Typography variant="body-sm" className="text-muted-foreground leading-relaxed">
              تحویل فوری و بیمه شده در بسته‌بندی لوکس محافظت‌شده جهت کادو و مصارف خانگی
              برتر شما.
            </Typography>
          </Glass>
        </motion.div>

        {/* Scroll Indicator Arrow */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mt-12 hidden md:flex flex-col items-center gap-2 text-muted-foreground text-xs font-light cursor-pointer"
          onClick={() => {
            document.getElementById("products-showcase")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>مشاهده محصولات لوکس و فیلترها</span>
          <ArrowDown className="w-4 h-4 text-accent" />
        </motion.div>
      </div>
    </section>
  );
};

Hero.displayName = "Hero";