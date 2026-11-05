"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BookOpen, Calendar, User, ArrowLeft } from "lucide-react";

const ARTICLES = [
  {
    title: "تفاوت برنج کشت اول و کشت دوم چیست؟",
    excerpt: "کشت اول و کشت دوم از نظر زمان برداشت، عطر، طعم، میزان پخت و قیمت تفاوت دارند. در این راهنما نکاتی را مرور می‌کنیم که پیش از خرید باید بدانید.",
    date: "۱۴۰۳/۰۴/۱۵",
    author: "تحریریه طلای شالیزار",
    category: "راهنمای خرید",
    readTime: "مطالعه ۵ دقیقه"
  },
  {
    title: "روش پخت مجلسی برنج دم‌سیاه",
    excerpt: "برای اینکه برنج دم‌سیاه خوب قد بکشد و دانه‌ها هنگام آبکش‌کردن نشکنند، مقدار آب، زمان خیساندن و زمان دم‌کشیدن اهمیت زیادی دارد.",
    date: "۱۴۰۳/۰۴/۰۲",
    author: "تحریریه طلای شالیزار",
    category: "آموزش پخت",
    readTime: "مطالعه ۷ دقیقه"
  },
  {
    title: "برنج هاشمی آستانه چه ویژگی‌هایی دارد؟",
    excerpt: "برنج هاشمی آستانه به عطر مطلوب، بافت نرم و پخت مناسب شناخته می‌شود. در این مطلب ویژگی‌ها و کاربرد آن برای مصرف روزانه و مهمانی را بررسی می‌کنیم.",
    date: "۱۴۰۳/۰۳/۱۸",
    author: "تحریریه طلای شالیزار",
    category: "شناخت انواع برنج",
    readTime: "مطالعه ۴ دقیقه"
  }
];

export default function BlogPage() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-16 text-right">
        {/* Page Header */}
        <div className="flex flex-col gap-2 mb-12 text-right items-start">
          <Badge variant="accent" className="w-fit gap-1.5 px-3 py-1 bg-accent/10 text-accent font-semibold">
            <BookOpen className="w-4 h-4 text-accent" />
            راهنمای خرید و پخت برنج
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
            وبلاگ طلای شالیزار
          </Typography>
          <Typography variant="body" className="max-w-2xl text-muted-foreground mt-2 leading-relaxed">
            راهنمای انتخاب برنج، تفاوت انواع برنج شمال، روش نگهداری و دستورهای پخت را اینجا بخوانید.
          </Typography>
        </div>

        {/* Articles Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article, idx) => (
            <Card key={idx} variant="glass-premium" className="flex flex-col h-full justify-between transition-all duration-300 hover:scale-103 hover:shadow-xl">
              <div>
                {/* Mock Image placeholder showing character initials for premium look */}
                <div className="h-48 w-full bg-primary/10 rounded-t-2xl flex items-center justify-center border-b border-border/20 relative overflow-hidden group">
                  <span className="text-primary/10 dark:text-accent/10 font-serif text-8xl font-black absolute select-none">
                    ش
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Badge variant="accent" className="absolute top-4 right-4 text-[10px] font-semibold px-2.5 py-1">
                    {article.category}
                  </Badge>
                </div>

                <div className="p-6">
                  {/* Article Metadata */}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3 justify-start">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-accent" />
                      {article.author}
                    </span>
                  </div>

                  {/* Title */}
                  <Typography variant="h4" className="font-bold text-base text-foreground mb-3 leading-snug line-clamp-2">
                    {article.title}
                  </Typography>

                  {/* Excerpt */}
                  <Typography variant="body-sm" className="text-muted-foreground text-xs leading-relaxed line-clamp-4">
                    {article.excerpt}
                  </Typography>
                </div>
              </div>

              {/* Read More link Footer */}
              <div className="px-6 pb-6 pt-3 flex justify-between items-center border-t border-border/10">
                <span className="text-[10px] text-muted-foreground font-light">{article.readTime}</span>
                <span className="flex items-center gap-1 text-accent hover:text-primary transition-colors text-xs font-bold cursor-pointer">
                  ادامه مطلب
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
