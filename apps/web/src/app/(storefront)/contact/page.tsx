"use client";

import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Glass } from "@/components/ui/Glass";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, CheckCircle, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message || (!formData.email && !formData.subject)) {
      setError("لطفاً اطلاعات ضروری (نام، موضوع و پیام) را وارد نمایید.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-16 text-right">
        {/* Page Header */}
        <div className="flex flex-col gap-2 mb-12 text-right items-start md:items-end">
          <Badge variant="accent" className="w-fit gap-1.5 px-3 py-1 bg-accent/10 text-accent font-semibold">
            <Send className="w-4 h-4 text-accent" />
            پاسخگوی گرم صدای شما هستیم
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
            تماس با طلای شالیزار
          </Typography>
          <Typography variant="body" className="max-w-2xl text-muted-foreground mt-2 leading-relaxed">
            کارشناسان و تیم پشتیبانی مشتریان طلای شالیزار همواره آماده شنیدن نظرات، پیشنهادات، انتقادات و پاسخگویی به سوالات شما درباره پخت و خرید ارقام برنج ممتاز شمال هستند.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Side Grid */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card variant="glass-premium" className="p-6 flex flex-col gap-6">
              <Typography variant="h3" className="text-lg font-bold text-primary dark:text-accent border-b border-border/30 pb-3">اطلاعات ارتباطی دفتر مرکزی</Typography>

              <div className="flex flex-col gap-5 text-sm">
                {/* Phone */}
                <div className="flex items-start gap-4 justify-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">تلفن‌های تماس مستقیم</span>
                    <span className="text-muted-foreground mt-1 text-xs leading-relaxed">۰۱۳-۳۳۴۴۵۵۶۶ (۱۰ خط فعال اداری)</span>
                    <span className="text-muted-foreground text-xs">۰۹۱۲۳۴۵۶۷۸۹ (پشتیبانی ۲۴ ساعته تلگرام و واتس‌اپ)</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 justify-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">مکاتبات الکترونیک</span>
                    <span className="text-muted-foreground mt-1 text-xs">info@talayeshalizar.ir</span>
                    <span className="text-muted-foreground text-xs">sale@talayeshalizar.ir (واحد فروش عمده)</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 justify-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">دفتر مرکزی و انبار اصلی</span>
                    <span className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      استان گیلان، رشت، بلوار دیلمان، مجتمع تجاری بهار، طبقه ۴، واحد ۴۰۲
                    </span>
                    <span className="text-muted-foreground text-xs leading-relaxed">
                      کارخانه بوجاری: گیلان، آستانه اشرفیه، جاده کیاشهر، شالیکوبی مرکزی طلای شالیزار
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-border/20" />

              <div className="bg-primary/5 p-4 rounded-xl text-xs leading-relaxed">
                <span className="font-bold text-primary dark:text-accent block mb-1">ساعات کاری اداری:</span>
                <span className="text-muted-foreground">شنبه تا چهارشنبه: ۸:۰۰ صبح الی ۱۷:۰۰ عصر</span>
                <br />
                <span className="text-muted-foreground">پنجشنبه‌ها: ۸:۰۰ صبح الی ۱۳:۰۰ ظهر</span>
              </div>
            </Card>
          </div>

          {/* Form Side Block */}
          <div className="lg:col-span-7">
            <Glass rounded="lg" className="p-8 border border-border/40">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <Typography variant="h3" className="text-2xl font-bold mb-3">پیام شما دریافت شد</Typography>
                  <Typography variant="body-sm" className="text-muted-foreground max-w-md leading-relaxed">
                    با سپاس از ارتباط شما با مجتمع کشت و صنعت طلای شالیزار. پیام ارزشمند شما به بخش مربوطه ارجاع داده شد و کارشناسان ما در سریع‌ترین زمان (حداکثر طی ۲۴ ساعت آینده) از طریق نشانی ایمیل یا شماره همراه شما، پاسخ را ارسال خواهند کرد.
                  </Typography>
                  <Button variant="accent" className="mt-8 px-8" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}>
                    ارسال پیام دیگر
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <Typography variant="h3" className="text-xl font-bold text-primary dark:text-accent border-b border-border/30 pb-3">ارسال پیام مستقیم</Typography>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="نام و نام خانوادگی *"
                      placeholder="مثال: حمید رضا رضایی"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="نشانی ایمیل یا شماره همراه *"
                      placeholder="مثال: 09123456789 یا email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <Input
                    label="موضوع پیام *"
                    placeholder="مثال: همکاری سازمانی / پیگیری سفارش / پیشنهاد محصول"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />

                  <div className="flex flex-col gap-1.5 text-right w-full">
                    <label className="text-xs font-medium text-foreground/80">متن پیام یا پرسش شما *</label>
                    <textarea
                      placeholder="پیام یا درخواست خود را به تفصیل در این قسمت مرقوم بفرمایید..."
                      className="w-full h-36 px-4 py-3 rounded-2xl text-xs text-right border border-border/60 bg-background/50 focus:border-ring focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="accent" type="submit" className="w-full md:w-auto px-8 font-bold">
                      ارسال پیام طلایی
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
