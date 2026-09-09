"use client";

import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/features/product-catalog/components/ProductCard";
import { MOCK_PRODUCTS } from "@/features/product-catalog/data/products";
import { Award, ShieldCheck, Truck, Headphones, MapPin } from "lucide-react";

const CATEGORIES = [
  { name: "هاشمی", hint: "آستانه و لاهیجان", href: "/products?variety=هاشمی", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80" },
  { name: "طارم", hint: "فریدونکنار", href: "/products?variety=طارم", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80" },
  { name: "دم‌سیاه", hint: "کیاشهر", href: "/products?variety=دم‌سیاه", img: "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?auto=format&fit=crop&w=600&q=80" },
  { name: "صدری", hint: "رودسر", href: "/products?variety=صدری", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80" },
  { name: "فجر", hint: "رشت", href: "/products?variety=فجر", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80" },
  { name: "شیرودی", hint: "تالش", href: "/products?variety=شیرودی", img: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80" },
];

const TRUST = [
  { icon: Award, title: "مبدأ مشخص", desc: "رقم و سال برداشت روی کیسه" },
  { icon: ShieldCheck, title: "ضمانت پخت", desc: "اگر عطر رضایت نداد پیگیری می‌کنیم" },
  { icon: Truck, title: "ارسال بر اساس وزن", desc: "کرایه با کیلو و استان حساب می‌شود" },
  { icon: Headphones, title: "پیگیری سفارش", desc: "قبل از پرداخت آنلاین با شما هماهنگ می‌شویم" },
];

function SectionHead({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6" dir="rtl">
      <Typography variant="serif-title" className="text-xl md:text-3xl font-bold text-right">{title}</Typography>
      {href && linkLabel ? (
        <Link href={href} className="text-xs md:text-sm text-primary shrink-0">{linkLabel}</Link>
      ) : null}
    </div>
  );
}

function Rail({ title, href, products }: { title: string; href: string; products: typeof MOCK_PRODUCTS }) {
  if (products.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 md:py-12" dir="rtl">
      <SectionHead title={title} href={href} linkLabel="مشاهده همه" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const bestsellers = [...MOCK_PRODUCTS].filter((p) => p.inStock).sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
  const sale = MOCK_PRODUCTS.filter((p) => p.discountPercent && p.discountPercent > 0);
  const gilan = MOCK_PRODUCTS.filter((p) => p.province === "گیلان" && p.inStock);
  const mazandaran = MOCK_PRODUCTS.filter((p) => p.province === "مازندران");

  return (
    <MainLayout>
      <section className="relative min-h-[68vh] flex items-center justify-center overflow-hidden px-4 py-20 text-center">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.avif" alt="شالیزار شمال ایران" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-5">
          <Badge variant="primary" className="px-4 py-2 bg-white/90 text-primary">برداشت گیلان و مازندران — ۱۴۰۴</Badge>
          <Typography variant="h1" className="text-4xl md:text-6xl font-bold text-white leading-tight">عطر شالیزار</Typography>
          <p className="text-slate-100 text-base md:text-lg max-w-xl">برنج شمال با رقم و مبدأ مشخص. از آستانه اشرفیه و فریدونکنار تا سفره.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products"><Button variant="primary" size="lg">فروشگاه</Button></Link>
            <a href="#categories"><Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10">دسته‌بندی ارقام</Button></a>
          </div>
        </div>
      </section>

      <section id="categories" className="max-w-7xl mx-auto px-4 py-12" dir="rtl">
        <SectionHead title="دسته‌بندی ارقام" href="/products" linkLabel="همه محصولات" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link key={c.name} href={c.href} className="group rounded-2xl overflow-hidden border border-[#E5E2DA] bg-white text-right">
              <div className="h-24 md:h-28 overflow-hidden">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-2 md:p-3 text-right">
                <p className="font-bold text-sm">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.hint}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#F3EEE4] py-8" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {TRUST.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-3 md:p-4 text-right border border-[#E5E2DA]">
              <item.icon className="w-5 h-5 text-primary mb-2" />
              <p className="font-bold text-sm">{item.title}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Rail title="پرفروش‌ترین‌ها" href="/products" products={bestsellers} />
      <Rail title="فروش ویژه و تخفیف‌دار" href="/products" products={sale} />
      <Rail title="برنج گیلان" href="/products?province=گیلان" products={gilan} />
      <Rail title="برنج مازندران" href="/products?province=مازندران" products={mazandaran} />

      <section id="story" className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center" dir="rtl">
        <div className="text-right space-y-4 order-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-start"><MapPin className="w-3 h-3" /> آستانه اشرفیه</p>
          <Typography variant="serif-title" className="text-3xl font-bold">از شالیزار تا کیسه</Typography>
          <p className="text-muted-foreground text-sm leading-relaxed">برنج را از گیلان و مازندران می‌آوریم. واسطه کم است تا سال برداشت و رقم روشن بماند.</p>
        </div>
        <div className="h-72 rounded-3xl overflow-hidden order-2">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" alt="شالیزار گیلان" className="w-full h-full object-cover" />
        </div>
      </section>
    </MainLayout>
  );
}
