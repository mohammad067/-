"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Search, Truck } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";
import { findOrder, type StoredOrder } from "@/features/orders/store";

const deliveryLabels: Record<StoredOrder["deliveryMethod"], string> = {
  standard: "پست پیشتاز (۳ تا ۵ روز کاری)",
  tipax: "تیپاکس (۱ تا ۲ روز کاری)",
  vip: "ارسال اختصاصی (۱ روز کاری)",
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
      setError("کد سفارش و شماره موبایل ۱۱ رقمی معتبر را وارد کنید.");
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
      <section className="max-w-4xl mx-auto w-full px-4 md:px-8 py-12 md:py-20">
        <div className="text-center mb-10">
          <Typography variant="h1" className="text-3xl md:text-5xl">پیگیری سفارش</Typography>
          <p className="mt-3 text-sm text-muted-foreground">
            کد سفارش و همان شماره موبایلی را وارد کنید که هنگام ثبت سفارش استفاده کرده‌اید.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 rounded-3xl border border-border bg-card p-4 md:p-6 shadow-sm">
          <Input value={orderId} onChange={(event) => setOrderId(event.target.value.toUpperCase())} placeholder="کد سفارش؛ مانند SHALI-..." className="w-full" dir="ltr" />
          <Input value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="شماره موبایل" inputMode="numeric" className="w-full" dir="ltr" />
          <Button type="submit" variant="accent" className="gap-2 whitespace-nowrap"><Search className="w-4 h-4" />پیگیری</Button>
        </form>
        {error && <p role="alert" className="mt-3 text-sm text-red-600 text-center">{error}</p>}

        {order && (
          <article className="mt-8 rounded-3xl border border-border bg-card p-5 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border pb-5">
              <div><p className="text-xs text-muted-foreground">کد سفارش</p><strong className="font-mono text-primary dark:text-accent" dir="ltr">{order.orderId}</strong></div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="w-4 h-4" /> سفارش ثبت شده</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 text-sm">
              <div className="space-y-2">
                <p><span className="text-muted-foreground">خریدار:</span> {order.customerName}</p>
                <p><span className="text-muted-foreground">مقصد:</span> {order.province}، {order.city}</p>
                <p><span className="text-muted-foreground">روش ارسال:</span> {deliveryLabels[order.deliveryMethod]}</p>
              </div>
              <div className="space-y-2">
                <p><span className="text-muted-foreground">تعداد اقلام:</span> {order.items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("fa-IR")}</p>
                <p><span className="text-muted-foreground">مبلغ سفارش:</span> {order.total.toLocaleString("fa-IR")} تومان</p>
                <p><span className="text-muted-foreground">تاریخ ثبت:</span> {new Date(order.createdAt).toLocaleDateString("fa-IR")}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-border pt-5 text-center text-xs">
              <div className="rounded-2xl bg-primary/5 p-4"><CheckCircle2 className="mx-auto mb-2 w-5 h-5 text-emerald-500" />ثبت سفارش</div>
              <div className="rounded-2xl bg-primary/5 p-4"><Package className="mx-auto mb-2 w-5 h-5 text-accent" />در انتظار آماده‌سازی</div>
              <div className="rounded-2xl bg-primary/5 p-4 text-muted-foreground"><Truck className="mx-auto mb-2 w-5 h-5" />ارسال</div>
            </div>
          </article>
        )}

        {searched && !order && !error && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center">
            <Package className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-bold text-lg">سفارشی با این اطلاعات پیدا نشد</h2>
            <p className="mt-2 text-sm text-muted-foreground">اطلاعات باید دقیقاً با سفارش ثبت‌شده در همین مرورگر یکسان باشد.</p>
          </div>
        )}
      </section>
    </MainLayout>
  );
}

export default function OrderTrackingPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری…</div>}><OrderTrackingContent /></Suspense>;
}
