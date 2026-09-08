"use client";

import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PRODUCTS } from "@/features/product-catalog/data/products";
import { Award, ShieldCheck, Sparkles, Zap, MapPin, Instagram } from "lucide-react";

const WHY = [
  { icon: Award, title: "فقط برنج شمال", desc: "هاشمی، طارم، صدری و دم‌سیاه از گیلان و مازندران. مخلوط نداریم." },
  { icon: Zap, title: "ارسال با وزن", desc: "کرایه بر اساس کیلو و شهر حساب می‌شود." },
  { icon: ShieldCheck, title: "ضمانت پخت", desc: "اگر از عطر یا پخت راضی نبودید پیگیری می‌کنیم." },
  { icon: Sparkles, title: "شناسنامه مبدأ", desc: "رقم، منطقه و سال برداشت روی محصول مشخص است." },
];

export default function HomePage() {
  return (
    <MainLayout>
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-4 py-20 text-center">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.avif" alt="شالیزار شمال ایران" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <Badge variant="accent" className="px-4 py-2">برداشت شالیزار گیلان و مازندران — ۱۴۰۴</Badge>
          <Typography variant="h1" className="text-4xl md:text-6xl font-bold text-white leading-tight">
            عطر شالیزار،<br />برنج شمال با مبدأ مشخص
          </Typography>
          <Link href="/products">
            <Button variant="primary" size="lg">مشاهده محصولات</Button>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <Typography variant="serif-title" className="text-3xl font-bold text-right mb-8">ارقام برنج گیلان و مازندران</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((prod) => (
            <Link key={prod.id} href={`/products/${prod.slug}`}>
              <Card className="h-full text-right overflow-hidden bg-white border border-[#E5E2DA] hover:shadow-md">
                <div className="h-40 bg-[#EFE8DC]">
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {prod.province}، {prod.region}
                  </span>
                  <h3 className="mt-2 font-bold text-primary">{prod.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{prod.summary}</p>
                  <p className="text-sm font-bold mt-3 text-primary">{prod.price.toLocaleString("fa-IR")} تومان</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#F3EEE4] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Typography variant="serif-title" className="text-3xl font-bold text-center mb-3">چرا از شمال می‌خرید؟</Typography>
          <p className="text-center text-muted-foreground mb-10">سایت روشن است چون شالیزار روز است.</p>
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

      <section className="max-w-7xl mx-auto px-4 py-16 text-right">
        <div className="flex items-center justify-between mb-6 gap-4">
          <Typography variant="serif-title" className="text-2xl font-bold">شالیزار را در اینستاگرام ببینید</Typography>
          <a href="https://www.instagram.com/Shalizar_Gold/" target="_blank" rel="noreferrer" className="text-sm flex items-center gap-2">
            <Instagram className="w-4 h-4" /> @Shalizar_Gold
          </a>
        </div>
      </section>
    </MainLayout>
  );
}
