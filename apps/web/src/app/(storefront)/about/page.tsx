"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Glass } from "@/components/ui/Glass";
import { Card } from "@/components/ui/Card";
import { Award, Users, Heart, MapPin, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-16 text-right">
        {/* Page Header */}
        <div className="flex flex-col gap-2 mb-12 text-right items-start md:items-end">
          <Badge variant="accent" className="w-fit gap-1.5 px-3 py-1 bg-accent/10 text-accent font-semibold">
            <Award className="w-4 h-4 text-accent" />
            درباره مسیر کار ما
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
            درباره طلای شالیزار
          </Typography>
          <Typography variant="body" className="max-w-2xl text-muted-foreground mt-2 leading-relaxed">
            هدف طلای شالیزار عرضه برنج گیلان و مازندران با اطلاعات روشن و قابل‌فهم است؛ از نوع برنج و محل کشت تا سال برداشت و وزن بسته.
          </Typography>
        </div>

        {/* History Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2F5D50]/10 to-accent/10 rounded-3xl blur-2xl" />
            <Glass intensity="high" rounded="lg" className="p-8 border border-border/40 relative z-10 flex flex-col gap-4">
              <span className="text-accent text-xs font-bold tracking-widest uppercase">انتخاب و عرضه برنج شمال</span>
              <Typography variant="h3" className="text-2xl font-bold text-primary dark:text-accent">از گیلان و مازندران تا سفره شما</Typography>
              <Typography variant="body-sm" className="text-muted-foreground leading-relaxed mt-2">
                تمرکز ما بر انتخاب برنج‌های شناخته‌شده شمال مانند هاشمی، طارم، صدری، دم‌سیاه، فجر و شیرودی است. مشخصات هر محصول پیش از خرید در همان صفحه نوشته می‌شود.
              </Typography>
              <Typography variant="body-sm" className="text-muted-foreground leading-relaxed">
                تلاش می‌کنیم توضیحات محصول ساده و دقیق باشد تا بتوانید بر اساس نوع برنج، محل کشت، وزن و بودجه خود انتخاب کنید.
              </Typography>
            </Glass>
          </div>
          <div className="flex flex-col gap-6 justify-center">
            <Typography variant="h2" className="text-3xl font-bold leading-tight">چیزی که برای ما مهم است</Typography>
            <Typography variant="body" className="text-muted-foreground leading-relaxed">
              اطلاعات درست، انتخاب آسان و پاسخ‌گویی پس از خرید، سه اصل اصلی ما در فروش برنج هستند.
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Card variant="glass" className="p-5 flex items-start gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm block">مشخصات روشن</span>
                  <span className="text-xs text-muted-foreground mt-1 block">نوع برنج، محل کشت، سال برداشت و وزن بسته مشخص است.</span>
                </div>
              </Card>

              <Card variant="glass" className="p-5 flex items-start gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm block">توضیحات قابل‌فهم</span>
                  <span className="text-xs text-muted-foreground mt-1 block">ویژگی هر محصول را بدون اصطلاحات پیچیده توضیح می‌دهیم.</span>
                </div>
              </Card>

              <Card variant="glass" className="p-5 flex items-start gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm block">قیمت شفاف</span>
                  <span className="text-xs text-muted-foreground mt-1 block">وزن، قیمت و تخفیف هر بسته پیش از ثبت سفارش نمایش داده می‌شود.</span>
                </div>
              </Card>

              <Card variant="glass" className="p-5 flex items-start gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm block">پاسخ‌گویی پس از خرید</span>
                  <span className="text-xs text-muted-foreground mt-1 block">اگر درباره سفارش یا کیفیت پخت پرسشی داشتید، موضوع را پیگیری می‌کنیم.</span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Brand visual showcase section */}
        <div className="w-full bg-primary/5 dark:bg-[#141D19]/40 border border-primary/10 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-extrabold text-accent">گیلان و مازندران</span>
            <span className="text-sm font-semibold text-foreground mt-2">محل کشت محصولات</span>
            <span className="text-xs text-muted-foreground mt-1">نام شهر در مشخصات هر محصول درج شده است</span>
          </div>
          <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-border/30 py-6 md:py-0">
            <span className="text-2xl md:text-3xl font-extrabold text-accent">۶ نوع برنج</span>
            <span className="text-sm font-semibold text-foreground mt-2">برای مصرف روزانه و مهمانی</span>
            <span className="text-xs text-muted-foreground mt-1">از هاشمی و طارم تا فجر و شیرودی</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-extrabold text-accent">۵ و ۱۰ کیلوگرم</span>
            <span className="text-sm font-semibold text-foreground mt-2">وزن‌های متناسب با مصرف</span>
            <span className="text-xs text-muted-foreground mt-1">وزن‌های موجود در صفحه هر محصول دیده می‌شود</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
