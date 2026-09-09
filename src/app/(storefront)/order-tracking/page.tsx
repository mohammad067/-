"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Home, Package, Search, Truck } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { findOrder, type StoredOrder } from "@/features/orders/store";

const deliveryLabels: Record<StoredOrder["deliveryMethod"], string> = {
  standard: "پست پیشتاز (۳ تا ۵ روز کاری)",
  tipax: "تیپاکس (۱ تا ۲ روز کاری)",
  vip: "پیک اختصاصی (۱ روز کاری)",
  weight: "ارسال بر اساس وزن",
};

function OrderTrackingContent() {
  const params = useSearchParams();
  const [orderId, setOrderId] = useState(params.get("orderId")?.toUpperCase() || "");
  const [mobile, setMobile] = useState(params.get("mobile") || "");
  const [order, setOrder] = useState<StoredOrder | null>(() => {
    const initialOrderId = params.get("orderId") || "";
    const initialMobile = params.get("mobile") || "";
    return initialOrderId && initialMobile ? findOrder(initialOrderId, initialMobile) : null;
  });
  const [searched, setSearched] = useState(Boolean(params.get("orderId") && params.get("mobile")));
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedMobile = mobile.replace(/\D/g, "");
    if (!orderId.trim() || !/^09\d{9}$/.test(normalizedMobile)) {
      setError("کد سفارش و موبایل ۱۱ رقمی را وارد کنید.");
      setOrder(null);
      setSearched(true);
      return;
    }
    setError("");
    setOrder(findOrder(orderId, normalizedMobile));
    setSearched(true);
  };

  return (
    <MainLayout>
      <section className="max-w-4xl mx-auto w-full px-4 md:px-8 py-12 text-right" dir="rtl">
        <div className="mb-10">
          <Typography variant="h2" className="text-2xl md:text-3xl">پیگیری سفارش</Typography>
          <p className="mt-2 text-sm text-muted-foreground">کد سفارش و همان موبایل ثبت‌شده را بنویسید.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 rounded-3xl border border-[#E5E2DA] bg-white p-4 md:p-6">
          <Input value={orderId} onChange={(event) => setOrderId(event.target.value.toUpperCase())} placeholder="کد سفارش" className="w-full" />
          <Input value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="موبایل" inputMode="numeric" className="w-full" />
          <Button type="submit" variant="primary" className="gap-2"><Search className="w-4 h-4" />پیگیری</Button>
        </form>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        {order && (
          <article className="mt-8 rounded-3xl border border-[#E5E2DA] bg-white p-5 md:p-8">
            <p className="text-xs text-muted-foreground">کد سفارش</p>
            <p className="font-bold mb-4">{order.orderId}</p>
            <p className="text-sm">خریدار: {order.customerName}</p>
            <p className="text-sm">مقصد: {order.province}، {order.city}</p>
            <p className="text-sm">ارسال: {deliveryLabels[order.deliveryMethod]}</p>
            <p className="text-sm mb-6">مبلغ: {order.total.toLocaleString("fa-IR")} تومان</p>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary"><CheckCircle2 className="mx-auto mb-1 w-4 h-4" />ثبت</div>
              <div className="rounded-2xl bg-[#EFE8DC] p-3"><Package className="mx-auto mb-1 w-4 h-4" />آماده‌سازی</div>
              <div className="rounded-2xl bg-[#EFE8DC] p-3"><Truck className="mx-auto mb-1 w-4 h-4" />ارسال</div>
              <div className="rounded-2xl bg-[#EFE8DC] p-3"><Home className="mx-auto mb-1 w-4 h-4" />تحویل</div>
            </div>
          </article>
        )}
        {searched && !order && !error && (
          <p className="mt-8 text-sm text-muted-foreground">سفارشی با این اطلاعات پیدا نشد.</p>
        )}
      </section>
    </MainLayout>
  );
}

export default function OrderTrackingPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری…</div>}><OrderTrackingContent /></Suspense>;
}
