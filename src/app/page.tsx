"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Glass } from "@/components/ui/Glass";
import { QuickViewModal } from "@/features/product-catalog/components/QuickViewModal";
import { MOCK_PRODUCTS } from "@/features/product-catalog/data/products";
import { Product } from "@/features/product-catalog/types";
import {
  Sparkles,
  Star,
  MapPin,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Instagram,
  Mail,
  ArrowDown,
  Eye,
  Layers
} from "lucide-react";
import Link from "next/link";

// Testimonials Mock Database
const TESTIMONIALS = [
  {
    name: "مریم حسینی",
    province: "تهران",
    rating: 5,
    comment: "کیفیت پخت و عطر رقم دم‌سیاه واقعاً شگفت‌انگیز بود. دقیقاً همان عطر و طعم سنتی شمال که سال‌ها به دنبالش بودیم.",
    initials: "م"
  },
  {
    name: "علیرضا کریمی",
    province: "اصفهان",
    rating: 5,
    comment: "بسته‌بندی خلاقانه پارچه‌ای و ارسال بیمه‌شده اختصاصی نشان از احترام فوق‌العاده به مشتری دارد. برنج یکدست و بدون خرده دانه.",
    initials: "ع"
  },
  {
    name: "سارا احمدی",
    province: "شیراز",
    rating: 4.9,
    comment: "برنج کشت دوم طعم و عطر بی‌رقیبی دارد. خرید کاملاً مستقیم و بی‌واسطه از مزارع گیلان را با طلای شالیزار تجربه کردیم.",
    initials: "س"
  }
];

// Why Choose Us Mock database
const WHY_CHOOSE_US = [
  {
    icon: <Award className="w-8 h-8 text-accent stroke-1" />,
    title: "صددرصد ایرانی و خالص",
    desc: "برداشت شده مستقیماً از غنی‌ترین و مرغوب‌ترین اراضی کشاورزی استان‌های گیلان و مازندران بدون برنج ترکیبی."
  },
  {
    icon: <Zap className="w-8 h-8 text-accent stroke-1" />,
    title: "ارسال اختصاصی بیمه‌شده",
    desc: "ارسال سریع و بهداشتی در سراسر کشور با بسته‌بندی مقاوم ضد رطوبت جهت حفظ عطر ناب شالیزار."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-accent stroke-1" />,
    title: "تضمین اصالت و بازگشت وجه",
    desc: "تضمین عودت وجه در صورت عدم رضایت از تست عطر، طعم، یا یکدستی محصول بعد از بازگشایی کیسه."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-accent stroke-1" />,
    title: "کشت ارگانیک سلامت‌محور",
    desc: "کشت سنتی و تحت نظارت دقیق جهت کنترل بهداشت کود و سموم، مناسب برای سبک زندگی سلامت جامعه ایرانی."
  },
  {
    icon: <Users className="w-8 h-8 text-accent stroke-1" />,
    title: "پشتیبانی ۲۴ ساعته طلایی",
    desc: "پاسخ‌گویی دلسوزانه و مشاوره تخصصی پخت و پز برنج ممتاز توسط مربیان آشپزی مجموعه شالیزار شمال."
  }
];

// Premium Categories Mock database
const CATEGORIES = [
  { name: "هاشمی", count: "۳ محصول ویژه", region: "آستانه اشرفیه", desc: "خوش‌پخت‌ترین و پرطرفدارترین رقم شمال" },
  { name: "صدری", count: "۲ محصول مجلل", region: "صومعه‌سرا", desc: "دانه فوق بلند قلمی مخصوص ضیافت‌های لوکس" },
  { name: "طارم", count: "۲ محصول معطر", region: "فریدونکنار", desc: "قدیمی‌ترین و اصیل‌ترین رقم خوش‌عطر مازندران" },
  { name: "دم‌سیاه", count: "۱ محصول شاهانه", region: "کیاشهر", desc: "سنگین‌ترین عطر و چربی کره‌ای ماندگار دانه" },
  { name: "فجر", count: "پیش‌فروش فصل", region: "گرگان", desc: "برنج یکدست با قیمت فوق‌العاده به‌صرفه و معطر" },
  { name: "شیرودی", count: "پیش‌فروش فصل", region: "تالش", desc: "مقاوم‌ترین دانه در برابر تغییر رطوبت و خوش‌پخت" }
];

