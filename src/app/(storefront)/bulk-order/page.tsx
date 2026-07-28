"use client";

import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Glass } from "@/components/ui/Glass";
import { ShoppingBag, PhoneCall, CheckCircle, Scale, ShieldCheck } from "lucide-react";

export default function BulkOrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    quantity: "",
    description: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const iranianMobileRegex = /^09\d{9}$/;

    if (!formData.name.trim() || !formData.phone.trim() || !formData.quantity.trim()) {
      setError("لطفاً تمامی فیلدهای ستاره‌دار (نام و نام خانوادگی، شماره همراه، و میزان مورد نیاز) را تکمیل بفرمایید.");
      return;
    }

    if (!iranianMobileRegex.test(formData.phone.trim())) {
      setError("شماره همراه معتبر نیست. شماره همراه باید با ۰۹ شروع شده و ۱۱ رقم باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹).");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-16 text-right">
        {/* Banner Title */}
        <div className="flex flex-col gap-2 mb-12 text-right items-start md:items-end">
          <Badge variant="accent" className="w-fit gap-1.5 px-3 py-1 bg-accent/10 text-accent font-semibold">
            <Scale className="w-4 h-4 text-accent" />
            تامین کننده مستقیم و بدون واسطه برنج شمال
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
            سامانه ثبت درخواست خرید عمده طلای شالیزار
          </Typography>
          <Typography variant="body" className="max-w-2xl text-muted-foreground mt-2 leading-relaxed">
            شرکت طلای شالیزار با بهره‌گیری از ظرفیت تعاونی‌های کشت گیلان و مازندران، آماده تامین برنج‌های یکدست و شناسنامه‌دار برای سازمان‌ها، هتل‌ها، رستوران‌ها و بازرگانان محترم با گارانتی کتبی پخت و آنالیز آزمایشگاهی است.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Side Block */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-last lg:order-first">
            <Card variant="glass-premium" className="p-6 flex flex-col gap-4">
              <Typography variant="h3" className="text-lg font-bold text-primary dark:text-accent">مزایای خرید عمده و سازمانی</Typography>

              <div className="flex flex-col gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">تضمین ۱۰۰٪ یکدستی و خلوص</span>
                    <span className="text-xs mt-1">ارائه نمونه دقیق پیش از ارسال بار عمده و تطابق کامل بار با نمونه ارسالی.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">بسته‌بندی سفارشی سازمانی</span>
                    <span className="text-xs mt-1">امکان چاپ لوگوی سازمان شما روی کیسه‌های متقال و پارچه‌ای ضد رطوبت ممتاز.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">مشاوره تخصصی و پشتیبانی ۲۴ ساعته</span>
                    <span className="text-xs mt-1">پاسخگویی سریع کارشناسان فروش عمده و بوجاری مرکزی شمال.</span>
                  </div>
                </div>
              </div>

              <hr className="border-border/30 my-2" />

              <div className="bg-primary/5 p-4 rounded-2xl border border-border/30 text-xs">
                <span className="font-bold text-primary dark:text-accent block mb-1">ارتباط مستقیم با واحد فروش عمده:</span>
                <span className="text-muted-foreground block mt-1">تلفن دفتر مرکزی: ۰۱۳-۳۳۴۴۵۵۶۶</span>
                <span className="text-muted-foreground block mt-0.5">همراه کارشناس: ۰۹۱۲۳۴۵۶۷۸۹</span>
              </div>
            </Card>
          </div>

          {/* Form Block */}
          <div className="lg:col-span-7">
            <Glass rounded="lg" className="p-8 border border-border/40">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <Typography variant="h3" className="text-2xl font-bold mb-3">درخواست شما با موفقیت ثبت گردید</Typography>
                  <Typography variant="body-sm" className="text-muted-foreground max-w-md leading-relaxed">
                    کارشناسان ارشد واحد تامین عمده طلای شالیزار حداکثر ظرف مدت ۲ ساعت کاری با شماره همراه <strong className="text-foreground">{formData.phone}</strong> جهت هماهنگی، ارسال پیش‌فاکتور و ارسال نمونه رایگان تماس حاصل خواهند کرد.
                  </Typography>
                  <Button variant="accent" className="mt-8 px-8" onClick={() => { setSubmitted(false); setFormData({ name: "", phone: "", quantity: "", description: "" }); }}>
                    ثبت درخواست جدید خرید عمده
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <Typography variant="h3" className="text-xl font-bold text-primary dark:text-accent border-b border-border/30 pb-3">ثبت اطلاعات متقاضی عمده</Typography>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-xl text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="نام و نام خانوادگی / نام سازمان *"
                      placeholder="مثال: رستوران البرز / شرکت بهمن"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="شماره تلفن همراه *"
                      placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <Input
                    label="میزان تناژ / وزن مورد نیاز (کیلوگرم) *"
                    placeholder="مثال: ۵۰۰ کیلوگرم یا ۲ تن"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />

                  <div className="flex flex-col gap-1.5 text-right w-full">
                    <label className="text-xs font-medium text-foreground/80">توضیحات تکمیلی یا ارقام مد نظر</label>
                    <textarea
                      placeholder="لطفاً مشخصات یا شرایط خاص پرداخت و تحویل خود را در این بخش بنویسید..."
                      className="w-full h-32 px-4 py-3 rounded-2xl text-xs text-right border border-border/60 bg-background/50 focus:border-ring focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="accent" type="submit" className="w-full md:w-auto px-8 font-bold">
                      ثبت و ارسال درخواست مشاوره خرید
                    </Button>
                  </div>
                </form>
              )}
            </Glass>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
