"use client";

import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ShoppingBag, PhoneCall, CheckCircle, Scale, ShieldCheck } from "lucide-react";

export default function BulkOrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", quantity: "", description: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.quantity.trim()) {
      setError("نام، موبایل و میزان سفارش لازم است.");
      return;
    }
    if (!/^09\d{9}$/.test(formData.phone.trim())) {
      setError("موبایل را با ۰۹ و ۱۱ رقم بنویسید.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-12 md:py-16 text-right" dir="rtl">
        <div className="mb-10 space-y-3">
          <Badge variant="accent" className="w-fit gap-1.5">
            <Scale className="w-4 h-4" />
            تأمین مستقیم برنج شمال
          </Badge>
          <Typography variant="h2" className="text-2xl md:text-3xl font-bold leading-snug text-right">
            درخواست خرید عمده
          </Typography>
          <p className="text-sm text-muted-foreground leading-7 max-w-2xl mr-0 ml-auto">
            برای رستوران، هتل و پخش. رقم و سال برداشت روی کیسه مشخص است. پیش‌فاکتور بعد از تماس ارسال می‌شود.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E5E2DA] rounded-3xl p-6 md:p-8">
              {submitted ? (
                <div className="py-10 text-right space-y-3">
                  <CheckCircle className="w-10 h-10 text-primary" />
                  <h2 className="text-xl font-bold">درخواست ثبت شد</h2>
                  <p className="text-sm text-muted-foreground">با شماره {formData.phone} تماس می‌گیریم.</p>
                  <Button variant="primary" onClick={() => { setSubmitted(false); setFormData({ name: "", phone: "", quantity: "", description: "" }); }}>درخواست جدید</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">
                  <h2 className="text-lg font-bold border-b border-[#E5E2DA] pb-3">اطلاعات متقاضی</h2>
                  {error && <p className="text-xs text-red-600">{error}</p>}
                  <Input label="نام / سازمان *" placeholder="رستوران یا شرکت" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  <Input label="موبایل *" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  <Input label="وزن تقریبی *" placeholder="مثلاً ۵۰۰ کیلو" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                  <label className="text-xs font-medium">توضیح</label>
                  <textarea className="w-full h-28 px-4 py-3 rounded-2xl text-sm text-right border border-[#E5E2DA]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  <Button variant="primary" type="submit" className="w-full md:w-auto self-start">ارسال درخواست</Button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="p-6 space-y-4 text-right bg-white">
              <h3 className="font-bold">مزایا</h3>
              {[
                { icon: ShieldCheck, t: "رقم مشخص", d: "مخلوط شهری نیست." },
                { icon: ShoppingBag, t: "بار عمده", d: "هماهنگ با وزن و مقصد." },
                { icon: PhoneCall, t: "تماس قبل از ارسال", d: "پیش‌فاکتور می‌فرستیم." },
              ].map((item) => (
                <div key={item.t} className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">{item.t}</p>
                    <p className="text-xs text-muted-foreground">{item.d}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