// Standard custom icon mockup for BookOpen fallback
function BookOpen({ className }: { className?: string }) {
  return <div className={className}>📖</div>;
}

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "طلای شالیزار - فروشگاه برنج لوکس ایرانی",
    "image": "https://rice-shop.ir/images/og-main.jpg",
    "description": "تجربه خرید مستقیم مرغوب‌ترین برنج‌های هاشمی، صدری، دم‌سیاه و طارم معطر گیلان و مازندران.",
    "telephone": "01333445566",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "بلوار منظریه، ساختمان شالیزار",
      "addressLocality": "رشت",
      "addressRegion": "گیلان",
      "addressCountry": "IR"
    },
    "priceRange": "$$$"
  };

  return (
    <MainLayout>
      {/* Structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* SECTION 1: Cinematic Floating Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 py-20 text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#2F5D50]/20 via-background to-background dark:from-[#0E1412] dark:via-[#111A16]/90 dark:to-[#0E1412]" />
          <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-[#C8A75D]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-5000" />
          <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-[#2F5D50]/15 rounded-full blur-[140px] mix-blend-screen animate-pulse duration-7000" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-8 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="accent" className="gap-2 px-4 py-2 bg-accent/10 text-accent border border-accent/30 text-sm">
              <Sparkles className="w-4 h-4 text-accent fill-accent" />
              ارگانیک‌ترین برداشت شالیزارهای شمال ایران - ۱۴۰۳
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="flex flex-col gap-4 text-center"
          >
            <Typography
              variant="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary dark:text-accent font-serif leading-tight max-w-4xl"
            >
              عطر شالیزار، <br />
              <span className="text-foreground dark:text-white font-medium">در طعم بی تکرار اصالت</span>
            </Typography>

            <Typography
              variant="serif-subtitle"
              className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed mt-4"
            >
              خرید مستقیم و شناسنامه‌دار برنج ممتاز از کشاورزان نمونه آستانه اشرفیه و فریدونکنار با بسته‌بندی نفیس و گارانتی طلایی پخت.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center items-center mt-6"
          >
            <Link href="/products">
              <Button variant="accent" size="lg" className="shadow-lg hover:scale-105 active:scale-97">
                مشاهده محصولات
              </Button>
            </Link>
            <a href="#editorial-story">
              <Button variant="outline" size="lg" className="border-primary/20 dark:border-accent/20 hover:bg-muted/10">
                درباره ما
              </Button>
            </a>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mt-12 hidden md:flex flex-col items-center gap-2 text-muted-foreground text-xs font-light cursor-pointer"
            onClick={() => {
              document.getElementById("featured-collection")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>کاشف طلای سبز شمال باشید</span>
            <ArrowDown className="w-4 h-4 text-accent" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Featured Rice Collection (8 products) */}
      <section id="featured-collection" className="max-w-7xl mx-auto w-full px-4 md:px-8 py-24 border-t border-border/20">
        <div className="flex flex-col gap-2 text-right mb-16">
          <Badge variant="primary" className="w-fit self-end gap-1 px-3 py-1 bg-primary/10 text-primary">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            مرغوب‌ترین‌های فصل برداشت جدید
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2">
            مجموعه ارقام سلطنتی و دست‌چین
          </Typography>
          <Typography variant="body" className="max-w-xl text-muted-foreground mt-2 leading-relaxed">
            محصولات ما مستقیماً پس از کارشناسی کیفیت عطر و میزان قد کشیدگی آزمایشگاهی، در خلاق‌ترین کیسه‌های کادویی پارچه‌ای بسته‌بندی و تحویل می‌گردند.
          </Typography>
        </div>

        {/* 8 Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((prod) => {
            const finalPrice = prod.discountPercent ? prod.price * (1 - prod.discountPercent / 100) : prod.price;
            const formattedPrice = finalPrice.toLocaleString("fa-IR") + " تومان";
            return (
              <Card key={prod.id} variant="glass-premium" className="flex flex-col h-full text-right hover:shadow-2xl transition-all duration-500">
                <div className="relative h-56 bg-gradient-to-b from-[#2F5D50]/10 to-transparent flex items-center justify-center border-b border-border/20 overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/2 group-hover:scale-105 transition-transform duration-700" />

                  <div className="z-10 w-20 h-24 rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/40 flex flex-col items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-700">
                    <span className="text-primary dark:text-accent font-serif text-xl font-bold">{prod.imageChar}</span>
                    <span className="text-[8px] text-muted-foreground mt-0.5 font-light">۱۰۰٪ اصل</span>
                  </div>

                  {prod.discountPercent && (
                    <Badge variant="accent" className="absolute top-4 right-4 text-[9px] font-bold">
                      تخفیف ویژه
                    </Badge>
                  )}

                  <Badge variant={prod.inStock ? "success" : "warning"} className="absolute top-4 left-4 text-[9px] font-medium">
                    {prod.inStock ? "موجود" : "پیش‌فروش"}
                  </Badge>

                  <div className="absolute bottom-3 right-4 flex items-center gap-1 px-2 py-0.5 rounded-md glass text-[10px] font-semibold">
                    <span>{prod.rating.toLocaleString("fa-IR")}</span>
                    <Star className="w-3 h-3 text-accent fill-accent" />
                  </div>
                </div>

                <CardHeader className="p-5 pb-2">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-accent" />
                    {prod.province}، {prod.region}
                  </span>
                  <Typography variant="h3" className="text-lg font-bold text-primary dark:text-foreground mt-1 line-clamp-1">
                    {prod.name}
                  </Typography>
                </CardHeader>

                <CardBody className="p-5 py-2 flex-grow">
                  <Typography variant="body-sm" className="text-muted-foreground leading-relaxed text-xs line-clamp-2">
                    {prod.summary}
                  </Typography>
                </CardBody>

                <CardFooter className="p-5 pt-3 flex flex-col gap-3 border-t border-border/20">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] text-muted-foreground font-light">بسته‌بندی {prod.weight}</span>
                    <span className="text-sm font-bold text-primary dark:text-accent">{formattedPrice}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProduct(prod)}
                      className="py-2 text-[11px] text-foreground font-semibold flex items-center justify-center gap-1 border-border/50 hover:bg-muted/10 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      پیش‌نمایش
                    </Button>
                    <Link href={`/products/${prod.slug}`} className="w-full">
                      <Button variant="accent" size="sm" className="py-2 text-[11px] font-bold w-full flex items-center justify-center">
                        جزئیات رقم
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Why Choose Us */}
      <section className="bg-primary/5 dark:bg-[#070b09] py-24 w-full border-t border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-2 text-center mb-16">
            <Badge variant="accent" className="w-fit mx-auto gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              تعهدات طلایی شالیزار به سفره شما
            </Badge>
            <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2">
              چرا برنج ما متمایز است؟
            </Typography>
            <Typography variant="body" className="max-w-xl mx-auto text-muted-foreground mt-2 leading-relaxed">
              کیفیت فقط یک ادعا نیست، بلکه فلسفه نسلی ماست. ما هر دانه برنج را به عنوان سفیر فرهنگ و تمدن ایرانی بوجار می‌کنیم.
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-right">
            {WHY_CHOOSE_US.map((item, idx) => (
              <Glass key={idx} intensity="high" rounded="lg" className="p-6 flex flex-col gap-3 justify-between hover:-translate-y-1.5 transition-transform duration-500">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                  {item.icon}
                </div>
                <Typography variant="h4" className="font-bold text-primary dark:text-accent">
                  {item.title}
                </Typography>
                <Typography variant="body-sm" className="text-muted-foreground text-xs leading-relaxed">
                  {item.desc}
                </Typography>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Categories */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-24">
        <div className="flex flex-col gap-2 text-right mb-16">
          <Badge variant="primary" className="w-fit self-end gap-1 px-3 py-1 bg-primary/10 text-primary">
            <Layers className="w-3.5 h-3.5" />
            تفکیک ارقام ممتاز
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2">
            دسته‌بندی تخصصی ارقام سنتی
          </Typography>
          <Typography variant="body" className="max-w-xl text-muted-foreground mt-2 leading-relaxed">
            برنج‌های سنتی شمال ایران را بر اساس تنوع عطر، ضخامت، قد و بافت کره‌ای در دسته‌بندی‌های اصیل شناسایی کنید.
          </Typography>
        </div>

        {/* Categories cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 text-right">
          {CATEGORIES.map((cat, idx) => (
            <Link key={idx} href="/products" className="group">
              <Glass rounded="lg" className="p-6 flex flex-col justify-between h-48 border border-border/40 hover:border-accent hover:shadow-xl transition-all duration-500">
                <div className="flex flex-col gap-1">
                  <Badge variant="accent" className="w-fit text-[10px]">{cat.count}</Badge>
                  <Typography variant="h3" className="text-xl font-bold text-primary group-hover:text-accent dark:text-foreground mt-3 transition-colors">
                    رقم {cat.name}
                  </Typography>
                  <Typography variant="body-sm" className="text-muted-foreground text-[11px] leading-relaxed mt-1 font-light">
                    {cat.desc}
                  </Typography>
                </div>
                <span className="text-[10px] text-muted-foreground/60 font-light mt-4">خاستگاه: {cat.region}</span>
              </Glass>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 5: Editorial Story Section */}
      <section id="editorial-story" className="max-w-7xl mx-auto w-full px-4 md:px-8 py-24 border-t border-border/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Large artistic illustration column */}
          <div className="lg:col-span-5 relative h-[380px] md:h-[450px] rounded-3xl bg-gradient-to-br from-[#2F5D50]/15 via-background to-background dark:from-[#0E1412] dark:via-[#111A16]/90 dark:to-[#0E1412] flex items-center justify-center border border-border/40 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#C8A75D]/10 rounded-full blur-[90px]" />
            <div className="z-10 text-center flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-white/45 dark:bg-black/30 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg">
                <span className="text-primary dark:text-accent font-serif text-3xl font-extrabold">م</span>
              </div>
              <span className="text-xs text-accent font-semibold tracking-wider">مزارع نمونه گیلان</span>
              <Typography variant="serif-subtitle" className="text-sm font-light text-muted-foreground max-w-xs px-4">
                «کشاورزی با شرافت، بسته‌بندی با نجابت»
              </Typography>
            </div>
          </div>

          {/* Elegant Text Story Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-right">
            <div className="flex flex-col gap-2">
              <Badge variant="accent" className="w-fit self-end gap-1">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                میراث مزارع سرسبز گیلان و مازندران
              </Badge>
              <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2">
                داستان شرافت، خشت و شالیزار
              </Typography>
            </div>

            <Typography variant="body" className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">
              سال‌هاست که در دشت‌های بکر شمال ایران، خانواده‌های کشاورز نمونه ما با عشق، آفتاب و آب شیرین رودخانه‌های پربرکت، دانه طلایی برنج را پرورش می‌دهند. طلای شالیزار، با هدف حذف دلالان و انتقال مستقیم مرغوب‌ترین و یکدست‌ترین برنج‌های ارگانیک سنتی تاسیس گردید.
            </Typography>

            <Typography variant="body" className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">
              روند بوجاری و بهینه‌سازی دانه در کارخانه طلای شالیزار با ۳ مرحله فیلتر بوجار لوکس و کنترل رطوبت هوشمند صورت می‌پذیرد تا برنج تا زمان بازگشایی در خانه شما، تمام عطر طبیعی، چربی کره‌ای ماندگار و سفیدی درخشان خود را بدون کوچک‌ترین خرده حفظ نماید.
            </Typography>

            <div className="flex items-center gap-4 mt-4 justify-start">
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-primary dark:text-accent">حاج حسین هاشمی</span>
                <span className="text-[11px] text-muted-foreground">سرپرست تعاونی مزارع نمونه آستانه اشرفیه</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-primary text-xs font-serif">ح</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: Customer Testimonials */}
      <section className="bg-primary/5 dark:bg-[#070b09] py-24 w-full border-t border-b border-border/20 text-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-2 text-center mb-16">
            <Badge variant="accent" className="w-fit mx-auto gap-1">
              <Users className="w-3.5 h-3.5 text-accent" />
              رضایت قلبی خانواده‌های وفادار ایرانی
            </Badge>
            <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2">
              دیدگاه مشتریان متمایز ما
            </Typography>
            <Typography variant="body" className="max-w-xl mx-auto text-muted-foreground mt-2 leading-relaxed">
              صدای گرم خانواده‌هایی که سفره خود را با عطر برنج طلای شالیزار پیوند زده‌اند، بزرگ‌ترین سرمایه کشاورزان ماست.
            </Typography>
          </div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            {TESTIMONIALS.map((item, idx) => (
              <Card key={idx} variant="default" className="p-8 flex flex-col gap-5 justify-between hover:shadow-xl transition-all duration-500 border border-border/40">
                <div className="flex items-center gap-1.5 justify-start text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent stroke-none" />
                  ))}
                </div>

                <Typography variant="body-sm" className="text-muted-foreground leading-relaxed text-sm">
                  « {item.comment} »
                </Typography>

                <div className="flex items-center gap-3 justify-start border-t border-border/20 pt-4 mt-2">
                  <div className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-bold">
                    {item.initials}
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-foreground">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground font-light">اصفهان / استان {item.province}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Newsletter */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-24 text-center flex flex-col items-center">
        <Glass intensity="high" rounded="lg" className="p-10 md:p-16 max-w-4xl w-full border border-border/30 shadow-xl text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-2">
            <Mail className="w-8 h-8 stroke-1" />
          </div>
          <Typography variant="serif-title" className="text-3xl md:text-4xl font-bold">
            مشترک خبرنامه طلایی شالیزار شوید
          </Typography>
          <Typography variant="body" className="max-w-xl text-muted-foreground leading-relaxed font-light text-sm">
            زمان برداشت برنج‌های نوبرانه، کدهای تخفیف اختصاصی فصلی و جشنواره‌های برداشت مزارع را مستقیماً در ایمیل خود دریافت کنید.
          </Typography>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mt-4">
            <Input
              placeholder="نشانی ایمیل شما (مثال: email@domain.com)"
              className="px-6 py-3.5 rounded-full text-xs text-center border-border/60 w-full"
            />
            <Button variant="accent" className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold whitespace-nowrap">
              عضویت طلایی
            </Button>
          </div>
        </Glass>
      </section>

      {/* SECTION 8: Instagram / Social Preview */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 border-t border-border/20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 text-right gap-4">
          <div className="flex flex-col gap-2">
            <Badge variant="accent" className="w-fit self-end gap-1">
              <Instagram className="w-3.5 h-3.5 text-accent" />
              در شالیزارهای ما گردش کنید
            </Badge>
            <Typography variant="serif-title" className="text-2xl md:text-3xl font-bold mt-1">
              آلبوم زندگی روستایی طلای شالیزار (@Shalizar_Gold)
            </Typography>
          </div>
          <div>
            <Button variant="outline" className="border-border text-foreground hover:border-accent text-xs">
              پیوستن به اینستاگرام ما
            </Button>
          </div>
        </div>

        {/* Gallery placeholders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Glass key={idx} rounded="lg" className="relative h-64 overflow-hidden group border border-border/30 hover:border-accent transition-all duration-500">
              <div className="absolute inset-0 bg-primary/5 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/40 dark:bg-black/35 backdrop-blur-md flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5 stroke-1.5" />
                </div>
              </div>
              <span className="absolute bottom-4 right-4 text-[10px] text-muted-foreground font-light">مزارع آستانه اشرفیه • ۱۴۰۳</span>
            </Glass>
          ))}
        </div>
      </section>

      {/* SECTION 9: Final CTA */}
      <section className="bg-gradient-to-tr from-[#2F5D50]/15 to-transparent dark:from-[#0E1412] dark:to-transparent py-24 w-full border-t border-border/20 text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">
          <Typography variant="serif-title" className="text-3xl md:text-5xl font-extrabold leading-tight">
            طعمی به یاد ماندنی، شایسته سفره‌های مجلل شما
          </Typography>
          <Typography variant="body" className="max-w-xl text-muted-foreground leading-relaxed text-sm md:text-base font-light">
            بسته‌ای دست‌چین، ارگانیک، و عاری از هرگونه برنج ناخالص را مستقیم از شالیزار پدری به آشپزخانه خود منتقل کنید.
          </Typography>
          <div className="mt-4">
            <Link href="/products">
              <Button variant="accent" size="lg" className="font-bold shadow-xl hover:scale-105 active:scale-97">
                مشاهده تمامی محصولات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK VIEW DYNAMIC MODAL */}
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </MainLayout>
  );
}
export const dynamic = "force-dynamic";
