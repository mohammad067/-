"use client";

import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/features/product-catalog/components/ProductCard";
import { MOCK_PRODUCTS } from "@/features/product-catalog/data/products";
import { Award, ShieldCheck, Sparkles, Zap, Instagram, MapPin } from "lucide-react";

const WHY = [
  { icon: Award, title: "فقط برنج شمال", desc: "هاشمی، طارم، صدری و دم‌سیاه از گیلان و مازندران." },
  { icon: Zap, title: "ارسال با وزن", desc: "کرایه بر اساس کیلو و شهر حساب می‌شود." },
  { icon: ShieldCheck, title: "ضمانت پخت", desc: "اگر از عطر یا پخت راضی نبودید پیگیری می‌کنیم." },
  { icon: Sparkles, title: "شناسنامه مبدأ", desc: "رقم، منطقه و سال برداشت روی هر کیسه مشخص است." },
];

const VARIETIES = [
  { name: "هاشمی", region: "آستانه اشرفیه" },
  { name: "طارم", region: "فریدونکنار" },
  { name: "دم‌سیاه", region: "کیاشهر" },
  { name: "صدری", region: "رودسر" },
  { name: "فجر", region: "رشت" },
  { name: "شیرودی", region: "تالش" },
];

const FIELD_SHOTS = [
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80", caption: "شالیزار آستانه • ۱۴۰۴" },
  { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80", caption: "برداشت فریدونکنار" },
  { src: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80", caption: "دانه هاشمی گیلان" },
  { src: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80", caption: "برنج قهوه‌ای همان رقم" },
];

export default function HomePage() {
  return (
    <MainLayout>
      <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden px-4 py-20 text-center">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.avif" alt="شالیزار شمال ایران" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-5">
          <Badge variant="primary" className="px-4 py-2 bg-white/90 text-primary">برداشت گیلان و مازندران — ۱۴۰۴</Badge>
          <Typography variant="h1" className="text-4xl md:text-6xl font-bold text-white leading-tight">
            عطر شالیزار
          </Typography>
          <p className="text-slate-100 text-base md:text-lg max-w-xl">
            برنج شمال با رقم و مبدأ مشخص. از آستانه اشرفیه و فریدونکنار تا سفره.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products"><Button variant="primary" size="lg">مشاهده محصولات</Button></Link>
            <a href="#story"><Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10">از کجا می‌آید</Button></a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-end gap-2">
          {VARIETIES.map((v) => (
            <Link key={v.name} href={`/products?variety=${encodeURIComponent(v.name)}`} className="rounded-full bg-white border border-[#E5E2DA] px-4 py-2 text-sm hover:border-primary">
              {v.name} • {v.region}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <Link href="/products" className="text-sm text-primary">همه ارقام</Link>
          <Typography variant="serif-title" className="text-3xl font-bold text-right">ارقام امسال</Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      <section className="bg-[#F3EEE4] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Typography variant="serif-title" className="text-3xl font-bold text-center mb-3">چرا از شمال می‌خرید؟</Typography>
          <p className="text-center text-muted-foreground mb-10">بدون مخلوط، بدون شعار ارگانیک بی‌مدرک.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((item) => (
              <Card key={item.title} className="p-6 text-right bg-white">
                <item.icon className="w-7 h-7 text-primary mb-3" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="h-72 rounded-3xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" alt="شالیزار گیلان" className="w-full h-full object-cover" />
        </div>
        <div className="text-right space-y-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
            <MapPin className="w-3 h-3" /> آستانه اشرفیه
          </p>
          <Typography variant="serif-title" className="text-3xl font-bold">از شالیزار تا کیسه</Typography>
          <p className="text-muted-foreground text-sm leading-relaxed">
            برنج را از گیلان و مازندران می‌آوریم. واسطه کم است تا سال برداشت و رقم روشن بماند.
            ارگانیک یا آزمایشگاه را فقط وقتی مدرک باشد می‌نویسیم.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-6 gap-4 text-right">
          <a href="https://www.instagram.com/Shalizar_Gold/" target="_blank" rel="noreferrer" className="text-sm flex items-center gap-2 text-primary">
            <Instagram className="w-4 h-4" /> @Shalizar_Gold
          </a>
          <Typography variant="serif-title" className="text-2xl font-bold">شالیزار را ببینید</Typography>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FIELD_SHOTS.map((shot) => (
            <a key={shot.caption} href="https://www.instagram.com/Shalizar_Gold/" target="_blank" rel="noreferrer" className="relative h-52 rounded-2xl overflow-hidden group">
              <img src={shot.src} alt={shot.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <span className="absolute bottom-0 inset-x-0 bg-[#F8F6F2]/92 text-[#1E2522] text-[11px] px-3 py-2 text-right">
                {shot.caption}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-[#F3EEE4] py-14 text-center">
        <Typography variant="serif-title" className="text-3xl font-bold mb-3">برنج شمال، برای سفره هر روز</Typography>
        <p className="text-muted-foreground text-sm mb-6">کیسه را با رقم و وزن مشخص انتخاب کنید.</p>
        <Link href="/products"><Button variant="primary" size="lg">ورود به فروشگاه</Button></Link>
      </section>
    </MainLayout>
  );
}
