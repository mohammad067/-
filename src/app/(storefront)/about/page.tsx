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
            داستان یک نسل اصالت و کیفیت برتر
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
            درباره طلای شالیزار
          </Typography>
          <Typography variant="body" className="max-w-2xl text-muted-foreground mt-2 leading-relaxed">
            ما در طلای شالیزار باور داریم که برنج ایرانی، فراتر از یک وعده غذایی، نمادی از عطر، طعم و مهمان‌نوازی خانواده‌های ایرانی است. تعهد ما عرضه مستقیم بهترین ارقام برنج شمال بدون واسطه است.
          </Typography>
        </div>

        {/* History Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2F5D50]/10 to-accent/10 rounded-3xl blur-2xl" />
            <Glass intensity="high" rounded="lg" className="p-8 border border-border/40 relative z-10 flex flex-col gap-4">
              <span className="text-accent text-xs font-bold tracking-widest uppercase">تاسیس و ریشه خانوادگی</span>
              <Typography variant="h3" className="text-2xl font-bold text-primary dark:text-accent">میراثی از دل شالیزارهای آستانه اشرفیه</Typography>
              <Typography variant="body-sm" className="text-muted-foreground leading-relaxed mt-2">
                برند «طلای شالیزار» حاصل سال‌ها تجربه عملی و نسل به نسل در مزارع کشاورزی برنج گیلان است. شالیزارهای ما واقع در کناره‌های حاصلخیز سفیدرود، جایی که آمیزش آب شیرین کوهستان و خاک زرخیز جلگه، معطرترین و خوش‌پخت‌ترین خوشه‌های برنج دنیا را تولید می‌کند، آغاز شد.
              </Typography>
              <Typography variant="body-sm" className="text-muted-foreground leading-relaxed">
                امروز مفتخریم که با تلفیق سنت‌های بومی برداشت و مدرن‌ترین سامانه‌های سورتینگ و بوجاری چندمرحله‌ای، کیفیتی بی‌رقیب، خالص و ۱۰۰٪ یکدست را بدون هیچ‌گونه ناخالصی به مشتریان وفادارمان ارائه دهیم.
              </Typography>
            </Glass>
          </div>
          <div className="flex flex-col gap-6 justify-center">
            <Typography variant="h2" className="text-3xl font-bold leading-tight">ارزش‌های بنیادین ما</Typography>
            <Typography variant="body" className="text-muted-foreground leading-relaxed">
              ما در تمامی مراحل کاشت، داشت، برداشت و فرآوری، اصول اخلاقی و کیفی سخت‌گیرانه‌ای را دنبال می‌کنیم تا برنجی شایسته نام طلایی شالیزار به سفره‌های گرم شما برسد.
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Card variant="glass" className="p-5 flex items-start gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm block">۱۰۰٪ خالص و ارگانیک</span>
                  <span className="text-xs text-muted-foreground mt-1 block">تضمین عدم اختلاط برنج‌های پرمحصول با ارقام لوکس محلی.</span>
                </div>
              </Card>

              <Card variant="glass" className="p-5 flex items-start gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm block">سلامتی مصرف‌کننده</span>
                  <span className="text-xs text-muted-foreground mt-1 block">استفاده بهینه و حداقلی از سموم و کودهای شیمیایی جهت تولید سالم.</span>
                </div>
              </Card>

              <Card variant="glass" className="p-5 flex items-start gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm block">عدالت در معامله</span>
                  <span className="text-xs text-muted-foreground mt-1 block">حمایت از معیشت شالیکاران زحمتکش بومی گیلان و مازندران.</span>
                </div>
              </Card>

              <Card variant="glass" className="p-5 flex items-start gap-4 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm block">رضایت‌مندی بی قید و شرط</span>
                  <span className="text-xs text-muted-foreground mt-1 block">امکان مرجوع کردن محصول در صورت عدم رضایت از عطر یا پخت.</span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Brand visual showcase section */}
        <div className="w-full bg-primary/5 dark:bg-[#141D19]/40 border border-primary/10 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-extrabold text-accent">۱۵+</span>
            <span className="text-sm font-semibold text-foreground mt-2">سال تجربه و تخصص بومی</span>
            <span className="text-xs text-muted-foreground mt-1">تامین و بوجاری سنتی و صنعتی</span>
          </div>
          <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-border/30 py-6 md:py-0">
            <span className="text-4xl md:text-5xl font-extrabold text-accent">۱۰۰٪</span>
            <span className="text-sm font-semibold text-foreground mt-2">تضمین اصالت و پخت دانه</span>
            <span className="text-xs text-muted-foreground mt-1">گارانتی طلایی مرجوعی کتبی</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-extrabold text-accent">۱۰,۰۰۰+</span>
            <span className="text-sm font-semibold text-foreground mt-2">مشتری وفادار و سفره روشن</span>
            <span className="text-xs text-muted-foreground mt-1">در سراسر کلان‌شهرهای ایران</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
